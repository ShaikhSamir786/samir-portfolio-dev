# Drizzle Kit — Command Reference

> **Project config:** [`drizzle.config.ts`](./drizzle.config.ts)
> — schema at `./lib/schema.ts`, migrations output at `./drizzle/`, dialect: `postgresql`.

---

## Quick Reference

| Command | Short description |
|---|---|
| `npx drizzle-kit generate` | Generate SQL migration files from schema changes |
| `npx drizzle-kit migrate` | Apply pending migration files to the database |
| `npx drizzle-kit push` | Sync schema to DB directly (no migration files) |
| `npx drizzle-kit pull` | Introspect DB and generate schema file from it |
| `npx drizzle-kit check` | Validate migration files for conflicts |
| `npx drizzle-kit up` | Upgrade old/legacy migration snapshot format |
| `npx drizzle-kit studio` | Open Drizzle Studio (local DB browser GUI) |
| `npx drizzle-kit drop` | Drop a specific generated migration file |

---

## Commands In Detail

### 1. `generate` — Generate migration files

```bash
npx drizzle-kit generate
```

Compares your current `lib/schema.ts` against the last migration snapshot and generates a new `.sql` migration file inside `./drizzle/`.

**When to use:**
- You added, removed, or renamed a column/table in `lib/schema.ts`
- You changed a column type, added an index, or modified a constraint
- You want a versioned, reviewable record of the database change (good for production / team environments)

**Options:**
```bash
# Custom migration name (makes it easier to identify in the ./drizzle folder)
npx drizzle-kit generate --name add_present_future_to_about

# Point to a different config file
npx drizzle-kit generate --config=drizzle.config.ts
```

**Output example:** `./drizzle/0003_add_present_future_to_about.sql`

---

### 2. `migrate` — Apply migration files

```bash
npx drizzle-kit migrate
```

Runs all pending SQL migration files from `./drizzle/` against the database (tracks applied migrations internally).

**When to use:**
- After running `generate`, to actually apply the SQL to the database
- In CI/CD pipelines before deploying a new version of the app
- In production environments where you want a full audit trail of schema changes

> [!IMPORTANT]
> Always run `generate` first, review the generated `.sql` file, then run `migrate`.

---

### 3. `push` — Push schema directly (no migration files)

```bash
npx drizzle-kit push
```

Directly syncs `lib/schema.ts` to the live database **without creating migration files**. Drizzle computes the diff and applies it immediately.

**When to use:**
- Local development — fast iteration without cluttering the `./drizzle/` folder
- Prototyping new tables or columns
- Neon/PlanetScale serverless environments where you manage schema through the UI or want instant feedback
- ⚠️ **Not recommended for production** — no audit trail of changes

**This project uses `push` for:** rapid schema iteration (e.g., adding the `present` and `future` columns to the `about` table).

> [!WARNING]
> `push` cannot handle all schema changes safely (e.g., renaming columns may drop+recreate them). Use `generate` + `migrate` for production.

---

### 4. `pull` — Introspect existing database → generate schema

```bash
npx drizzle-kit pull
```

Connects to the database, reads the actual live schema, and generates a `schema.ts` file from it.

**When to use:**
- You're adopting Drizzle ORM on an **existing database** (you didn't start with Drizzle)
- Your DB was manually altered and your `lib/schema.ts` is out of sync
- You want to reverse-engineer a database someone else set up

> [!NOTE]
> The generated schema file is a starting point — you may need to clean it up and adjust types for your application.

---

### 5. `check` — Validate migration files

```bash
npx drizzle-kit check
```

Scans all migration files in `./drizzle/` for issues such as conflicting or duplicate migration names/hashes.

**When to use:**
- Before deploying to production to ensure migrations are in a healthy state
- After merging branches that both added migrations (to detect conflicts)
- As part of a CI lint/check step

---

### 6. `up` — Upgrade migration snapshot format

```bash
npx drizzle-kit up
```

Upgrades migration snapshot files to the latest Drizzle Kit format when you update the `drizzle-kit` package to a new major version.

**When to use:**
- After upgrading `drizzle-kit` and seeing warnings about an outdated snapshot format
- Only needed once after a major version bump

---

### 7. `studio` — Open Drizzle Studio (DB GUI)

```bash
npx drizzle-kit studio
```

Starts a local web server (default: `https://local.drizzle.studio`) with a GUI to browse, query, and edit your database tables — like a lightweight TablePlus/pgAdmin in the browser.

**When to use:**
- Debugging data issues without writing raw SQL
- Quickly viewing table contents during development
- Manually inserting seed/test rows

**Options:**
```bash
# Use a specific port
npx drizzle-kit studio --port 4983

# Verbose output
npx drizzle-kit studio --verbose
```

> [!NOTE]
> Requires `DATABASE_URL` in your `.env`. This project uses Neon (serverless Postgres) — Studio works with it directly.

---

### 8. `drop` — Drop a migration file

```bash
npx drizzle-kit drop
```

Interactively lets you select and delete a migration file from `./drizzle/`. Updates the internal snapshot so Drizzle doesn't try to apply the deleted migration.

**When to use:**
- You generated a migration by mistake and want to remove it before it gets applied
- Cleaning up failed or duplicate migrations during development

> [!CAUTION]
> Never drop a migration that has already been applied to any database — this will cause the migration tracker to go out of sync.

---

## Recommended Workflow

### Local Development (this project)
```bash
# 1. Edit lib/schema.ts
# 2. Sync to local/dev DB instantly
npx drizzle-kit push
```

### Production / Team Environments
```bash
# 1. Edit lib/schema.ts
# 2. Generate a named migration file
npx drizzle-kit generate --name describe_your_change

# 3. Review the generated SQL in ./drizzle/
# 4. Apply it to production DB
npx drizzle-kit migrate
```

### Onboarding an Existing Database
```bash
# Pull schema from live DB
npx drizzle-kit pull

# Review generated schema.ts, then use push/migrate going forward
```

---

## Environment Setup

All commands require `DATABASE_URL` to be set. This project uses `.env`:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

See [`.env.example`](./.env.example) for all required variables.

---

## Project File Locations

| Path | Purpose |
|---|---|
| [`drizzle.config.ts`](./drizzle.config.ts) | Drizzle Kit configuration |
| [`lib/schema.ts`](./lib/schema.ts) | Table definitions (source of truth) |
| [`lib/db.ts`](./lib/db.ts) | DB client instance |
| `./drizzle/` | Generated migration SQL files & snapshots |
