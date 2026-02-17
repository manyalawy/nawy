# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Run Commands

### Docker (Recommended)

```bash
docker-compose up --build                    # Start all services (dev mode with hot-reload)
docker-compose -f docker-compose.yml up --build  # Production mode (no hot-reload)
docker-compose up db -d                      # Start database only
docker-compose exec apartment-service npm run prisma:seed  # Seed apartments
docker-compose exec auth-service npm run prisma:seed       # Seed users
```

**Hot-reloading**: By default, `docker-compose up` uses `docker-compose.override.yml` which enables hot-reloading. Code changes reflect immediately without rebuilding images. Each service uses `Dockerfile.dev` with volume mounts for source code.

### Prisma Commands (auth-service and apartment-service)

```bash
npm run prisma:generate      # Generate Prisma client
npm run prisma:migrate:dev   # Run migrations (development)
npm run prisma:migrate       # Run migrations (production)
npm run prisma:seed          # Seed database
```

### Linting

```bash
cd frontend && npm run lint  # ESLint via Next.js
```

## Architecture

This is a microservices monorepo with HTTP-based service communication:

```
Frontend (Next.js :3000)
    │
    ▼
API Gateway (NestJS :3001)  ← JWT validation happens here
    │
    ├──► Auth Service (:3002)      → User/Auth Prisma schema
    │
    └──► Apartment Service (:3003) → Apartment/Project Prisma schema
            │
            ▼
        PostgreSQL (:5432) ← Shared database (nawy_db)
```

**Key architectural patterns:**

- **API Gateway as auth boundary**: JWT validation and role-based access control happen at the gateway level via global `JwtAuthGuard`. Individual services do not validate JWTs from external requests.
- **`@Public()` decorator**: Bypasses the global auth guard for public endpoints (login, register, apartment listing).
- **`@Roles()` decorator + `RolesGuard`**: Admin-only endpoints (POST /apartments, POST /projects).
- **HTTP proxying**: Gateway uses `@nestjs/axios` to proxy requests to backend services via `AUTH_SERVICE_URL` and `APARTMENT_SERVICE_URL` environment variables.
- **Rate limiting**: Redis-backed rate limiting via `@nestjs/throttler` at the API Gateway. Configured with two tiers:
  - `default`: 60 requests/minute (all endpoints)
  - `strict`: 5 requests/minute (auth endpoints: login, register, refresh)

## Key Files

| Purpose | Path |
|---------|------|
| API Gateway auth guard | `services/api-gateway/src/auth/jwt.strategy.ts` |
| Rate limiter config | `services/api-gateway/src/app.module.ts` |
| Gateway controllers | `services/api-gateway/src/apartments/`, `services/api-gateway/src/users/` |
| Auth Service logic | `services/auth-service/src/modules/auth/auth.service.ts` |
| Apartment Service logic | `services/apartment-service/src/modules/apartments/apartments.service.ts` |
| Auth Prisma schema | `services/auth-service/prisma/schema.prisma` |
| Apartment Prisma schema | `services/apartment-service/prisma/schema.prisma` |
| Frontend API client | `frontend/src/lib/api.ts` |
| Auth context | `frontend/src/context/AuthContext.tsx` |
| Docker dev overrides | `docker-compose.override.yml` |
| Dev Dockerfiles | `services/*/Dockerfile.dev`, `frontend/Dockerfile.dev` |

## Known Issues

**Migration naming conflict**: Both services share the same PostgreSQL database and `_prisma_migrations` table. Migration folder names must be unique across services to avoid conflicts where one service's migration is skipped because another service already recorded a migration with the same name.

## Environment Variables

Environment variables are managed via env files:
- `.env` - Development values (used by default with docker-compose)
- `.env.prod` - Production values (placeholder template, must be configured)
- `.env.example` - Reference template

Key variables:

| Variable | Description | Used By |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | auth-service, apartment-service |
| `JWT_SECRET` | JWT signing key | api-gateway, auth-service |
| `AUTH_SERVICE_URL` | Auth service URL | api-gateway |
| `APARTMENT_SERVICE_URL` | Apartment service URL | api-gateway |
| `REDIS_URL` | Redis connection string for rate limiting | api-gateway |
| `NEXT_PUBLIC_API_URL` | API base URL | frontend |
| `CORS_ORIGIN` | Allowed CORS origin | all services |

## Test Accounts (after seeding)

- Admin: `admin@nawy.com` / `admin123`
- User: `user@nawy.com` / `admin123`