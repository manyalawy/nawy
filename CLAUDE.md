# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation

Always use Context7 MCP for fetching up-to-date documentation when working with libraries and frameworks.

## Build and Run Commands

### Docker (Recommended)

```bash
docker-compose up --build                    # Start all services (with hot-reload)
docker-compose up db -d                      # Start database only
docker-compose exec apartment-service npm run prisma:seed  # Seed apartments
docker-compose exec auth-service npm run prisma:seed       # Seed users
```

**Hot-reloading**: Code changes reflect immediately without rebuilding images. Each service uses volume mounts for source code.

### Prisma Commands (auth-service and apartment-service)

```bash
npm run prisma:generate      # Generate Prisma client
npm run prisma:migrate:dev   # Run migrations
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
    ├──► Auth Service (internal :3002)      → User/Auth Prisma schema
    │
    └──► Apartment Service (internal :3003) → Apartment/Project Prisma schema
            │
            ├──► Meilisearch (:7700)  ← Full-text search engine
            │
            └──► PostgreSQL (:5432)   ← Source of truth (nawy_db)
```

**Note:** Auth Service, Apartment Service, and Redis are internal to the Docker network (not exposed to host). All external requests go through the API Gateway.

**Key architectural patterns:**

- **API Gateway as auth boundary**: JWT validation and role-based access control happen at the gateway level via global `JwtAuthGuard`. Individual services do not validate JWTs from external requests.
- **`@Public()` decorator**: Bypasses the global auth guard for public endpoints (login, register, apartment listing).
- **`@Roles()` decorator + `RolesGuard`**: Admin-only endpoints (POST /apartments, POST /projects, search admin).
- **HTTP proxying**: Gateway uses `@nestjs/axios` to proxy requests to backend services via `AUTH_SERVICE_URL` and `APARTMENT_SERVICE_URL` environment variables.
- **Rate limiting**: Redis-backed rate limiting via `@nestjs/throttler` at the API Gateway. Configured with two tiers:
  - `default`: 60 requests/minute (all endpoints)
  - `strict`: 5 requests/minute (auth endpoints: login, register, refresh)
- **Meilisearch for search**: Full-text search with typo tolerance, fuzzy matching, and relevance ranking. PostgreSQL remains source of truth; Meilisearch is a search-optimized read replica with automatic fallback to Prisma if unavailable.

## Key Files

| Purpose | Path |
|---------|------|
| API Gateway auth guard | `services/api-gateway/src/auth/jwt.strategy.ts` |
| Rate limiter config | `services/api-gateway/src/app.module.ts` |
| Gateway controllers | `services/api-gateway/src/apartments/`, `services/api-gateway/src/users/` |
| Auth Service logic | `services/auth-service/src/modules/auth/auth.service.ts` |
| Apartment Service logic | `services/apartment-service/src/modules/apartments/apartments.service.ts` |
| Meilisearch module | `services/apartment-service/src/meilisearch/` |
| Search service | `services/apartment-service/src/modules/apartments/apartments-search.service.ts` |
| Sync service | `services/apartment-service/src/modules/apartments/apartments-sync.service.ts` |
| Auth Prisma schema | `services/auth-service/prisma/schema.prisma` |
| Apartment Prisma schema | `services/apartment-service/prisma/schema.prisma` |
| Frontend API client | `frontend/src/lib/api.ts` |
| Auth context | `frontend/src/context/AuthContext.tsx` |
| Docker config | `docker-compose.yml` |

## Security

**Network isolation**: Internal services (auth-service, apartment-service, Redis) are not exposed to the host machine. They communicate only within the Docker network, accessible via the API Gateway.

**Required environment variables**: Services validate required environment variables at startup and fail fast if missing:
- `JWT_SECRET` is required for both api-gateway and auth-service

**Redis authentication**: Redis requires password authentication. The password is configured via `REDIS_PASSWORD` environment variable.

## Known Issues

**Migration naming conflict**: Both services share the same PostgreSQL database and `_prisma_migrations` table. Migration folder names must be unique across services to avoid conflicts where one service's migration is skipped because another service already recorded a migration with the same name.

## Environment Variables

Environment variables are configured in `.env`. Key variables:

| Variable | Description | Used By |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | auth-service, apartment-service |
| `JWT_SECRET` | JWT signing key (required) | api-gateway, auth-service |
| `AUTH_SERVICE_URL` | Auth service URL | api-gateway |
| `APARTMENT_SERVICE_URL` | Apartment service URL | api-gateway |
| `REDIS_PASSWORD` | Redis authentication password | redis, api-gateway |
| `REDIS_URL` | Redis connection string (includes password) | api-gateway |
| `MEILISEARCH_URL` | Meilisearch connection URL | apartment-service |
| `MEILISEARCH_MASTER_KEY` | Meilisearch API key | apartment-service |
| `NEXT_PUBLIC_API_URL` | API base URL | frontend |
| `CORS_ORIGIN` | Allowed CORS origin | all services |

## Test Accounts (after seeding)

- Admin: `admin@nawy.com` / `admin123`
- User: `user@nawy.com` / `admin123`

## Meilisearch Integration

The apartment search uses Meilisearch for advanced full-text search capabilities:

**Features:**
- Typo tolerance (finds "skyline" when searching "skylin")
- Fuzzy matching and relevance ranking
- Fast prefix search for autocomplete
- Automatic fallback to PostgreSQL if Meilisearch is unavailable

**Search flow:**
1. Search query → Meilisearch (returns ranked IDs)
2. IDs → PostgreSQL (fetch fresh data, maintain relevance order)
3. On Meilisearch failure → automatic fallback to Prisma ILIKE

**Data sync:**
- On apartment create → index to Meilisearch
- On apartment update → re-index to Meilisearch
- On apartment delete → remove from Meilisearch
- On project update → re-index all apartments in that project (project data is denormalized)
- On startup → auto-sync if index is empty
- Manual reindex via `POST /api/v1/admin/search/reindex` (Admin only)

All sync operations are non-blocking (async) and log errors without failing the main request.

**Admin endpoints:**
```bash
# Trigger full reindex (requires admin JWT)
curl -X POST "http://localhost:3001/api/v1/admin/search/reindex" -H "Authorization: Bearer <token>"

# Get index stats
curl "http://localhost:3001/api/v1/admin/search/stats" -H "Authorization: Bearer <token>"

# Check health
curl "http://localhost:3001/api/v1/admin/search/health" -H "Authorization: Bearer <token>"
```

**Meilisearch index schema:**
- Searchable: unitName, unitNumber, description, features, projectName, projectLocation, projectDeveloper
- Filterable: projectId, bedrooms, bathrooms, price, area, floor, status
- Sortable: price, area, bedrooms, createdAt