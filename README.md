# Construction Backend API

Node.js + Express + Sequelize + MySQL backend for user authentication, project management, and daily progress reports.

## Tech Stack

- Node.js
- Express
- MySQL
- Sequelize ORM
- JWT authentication

## Implemented Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /projects`
- `GET /projects`
- `GET /projects/:id`
- `PUT /projects/:id`
- `DELETE /projects/:id`
- `POST /projects/:id/dpr`
- `GET /projects/:id/dpr`

## Features

- JWT authentication with bearer token support
- Role-based access control for admin/manager-only routes
- Request validation with descriptive error messages
- Proper HTTP status codes for validation, auth, and missing-resource cases
- Sequelize model relationships between users, projects, and DPRs
- SQL schema script included in [`schema.sql`](./schema.sql)

## Setup

1. Create a MySQL database named `construction_db` or change `DB_NAME` in `.env`.
2. Run the SQL in [`schema.sql`](./schema.sql).
3. Copy `.env.example` to `.env` and fill in the values.
4. Install dependencies:

```bash
npm install
```

5. Start the server:

```bash
npm run dev
```

The server runs on `http://localhost:5000` by default.

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=construction_db
JWT_SECRET=your_secret
PORT=5000
```

## Example Requests

Register:

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin User\",\"email\":\"admin@example.com\",\"password\":\"secret123\",\"role\":\"admin\"}"
```

Login:

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"secret123\"}"
```

Create project:

```bash
curl -X POST http://localhost:5000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d "{\"name\":\"Site A\",\"description\":\"Office build\",\"start_date\":\"2026-03-13\",\"end_date\":\"2026-06-30\",\"status\":\"planned\"}"
```

List projects:

```bash
curl "http://localhost:5000/projects?status=planned&limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Get single project:

```bash
curl http://localhost:5000/projects/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Update project:

```bash
curl -X PUT http://localhost:5000/projects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d "{\"status\":\"active\"}"
```

Delete project:

```bash
curl -X DELETE http://localhost:5000/projects/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Create DPR:

```bash
curl -X POST http://localhost:5000/projects/1/dpr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d "{\"date\":\"2026-03-13\",\"work_description\":\"Foundation work completed\",\"weather\":\"Sunny\",\"worker_count\":12}"
```

List DPRs:

```bash
curl "http://localhost:5000/projects/1/dpr?date=2026-03-13" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Notes

- `POST /projects` and `PUT /projects/:id` are restricted to `admin` and `manager`.
- `DELETE /projects/:id` is restricted to `admin`.
- The internship prompt mentions `phone` in register input, but the provided minimal data model does not include a `phone` column, so this backend follows the schema-defined fields.
