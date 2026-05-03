# Dockerized Laravel + React + PostgreSQL

This repository contains:

- `backend`: Laravel (PHP)
- `frontend`: React + TypeScript (Vite)
- `postgres`: PostgreSQL

## Prerequisites

Install these on your machine:

- Docker Desktop

## Run the project

From the repository root:

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:5173
- Laravel backend: http://localhost:8000
- Health endpoint: http://localhost:8000/api/health

## What reviewers should see

On the React page, there is a backend health check panel.  
If everything is configured correctly, it should show:

- `App: ok`
- `Database: ok`

## Stop the project

```bash
docker compose down
```

To also remove DB data volume:

```bash
docker compose down -v
```
