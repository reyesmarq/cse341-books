import { ObjectId } from 'mongodb';
import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  const books = await db.collection('books').find({}).toArray();
  return books;
};

const getBookById = async (bookId) => {
  if (!ObjectId.isValid(bookId)) {
    return null;
  }

  const db = getDb();
  const book = await db.collection('books').findOne({ _id: new ObjectId(bookId) });
  return book;
};

const createBook = async ({ authorId, title, publicationDate }) => {
  const db = getDb();
  const { insertedId } = await db.collection('books').insertOne({ authorId, title, publicationDate });
  return { _id: insertedId, authorId, title, publicationDate };
};

const updateBook = async (bookId, { authorId, title, publicationDate }) => {
  if (!ObjectId.isValid(bookId)) {
    return null;
  }

  const db = getDb();
  const _id = new ObjectId(bookId);
  const { matchedCount } = await db.collection('books').updateOne({ _id }, { $set: { authorId, title, publicationDate } });
  if (matchedCount === 0) {
    return null;
  }

  return { _id, authorId, title, publicationDate };
};

const deleteBook = async (bookId) => {
  if (!ObjectId.isValid(bookId)) {
    return false;
  }

  const db = getDb();
  const { deletedCount } = await db.collection('books').deleteOne({ _id: new ObjectId(bookId) });
  return deletedCount > 0;
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
