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

If `mysql -u root` is unavailable, open MariaDB via:

```bash
sudo mysql
```

Create local dev user:

```sql
CREATE USER 'dev'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON *.* TO 'dev'@'localhost';
FLUSH PRIVILEGES;
```

Default credentials used in this project: `dev / 1234`

Create database:

```bash
mysql -u dev -p -e "CREATE DATABASE IF NOT EXISTS leaderboard;"
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

Update `.env` using your local DB credentials (`dev` / `1234` by default).

Run schema:

```bash
mysql -u dev -p leaderboard < src/sql/schema.sql
```

Run seed:

```bash
npx ts-node src/sql/seed.ts
```

> If the database was created earlier with an outdated schema, the seed script may fail due to missing or renamed columns.
> It is recommended to recreate the database before running schema.sql and seed.

```bash
mysql -u dev -p
```

```sql
DROP DATABASE IF EXISTS leaderboard;
CREATE DATABASE leaderboard;
```

```bash
mysql -u dev -p leaderboard < src/sql/schema.sql
npx ts-node src/sql/seed.ts
```

> On Linux/Windows, install MariaDB using your preferred package manager.
> The setup steps remain the same.

## Run App

```bash
npm run start:dev
```

Stop app: `Ctrl + C`.

## API Endpoints

- `POST /scores` - Creates a score record (`user_id`, `value`) and returns created score.
- `GET /leaderboard` - Returns top 100 users with `rank`, `username`, `total_score`, `average_score`, `last_activity`.
- `GET /users/:id/rank` - Returns `{ user_id, username, rank, total_score }` for a specific user.

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
