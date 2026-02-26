# RoleSync Frontend

Modern React + Vite + Tailwind frontend for the RoleSync platform.

## Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Features

- **Search Jobs**: Filter by title, company, location, job type
- **Manage Alerts**: Create and manage job alerts with filters
- **Resume Matching**: Upload PDF resume and get ranked job matches
- **Dark Mode**: Toggle theme with persistent preference
- **Static Pages**: About, Blog, Contact, Privacy, Terms

## Routing

The frontend uses React Router for URL-based routing.

| Route | Page |
| --- | --- |
| `/` | Search Jobs |
| `/search` | Search Jobs |
| `/alerts` | Alerts |
| `/resume` | Resume Match |
| `/about` | About |
| `/blog` | Blog |
| `/contact` | Contact |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

## API Proxy

Vite is configured to proxy API calls from `/api/*` to `http://localhost:8000/*`.

Ensure backend is running on port 8000:

```bash
cd backend
python -m uvicorn app.main:app --reload --app-dir backend --port 8000
```

## Build

```bash
npm run build
```

Output: `dist/`
