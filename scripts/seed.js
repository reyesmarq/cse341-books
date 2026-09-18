import { MongoClient } from 'mongodb';

const books = [
  { author: 'Octavia E. Butler', title: 'Kindred', publicationDate: '1979-06-01' },
  { author: 'Ted Chiang', title: 'Exhalation', publicationDate: '2019-05-07' },
  { author: 'Ursula K. Le Guin', title: 'The Left Hand of Darkness', publicationDate: '1969-03-01' },
];

const connectionString = process.env.MONGODB_URI;
if (!connectionString) {
  throw new Error('MONGODB_URI is required. Run with: npm run seed');
}

const client = new MongoClient(connectionString);

try {
  await client.connect();
  const collection = client.db(process.env.MONGODB_DB_NAME).collection('books');

  const { deletedCount } = await collection.deleteMany({});
  console.log(`Removed ${deletedCount} existing document(s).`);

  const { insertedCount } = await collection.insertMany(books);
  console.log(`Inserted ${insertedCount} document(s).`);

  const seeded = await collection.find({}).toArray();
  console.log('\nCollection now contains:');
  for (const book of seeded) {
    console.log(`  ${book._id}  ${book.title}`);
  }
} finally {
  await client.close();
}
