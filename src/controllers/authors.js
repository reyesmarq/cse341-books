import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor, hasBooksByAuthor } from '../models/authors.js';
import { validateAuthorInput } from '../validators.js';

const getAuthorsHandler = async (_, res) => {
  try {
    const authors = await getAllAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    console.error('Failed to retrieve authors:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAuthorByIdHandler = async (req, res) => {
  try {
    const author = await getAuthorById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    return res.status(200).json(author);
  } catch (error) {
    console.error('Failed to retrieve author:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createAuthorHandler = async (req, res) => {
  try {
    if (!validateAuthorInput(req.body)) {
      return res.status(400).json({ message: 'name and birthYear are required' });
    }

    const { name, birthYear } = req.body;
    const author = await createAuthor({ name, birthYear });
    return res.status(201).json(author);
  } catch (error) {
    console.error('Failed to create author:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAuthorHandler = async (req, res) => {
  try {
    if (!validateAuthorInput(req.body)) {
      return res.status(400).json({ message: 'name and birthYear are required' });
    }

    const { name, birthYear } = req.body;
    const author = await updateAuthor(req.params.id, { name, birthYear });
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    return res.status(200).json(author);
  } catch (error) {
    console.error('Failed to update author:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAuthorHandler = async (req, res) => {
  try {
    const author = await getAuthorById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    if (await hasBooksByAuthor(req.params.id)) {
      return res.status(409).json({ message: 'Cannot delete author with existing books' });
    }

    await deleteAuthor(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('Failed to delete author:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getAuthorsHandler, getAuthorByIdHandler, createAuthorHandler, updateAuthorHandler, deleteAuthorHandler };
