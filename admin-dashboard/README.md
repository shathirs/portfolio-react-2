# Portfo. Admin Dashboard

Frontend for the portfolio admin panel (MERN stack — admin UI only for now).

## Stack

- **React 19** + **TypeScript**
- **Vite** — dev server and build
- **Tailwind CSS v4** — styling
- **React Router** — navigation (wired in Step 2+)
- **Lucide React** — icons (used from Step 2+)

## Project structure

```
src/
  components/   # Reusable UI (tables, forms, cards)
  layouts/      # Admin shell (sidebar, top bar)
  pages/        # Route screens (login, dashboard, projects, …)
  data/         # Mock data until API is connected
  types/        # Shared TypeScript types
```

## Scripts

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

## Backend API

Requires the Express server in `../server` running on port 5000. Vite proxies `/api` automatically.

Login uses JWT stored in `localStorage`. See root `README.md` for full MERN setup.

## Routes

| Path | Screen |
|------|--------|
| `/login` | Admin login (no sidebar) |
| `/dashboard` | Overview |
| `/projects` | Projects list |
| `/projects/new` | Add project |
| `/projects/:id/edit` | Edit project |
| `/skills` | Skills |
| `/education` | Education |
| `/certificates` | Certificates |
| `/messages` | Messages |
| `/profile` | Profile |

## Next steps

1. ✅ Scaffold (Vite, Tailwind, folders, types)
2. ✅ Layout + routing (sidebar, top bar)
3. ✅ Login page (form, validation, remember me)
4. ✅ Dashboard overview (stats, recent projects & messages)
5. ✅ Projects list + add/edit form (CRUD with mock state)
6. ✅ Skills management (CRUD, progress bars)
7. ✅ Messages inbox + polished coming-soon pages (Education, Certificates, Profile)
