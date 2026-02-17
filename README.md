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
- Node.js 20+ (for local development)

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

## Local Development

### Install Dependencies

```bash
# Install all service dependencies
cd services/auth-service && npm install
cd ../apartment-service && npm install
cd ../api-gateway && npm install
cd ../../frontend && npm install
```

### Set Up Environment

```bash
cp .env.example .env
```

### Start Database

```bash
docker-compose up db -d
```

### Run Migrations

```bash
cd services/auth-service && npm run prisma:migrate:dev
cd ../apartment-service && npm run prisma:migrate:dev
```

### Start Services

```bash
# Terminal 1 - Auth Service
cd services/auth-service && npm run start:dev

# Terminal 2 - Apartment Service
cd services/apartment-service && npm run start:dev

# Terminal 3 - API Gateway
cd services/api-gateway && npm run start:dev

# Terminal 4 - Frontend
cd frontend && npm run dev
```

## Project Structure

```
nawy-apartments/
├── docker-compose.yml
├── README.md
├── services/
│   ├── api-gateway/          # API Gateway (NestJS)
│   ├── auth-service/         # Auth Service (NestJS)
│   └── apartment-service/    # Apartment Service (NestJS)
├── frontend/                 # Next.js Frontend
│   └── src/
│       ├── app/              # App Router pages
│       ├── components/       # React components
│       ├── context/          # React contexts
│       ├── hooks/            # Custom hooks
│       ├── lib/              # Utilities
│       ├── styles/           # Theme and styles
│       └── types/            # TypeScript types
└── shared/
    └── types/                # Shared TypeScript types
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

See `.env.example` for all available environment variables.

## License

MIT
