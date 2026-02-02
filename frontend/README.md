# Job Aggregator Frontend

Minimal React + Vite + Tailwind frontend for the job aggregator platform.

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

## API Proxy

Vite is configured to proxy API calls from `/api/*` to `http://localhost:8000/*`

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
