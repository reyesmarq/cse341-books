import { MongoClient } from 'mongodb';

const authors = [
  { name: 'Octavia E. Butler', birthYear: 1947 },
  { name: 'Ted Chiang', birthYear: 1967 },
  { name: 'Ursula K. Le Guin', birthYear: 1929 }
];

const connectionString = process.env.MONGODB_URI;
if (!connectionString) {
  throw new Error('MONGODB_URI is required. Run with: npm run seed');
}

const client = new MongoClient(connectionString);

try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  const authorsCollection = db.collection('authors');
  const booksCollection = db.collection('books');

  const { deletedCount: deletedBooks } = await booksCollection.deleteMany({});
  console.log(`Removed ${deletedBooks} existing book document(s).`);

  const { deletedCount: deletedAuthors } = await authorsCollection.deleteMany({});
  console.log(`Removed ${deletedAuthors} existing author document(s).`);

  const { insertedIds: authorIds } = await authorsCollection.insertMany(authors);
  console.log(`Inserted ${Object.keys(authorIds).length} author document(s).`);

  const books = [
    { authorId: authorIds[0].toString(), title: 'Kindred', publicationDate: '1979-06-01' },
    { authorId: authorIds[1].toString(), title: 'Exhalation', publicationDate: '2019-05-07' },
    { authorId: authorIds[2].toString(), title: 'The Left Hand of Darkness', publicationDate: '1969-03-01' }
  ];

  const { insertedCount } = await booksCollection.insertMany(books);
  console.log(`Inserted ${insertedCount} book document(s).`);

  console.log('\nAuthors collection now contains:');
  const seededAuthors = await authorsCollection.find({}).toArray();
  for (const author of seededAuthors) {
    console.log(`  ${author._id}  ${author.name}`);
  }

  console.log('\nBooks collection now contains:');
  const seededBooks = await booksCollection.find({}).toArray();
  for (const book of seededBooks) {
    console.log(`  ${book._id}  ${book.title}  (authorId: ${book.authorId})`);
  }
} finally {
  await client.close();
}
