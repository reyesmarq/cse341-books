# Books & Authors API — Week 02 Specification

Builds on `SPEC.md` (Week 01), which established a read-only Books API backed
by MongoDB, using `_id` as the sole book identifier. This spec extends that
API with full CRUD on books, a new authors collection, a book → author
relationship, and Swagger documentation for both.

---

## Feature 1: Book CRUD Operations

### Version 1

**Purpose**
Extend the existing read-only Books API so clients can also create, update,
and delete books, and so each book references the author who wrote it.

**Data Model**

- `id` — identifier for the book
- `authorId` — references an author
- `title` — the book's title
- `publicationDate` — when the book was published

**Endpoints**

- `GET /books` — returns all books.
- `GET /books/:id` — returns one book matching the given id.
- `POST /books` — creates a book.
- `PUT /books/:id` — updates a book.
- `DELETE /books/:id` — deletes a book.

**Assumptions**

- If `authorId` doesn't match an existing author, the API rejects the
  request with `400`.
- All routes are documented and testable in Swagger.

### Evaluation of Version 1

**Are there any bugs or short-sighted decisions in this specification?**
It doesn't say what `id` actually is. Week 01 already settled this question
for books — MongoDB's own `_id` is the sole identifier, not a separate
application-level field — and this spec should carry that decision forward
rather than reintroduce a second id. It also doesn't define field types,
which status codes pair with which outcomes (create success vs. validation
failure vs. not-found), or what the request/response bodies look like.

**Security vulnerabilities?**
No error-handling contract, so a naive implementation could leak raw
driver/database errors to the client. No mention of validating field
*types*, not just presence — an attacker-controlled `publicationDate` or
`authorId` of the wrong type could reach the database layer unchecked.

**Performance concerns?**
None significant at this scale. `GET /books` returning an unbounded array
is a known limitation, not something to solve this iteration.

**Unclear response examples or error behaviors?**
Yes — no example JSON for any request or response, no distinction between
"validation failed" (bad input) and "reference failed" (`authorId` doesn't
exist), and no defined behavior for `DELETE` on a book that doesn't exist.

### Version 2

**Purpose**
Extend the Books API with full CRUD. Every book references its author via
`authorId`. `_id` remains the sole book identifier, consistent with Week 01.

**Data Model**

- **Database:** `cse341-books-db`
- **Collection:** `books`

| Field             | Type     | Required | Notes                                                                 |
|-------------------|----------|----------|------------------------------------------------------------------------|
| `_id`             | ObjectId | yes      | Assigned automatically on insert. Serialized as a 24-char hex string.  |
| `authorId`        | string   | yes      | 24-char hex string of an existing author's `_id`.                     |
| `title`           | string   | yes      | Book title.                                                            |
| `publicationDate` | string   | yes      | ISO 8601 date, e.g. `"2021-08-17"`.                                    |

**Endpoints**

#### `GET /books`
Returns every book as a JSON array. — **200**

#### `GET /books/:id`
Returns a single book whose `_id` matches `:id`.
- **200** — book found.
- **404** — `{ "message": "Book not found" }`. Returned for both a
  well-formed id with no match and a malformed id (never a `500`).

#### `POST /books`
Creates a book.
- **Request body**
  ```json
  { "authorId": "6aacaa7424590f727a1a1300", "title": "Kindred", "publicationDate": "1979-06-01" }
  ```
- **201**
  ```json
  { "_id": "6aacaa7424590f727a1a1316", "authorId": "6aacaa7424590f727a1a1300", "title": "Kindred", "publicationDate": "1979-06-01" }
  ```
- **400** — missing/wrong-type `title`, `authorId`, or `publicationDate`:
  `{ "message": "title, authorId, and publicationDate are required" }`
- **400** — `authorId` is well-formed but no such author exists:
  `{ "message": "authorId does not match an existing author" }`

#### `PUT /books/:id`
Updates `authorId`, `title`, and `publicationDate` on an existing book.
- **200** — updated book, same shape as `POST` response.
- **400** — same validation rules as `POST` (all three fields required;
  `authorId` must reference an existing author).
