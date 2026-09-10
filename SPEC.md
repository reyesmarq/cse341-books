# Books API — Specification

## Feature Description

Build a read-only web service for managing a personal book collection. The
service must let a client retrieve every book, and retrieve a single book by
its id.

---

## Version 1

### Purpose

Provide a small HTTP API backed by MongoDB that exposes a collection of
books so a client (browser, curl, or another service) can list all books or
look one up by id.

### Data Model

A book has:

- `id` — identifier for the book
- `author` — the book's author
- `title` — the book's title
- `publicationDate` — when the book was published

### Endpoints

- `GET /books` — returns all books.
- `GET /books/:id` — returns one book matching the given id.

### Assumptions

- Only reading data is in scope for this iteration; creating, updating, and
  deleting books are deferred to a later week.
- Data lives in MongoDB.
- The API returns JSON.

---

## Evaluation of Version 1

**Are there any bugs or short-sighted decisions in this specification?**
The field types and formats aren't defined (e.g., is `publicationDate` a
string, and in what format?), so two people implementing this spec could
disagree. There's no id format specified either, and no plan for what
happens when an id doesn't exist.

**Security vulnerabilities?**
No error-handling contract means a naive implementation could leak stack
traces or internal error details (e.g., MongoDB connection strings) to the
client on failure.

**Performance concerns?**
None significant at this scale (a handful of seed documents), but `GET
/books` returning an unbounded array should be noted as a known limitation
rather than solved now — pagination is out of scope for Week 1.

**Unclear response examples or error behaviors?**
Yes — neither success nor error response bodies are specified, and there's
no distinction between "not found" and "something went wrong on the
server."

---

## Version 2

### Purpose

Provide a read-only HTTP API, backed by MongoDB, that exposes a collection
of books. Clients can fetch the full list of books or a single book by id.
Write operations (create/update/delete) are explicitly out of scope for
this iteration.

### Data Model

- **Database:** `cse341-books-db`
- **Collection:** `books`

| Field             | Type   | Required | Notes                                   |
|-------------------|--------|----------|------------------------------------------|
| `id`              | string | yes      | Custom identifier, e.g. `"b1"`. Distinct from MongoDB's `_id`. |
| `author`          | string | yes      | Full name of the author.                |
| `title`           | string | yes      | Book title.                             |
| `publicationDate` | string | yes      | ISO 8601 date, e.g. `"2021-08-17"`.     |

### Endpoints

#### `GET /books`

Returns every book as a JSON array.

- **Success — 200**
  ```json
  [
    { "id": "b1", "author": "Octavia E. Butler", "title": "Kindred", "publicationDate": "1979-06-01" },
    { "id": "b2", "author": "Ted Chiang", "title": "Exhalation", "publicationDate": "2019-05-07" }
  ]
  ```
- **Server error — 500**
  ```json
  { "message": "Internal server error" }
  ```

#### `GET /books/:id`

Returns a single book matching `id`.

- **Success — 200**
  ```json
  { "id": "b1", "author": "Octavia E. Butler", "title": "Kindred", "publicationDate": "1979-06-01" }
  ```
- **Not found — 404**
  ```json
  { "message": "Book not found" }
  ```
- **Server error — 500**
  ```json
  { "message": "Internal server error" }
  ```

### Error Handling

- Clients never see stack traces or raw driver/database errors.
- Unexpected failures return `500` with the generic body
  `{ "message": "Internal server error" }`; the real error is logged
  server-side only.
- A missing id returns `404` with `{ "message": "Book not found" }`, kept
  distinct from `500` so clients can tell "doesn't exist" apart from
  "something broke."

### Implementation Notes

- Use MongoDB with a custom `id` field for lookups (not `_id`), to keep
  Week 1 simple.
- Seed the `books` collection with at least 3 documents.
- Database connection details (`MONGODB_URI`, `MONGODB_DB_NAME`) come from
  environment variables — never hard-coded or committed.
