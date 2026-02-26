# RoleSync

AI-powered job aggregation platform that pulls listings from multiple sources, deduplicates them, and matches them against your resume — all in one place.

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)

## What It Does

| Feature | Description |
|---------|-------------|
| **Job Aggregation** | Fetches listings from the Adzuna API and company career pages (Google, Meta, Microsoft) on a scheduled background job |
| **Deduplication** | Removes duplicate postings across sources using intelligent fuzzy matching |
| **Normalization** | Standardizes titles, locations, and salary formats so everything is comparable |
| **Resume Matching** | Upload a PDF resume and get jobs ranked by TF-IDF similarity score |
| **Smart Alerts** | Set keyword/location filters and receive email notifications when new matches appear |
| **Auth** | JWT-based signup/signin with protected routes |
| **Search & Filter** | Full-text search with filters for title, company, location, job type, and salary range |
| **Redis Caching** | Frequently accessed data is cached to keep responses fast |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.10+, FastAPI, SQLAlchemy 2, Pydantic v2 |
| **Database** | PostgreSQL 12+ |
| **Cache** | Redis 6+ |
| **Scraping** | httpx, BeautifulSoup (lxml) |
| **Resume Parsing** | pdfplumber |
| **Scheduling** | APScheduler |
| **Auth** | python-jose (JWT), passlib + bcrypt |
| **Email** | SMTP |
| **Frontend** | React 18, React Router 6, Vite |
| **Styling** | Tailwind CSS 3, Lucide React icons |
| **Deployment** | Render (backend Docker), Vercel (frontend SPA) |

## Project Structure

```
job-aggregator/
├── backend/
│   ├── app/
│   │   ├── api/                  # Route handlers + Pydantic schemas
│   │   │   ├── auth_routes.py    # POST /auth/signup, /auth/login
│   │   │   ├── job_routes.py     # GET /jobs, /jobs/{id}, /jobs/search
│   │   │   ├── alert_routes.py   # CRUD /alerts
│   │   │   ├── match_routes.py   # POST /match/resume
│   │   │   ├── auth_dependencies.py
│   │   │   └── schemas.py
│   │   ├── fetchers/             # Job source connectors
│   │   │   ├── adzuna_api.py     # Adzuna REST API
│   │   │   ├── career_page.py    # HTML career page scraper
│   │   │   └── base.py           # Abstract fetcher
│   │   ├── services/             # Business logic
│   │   │   ├── job_matcher.py    # TF-IDF resume ↔ job matching
│   │   │   ├── dedup_service.py  # Fuzzy deduplication
│   │   │   ├── normalizer.py     # Data normalization
│   │   │   ├── resume_parser.py  # PDF text extraction
│   │   │   ├── alert_service.py  # Alert evaluation & dispatch
│   │   │   ├── email_service.py  # SMTP email sending
│   │   │   ├── email_queue_service.py
│   │   │   ├── fetcher_service.py
│   │   │   ├── job_repository.py
│   │   │   └── redis_sync_service.py
│   │   ├── models/               # SQLAlchemy ORM models
│   │   │   ├── job_model.py
│   │   │   ├── alert_model.py
│   │   │   └── user_model.py
│   │   ├── core/                 # Config, DB, Redis, scheduler
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── init_db.py
│   │   │   ├── jwt_handler.py
│   │   │   ├── redis.py
│   │   │   └── scheduler.py
│   │   ├── configs/companies/    # YAML scraper configs
│   │   │   ├── google.yaml
│   │   │   ├── meta.yaml
│   │   │   └── microsoft.yaml
│   │   └── main.py
│   ├── scripts/
│   │   └── fetch_and_save.py     # Manual fetch script
│   ├── tests/
│   │   ├── test_fetchers.py
│   │   ├── test_normalization_dedup.py
│   │   └── test_resume_match.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/                # Route-level pages
│   │   │   ├── LandingPage.jsx   # Public marketing page
│   │   │   ├── SignIn.jsx        # Auth
│   │   │   ├── SignUp.jsx
│   │   │   ├── JobSearch.jsx     # Protected — search & filter jobs
│   │   │   ├── AlertManager.jsx  # Protected — manage alerts
│   │   │   ├── ResumeMatch.jsx   # Protected — upload resume & match
│   │   │   ├── About.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Privacy.jsx
│   │   │   └── Terms.jsx
│   │   ├── components/
│   │   │   ├── landing/          # Landing & app layout shells
│   │   │   │   ├── DarkLayout.jsx      # Public page wrapper
│   │   │   │   ├── AppDarkLayout.jsx   # Authenticated page wrapper
│   │   │   │   ├── LandingNavbar.jsx
│   │   │   │   ├── AppNavbar.jsx
│   │   │   │   ├── LandingFooter.jsx
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── FeaturesSection.jsx
│   │   │   │   ├── HowItWorksSection.jsx
│   │   │   │   ├── JobSourcesSection.jsx
│   │   │   │   ├── PricingSection.jsx
│   │   │   │   ├── FAQSection.jsx
│   │   │   │   ├── CTASection.jsx
│   │   │   │   └── StatsSection.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # JWT auth state
│   │   │   └── ThemeContext.jsx  # Dark mode preference
│   │   ├── services/
│   │   │   └── api.js            # Fetch wrapper for backend API
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── package.json
│
├── render.yaml                   # Render deployment config
└── docs/
```

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+ & npm
- PostgreSQL 12+
- Redis 6+

