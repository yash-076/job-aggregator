# Job Aggregator

## Project Structure

```
job-aggregator/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   ├── fetchers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── core/
│   │   ├── configs/companies/
│   │   └── main.py
│   ├── scripts/
│   ├── tests/
│   └── requirements.txt
│
├── frontend/            # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
│
└── .env.example
```

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --app-dir backend --port 8000
```

API: `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

## Phases Completed

- ✅ Phase 0 - Setup
- ✅ Phase 1 - Database schema & models
- ✅ Phase 2 - Job fetching (career pages + Adzuna API)
- ✅ Phase 3 - Normalization & deduplication
- ✅ Phase 4 - Job search & detail APIs
- ✅ Phase 5 - Alerts engine (email only)
- ✅ Phase 6 - Resume vs JD matching
- ✅ Phase 7 - Minimal frontend
- ⏳ Phase 8 - Deployment & docs
