# Roadmap

## Goal

A counter page anyone on the team can open, press a button on, and have the
number persist — shared across everyone, backed by Turso. Secondary goal:
the team practices the full GitHub workflow (issue → branch → PR → review →
merge) end to end. Grounded in the real GitHub issues, not aspirational —
update this doc when scope actually changes.

## Phase 1 — Core feature (MVP)

Goal: one working counter page, deployed nowhere yet, but correct.

- **Scope decision: increment only.** Issues [#4](https://github.com/japanese-project/button_counter/issues/4)
  and [#5](https://github.com/japanese-project/button_counter/issues/5) (screen + buttons)
  as originally written also call for a decrease button — dropped, out of
  scope for now. #4 and #5 need to be amended to match (currently still say
  increase + decrease). Issue [#9](https://github.com/japanese-project/button_counter/issues/9)
  and PR [#19](https://github.com/japanese-project/button_counter/pull/19) already only
  implement increment, so this brings the requirements in line with the logic
  instead of the other way around.
- **Counter screen** ([#4](https://github.com/japanese-project/button_counter/issues/4)) —
  shows the count; a refresh must not reset it.
- **Increment button** ([#5](https://github.com/japanese-project/button_counter/issues/5)).
- **Interface implementation** ([#3](https://github.com/japanese-project/button_counter/issues/3)) —
  wire the Svelte components + TypeScript together.
- **Counter logic** ([#9](https://github.com/japanese-project/button_counter/issues/9)) —
  read/update the count in Turso. Increment only.

## Phase 2 — Make it feel right

Goal: fix the rough edges found while actually testing Phase 1's implementation.

- **Real-time sync across clients — confirmed requirement.** Right now each
  browser only knows about its own clicks until it reloads — two people
  looking at the page at the same time don't see each other's presses.
  "Correct after a refresh" isn't good enough; the server needs to push
  updates to every connected client (WebSockets/SSE), not just accept writes.
- **Error handling for the optimistic UI.** The button currently updates the
  displayed count instantly and fires the save in the background, but if
  that request fails there's no rollback — the screen silently drifts from
  the database until a manual refresh.
- **Usage docs** ([#13](https://github.com/japanese-project/button_counter/issues/13)) —
  install steps, env vars, running the app, Turso setup, project structure,
  how to use the counter app. (Separate from `docs/CONTRIBUTING.md`, which
  covers team workflow, not app usage.)

## Phase 3 — Production readiness

Goal: safe to put in front of people outside the dev team.

- **Deploy** ([#18](https://github.com/japanese-project/button_counter/issues/18)) —
  no target chosen yet; `adapter-auto` is in `vite.config.ts` but not
  committed to a specific host.
- **Rate limiting / abuse protection** on the increment action — nothing
  stops a script from hammering it today.
- **Structured logging** for production, instead of nothing.

## Ideas — not committed yet

- **Reset the counter.** Came up as a maybe — not scoped, not an issue, not
  blocking anything. Worth an issue if the team actually wants it.

## Already done

- DB schema + shared Turso connection ([#8](https://github.com/japanese-project/button_counter/issues/8),
  [#15](https://github.com/japanese-project/button_counter/issues/15))
- Migration pipeline replacing hand-written `schema.sql`
  ([#20](https://github.com/japanese-project/button_counter/issues/20))
- Counter screen design ([#14](https://github.com/japanese-project/button_counter/issues/14))
- Team practiced the PR → review → merge cycle ([#10](https://github.com/japanese-project/button_counter/issues/10)–[#12](https://github.com/japanese-project/button_counter/issues/12))
- Project settings and DB wiring ([#2](https://github.com/japanese-project/button_counter/issues/2),
  [#6](https://github.com/japanese-project/button_counter/issues/6),
  [#7](https://github.com/japanese-project/button_counter/issues/7)) — functionally
  done via #15/#20's work; these issues just need closing.
