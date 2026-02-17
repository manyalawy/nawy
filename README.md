# Nawy Apartment Listing Platform

A full-stack apartment listing application built with microservices architecture.

## Architecture

```
                    ┌─────────────────┐
                    │   Frontend      │
                    │   (Next.js)     │
                    │   Port: 3000    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │   (NestJS)      │
                    │   Port: 3001    │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌─────────▼─────────┐ ┌──────▼──────┐  ┌───────▼───────┐
│   Auth Service    │ │  Apartment  │  │    Shared     │
│   (NestJS)        │ │  Service    │  │   PostgreSQL  │
│   Port: 3002      │ │  Port: 3003 │  │   Port: 5432  │
└───────────────────┘ └─────────────┘  └───────────────┘
```

## Technology Stack

| Component | Technology |
|-----------|------------|
| API Gateway | NestJS, Swagger |
| Auth Service | NestJS, JWT, bcrypt |
| Apartment Service | NestJS, Prisma |
| Database | PostgreSQL 16 |
| Frontend | Next.js 14 (App Router) |
| Styling | styled-components |
| Container | Docker, Docker Compose |

## Quick Start

### Prerequisites

- Docker and Docker Compose

### Running with Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd nawy-apartments
```

2. Start all services:
```bash
docker-compose up --build
```

3. Access the application:
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:3001
   - API Documentation: http://localhost:3001/api/docs

### Development with Hot-Reloading

By default, `docker-compose up` enables hot-reloading for all services. Code changes reflect immediately without rebuilding images.

```bash
# Development mode (with hot-reload) - default
docker-compose up --build

# Production mode (no hot-reload)
docker-compose -f docker-compose.yml up --build
```

The development setup uses:
- `docker-compose.override.yml` - Overrides with volume mounts and dev commands
- `Dockerfile.dev` files - Simplified dev containers for each service
- Volume mounts - Sync local source files into containers
- Watch mode - NestJS (`nest start --watch`) and Next.js (`next dev`)

### Seeding the Database

After the services are running, seed the database with sample data:

```bash
# Seed apartments and projects
docker-compose exec apartment-service npm run prisma:seed

# Seed test users
docker-compose exec auth-service npm run prisma:seed
```

### Test Accounts

After seeding, you can use these accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@nawy.com | admin123 | Admin |
| user@nawy.com | admin123 | User |

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Login, get JWT | Public |
| GET | `/api/v1/auth/me` | Get current user | Protected |
| POST | `/api/v1/auth/refresh` | Refresh token | Public |

### Apartments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/apartments` | List apartments | Public |
| GET | `/api/v1/apartments/:id` | Get details | Public |
| POST | `/api/v1/apartments` | Create apartment | Admin |
| GET | `/api/v1/projects` | List projects | Public |

### Query Parameters (GET /apartments)

- `search` - Search in unitName, unitNumber, project name
- `projectId` - Filter by project
- `bedrooms` - Filter by bedroom count
- `minPrice` / `maxPrice` - Price range
- `page` / `limit` - Pagination

## Project Structure

```
nawy-apartments/
├── docker-compose.yml          # Production Docker config
├── docker-compose.override.yml # Development overrides (hot-reload)
├── .env.dev                    # Development environment variables
├── .env.prod                   # Production environment variables (configure!)
├── .env.example                # Environment variable template
├── README.md
├── services/
│   ├── api-gateway/            # API Gateway (NestJS)
│   │   ├── Dockerfile          # Production Dockerfile
│   │   └── Dockerfile.dev      # Development Dockerfile
│   ├── auth-service/           # Auth Service (NestJS)
│   │   ├── Dockerfile
│   │   └── Dockerfile.dev
│   └── apartment-service/      # Apartment Service (NestJS)
│       ├── Dockerfile
│       └── Dockerfile.dev
├── frontend/                   # Next.js Frontend
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── src/
│       ├── app/                # App Router pages
│       ├── components/         # React components
│       ├── context/            # React contexts
│       ├── hooks/              # Custom hooks
│       ├── lib/                # Utilities
│       ├── styles/             # Theme and styles
│       └── types/              # TypeScript types
└── shared/
    └── types/                  # Shared TypeScript types
```

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Apartment Listing**: Browse apartments with search and filters
- **Apartment Details**: View detailed apartment information
- **Responsive Design**: Mobile-friendly interface
- **Admin Features**: Create apartments (admin only)

## Security

- Passwords hashed with bcrypt (10+ salt rounds)
- JWT tokens for authentication
- Role-based access control (USER, ADMIN)
- Input validation on all endpoints
- CORS configuration

## Environment Variables

The project uses separate environment files for development and production:

| File | Purpose |
|------|---------|
| `.env.dev` | Development configuration (used by default) |
| `.env.prod` | Production configuration (requires setup) |
| `.env.example` | Reference template |

**Development** runs automatically with `.env.dev` values.

**Production** requires configuring `.env.prod`:
1. Copy placeholder values: `cp .env.prod .env.prod.local`
2. Update with real values (database URL, JWT secret, domains)
3. Run: `docker-compose -f docker-compose.yml --env-file .env.prod up --build`

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing (change in production!)
- `NEXT_PUBLIC_API_URL` - API URL for frontend
- `CORS_ORIGIN` - Allowed CORS origin

## License

MIT
