# RoleSync Backend

FastAPI backend for the RoleSync job aggregation platform.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | FastAPI |
| ORM | SQLAlchemy 2 |
| Validation | Pydantic v2 |
| Database | PostgreSQL 12+ |
| Cache | Redis 6+ |
| Scraping | httpx + BeautifulSoup (lxml) |
| Resume parsing | pdfplumber |
| Auth | python-jose (JWT) + passlib/bcrypt |
| Scheduling | APScheduler |
| Email | SMTP |

## Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create `.env`:

```ini
DATABASE_URL=postgresql://user:password@localhost:5432/job_aggregator
REDIS_URL=redis://localhost:6379
SECRET_KEY=your_jwt_secret
LOG_LEVEL=INFO

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=your_email@gmail.com

ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
ADZUNA_COUNTRY=us
```

Initialize and run:

```bash
python -m app.core.init_db
uvicorn app.main:app --reload --port 8000
```

Swagger UI: `http://localhost:8000/docs`

## API Endpoints

### Auth

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/signup` | Register user |
| `POST` | `/auth/login` | Get JWT token |

### Jobs

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/jobs` | List/search jobs (paginated) |
| `GET` | `/api/jobs/{id}` | Job details |
| `POST` | `/api/jobs/search` | Full-text search with filters |

### Alerts

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/alerts` | List user's alerts |
| `POST` | `/api/alerts` | Create alert |
| `PUT` | `/api/alerts/{id}` | Update alert |
| `DELETE` | `/api/alerts/{id}` | Delete alert |

### Resume Matching

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/match/resume` | Upload PDF & get ranked matches |

## Project Structure

```
app/
├── api/                      # Routes + schemas
│   ├── auth_routes.py        # Signup/login
│   ├── auth_dependencies.py  # JWT dependency
│   ├── job_routes.py         # Job search/detail
│   ├── alert_routes.py       # Alert CRUD
│   ├── match_routes.py       # Resume matching
│   └── schemas.py            # Pydantic models
├── fetchers/                 # Job source connectors
│   ├── base.py               # Abstract fetcher
│   ├── adzuna_api.py         # Adzuna REST API
│   └── career_page.py        # YAML-driven HTML scraper
├── services/                 # Business logic
│   ├── fetcher_service.py    # Orchestrates all fetchers
│   ├── normalizer.py         # Title/location/salary normalization
│   ├── dedup_service.py      # SHA256 + Redis TTL dedup
│   ├── job_repository.py     # DB persistence
│   ├── job_matcher.py        # TF-IDF resume ↔ job matching
│   ├── resume_parser.py      # PDF text extraction
│   ├── alert_service.py      # Alert evaluation & dispatch
│   ├── email_service.py      # SMTP sending
│   ├── email_queue_service.py
│   └── redis_sync_service.py
├── models/                   # SQLAlchemy ORM
│   ├── job_model.py
│   ├── alert_model.py
│   └── user_model.py
├── core/                     # Infrastructure
│   ├── config.py             # Pydantic Settings (.env)
│   ├── database.py           # Engine + session
│   ├── init_db.py            # Table creation
│   ├── jwt_handler.py        # JWT encode/decode
│   ├── redis.py              # Redis client
│   └── scheduler.py          # APScheduler background jobs
├── configs/companies/        # Scraper YAML configs
│   ├── google.yaml
│   ├── meta.yaml
│   └── microsoft.yaml
└── main.py                   # App entry + lifespan
```

## Testing

```bash
pytest tests/ -v
pytest --cov=app tests/
```

## Deployment

Deployed on **Render** via Docker — see `render.yaml` and `Dockerfile`.

Production command: `gunicorn --workers=2 --worker-class=uvicorn.workers.UvicornWorker app.main:app`
