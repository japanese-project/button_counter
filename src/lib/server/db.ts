import {connect} from '@tursodatabase/serverless';
import {TURSO_DATABASE_URL, TURSO_AUTH_TOKEN} from '$env/static/private';

export const db = connect({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
});