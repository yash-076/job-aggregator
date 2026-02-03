# Deployment Guide - Render

## Overview

This guide walks you through deploying the Job Aggregator backend on [Render](https://render.com).

Render provides:
- Free PostgreSQL database
- Free Redis cache
- Free web service tier (with limits)
- Infrastructure as code via `render.yaml`

## Prerequisites

1. GitHub account (with repo pushed)
2. Render account (free tier)
3. Adzuna API credentials (optional, for job fetching)
4. Email credentials for alerts (Gmail with App Password recommended)

## Deployment Steps

### 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Job Aggregator Phase 7"
git remote add origin https://github.com/YOUR_USERNAME/job-aggregator.git
git branch -M main
git push -u origin main
```

### 2. Connect Render to GitHub

1. Go to [render.com](https://render.com)
2. Sign up / Log in
3. Click **+ New** → **Blueprint**
4. Select **GitHub** and authorize
5. Find your `job-aggregator` repo
6. Click **Connect**

### 3. Configure Environment Variables

In Render dashboard, go to your services and set:

#### For FastAPI service (`job-aggregator-api`):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=your_email@gmail.com

ADZUNA_APP_ID=your_adzuna_id
ADZUNA_APP_KEY=your_adzuna_key
ADZUNA_COUNTRY=us
```

**Note:** For Gmail:
- Enable 2-factor authentication
- Generate [App Password](https://support.google.com/accounts/answer/185833)
- Use App Password in `SMTP_PASSWORD`

### 4. Deploy

Click **Deploy** in Render dashboard. The `render.yaml` will:
1. Create PostgreSQL database
2. Create Redis instance
3. Build and deploy FastAPI service
4. Run database migrations (`build.sh`)

**Deployment takes 3-5 minutes.**

### 5. Verify Deployment

Once deployed:

```bash
# Check API health
curl https://job-aggregator-api.onrender.com/health

# Check swagger docs
curl https://job-aggregator-api.onrender.com/docs
```

## Render Dashboard Access

- **Database**: Services → `job-aggregator-db` → Connections
- **Redis**: Services → `job-aggregator-redis`
- **API Logs**: Services → `job-aggregator-api` → Logs

## Testing the Deployment

### Create an Alert

```bash
curl -X POST "https://job-aggregator-api.onrender.com/alerts" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_test_email@gmail.com",
    "name": "Test Alert",
    "filters": {"title": "engineer"}
  }'
```

### Search Jobs

```bash
curl "https://job-aggregator-api.onrender.com/jobs?title=engineer&limit=5"
```

### Run Manual Job Fetch

You'll need to trigger job fetching via CLI. For this on Render, use a **background worker** (Phase 8 enhancement).

For now, you can:
1. Trigger locally:
   ```bash
   python backend/scripts/fetch_and_save.py
   ```
   (Uses remote DB on Render)

2. Or add a **scheduled job** via Render's cron service (separate service in `render.yaml`).

## Troubleshooting

### "Connection refused" for database

- Check database URL in Render dashboard
- Verify PostgreSQL service is running
- Wait 2-3 minutes after deployment

### SMTP Email Not Sending

- Verify credentials in Render environment variables
- Check Gmail App Password (not regular password)
- Look at **Logs** tab for SMTP errors

### API returns 500 errors

Check **Logs** tab in Render dashboard:
```
ERROR: ModuleNotFoundError: No module named 'app'
```

Solution: Ensure `cd backend &&` is in build and start commands.

### Redis Connection Timeout

- Ensure Redis service is deployed
- Check Redis URL in environment

## Scaling Beyond Free Tier

When you outgrow free tier:

1. **PostgreSQL**: Upgrade to paid plan in Render dashboard
2. **Redis**: Upgrade to paid plan
3. **API**: Upgrade from free web service to standard ($7/mo)
4. **Cron jobs**: Use Render's cron service for scheduled fetches

## Auto-Redeploy on GitHub Push

In Render dashboard → **Settings**:
- Enable "Auto-deploy on push"
- Connects webhook to GitHub repo
- Redeploys on every push to `main`

## Environment Parity

Keep `.env.example` and Render env vars in sync:

**Local `.env`:**
```
DATABASE_URL=postgresql://localhost:5432/job_aggregator
REDIS_URL=redis://localhost:6379
```

**Render Environment:**
```
DATABASE_URL=(auto-set by Postgres service)
REDIS_URL=(auto-set by Redis service)
```

## Next: Frontend Deployment (Phase 8)

Deploy React frontend to Render or Vercel:

**Render:**
```yaml
  - type: web
    name: job-aggregator-frontend
    buildCommand: "cd frontend && npm install && npm run build"
    staticPublishPath: frontend/dist
```

**Vercel:**
```bash
npm install -g vercel
cd frontend
vercel --prod
```

## Monitoring

Add monitoring services (Phase 8+):
- **Sentry**: Error tracking
- **Datadog**: Performance monitoring
- **LogDNA**: Log aggregation

## Cost Estimate

- **Free tier**: $0/month (limited)
- **Hobby tier**: ~$10/month
  - 1x PostgreSQL ($7)
  - 1x Redis ($3)
  - 1x Web service (included in Render hobby plan)

## Rollback

To rollback a deployment:

1. Go to Render dashboard → Service → **Deployments**
2. Find previous successful deployment
3. Click **Redeploy** on that version

## Support

- Render docs: https://render.com/docs
- Render support: support@render.com
- Backend README: [../backend/README.md](../backend/README.md)

---

**Status**: Backend deployed on Render ✅

Next: Deploy frontend to Render or Vercel (Phase 8)
