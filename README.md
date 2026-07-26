# Biryani House Dordrecht

The platform uses a Next.js frontend and a Python FastAPI backend. PostgreSQL is
managed through SQLAlchemy and Alembic; the browser keeps using `/api/...` while
Next.js proxies those requests to FastAPI.

## Run everything with Docker

```bash
docker compose up --build
```

This starts:

- Next.js at `http://localhost:3000`
- FastAPI at `http://localhost:8000`
- API documentation at `http://localhost:8000/api/docs`
- PostgreSQL at `localhost:5432`

The backend container applies migrations and seeds the menu automatically. A
development admin is created as `admin@example.com` with password
`change-me-now`; change it before using any shared environment.

## Run locally

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
copy .env.example .env
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

In a second terminal:

```bash
npm install
npm run dev
```

Backend checks:

```bash
cd backend
ruff check .
pytest
```

Frontend checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## API

- `GET /api/health`
- `GET /api/menu`
- `POST /api/orders`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/admin/orders`
- `POST /api/stripe/webhook`

See [product specification](docs/product-specification.md) for the wider
product scope.
