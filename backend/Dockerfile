FROM python:3.11.8-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        python3-dev \
        libpq-dev \
        libxml2-dev \
        libxslt1-dev \
        zlib1g-dev \
        libffi-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["gunicorn", "--workers=1", "--worker-class=uvicorn.workers.UvicornWorker", "--bind=0.0.0.0:8000", "--timeout=120", "--access-logfile=-", "--error-logfile=-", "app.main:app"]
