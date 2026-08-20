import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';
import { createClient } from '@libsql/client';

export const turso = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN
});
