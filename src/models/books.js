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

export { getAllBooks, getBookById };
