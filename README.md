# Job Aggregator

A comprehensive job aggregation and matching platform built with FastAPI and React that fetches job postings from multiple sources, matches them against user resumes, and sends personalized alerts.

## Project Structure

```
job-aggregator/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── fetchers/         # Job source fetchers
│   │   ├── models/           # Database models
│   │   ├── services/         # Business logic
│   │   ├── core/             # Core configuration
│   │   ├── configs/companies/# Job source configs
│   │   └── main.py
│   ├── scripts/          # Utility scripts
│   ├── tests/            # Unit tests
│   └── requirements.txt
│
├── frontend/            # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application pages
│   │   ├── services/     # API integration
│   │   ├── context/      # State management
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
│
├── docs/                # Documentation
└── .env.example         # Environment template
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python -m app.core.init_db  # Initialize database
python -m uvicorn app.main:app --reload --port 8000
```

API: `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Features

- **Job Aggregation**: Fetches job postings from multiple sources (Adzuna API, company career pages)
- **Smart Deduplication**: Removes duplicate job listings across sources with intelligent matching
- **Job Normalization**: Standardizes job data across different sources for consistency
- **Resume Matching**: AI-powered matching between resumes and job descriptions using TF-IDF/similarity algorithms
- **Job Alerts**: Email notifications for job matches based on user preferences and criteria
- **Dark Mode**: Full dark mode support with persistent theme preference
- **Search & Filter**: Advanced job search with location, salary, and skill filtering
- **Real-time Sync**: Redis-based caching for improved performance and reduced database load

## Technology Stack

### Backend
- **Framework**: FastAPI - Modern, fast web framework for building APIs
- **Database**: PostgreSQL - Robust relational database
- **Cache**: Redis - In-memory data store for caching and sessions
- **Task Scheduling**: APScheduler - For background job fetching
- **Email**: SMTP - Email alert delivery
- **Language**: Python 3.8+

### Frontend
- **Framework**: React 18+ - UI library
- **Build Tool**: Vite - Fast build tool and dev server
- **Styling**: Tailwind CSS - Utility-first CSS framework
- **State Management**: Context API - React built-in state management
- **HTTP Client**: Axios - Promise-based HTTP client

## Architecture Overview

### Backend Structure

- **API Routes** (`app/api/`): RESTful endpoints for jobs, alerts, and matching
  - `job_routes.py` - Job search and filtering endpoints
  - `alert_routes.py` - User alert management
  - `match_routes.py` - Resume matching endpoints
  
- **Fetchers** (`app/fetchers/`): Job source connectors
  - `adzuna_api.py` - Adzuna job API integration
  - `career_page.py` - Web scraping for company career pages
  - `base.py` - Base fetcher class
  
- **Services** (`app/services/`): Business logic
  - `job_matcher.py` - Resume-to-job matching logic
  - `dedup_service.py` - Deduplication engine
  - `email_service.py` - Email sending
  - `alert_service.py` - Alert management
  - `resume_parser.py` - Resume text extraction
  - `normalizer.py` - Job data normalization
  
- **Models** (`app/models/`): SQLAlchemy ORM models
  - `job_model.py` - Job listings
  - `alert_model.py` - User alerts
  
- **Core** (`app/core/`): Infrastructure
  - `database.py` - Database setup
  - `config.py` - Configuration management
  - `redis.py` - Redis client
  - `scheduler.py` - Background job scheduler

### Frontend Structure

- **Pages** (`src/pages/`): Main application pages
  - `JobSearch.jsx` - Browse and search jobs
  - `ResumeMatch.jsx` - Upload resume and match with jobs
  - `AlertManager.jsx` - Create and manage job alerts
  - About, Contact, Blog, Terms, Privacy pages
  
- **Components** (`src/components/`): Reusable UI components
  - `Button.jsx`, `Card.jsx`, `Input.jsx` - Basic components
  - `Layout.jsx` - Main layout wrapper
  - `LoadingSpinner.jsx`, `ErrorMessage.jsx` - Utility components
  
- **Services** (`src/services/`): API integration
  - `api.js` - Axios instance and API calls
  
- **Context** (`src/context/`): State management
  - `ThemeContext.jsx` - Dark mode theme management

## API Endpoints

### Jobs
```
GET  /api/jobs              - List all jobs with pagination
GET  /api/jobs/{id}         - Get job details
POST /api/jobs/search       - Search jobs with filters
```

### Alerts
```
GET    /api/alerts          - List user alerts
POST   /api/alerts          - Create new alert
GET    /api/alerts/{id}     - Get alert details
PUT    /api/alerts/{id}     - Update alert
DELETE /api/alerts/{id}     - Delete alert
```

### Matching
```
POST /api/match/upload      - Upload resume for matching
POST /api/match             - Match resume against jobs
GET  /api/match/results     - Get matching results
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/job_aggregator

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password

