# Portfo. — MERN Portfolio Stack

A full-stack portfolio you can manage yourself: a public site for visitors, an admin dashboard to edit content, and an Express API backed by MongoDB.

| Folder | What it is |
|--------|------------|
| `portfolio-site/` | Public portfolio (React + Vite + Tailwind) |
| `admin-dashboard/` | Admin panel to manage projects, skills, messages, and more |
| `server/` | REST API, file uploads, JWT auth, AI features |

---

## Before you start

You will need:

- **Node.js** 18+ (20+ recommended)
- **npm** (comes with Node)
- **MongoDB** — either installed locally, or a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

During development you run **three processes** (API + two frontends). Each needs its own terminal window or tab.

---

## Setup

### 1. Clone and open the project

```bash
git clone <your-repo-url>
cd portfolio
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env
```

Open `server/.env` and set at least the **required** variables listed below (especially `MONGODB_URI`, `JWT_SECRET`, and your admin login).

Install dependencies:

```bash
npm install
```

Seed the database with sample content and your admin user (password is stored **hashed** in MongoDB):

```bash
npm run seed
```

> **Note:** `npm run seed` clears existing data and recreates it. Use it for a fresh start, not on a production database you want to keep.

### 3. Install the frontends

From the project root:

```bash
cd portfolio-site
npm install

cd ../admin-dashboard
npm install
```

The portfolio site and admin app work out of the box in dev mode — they proxy API requests to `http://localhost:5000`. You usually **do not** need a `.env` file in the frontends unless you point them at a remote API (see [Frontend environment variables](#frontend-environment-variables-optional)).

---

## Environment variables

### Backend (`server/.env`)

Copy from `server/.env.example`. Never commit `.env` to git.

#### Required

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string. Local example: `mongodb://127.0.0.1:27017/portfolio`. For Atlas, use the connection string from the Atlas dashboard. |
| `JWT_SECRET` | A long random string used to sign login tokens. Use something strong in production — not the placeholder from the example file. |
| `ADMIN_USERNAME` | Username for admin login (stored in MongoDB). |
| `ADMIN_EMAIL` | Admin email (stored in MongoDB). |
| `ADMIN_PASSWORD` | Admin password used when **creating** the user via `npm run seed` or on first server start. After that, change it from **Admin → Profile → Reset password**; login uses the hash in the database. |
| `ADMIN_NAME` | Display name shown in the admin UI. |

#### Recommended for local development

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Port the API listens on. |
| `JWT_EXPIRES_IN` | `7d` | How long login tokens stay valid (e.g. `7d`, `24h`). |
| `CLIENT_URL` | `http://localhost:5173,http://localhost:5174` | Comma-separated URLs allowed by CORS — your admin and portfolio dev servers. Add production URLs when you deploy. |

#### Optional — AI (portfolio chat + admin skill suggestions)

Set **one** provider. Restart the server after adding a key.

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | [Groq](https://console.groq.com/) API key (default model: `llama-3.1-8b-instant` via `GROQ_MODEL`) |
| `GEMINI_API_KEY` | Google Gemini key (`GEMINI_MODEL`, e.g. `gemini-2.0-flash`) |
| `OPENAI_API_KEY` | OpenAI key (`OPENAI_MODEL`, e.g. `gpt-4o-mini`) |

Without an AI key, the portfolio chat and AI skill suggestions are disabled; everything else still works.

#### Optional — default profile on first run

| Variable | Description |
|----------|-------------|
| `PROFILE_LINKEDIN_URL` | LinkedIn profile URL used when seeding / creating the site profile |
| `PROFILE_IMAGE_URL` | Profile photo URL (e.g. copy image address from LinkedIn). You can also set this later in **Admin → Profile**. |

---

### Frontend environment variables (optional)

Both `portfolio-site` and `admin-dashboard` can use a `.env` file. For **local development**, leave `VITE_API_URL` unset — Vite proxies `/api` and `/uploads` to the backend.

| Variable | When to set |
|----------|-------------|
| `VITE_API_URL` | Only when the API is on another host (e.g. `https://api.yoursite.com/api`). See `admin-dashboard/.env.example`. |

---

## How to run

Start the **API first**, then the two frontends. Use three terminals.

### Terminal 1 — Backend (API)

```bash
cd server
npm run dev
```

- API: **http://localhost:5000**
- Health check: **http://localhost:5000/api/health**

For production:

```bash
npm start
```

### Terminal 2 — Public portfolio

```bash
cd portfolio-site
npm run dev
```

- Site: **http://localhost:5174**

Production build:

```bash
npm run build
npm run preview
```

### Terminal 3 — Admin dashboard

```bash
cd admin-dashboard
npm run dev
```

- Admin: **http://localhost:5173**

Production build:

```bash
npm run build
npm run preview
```

### Sign in to the admin

Use the credentials from `server/.env` (after `npm run seed`), for example:

| Field | Example (from `.env.example`) |
|-------|-------------------------------|
| Username | Value of `ADMIN_USERNAME` |
| Password | Value of `ADMIN_PASSWORD` (only until you change it in the app) |

You can log in with **username** or **email**.

To change your password while logged in: **Profile → Reset password** (updates the hashed password in MongoDB).

---

## How it fits together

```
Portfolio site (5174)  ──proxy /api, /uploads──►  Express API (5000)  ──►  MongoDB
Admin dashboard (5173)   ──proxy /api, /uploads──►  Express API (5000)  ──►  MongoDB
```

- You edit content in the **admin dashboard**.
- The **portfolio site** reads published data from public API routes.
- Uploaded images (projects, certificates, profile) are stored under `server/uploads/` and served from the API.

---

## Main features

- **Projects, skills, education, certificates** — full CRUD in the admin; public site shows published items only.
- **Contact form** — messages land in **Admin → Messages**, with live updates via SSE while you are logged in.
- **Portfolio AI chat** — visitors can ask questions; answers use your profile and content from the database (needs an AI key in `.env`).
- **AI skill suggestions** — optional help when adding skills in the admin (same AI keys).
- **Profile** — one profile for the admin header and the public site (photo, bio, links).

---

## Useful scripts

| Location | Command | Purpose |
|----------|---------|---------|
| `server/` | `npm run dev` | API with auto-restart on file changes |
| `server/` | `npm start` | API (production) |
| `server/` | `npm run seed` | Reset DB + sample data + admin user |
| `portfolio-site/` | `npm run dev` | Public site dev server |
| `portfolio-site/` | `npm run build` | Production build → `dist/` |
| `admin-dashboard/` | `npm run dev` | Admin dev server |
| `admin-dashboard/` | `npm run build` | Production build → `dist/` |

---

## Security reminders

- Do not commit `server/.env` or API keys.
- Use a strong `JWT_SECRET` and `ADMIN_PASSWORD` in production.
- Change the default admin password after first login via **Profile → Reset password**.

---

## License

Private project — adjust as needed for your own use.
