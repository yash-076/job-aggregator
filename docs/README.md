# Job Aggregator Backend

## Phase 1 - Database Schema

### Setup Instructions

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL credentials

4. **Initialize database:**
   ```bash
   python -m backend.app.core.init_db
   ```

### Database Schema

**Table: jobs**
- `id`: Primary key
- `title`: Job title
- `company`: Company name
- `location`: Job location
- `job_type`: internship | full-time | contract
- `description`: Full job description
- `source_url`: Original posting URL (unique)
- `source`: Source identifier (e.g., "google_careers")
- `dedup_hash`: Hash for deduplication (unique)
- `posted_date`: When job was posted
- `expires_date`: When job expires
- `is_active`: Active status flag
- `metadata`: Additional fields as JSON
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp
