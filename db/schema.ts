import * as t from 'drizzle-orm/sqlite-core'

// Matches the table applied to the shared Turso DB in issue #8 — no
// AUTOINCREMENT, so this must stay a plain `INTEGER PRIMARY KEY`.
export const counter = t.sqliteTable('counter', {
	id: t.integer().primaryKey(),
	count: t.integer().notNull().default(0),
})
