# Turso Database Setup (issue #15)

Configure Turso as the serverless database for `button_counter` and store the
connection info in `.env`. This is a prerequisite for issue #8 (creating the
DB tables) — once step 8 below is done, the table itself gets created as a
one-time migration (see "Next: issue #8"), and the `db` client is used for
reading/writing rows from then on.

`.gitignore` already excludes `.env` / `.env.*` and keeps `.env.example`
tracked, so no gitignore changes are needed.

## 1. Install the Turso CLI

Linux:

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

macOS (Homebrew):

```bash
brew install tursodatabase/tap/turso
```

Verify it installed:

```bash
turso --version
```

## 2. Log in

```bash
turso auth login
```

This opens a browser window to authenticate.

## 3. Create the database

```bash
turso db create button-counter
```

## 4. Get your credentials

```bash
turso db show button-counter --url
turso db tokens create button-counter
```

Keep both values handy for step 6.

**Share these two values with the team outside of git** (team chat, DM, a
password manager — not a commit). Everyone should point at this same
database, since the counter is meant to be one shared number, not a
separate copy per person. `.env` is gitignored on purpose, so this is the
only way teammates working on issue #8 or #7 get a working connection to
the same data.

## 5. Install the client package

```bash
npm install @tursodatabase/serverless
```

This is Turso's current recommended package for apps that connect to a
remote Turso Cloud database from Node/serverless/edge runtimes without an
ORM — matches this project (no adapter chosen yet, no Drizzle/Prisma).

## 6. Create `.env`

Create a file named `.env` in the project root (it's already gitignored,
so it will never be committed):

```
TURSO_DATABASE_URL=<paste the url from step 4>
TURSO_AUTH_TOKEN=<paste the token from step 4>
```

## 7. Create `.env.example`

Create a file named `.env.example` in the project root (this one **is**
tracked in git) with the same two keys, left blank, so anyone who clones
the repo knows what to configure:

```
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

## 8. Create the server-only DB client

Create `src/lib/server/db.ts`:

```ts
import { connect } from '@tursodatabase/serverless';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';

export const db = connect({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN
});
```

Notes:

- Living under `src/lib/server/` means SvelteKit's server-only module
  boundary blocks this file from ever being bundled into client-side code.
- `$env/static/private` fails the build loudly if either env var is
  missing from `.env` — a good fast-fail if `.env` was never created.
- For issue #8, `import { db } from '$lib/server/db'` inside any
  `+page.server.ts` / `+server.ts` is all that's needed to start running
  queries against the table once it exists (see "Next: issue #8" for how
  the table itself gets created).

## 9. Verify it works

1. `npm run dev` — should start with no "missing environment variable" or
   module-resolution errors.
2. Temporarily add this line inside `src/routes/+page.server.ts`'s `load`
   function (create the file if it doesn't exist yet):
   ```ts
   console.log(await db.execute('select 1'));
   ```
   Run `npm run dev`, confirm the query result prints in the terminal —
   this proves the credentials and network path work end-to-end against
   the real Turso database. Remove the line afterward; it's just a
   connectivity smoke test, not app logic.
3. `npm run check` — should pass (confirms the `$env/static/private`
   types resolve correctly).
4. `git status` — `.env` should NOT appear (proves it's ignored), while
   `.env.example` and `src/lib/server/db.ts` should appear as new files
   ready to commit.

## Next: issue #8

Table creation should be a one-time migration step, not something the app
runs on every request — so it doesn't belong inside `+page.server.ts` or
any request-handling code. The standard pattern for a project this size:

1. Write the schema in a `schema.sql` file at the project root:
   ```sql
   CREATE TABLE IF NOT EXISTS counter (
   	id INTEGER PRIMARY KEY,
   	count INTEGER NOT NULL DEFAULT 0
   );
   ```
   (adjust columns once the schema question from issue #8 — "how many
   variables are needed" — is settled; a simple count button only needs a
   `count` column to start)
2. Apply it once, directly against the Turso database, via the CLI:
   ```bash
   turso db shell button-counter < schema.sql
   ```
3. From then on, `src/lib/server/db.ts`'s `db` client is only used for
   reading/writing rows (`SELECT`, `UPDATE`, …) — not for creating or
   altering tables. If the schema changes later, update `schema.sql` and
   re-run the shell command.

Commit `schema.sql` to git — it's not a secret, and keeping it tracked
means the table definition has a history alongside the code that uses it.

If the project ever grows past a handful of tables, a proper migration
tool (Drizzle ORM + drizzle-kit) is worth adopting instead. For one table,
though, a tracked `schema.sql` applied via the CLI is simpler and equally
standard.
