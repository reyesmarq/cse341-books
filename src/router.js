import { Router } from 'express';
import { getBooksHandler, getBookByIdHandler } from './controllers/books.js';
import {
  getAuthorsHandler,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler
} from './controllers/authors.js';

const router = Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: List all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Array of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/books', getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get a book by id
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/BookId'
 *     responses:
 *       200:
 *         description: The matching book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         $ref: '#/components/responses/BookNotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/books/:id', getBookByIdHandler);

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: List all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Array of authors.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     summary: Create an author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *     responses:
 *       201:
 *         description: Author created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         $ref: '#/components/responses/AuthorValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/authors', getAuthorsHandler);
router.post('/authors', createAuthorHandler);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Get an author by id
 *     tags: [Authors]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorId'
 *     responses:
 *       200:
 *         description: The matching author.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         $ref: '#/components/responses/AuthorNotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   put:
 *     summary: Update an author by id
 *     tags: [Authors]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *     responses:
 *       200:
 *         description: The updated author.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         $ref: '#/components/responses/AuthorValidationError'
 *       404:
 *         $ref: '#/components/responses/AuthorNotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   delete:
 *     summary: Delete an author by id
 *     tags: [Authors]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorId'
 *     responses:
 *       204:
 *         description: Author deleted.
 *       404:
 *         $ref: '#/components/responses/AuthorNotFound'
 *       409:
 *         description: Author is still referenced by at least one book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               message: Cannot delete author with existing books
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/authors/:id', getAuthorByIdHandler);
router.put('/authors/:id', updateAuthorHandler);
router.delete('/authors/:id', deleteAuthorHandler);

export default router;
