# Database Migrations (issue #20)

Schema changes go through Drizzle instead of hand-written SQL applied by hand.
No more `turso db shell button-counter < schema.sql`.

Also folds in issue #24: `src/lib/server/db.ts` now uses `@libsql/client`
(`createClient`, exported as `turso`) instead of `@tursodatabase/serverless` —
the same client library the migration tooling already depended on, so the
project isn't carrying two DB clients for two different jobs anymore.
`scripts/baseline-migration.mjs` was updated to match.

## How it works

- `db/schema.ts` — the schema, defined in TypeScript with `drizzle-orm/sqlite-core`.
  This is the source of truth; edit it, don't hand-write SQL.
- `db/migrations/` — generated, versioned SQL migration files plus metadata
  (`meta/_journal.json`, `meta/*_snapshot.json`). Generated, not hand-edited.
- `drizzle.config.ts` — tells `drizzle-kit` where the schema and migrations
  live, and how to reach the DB (reuses `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`
  from `.env`).

## Changing the schema

1. Edit `db/schema.ts`.
2. Generate a migration from the diff:

   ```bash
   npm run db:generate
   ```

3. Review the generated SQL in `db/migrations/` — check it does what you expect
   before applying it.
4. Apply it to the shared DB:

   ```bash
   npm run db:migrate
   ```

`db:migrate` only runs migrations newer than the last one it has a record of
(tracked in a `__drizzle_migrations` table on the DB itself) — running it
repeatedly is safe, already-applied migrations are skipped.

## Adopting a table that already exists

If a table exists on the DB from before this pipeline (or before some future
migration was written), don't just run `db:migrate` and let it try to
`CREATE TABLE` — it'll fail with "table already exists". Baseline it instead:

```bash
npm run db:baseline -- <migration-tag>   # e.g. 0000_flawless_meggan
```

This records the migration as already-applied in `__drizzle_migrations`
(hash + timestamp) without running its SQL. `db:migrate` then correctly skips
it and only runs genuinely new migrations from there on. The script is
idempotent — running it again on an already-baselined migration is a no-op.

## History note

The `counter` table already existed on the shared DB before this pipeline was
introduced (applied by hand in issue #8). `db/migrations/0000_flawless_meggan.sql`
was baselined with the script above rather than actually executed. As an extra
safety net, that one migration file also has a hand-added `IF NOT EXISTS` guard
(drizzle-kit doesn't generate one) — if the bookkeeping row is ever lost,
re-running it becomes a safe no-op instead of a hard failure. Later migrations
won't have this guard; only this one is a special case.
