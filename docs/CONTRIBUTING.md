# Contributing

## Workflow

```text
Pick an issue → branch off main → do the work → check it → commit → push → open a PR → get reviewed → merge
```

1. **Sync main**

   ```bash
   git checkout main
   git pull origin main
   ```

2. **Branch per issue** — name it `feature/issue-<number>-<short-description>`

   ```bash
   git checkout -b feature/issue-12-button-counter
   ```

3. **Do the task** described in the GitHub issue. Keep the branch scoped to that issue.

4. **Check before committing**

   ```bash
   npm run check   # type-check (svelte-check)
   npm run lint    # formatting (prettier --check)
   npm run format  # auto-fixes formatting
   ```

5. **Commit and push**

   ```bash
   git add <files>
   git commit -m "issue-<number>: <what changed>"
   git push -u origin feature/issue-<number>-<short-description>
   ```

   Note: `issue-<number>:` in a commit message is just a readability
   convention — GitHub does **not** turn it into a link. It only auto-links
   (and auto-closes on merge) when the text is the literal `#<number>`, e.g.
   `Closes #12` — see the next step.

6. **Open a PR** into `main` with a short description of what and why. Put `Closes #12` (using the real issue number, `#` required) in the PR body — that's what actually links and auto-closes the issue when the PR merges.

7. **Address review feedback** with new commits on the same branch — the PR updates automatically.

> Never commit directly to `main`.

## Code style

- Tabs for indentation, single quotes, no trailing commas (`prettier.config.js` is the source of truth — run `npm run format` rather than hand-matching this).
- No unnecessary comments — code should read clearly on its own; comment only the non-obvious _why_.

## Running locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run check     # type-check
```

See `docs/turso-setup.md` for getting Turso credentials into your `.env`.

## Working against the shared database

The dev server talks to the **team's shared Turso database**, not a local one — there's no per-developer copy. A few consequences:

- Anything you write while testing (incrementing the counter, inserting rows) is visible to everyone, immediately.
- If you're testing something that mutates data, reset it back to its prior state afterward (e.g. `turso db shell button-counter "UPDATE counter SET count = 0 WHERE id = 1;"`) rather than leaving the DB in a test state.
- Don't assume you're the only writer — the DB can and will see concurrent writes from teammates' dev servers.

## Keeping branches clean

Once your PR merges, delete the branch — locally (`git branch -d <branch>`) and on GitHub (`git push origin --delete <branch>`, or let GitHub's "Delete branch" button on the merged PR do it).
