# Portfo. — MERN Portfolio Stack

| Folder | Description |
|--------|-------------|
| `portfolio-site/` | Public portfolio website (React + Tailwind) |
| `admin-dashboard/` | React admin UI (Vite + TypeScript + Tailwind) |
| `server/` | Express REST API + MongoDB |

## Quick start

### 1. MongoDB

Install and start MongoDB locally, or set `MONGODB_URI` in `server/.env` to a MongoDB Atlas connection string.

### 2. Backend

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

API: http://localhost:5000

### 3. Public portfolio

```bash
cd portfolio-site
npm install
npm run dev
```

Portfolio: http://localhost:5174

### 4. Admin dashboard

```bash
cd admin-dashboard
npm install
npm run dev
```

Admin UI: http://localhost:5173

### 5. Login

| Email | Password |
|-------|----------|
| `admin@portfo.com` | `admin123` |

(Vals from `server/.env` after `npm run seed`)

## Architecture

```
Portfolio (5174)  --proxy /api-->  Express (5000)  -->  MongoDB
Admin (5173)      --proxy /api-->  Express (5000)  -->  MongoDB
```

Both Vite apps proxy `/api` and `/uploads` to the backend. Set `CLIENT_URL` in `server/.env` to both origins (see `.env.example`).

### Public API (no auth)

| Endpoint | Description |
|----------|-------------|
| `GET /api/public/projects` | Published projects |
| `GET /api/public/projects/:id` | Single project |
| `GET /api/public/skills` | Skills with proficiency |
| `GET /api/public/education` | Education timeline |
| `GET /api/public/certificates` | Published certificates |
| `POST /api/messages/contact` | Contact form submission |
| `GET /api/public/chat/status` | Portfolio AI chat availability |
| `POST /api/public/chat` | Portfolio AI chat (answers from your DB content) |

Content is managed in the admin dashboard; the portfolio site reads published data automatically.

### Portfolio AI chat

Visitors can click **Ask AI** on the portfolio site. Answers are generated from your profile, projects, skills, education, certificates, and any links stored in the admin (GitHub, LinkedIn, live demos, credential URLs, etc.). Uses the same AI keys as admin skill suggestions (`GROQ_API_KEY`, `GEMINI_API_KEY`, or `OPENAI_API_KEY` in `server/.env`).

### Messages (contact form)

| Action | Endpoint |
|--------|----------|
| Portfolio visitor submits form | `POST /api/messages/contact` (public) |
| Admin inbox | `GET /api/messages` (auth required) |
| Mark read / delete | `PATCH` / `DELETE /api/messages/:id` |

Messages appear in **Admin → Messages** and on the **Dashboard** under Recent Messages.

**Real-time updates:** while logged into the admin dashboard, the server pushes new messages over SSE (`GET /api/messages/stream`). The inbox, sidebar unread badge, and dashboard stats update without refresh.

### AI skill suggestions (admin)

When adding a skill, the admin can use **AI recommendations** (logo + category + proficiency). Add one API key to `server/.env`:

```env
GROQ_API_KEY=your_groq_key
```

Or use `GEMINI_API_KEY` or `OPENAI_API_KEY` instead. Restart the server after adding the key.