- **404** — `{ "message": "Book not found" }`.

#### `DELETE /books/:id`
- **204** — no body.
- **404** — `{ "message": "Book not found" }`.

**Error Handling**
- Clients never see stack traces or raw driver/database errors.
- Unexpected failures return `500` with
  `{ "message": "Internal server error" }`; the real error is logged
  server-side only.

**Implementation Notes**
- Guard `:id` and `authorId` with `ObjectId.isValid()` before constructing
  an `ObjectId` — an invalid `authorId` is a `400`, an invalid `:id` in the
  URL is treated as "not found," not a server fault.
- All five routes are documented in Swagger and testable at `/api-docs`.

---

## Feature 2: Author CRUD Operations

### Version 1

**Purpose**
Provide a collection of authors that books can reference, with full CRUD.

**Data Model**
- `id` — identifier for the author
- `name` — the author's full name
- `birthYear` — the year the author was born

**Endpoints**
- `GET /authors` — returns all authors.
- `GET /authors/:id` — returns one author.
- `POST /authors` — creates an author.
- `PUT /authors/:id` — updates an author.
- `DELETE /authors/:id` — deletes an author.

**Assumptions**
- Deleting an author that still has books referencing it is not allowed
  outright — those books would be left pointing at nothing.

### Evaluation of Version 1

**Are there any bugs or short-sighted decisions in this specification?**
Same identifier ambiguity as Feature 1's first draft — resolved the same
way, by using `_id` rather than inventing a second id field. "Not allowed
outright" for delete-with-books isn't a status code; it needs to be
concrete (`409`) so a client can distinguish it from a generic `400`.

**Security vulnerabilities?**
No type validation on `birthYear` — an unchecked value could be a string,
negative, or in the future, and would reach the database as-is.

**Performance concerns?**
None at this scale.

**Unclear response examples or error behaviors?**
Yes — no example bodies, and no defined behavior for `POST`/`PUT` when
fields are missing or the wrong type.

### Version 2

**Purpose**
Provide a full-CRUD authors collection that books reference by id.

**Data Model**
- **Database:** `cse341-books-db`
- **Collection:** `authors`

| Field       | Type     | Required | Notes                                                          |
|-------------|----------|----------|------------------------------------------------------------------|
| `_id`       | ObjectId | yes      | Assigned automatically on insert. Serialized as a 24-char hex string. |
| `name`      | string   | yes      | Author's full name.                                             |
| `birthYear` | number   | yes      | Four-digit year, e.g. `1947`.                                   |

**Endpoints**

#### `GET /authors`
Returns every author as a JSON array. — **200**

#### `GET /authors/:id`
- **200** — author found.
- **404** — `{ "message": "Author not found" }`. Malformed id treated as
  not-found, not a server fault.

#### `POST /authors`
- **Request body**
  ```json
  { "name": "Octavia E. Butler", "birthYear": 1947 }
  ```
- **201**
  ```json
  { "_id": "6aacaa7424590f727a1a1300", "name": "Octavia E. Butler", "birthYear": 1947 }
  ```
- **400** — missing/wrong-type `name` or `birthYear`:
  `{ "message": "name and birthYear are required" }`

#### `PUT /authors/:id`
- **200** — updated author, same shape as `POST` response.
- **400** — same validation as `POST`.
- **404** — `{ "message": "Author not found" }`.

#### `DELETE /authors/:id`
- **204** — no body, author deleted.
- **404** — `{ "message": "Author not found" }`.
- **409** — author still referenced by at least one book:
  `{ "message": "Cannot delete author with existing books" }`.

**Error Handling**
- Same contract as Feature 1: no stack traces or raw driver errors reach
  the client; unexpected failures are `500` with
  `{ "message": "Internal server error" }`.

**Implementation Notes**
- Guard `:id` with `ObjectId.isValid()` before constructing an `ObjectId`.
- `DELETE` checks the `books` collection for any document with a matching
  `authorId` before removing the author.
- All five routes are documented in Swagger and testable at `/api-docs`.
- Seed the `authors` collection with at least 3 documents, and update
  seeded books to reference their `_id`s via `authorId`.
