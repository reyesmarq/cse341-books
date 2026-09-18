import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../models/books.js';
import { authorExists } from '../models/authors.js';
import { validateBookInput } from '../validators.js';

const getBooksHandler = async (_, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('Failed to retrieve books:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (error) {
    console.error('Failed to retrieve book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createBookHandler = async (req, res) => {
  try {
    if (!validateBookInput(req.body)) {
      return res.status(400).json({ message: 'title, authorId, and publicationDate are required' });
    }

    const { authorId, title, publicationDate } = req.body;
    if (!(await authorExists(authorId))) {
      return res.status(400).json({ message: 'authorId does not match an existing author' });
    }

    const book = await createBook({ authorId, title, publicationDate });
    return res.status(201).json(book);
  } catch (error) {
    console.error('Failed to create book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookHandler = async (req, res) => {
  try {
    if (!validateBookInput(req.body)) {
      return res.status(400).json({ message: 'title, authorId, and publicationDate are required' });
    }

    const { authorId, title, publicationDate } = req.body;
    if (!(await authorExists(authorId))) {
      return res.status(400).json({ message: 'authorId does not match an existing author' });
    }

    const book = await updateBook(req.params.id, { authorId, title, publicationDate });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (error) {
    console.error('Failed to update book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const deleted = await deleteBook(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Failed to delete book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getBooksHandler, getBookByIdHandler, createBookHandler, updateBookHandler, deleteBookHandler };