# API Keys
ADZUNA_API_KEY=your-adzuna-api-key
ADZUNA_APP_ID=your-app-id

# Job Scheduler
JOB_FETCH_INTERVAL=3600  # 1 hour in seconds
```

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16+ and npm
- PostgreSQL 12+
- Redis 5+

### Detailed Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -m app.core.init_db

# Run development server
python -m uvicorn app.main:app --reload --port 8000
```

### Detailed Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

### Running Tests

```bash
cd backend

# Run all tests
pytest tests/

# Run specific test file
pytest tests/test_fetchers.py -v

# Run with coverage
pytest --cov=app tests/
```

### Database Migrations

```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1
```

### Project Scripts

```bash
# Fetch jobs from configured sources
cd backend/scripts
python fetch_and_save.py

# Initialize database with schema
python -m app.core.init_db
```

## Configuration

### Job Sources

Job sources are configured in `backend/app/configs/companies/` with YAML files:

**Example: google.yaml**
```yaml
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

### Supported Job Sources
- **Adzuna API** - Major job aggregator API
- **Google Careers** - Web scraping
- **Meta Careers** - Web scraping
- **Microsoft Careers** - Web scraping

## Phases Completed

- ✅ **Phase 0** - Project setup and architecture
- ✅ **Phase 1** - Database schema & ORM models
- ✅ **Phase 2** - Job fetching (career pages + Adzuna API)
- ✅ **Phase 3** - Data normalization & deduplication
- ✅ **Phase 4** - Job search & detail APIs
- ✅ **Phase 5** - Alert engine with email notifications
- ✅ **Phase 6** - Resume vs JD matching algorithm
- ✅ **Phase 7** - Responsive React frontend with dark mode
- ⏳ **Phase 8** - Deployment & documentation

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and commit (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript
- Write tests for new features
- Update documentation as needed

## Testing

### Backend Tests
- **test_fetchers.py** - Job fetching functionality
- **test_normalization_dedup.py** - Data normalization and deduplication
- **test_resume_match.py** - Resume matching algorithm

### Frontend Testing
- Component testing with Vitest
- Integration testing with end-to-end tests

```bash
cd frontend
npm run test
```

## Performance Optimization

- **Redis Caching**: Frequently accessed job data cached in Redis
- **Database Indexing**: Proper indexes on job title, location, and date fields
- **Frontend Code Splitting**: Vite automatically chunks code for faster loading
- **Lazy Loading**: Components loaded on-demand
- **API Response Pagination**: Jobs returned in manageable chunks
- **Query Optimization**: Efficient database queries with proper joins

## Known Issues & Limitations

- Email alerts currently support SMTP only (OAuth2 coming soon)
- Resume matching requires properly formatted PDF or text files
- Adzuna API rate limiting may require API key upgrade for high volume
- Web scraping may break if career page markup changes

## Future Enhancements

- [ ] Support for additional job sources (LinkedIn, Indeed, etc.)
- [ ] Advanced ML-based job recommendation engine using collaborative filtering
- [ ] User authentication and personalized dashboards
- [ ] Mobile app for iOS/Android
- [ ] Multiple resume support and comparison
- [ ] Browser push notifications
- [ ] LinkedIn integration and profile sync
- [ ] Salary trend analysis
- [ ] Job market insights and statistics
- [ ] Interview preparation resources

## Troubleshooting

### Backend Issues

**Connection refused on port 8000**
```bash
# Check if port is in use
# Windows
netstat -ano | findstr :8000
# macOS/Linux
lsof -i :8000

# Kill the process if needed and restart
```

**Database connection error**
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env` file is correct
- Ensure database exists: `createdb job_aggregator`
- Run migrations: `alembic upgrade head`

**Redis connection error**
- Verify Redis is running: `redis-cli ping`
- Check REDIS_URL in `.env` file

### Frontend Issues

**Port 3000 already in use**
```bash
# Use alternative port
npm run dev -- --port 5173
```

**Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Dark mode not persisting**
- Check localStorage is enabled in browser
- Clear browser cache and reload
- Verify ThemeContext is properly initialized

## Documentation

- [Backend API Documentation](./backend/README.md)
- [Frontend Development Guide](./frontend/README.md)
- [Dark Mode Implementation](./frontend/DOCUMENTATION/DARK_MODE.md)
- [Architecture Overview](./docs/README.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact & Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Contact the development team

---

**Last Updated**: February 2026  
**Status**: Active Development  
**Maintainers**: Development Team
