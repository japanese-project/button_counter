# Turso Database Setup (issue #15)

Connect to the shared Turso database and store credentials in `.env`.

## 1. Install the Turso CLI and log in

```bash
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
```

## 2. Create the database

```bash
turso db create button-counter
```

## 3. Get credentials

```bash
turso db show button-counter --url
turso db tokens create button-counter
```

Share these two values with the team over a private channel (chat, DM,
password manager) — never in git or an issue comment.

## 4. Install the client package

```bash
npm install @tursodatabase/serverless
```

## 5. Create `.env` (gitignored, not committed)

```
TURSO_DATABASE_URL=<url from step 3>
TURSO_AUTH_TOKEN=<token from step 3>
```

`.env.example` (tracked) lists the same two keys blank, so anyone cloning
the repo knows what to configure.

## 6. Server-only DB client — `src/lib/server/db.ts`

```ts
import { connect } from '@tursodatabase/serverless';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';

export const db = connect({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN
});
```

Living under `src/lib/server/` keeps it out of client-side bundles.
`$env/static/private` fails the build if either env var is missing.

## 7. Verify

- `npm run dev` — starts with no missing-env or module errors
- `npm run check` — passes
- `git status` — `.env` does not appear (proves it's ignored); `.env.example`
  and `src/lib/server/db.ts` do
- Each teammate runs `turso db shell button-counter` and gets a prompt,
  confirming their own credentials work
