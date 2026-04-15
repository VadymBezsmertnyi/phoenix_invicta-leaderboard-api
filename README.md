# Phoenix Invicta Leaderboard API

## Project Overview

Backend service for leaderboard operations: users, scores, and aggregated ranking.
Built as a simple feature-based API for a test assignment.

## Tech Stack

- Node.js
- TypeScript
- Express
- MariaDB
- Zod

## Local Setup

### Install MariaDB (macOS + Homebrew)

```bash
brew update
brew install mariadb
```

### Start MariaDB

```bash
brew services start mariadb
```

### Stop MariaDB

```bash
brew services stop mariadb
```

## Setup Project

```bash
npm install
cp .env.example .env
```

Create database:

```sql
CREATE DATABASE leaderboard;
```

Run schema:

```bash
mysql -u root -p leaderboard < src/sql/schema.sql
```

Run seed:

```bash
npx ts-node src/sql/seed.ts
```

## Run App

```bash
npm run dev
```

Stop app: `Ctrl + C`.

## API Endpoints

- `POST /api/scores` - Creates a score record (`userId`, `value`) and returns created score.
- `GET /api/leaderboard` - Returns top 100 users with `rank`, `total_score`, `average_score`, `last_activity`.
- `GET /api/users/:id/rank` - Returns user rank by id (planned endpoint; not implemented yet).

## Architecture

- Feature-based structure under `src/api/*`.
- Request flow: `router -> service -> DB`.
- Validation via Zod in services (`parse`).
- Error handling in routers (`try/catch` + status mapping).
- No in-memory storage, MariaDB only.

## Performance Notes

- Leaderboard uses SQL aggregation: `SUM`, `AVG`, `MAX`.
- DB indexes should be used for `scores.user_id`, `scores.created_at`, and `users.username`.
- Seed uses batch inserts for large data generation.

## What would I improve

- Redis caching for leaderboard reads.
- Pre-aggregated leaderboard table.
- Background jobs for periodic recalculation.
- Pagination/filtering for leaderboard endpoints.
- Load testing and profiling under realistic traffic.
