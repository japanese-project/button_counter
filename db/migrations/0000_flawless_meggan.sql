-- Baseline migration for a table that already existed (issue #8) before this
-- pipeline was introduced. `IF NOT EXISTS` is hand-added here (drizzle-kit
-- doesn't generate it) as a safety net: if the __drizzle_migrations
-- bookkeeping row is ever lost, re-running this becomes a safe no-op
-- instead of a hard "table already exists" failure. Don't remove it, and
-- don't add it to later migrations by habit — this file is a special case.
CREATE TABLE IF NOT EXISTS `counter` (
	`id` integer PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
