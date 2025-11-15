# Docker Commands for Inventory System

This document provides instructions for running commands inside your Docker containers, particularly for database schema management.

## Container Names

- Database: `inventory_db`
- SvelteKit Frontend: `inventory_frontend`

## Running Drizzle Commands

To push your schema changes to the database, you have several options:

### Option 1: Interactive Mode

This allows you to see prompts and answer questions about schema changes:

```bash
docker exec -it inventory_frontend bun x drizzle-kit push
```

When prompted about table creation or renaming, select the appropriate option (usually "create table" for new tables).

### Option 2: Non-Interactive Mode (Force Push)

This will automatically apply all changes without prompting:

```bash
docker exec inventory_frontend bun x drizzle-kit push --force
```

### Option 3: Run Inside Container

For more complex operations, you can open a shell inside the container:

```bash
docker exec -it inventory_frontend /bin/bash
# Then inside the container:
bun x drizzle-kit push
```

## Database Management

### View Database Logs

```bash
docker logs inventory_db
```

### Access PostgreSQL CLI

```bash
docker exec -it inventory_db psql -U inventory_user -d inventory
```

### Common PostgreSQL Commands

Once in the PostgreSQL CLI:

- List tables: `\dt`
- Describe table: `\d table_name`
- Run SQL query: `SELECT * FROM table_name;`
- Exit: `\q`

## Container Management

### Restart Containers

```bash
docker-compose restart
```

### Rebuild and Start

If you've made changes to Dockerfile or docker-compose.yml:

```bash
docker-compose up --build
```

### Stop Containers

```bash
docker-compose down
```

## Development Workflow

1. Make schema changes in `src/db/schema.ts`
2. Push changes to database: `docker exec inventory_frontend bun x drizzle-kit push`
3. For major schema changes, consider rebuilding the containers: `docker-compose up --build`