### 1. Clone & configure

```bash
git clone <repo-url>
cd job-aggregator
```

Create `backend/.env`:

```ini
DATABASE_URL=postgresql://user:password@localhost:5432/job_aggregator
REDIS_URL=redis://localhost:6379

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=your_email@gmail.com

ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
ADZUNA_COUNTRY=us

SECRET_KEY=your_jwt_secret
LOG_LEVEL=INFO
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

pip install -r requirements.txt
python -m app.core.init_db   # Create tables
uvicorn app.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs` (Swagger UI).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`. The Vite dev server proxies `/api/*` requests to the backend on port 8000.

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Authenticate & receive JWT |

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs` | List jobs (paginated, filterable) |
| `GET` | `/api/jobs/{id}` | Get job details |
| `POST` | `/api/jobs/search` | Full-text search with filters |

### Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/alerts` | List user's alerts |
| `POST` | `/api/alerts` | Create an alert |
| `PUT` | `/api/alerts/{id}` | Update an alert |
| `DELETE` | `/api/alerts/{id}` | Delete an alert |

### Resume Matching

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/match/resume` | Upload PDF resume & get ranked job matches |

## How It Works

```
┌────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Adzuna API    │────▶│              │     │  PostgreSQL  │
├────────────────┤     │   Fetcher    │────▶│   (jobs,     │
│  Career Pages  │────▶│   Service    │     │   users,     │
│  (Google, Meta,│     │              │     │   alerts)    │
│   Microsoft)   │     └──────┬───────┘     └──────┬──────┘
└────────────────┘            │                    │
                     Normalize + Dedup             │
                              │                    │
                     ┌────────▼────────┐    ┌──────▼──────┐
                     │  APScheduler    │    │   FastAPI    │
                     │  (runs every    │    │   REST API   │
                     │   N seconds)    │    └──────┬──────┘
                     └─────────────────┘           │
                                            ┌──────▼──────┐
                                            │  React SPA  │
                                            │  (Vite +    │
                                            │  Tailwind)  │
                                            └─────────────┘
```

1. **APScheduler** triggers the fetcher service on a fixed interval.
2. **Fetchers** pull raw listings from Adzuna and configured career pages.
3. **Normalizer** standardizes fields; **Dedup** removes duplicates by fuzzy title + company matching.
4. Clean jobs are stored in **PostgreSQL** and cached in **Redis**.
5. The **FastAPI** layer exposes search, alert, and matching endpoints.
6. The **React** frontend consumes the API — protected routes require JWT auth.
7. **Alert service** evaluates new jobs against saved filters and queues email notifications.

## Job Source Configuration

Career page scrapers are driven by YAML configs in `backend/app/configs/companies/`:

```yaml
# google.yaml
name: "Google Careers"
url: "https://careers.google.com/jobs/results/"
enabled: true
fields:
  title: ".job-title"
  company: ".company-name"
  location: ".location"
  description: ".job-description"
  salary: ".salary-range"
```

Add a new company by creating another YAML file in the same directory.

## Testing

```bash
cd backend

pytest tests/ -v                   # Run all tests
pytest tests/test_fetchers.py -v   # Fetcher tests
pytest tests/test_normalization_dedup.py -v
pytest tests/test_resume_match.py -v
pytest --cov=app tests/            # With coverage
```

## Deployment

| Service | Platform | Config |
|---------|----------|--------|
| Backend | Render (Docker) | `render.yaml` — Gunicorn + Uvicorn workers |
| Frontend | Vercel (SPA) | `vercel.json` — SPA rewrite rules |

The backend Dockerfile and `render.yaml` are preconfigured. Push to main to trigger deploys.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Port 8000 in use | `netstat -ano \| findstr :8000` → kill the process |
| DB connection error | Verify PostgreSQL is running and `DATABASE_URL` is correct |
| Redis connection error | Verify Redis is running and `REDIS_URL` is correct |
| Module not found (frontend) | `rm -rf node_modules package-lock.json && npm install` |
| Adzuna rate limit | Upgrade your Adzuna API plan or increase fetch interval |

## License

MIT

---

**Status**: Active Development
