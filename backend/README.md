# Job Aggregator Backend

Python FastAPI backend for the job aggregation platform.

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL + SQLAlchemy ORM
- **Cache/Dedup**: Redis
- **Scraping**: httpx + BeautifulSoup (lxml)
- **Resume Parsing**: pdfplumber
- **Email**: SMTP
- **Job Scheduling**: APScheduler
- **API Schema**: Pydantic

## Setup

### 1. Prerequisites

- Python 3.10+
- PostgreSQL 12+
- Redis 6+

### 2. Install Dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update:

```ini
DATABASE_URL=postgresql://user:password@localhost:5432/job_aggregator
REDIS_URL=redis://localhost:6379
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

### 4. Initialize Database

```bash
python -m app.core.init_db
```

This creates all required tables.

### 5. Run Backend

```bash
python -m uvicorn app.main:app --reload --app-dir backend --port 8000
```

API available at `http://localhost:8000`

## Project Structure

```
backend/
├── app/
│   ├── api/                 # API routes & schemas
│   │   ├── job_routes.py    # GET /jobs search/detail
│   │   ├── alert_routes.py  # CRUD /alerts
│   │   ├── match_routes.py  # POST /match/resume
│   │   └── schemas.py       # Pydantic models
│   │
│   ├── fetchers/            # Job data fetchers
│   │   ├── base.py          # Abstract base fetcher
│   │   ├── career_page.py   # Generic YAML-config scraper
│   │   └── adzuna_api.py    # Adzuna public API
│   │
│   ├── services/            # Business logic
│   │   ├── fetcher_service.py      # Orchestrate all fetchers
│   │   ├── normalizer.py           # Normalize raw jobs
│   │   ├── dedup_service.py        # Redis dedup
│   │   ├── job_repository.py       # DB persistence
│   │   ├── alert_service.py        # Alert matching & notifications
│   │   ├── email_service.py        # SMTP email sending
│   │   ├── resume_parser.py        # PDF text extraction
│   │   └── job_matcher.py          # Resume vs JD matching
│   │
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── job_model.py
│   │   └── alert.py
│   │
│   ├── core/                # Core utilities
│   │   ├── config.py        # Settings from .env
│   │   ├── database.py      # SQLAlchemy setup
│   │   ├── redis.py         # Redis client
│   │   └── init_db.py       # DB initialization
│   │
│   ├── configs/companies/   # YAML fetcher configs
│   │   ├── google.yaml
│   │   ├── microsoft.yaml
│   │   └── meta.yaml
│   │
│   └── main.py              # FastAPI app entry
│
├── scripts/
│   └── fetch_and_save.py    # CLI: fetch jobs, normalize, save, alert
│
├── tests/
│   ├── test_fetchers.py
│   ├── test_normalization_dedup.py
│   └── test_resume_match.py
│
├── requirements.txt
├── README.md
└── .env.example
```

## API Endpoints

### Jobs

**Search jobs:**
```
GET /jobs?title=engineer&company=google&location=SF&job_type=full-time&skip=0&limit=50
```

Response:
```json
{
  "items": [...],
  "total": 1234,
  "skip": 0,
  "limit": 50,
  "has_more": true
}
```

**Get job detail:**
```
GET /jobs/{id}
```

### Alerts

**Create alert:**
```
POST /alerts
{
  "email": "user@example.com",
  "name": "Senior Engineer Jobs",
  "filters": {
    "title": "engineer",
    "company": "google",
    "location": null,
    "job_type": "full-time"
  }
}
```

**List alerts:**
```
GET /alerts?email=user@example.com
```

**Delete alert:**
```
DELETE /alerts/{id}
```

### Resume Matching

**Upload resume & get matches:**
```
POST /match/resume?top_n=20
Content-Type: multipart/form-data
```

Request body: PDF file

Response:
```json
{
  "total_jobs_scored": 5000,
  "top_matches": [
    {
      "job": {...},
      "match_score": 42,
      "matched_keywords": 42
    }
  ]
}
```

