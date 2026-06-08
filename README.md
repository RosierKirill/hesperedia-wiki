# Hesperedia Wiki

A full-stack production-ready wiki for the Hesperedia fictional universe — a custom Fandom-style wiki built with Next.js, Express, and PostgreSQL.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)
- Cloudinary account (for media uploads)

## Installation

```bash
# Clone and install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your values (DATABASE_URL, JWT_SECRET, Cloudinary keys)
```

## Running with Docker

```bash
# Start PostgreSQL
docker-compose up -d

# DATABASE_URL for .env:
# postgresql://hesperedia:hesperedia_dev@localhost:5432/hesperedia
```

## Database Setup

```bash
cd apps/api

# Run migrations
npx prisma migrate dev --name init

# Seed initial data
npx prisma db seed
```

## Development

```bash
# From repo root — starts both web (port 3000) and api (port 4000)
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:4000/api/v1
- PgAdmin: http://localhost:5050 (admin@hesperedia.wiki / admin)

## Build

```bash
npm run build
```

## Project Structure

```
hesperedia-wiki/
├── apps/
│   ├── web/          Next.js 14 App Router frontend
│   └── api/          Express + Prisma backend
├── packages/
│   └── shared-types/ Shared TypeScript types
├── docker-compose.yml
└── turbo.json
```

## Default Admin Account

After seeding:
- Email: `admin@hesperedia.wiki`
- Password: `HespeAdmin2024!`

## Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Leaflet.js, Zustand, TanStack Query v5

**Backend:** Node.js, Express, Prisma ORM, PostgreSQL, JWT, Cloudinary, Zod

## Useful Commands

```bash
npm run dev          # Start all apps in development
npm run build        # Build all apps
npm run lint         # Lint all packages
npm run type-check   # TypeScript check all packages
npm run seed         # Seed database (from apps/api)
npm run db:migrate   # Run Prisma migrations
```
