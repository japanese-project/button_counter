# ESLint Configuration (issue #43)

ESLint is the project's static-analysis gate: it catches correctness bugs,
unused imports, and style violations that Prettier (by design) doesn't care
about. It is set up with the official Svelte CLI (`npx sv add eslint`), so it
matches Svelte's current recommended conventions.

## Where the configuration lives

- `eslint.config.js` — flat config, the only config file (takes priority over
  any legacy `.eslintrc.*`).
- `.vscode/extensions.json` — recommends `dbaeumer.vscode-eslint`.
- devDependencies added by the CLI: `eslint`, `@eslint/js`, `typescript-eslint`,
  `eslint-plugin-svelte`, `eslint-config-prettier`, `globals`.

## What the config does, top to bottom

1. `includeIgnoreFile(gitignore_path)` — everything in `.gitignore`
   (`node_modules`, `.svelte-kit`, `build`, `.env`, …) is out of scope, so
   `eslint .` is fast and never lints generated code.
2. `js.configs.recommended` — the base ESLint rule set.
3. `ts.configs.recommended` — TypeScript-aware rules from `typescript-eslint`.
4. `svelte.configs.recommended` — rules for `.svelte` files from
   `eslint-plugin-svelte`.
5. `prettier` + `svelte.configs.prettier` — turns **off** every ESLint rule
   that overlaps Prettier formatting, so the two tools can't disagree
   (see `docs/prettier-config.md`).
6. Global scope: browser + node globals are available everywhere.
7. `no-undef` is off — TS already catches undefined variables; the rule is
   noise on TypeScript projects.
8. `.svelte` files are parsed with the TypeScript parser, so type-aware rules
   work inside component markup.

## The snake_case rule

Requested in issue #43: variables and functions must be `snake_case` instead
of `camelCase`. Enforced via `@typescript-eslint/naming-convention`:

- `variable` → `snake_case` **or** `UPPER_CASE`
  (`UPPER_CASE` stays legal so environment constants like `TURSO_DATABASE_URL`
  don't get flagged).
- `function` → `snake_case`.

Not restricted (deliberately):

| What                                  | Why                                                             |
| ------------------------------------- | --------------------------------------------------------------- |
| Types / interfaces                    | PascalCase (`Props`, `Config`) is the TS convention             |
| Imports                               | library names (`createClient`) and component imports (`Header`) |
| Object-literal keys / function params | the issue only called out variables and functions               |

> **Svelte props are linted.** `$props()` destructured bindings are variables,
> so a prop must be `snake_case` / `UPPER_CASE` like any other one — which is
> exactly why `onTrigger` in `Button.svelte` was renamed to `on_trigger`.

| ✅ Allowed                                       | ❌ Flagged                            |
| ------------------------------------------------ | ------------------------------------- |
| `count`, `led_on`, `turso`, `TURSO_DATABASE_URL` | `ledOn`                               |
| `increment_counter()`, `handle_click()`          | `incrementCounter()`, `handleClick()` |

The renames this issue applied:

| File                           | Before → After                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `src/components/Button.svelte` | `onTrigger` → `on_trigger`, `ledOn` → `led_on`, `handleClick` → `handle_click` |
| `src/routes/+page.svelte`      | `countLive` → `count_live`, `liveCount` → `live_count`                         |
| `src/routes/counter.remote.ts` | `countLive` → `count_live`                                                     |
| `src/routes/counter.ts`        | `incrementCount` → `increment_count`, `getCount` → `get_count`                 |
| `src/routes/+page.server.ts`   | `incrementCount` → `increment_count`                                           |

## Running it

```bash
npm run lint          # prettier --check . && eslint .   (full gate)
npx eslint .          # lint everything
npx eslint --fix .    # auto-fix what ESLint can fix safely
npx eslint src/       # lint one directory
```

`npm run lint` is the gate CI/reviewers care about — it fails on either an
unformatted file or an ESLint error.

## Editing / adding rules

The last block in `eslint.config.js` is where project-specific rules live:

```js
{
	// Override or add rule settings here, such as:
	// 'svelte/button-has-type': 'error'
	rules: {
		'@typescript-eslint/naming-convention': [
			'error',
			{ selector: 'variable', format: ['snake_case', 'UPPER_CASE'] },
			{ selector: 'function', format: ['snake_case'] }
		]
	}
}
```

## Verify

- `npm run lint` passes — Prettier's check runs first, then ESLint; both are
  silent when the repo is clean.
- `npx eslint .` prints nothing.
- Renaming an existing identifier to camelCase (e.g. back to `incrementCounter`)
  immediately reports a `naming-convention` error.
