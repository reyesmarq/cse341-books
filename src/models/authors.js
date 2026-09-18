import { ObjectId } from 'mongodb';
import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const db = getDb();
  const authors = await db.collection('authors').find({}).toArray();
  return authors;
};

const getAuthorById = async (authorId) => {
  if (!ObjectId.isValid(authorId)) {
    return null;
  }

  const db = getDb();
  const author = await db.collection('authors').findOne({ _id: new ObjectId(authorId) });
  return author;
};

const authorExists = async (authorId) => {
  if (!ObjectId.isValid(authorId)) {
    return false;
  }

  const db = getDb();
  const author = await db.collection('authors').findOne({ _id: new ObjectId(authorId) }, { projection: { _id: 1 } });
  return Boolean(author);
};

const createAuthor = async ({ name, birthYear }) => {
  const db = getDb();
  const { insertedId } = await db.collection('authors').insertOne({ name, birthYear });
  return { _id: insertedId, name, birthYear };
};

const updateAuthor = async (authorId, { name, birthYear }) => {
  if (!ObjectId.isValid(authorId)) {
    return null;
  }

  const db = getDb();
  const _id = new ObjectId(authorId);
  const { matchedCount } = await db.collection('authors').updateOne({ _id }, { $set: { name, birthYear } });
  if (matchedCount === 0) {
    return null;
  }

  return { _id, name, birthYear };
};

const deleteAuthor = async (authorId) => {
  if (!ObjectId.isValid(authorId)) {
    return false;
  }

  const db = getDb();
  const { deletedCount } = await db.collection('authors').deleteOne({ _id: new ObjectId(authorId) });
  return deletedCount > 0;
};

const hasBooksByAuthor = async (authorId) => {
  const db = getDb();
  const book = await db.collection('books').findOne({ authorId }, { projection: { _id: 1 } });
  return Boolean(book);
};

export { getAllAuthors, getAuthorById, authorExists, createAuthor, updateAuthor, deleteAuthor, hasBooksByAuthor };
