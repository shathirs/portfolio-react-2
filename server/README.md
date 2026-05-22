# Portfolio API (Express + MongoDB)

REST API for the Portfo. admin dashboard and public portfolio.

## Setup

1. Install [MongoDB](https://www.mongodb.com/try/download/community) locally (or use MongoDB Atlas).
2. Copy environment file:

```bash
cp .env.example .env
```

3. Install dependencies and seed the database:

```bash
npm install
npm run seed
```

4. Start the server:

```bash
npm run dev
```

API runs at **http://localhost:5000**

## Admin account in MongoDB

Credentials are read from `.env` and **saved to MongoDB** (password is bcrypt-hashed):

| Env variable | Purpose |
|--------------|---------|
| `ADMIN_USERNAME` | Login username (stored in DB) |
| `ADMIN_EMAIL` | Email (stored in DB) |
| `ADMIN_PASSWORD` | Plain password in `.env` only — hashed before save |
| `ADMIN_NAME` | Display name |

On server start, `ensureAdmin()` creates the admin in MongoDB if none exists.

| Field | Default |
|-------|---------|
| Username | `admin` |
| Email | `admin@portfo.com` |
| Password | `admin123` |

Change `.env`, then restart the server or run `npm run seed`.

## API endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Login, returns JWT |
| POST | `/api/auth/logout` | Yes | Revoke token (server-side logout) |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/projects` | Yes | List projects |
| POST | `/api/projects` | Yes | Create project |
| PUT | `/api/projects/:id` | Yes | Update project |
| DELETE | `/api/projects/:id` | Yes | Delete project |
| GET | `/api/skills` | Yes | List skills |
| POST | `/api/skills` | Yes | Create skill |
| PUT | `/api/skills/:id` | Yes | Update skill |
| DELETE | `/api/skills/:id` | Yes | Delete skill |
| GET | `/api/messages` | Yes | List messages |
| PATCH | `/api/messages/:id` | Yes | Mark read |
| DELETE | `/api/messages/:id` | Yes | Delete message |
| POST | `/api/messages/contact` | — | Public contact form |
| GET | `/api/dashboard/stats` | Yes | Dashboard counts |
| GET | `/api/dashboard/recent` | Yes | Recent projects & messages |

Send JWT as: `Authorization: Bearer <token>`

### Certificate images

- `POST /api/certificates/upload` — multipart field `image` (max 5MB), returns `{ url: "/uploads/certificates/..." }`
- Files are served at `http://localhost:5000/uploads/certificates/...`
