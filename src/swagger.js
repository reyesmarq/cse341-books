import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Books & Authors API',
      version: '2.0.0',
      description: 'CRUD API for books and authors, backed by MongoDB.'
    },
    components: {
      parameters: {
        BookId: {
          name: 'id',
          in: 'path',
          required: true,
          description: '24-character hex string of the book\'s _id.',
          schema: { type: 'string', example: '6aacaa7424590f727a1a1316' }
        },
        AuthorId: {
          name: 'id',
          in: 'path',
          required: true,
          description: '24-character hex string of the author\'s _id.',
          schema: { type: 'string', example: '6aacaa7424590f727a1a1300' }
        }
      },
      schemas: {
        Message: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        BookInput: {
          type: 'object',
          required: ['authorId', 'title', 'publicationDate'],
          properties: {
            authorId: { type: 'string', example: '6aacaa7424590f727a1a1300' },
            title: { type: 'string', example: 'Kindred' },
            publicationDate: { type: 'string', example: '1979-06-01' }
          }
        },
        Book: {
          allOf: [
            {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '6aacaa7424590f727a1a1316' }
              }
            },
            { $ref: '#/components/schemas/BookInput' }
          ]
        },
        AuthorInput: {
          type: 'object',
          required: ['name', 'birthYear'],
          properties: {
            name: { type: 'string', example: 'Octavia E. Butler' },
            birthYear: { type: 'integer', example: 1947 }
          }
        },
        Author: {
          allOf: [
            {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '6aacaa7424590f727a1a1300' }
              }
            },
            { $ref: '#/components/schemas/AuthorInput' }
          ]
        }
      },
      responses: {
        ServerError: {
          description: 'Unexpected server error.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Message' },
              example: { message: 'Internal server error' }
            }
          }
        },
        BookNotFound: {
          description: 'No book matches the given id.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Message' },
              example: { message: 'Book not found' }
            }
          }
        },
        BookValidationError: {
          description: 'Missing/invalid fields, or authorId does not reference an existing author.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Message' },
              examples: {
                missingFields: { value: { message: 'title, authorId, and publicationDate are required' } },
                unknownAuthor: { value: { message: 'authorId does not match an existing author' } }
              }
            }
          }
        },
        AuthorNotFound: {
          description: 'No author matches the given id.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Message' },
              example: { message: 'Author not found' }
            }
          }
        },
        AuthorValidationError: {
          description: 'Missing or invalid fields.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Message' },
              example: { message: 'name and birthYear are required' }
            }
          }
        }
      }
    }
  },
  apis: ['./src/router.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
