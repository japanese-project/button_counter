// Records a migration as already-applied in __drizzle_migrations without
// running its SQL — for adopting a table that already exists outside the
// migration pipeline (see docs/migrations.md). Codifies the manual steps
// used to baseline 0000_flawless_meggan.sql for the `counter` table.
//
// Usage: node --env-file=.env scripts/baseline-migration.mjs <migration-tag>
// Example: node --env-file=.env scripts/baseline-migration.mjs 0000_flawless_meggan

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createClient } from '@libsql/client';

const tag = process.argv[2];
if (!tag) {
	console.error('Usage: node --env-file=.env scripts/baseline-migration.mjs <migration-tag>');
	process.exit(1);
}

const journal = JSON.parse(readFileSync('./db/migrations/meta/_journal.json', 'utf8'));
const entry = journal.entries.find((e) => e.tag === tag);
if (!entry) {
	console.error(`No entry for tag "${tag}" in db/migrations/meta/_journal.json`);
	process.exit(1);
}

const sql = readFileSync(`./db/migrations/${tag}.sql`, 'utf8');
const hash = createHash('sha256').update(sql).digest('hex');
const createdAt = entry.when;

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
	console.error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set (see .env).');
	process.exit(1);
}

const turso = createClient({
	url: process.env.TURSO_DATABASE_URL,
	authToken: process.env.TURSO_AUTH_TOKEN
});

await turso.execute(`
	CREATE TABLE IF NOT EXISTS __drizzle_migrations (
		id SERIAL PRIMARY KEY,
		hash text NOT NULL,
		created_at numeric
	)
`);

const existing = await turso.execute('SELECT hash FROM __drizzle_migrations WHERE hash = ?', [
	hash
]);
if (existing.rows.length > 0) {
	console.log(`Migration "${tag}" is already baselined — nothing to do.`);
	process.exit(0);
}

await turso.execute('INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)', [
	hash,
	createdAt
]);
console.log(`Baselined "${tag}" (hash ${hash.slice(0, 12)}…, created_at ${createdAt}).`);
