import { defineConfig } from 'drizzle-kit'

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env
if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
	throw new Error(
		'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set (see .env / docs/turso-setup.md).',
	)
}

export default defineConfig({
	dialect: 'turso',
	schema: './db/schema.ts',
	out: './db/migrations',
	dbCredentials: {
		url: TURSO_DATABASE_URL,
		authToken: TURSO_AUTH_TOKEN,
	},
})