## Key Features

### Job Fetching (Phase 2)
- Generic career page scraper (YAML-driven)
- Adzuna public API integration
- Unified raw job format

### Normalization & Dedup (Phase 3)
- Canonical URLs
- Job type normalization
- SHA256 dedup hash
- Redis TTL-backed dedup (14 days)

### Job Search API (Phase 4)
- Filter by title, company, location, job type, source
- Pagination support

### Alerts (Phase 5)
- Create job alerts with filters
- Match new jobs against alerts
- Send email notifications (SMTP)

### Resume Matching (Phase 6)
- PDF text extraction (pdfplumber)
- Keyword-based matching (simple, explainable)
- Ranked results

## Database Models

### Job
```
id, title, company, location, job_type, description,
source_url, source, dedup_hash, posted_date, expires_date,
is_active, metadata, created_at, updated_at
```

### UserAlert
```
id, email, name, filters (JSON), is_active,
created_at, updated_at
```

## CLI Commands

### Fetch & Save Jobs

```bash
python backend/scripts/fetch_and_save.py
```

Fetches from all sources, normalizes, deduplicates, saves to DB, checks alerts.

## Testing

```bash
# Test fetchers
python backend/tests/test_fetchers.py

# Test normalization & dedup
python backend/tests/test_normalization_dedup.py

# Test resume matching
python backend/tests/test_resume_match.py
```

## Environment Setup (macOS/Linux)

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -m app.core.init_db

# Run backend
python -m uvicorn app.main:app --reload --port 8000
```

## Common Tasks

### Add a New Company Career Page

1. Create `backend/app/configs/companies/company_name.yaml`:
```yaml
company: "Company Name"
base_url: "https://company.com"
job_url: "https://company.com/careers/jobs"
source: "career_page"

selectors:
  job_container: "div.job-listing"
  title: "h2.job-title"
  location: "span.location"
  link: "a.apply-link"
  description: "p.description"
```

2. Fetcher will automatically pick it up on next run.

### Test a New Fetcher

```bash
python -c "
import asyncio
from app.fetchers.career_page import CareerPageFetcher

async def test():
    fetcher = CareerPageFetcher('app/configs/companies/company_name.yaml')
    jobs = await fetcher.fetch()
    print(f'Fetched {len(jobs)} jobs')
    for j in jobs[:3]:
        print(j)

asyncio.run(test())
"
```

### Check Redis Dedup Memory

```bash
redis-cli
> KEYS "jobs:dedup:*" | wc -l
```

## Deployment

See [Phase 8 - Deployment](../README.md) for production setup.

## Phases

- ✅ Phase 0 - Setup
- ✅ Phase 1 - Database schema
- ✅ Phase 2 - Job fetching
- ✅ Phase 3 - Normalization & dedup
- ✅ Phase 4 - Job search API
- ✅ Phase 5 - Alerts engine
- ✅ Phase 6 - Resume matching
- ✅ Phase 7 - Minimal frontend
- ⏳ Phase 8 - Deployment & docs

## Troubleshooting

### "No module named 'app'"
Ensure you're in the `backend/` directory or add it to PYTHONPATH:
```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### Database connection errors
Check `.env` DATABASE_URL and ensure PostgreSQL is running:
```bash
psql -U user -d job_aggregator -c "SELECT 1;"
```

### Redis connection errors
Ensure Redis is running:
```bash
redis-cli ping
```

### SMTP email not sending
- Check `.env` SMTP settings
- For Gmail, use App Password (not regular password)
- Enable "Less secure app access" if needed

### Adzuna API returns no results
- Verify `ADZUNA_APP_ID` and `ADZUNA_APP_KEY` in `.env`
- Check API rate limits (Adzuna free tier may have restrictions)

## Contributing

1. Follow PEP 8 style guide
2. Use single-responsibility functions
3. Add type hints
4. Write tests for new features
5. Keep configs in YAML, not code

## License

Portfolio project - 2026
