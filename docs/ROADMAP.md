# Roadmap

Status snapshot of `japanese-project/button_counter`, built from the actual GitHub
issues (not aspirational) so it stays honest about what's done vs. still open. Update
this when issues open/close/change scope — a roadmap that drifts from the tracker is
worse than no roadmap.

## Done

- [#8](https://github.com/japanese-project/button_counter/issues/8) — `counter` table schema created and applied to the shared Turso DB
- [#14](https://github.com/japanese-project/button_counter/issues/14) — counter screen design
- [#15](https://github.com/japanese-project/button_counter/issues/15) — Turso DB connection + credentials wired into the app (`src/lib/server/db.ts`)
- [#10](https://github.com/japanese-project/button_counter/issues/10), [#11](https://github.com/japanese-project/button_counter/issues/11), [#12](https://github.com/japanese-project/button_counter/issues/12) — team practiced the PR → review → merge cycle

## Open — looks functionally done, needs closing or a scope check

- [#2](https://github.com/japanese-project/button_counter/issues/2) — project settings (TypeScript + SvelteKit + local dev config) — already in place
- [#6](https://github.com/japanese-project/button_counter/issues/6) — serverless DB setup (Turso + `.env`) — overlaps with #15, already done
- [#7](https://github.com/japanese-project/button_counter/issues/7) — connect DB to the app — already done via `db.ts`

## In progress

- [#9](https://github.com/japanese-project/button_counter/issues/9) — counter logic: read/update the count in Turso. PR [#19](https://github.com/japanese-project/button_counter/pull/19) implements **increment only**.

## ⚠️ Open scope gap — needs a decision before UI work continues

Issues [#4](https://github.com/japanese-project/button_counter/issues/4) and
[#5](https://github.com/japanese-project/button_counter/issues/5) (the counter screen
and its buttons) both specify **two buttons — increase _and_ decrease** — the number
should be able to go both up and down. Issue #9 (the logic issue) only specifies
increment: _"increase the counter and save it to the database."_ No issue currently
scopes a `decrement` action or button.

Until this is resolved, #9's implementation and #4/#5's requirements don't match. Needs
either: a `decrement` action added to #9's scope (and PR #19), or #4/#5 amended to
drop the decrease button. This is exactly the kind of thing issue #1 (requirement
definition) should pin down.

## Not started

- [#1](https://github.com/japanese-project/button_counter/issues/1) — requirement definition (this doc + `CONTRIBUTING.md` are a first pass at it)
- [#3](https://github.com/japanese-project/button_counter/issues/3) — interface implementation (Svelte components + TypeScript for the counter UI)
- [#4](https://github.com/japanese-project/button_counter/issues/4) — counter screen (displays the count; a refresh must not reset it)
- [#5](https://github.com/japanese-project/button_counter/issues/5) — increase/decrease buttons
- [#13](https://github.com/japanese-project/button_counter/issues/13) — project usage docs (install, env vars, running the app, Turso setup, project structure, how to use the counter app)
- [#18](https://github.com/japanese-project/button_counter/issues/18) — deploy (no target chosen yet — `adapter-auto` is in `vite.config.ts` but not committed to a specific host)

## Later / not yet an issue

Came up while testing #9's implementation — worth turning into issues once the current
scope lands, not blocking anything today:

- Real-time sync across clients (today each browser only knows about its own clicks
  until it reloads; a truly shared live counter needs server push — WebSockets/SSE —
  not just writes to the DB)
- Rate limiting / abuse protection on the increment (and future decrement) endpoint
- Structured logging for production
- A migration tool instead of hand-written `schema.sql` if the schema grows beyond one table
