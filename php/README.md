# PHP PostgreSQL Remote Database Integration (Neon / CockroachDB)

This directory provides the complete PHP backend and migration layer for connecting to remote serverless PostgreSQL instances (like **Neon** or **CockroachDB 10GB**) without needing credit card verification.

## Architecture

- **Driver:** PHP Standard Data Objects (`PDO` with `pdo_pgsql`).
- **Encryption:** Enforces TLS via `sslmode=require` required by Neon and CockroachDB.
- **Compatibility:** Uses the exact same PostgreSQL schema as the main Next.js / Drizzle application.

## Directory Structure

```
php/
├── config/
│   └── db.php          # Singleton PDO connection manager
├── api/
│   ├── inquiries.php   # REST API: list & submit quote requests
│   └── services.php    # REST API: fetch services & packages
├── migrate.php         # Standalone schema migration script
├── .env.example        # Environment variable template
└── README.md
```

## Setup & Running

### 1. Configure Connection Details

Set environment variables on your host (e.g. Vercel, Alwaysdata, or `.env`):

```bash
DATABASE_URL=postgresql://user:password@ep-your-subdomain.neon.tech/neondb?sslmode=require
```

Or individual variables:
- `DB_HOST`: e.g. `ep-cool-subdomain.neon.tech`
- `DB_PORT`: `5432` (for Neon) or `26257` (for CockroachDB)
- `DB_NAME`: `neondb`
- `DB_USER`: your DB username
- `DB_PASSWORD`: your DB password

### 2. Run Database Migrations

Initialize all 13 PostgreSQL tables:

```bash
php php/migrate.php
```

Or visit `https://your-php-host.com/migrate.php` in your browser.

### 3. API Endpoints

- **`GET /api/inquiries.php`**: Fetch recent inquiries.
- **`POST /api/inquiries.php`**: Submit a new quote inquiry.
- **`GET /api/services.php`**: Fetch active services with nested packages.
