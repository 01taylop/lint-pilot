# CLAUDE.md

Zedlint is an opinionated lint orchestrator that runs ESLint, Stylelint, and Markdownlint from a single command. It ships today as one package (`zedlint`) and is moving toward a Yarn workspaces monorepo of a CLI plus opt-in config packages published under the `@zedlint` npm scope.

## Repo map

- `src/` — the CLI: `commands/`, `linters/` (one directory per linter), `utils/`, `types/`.
- `config/` — the lint config Zedlint ships to consumers. These are config objects, so this directory uses default exports.
- `jest-config/` — Jest setup and shared fixtures.
- `lib/` — build output from `yarn build`. Git-ignored, but `eslint.config.js` and `.markdownlint.json` both read from it, so the repo cannot lint itself until it has been built.

Path aliases are declared in **both** `tsconfig.json` and `jest.config.ts` — add a new one to both, or tests will fail to resolve it:

- `@Jest/*` → `jest-config/*`
- `@Linters/*` → `src/linters/*`
- `@Types/*` → `src/types/*`
- `@Utils/*` → `src/utils/*`

Toolchain: TypeScript, ESM only (`"type": "module"`), Node.js >= 20.19 (`.nvmrc` pins v24.12), Yarn 4 via corepack. If `yarn` resolves to v1, run `corepack enable` first.

## Working agreement

- **Sync before trusting state.** This repo is edited outside Claude Code too — pull the latest changes before starting, and re-read a file (or check `git status`/`git diff`) before asserting its contents, rather than relying on an earlier read in this conversation.
- **One logical change per PR**, reviewable in a single sitting.
- **Avoid scope creep.** If new work surfaces mid-task, judge whether it's a genuine prerequisite (do it first, as its own PR, then resume), incidental (park it for later), or truly coupled to the current change (keep it together).
- **Ask before assuming.** Ask before deciding on naming, API shape, behaviour changes, or scope — don't guess. Mechanical follow-through (fixing a typo, updating a lockfile) doesn't need permission.

## Workflow

Each step waits on the one before it being signed off — don't run ahead.

1. **Implement** the change.
2. **Test** (see Testing): only once the implementation is approved, avoiding tests for a design that's still likely to change.
3. **Commit** (see Commit guidelines): follow the title and description rules there.
4. **Changeset** (`yarn changeset`): add it once told the feature is finalised, avoiding one for a shape that's still under review.
5. **PR** (see PR guidelines): prepare or update it once asked, avoiding a rewrite after every commit pushed to the branch.

**Don't run lint.** CI checks it. Locally it needs a build first (see `lib/` above), and it currently reports pre-existing errors because the shipped ESLint config doesn't parse TypeScript yet — noise that invites scope creep.

## Coding guidelines

### Imports

Group imports in this order, separated by a blank line:

1. Node.js built-ins (`node:*`)
2. Third-party packages
3. Aliased internal modules (`@Jest/*`, `@Linters/*`, `@Types/*`, `@Utils/*`)
4. Relative imports (`./`, `../`)
5. Type-only imports, wherever they resolve from

Nothing enforces this ordering automatically, so it has to be written correctly by hand.

- Type-only imports use a separate `import type { }` statement rather than an inline modifier (`import { x, type y } from '...'`), and always sit last, in their own group — this keeps type and value imports visually distinct.
- When importing more than three named exports from a single source, split onto multiple lines — one import per line:

  ```ts
  // three or fewer — single line is fine
  import { foo, bar, baz } from './utils'

  // four or more — one per line
  import {
    alpha,
    beta,
    gamma,
    delta,
  } from './utils'
  ```

- Prefer named imports over default imports for internal modules. Default imports are fine for third-party packages that only export a default (e.g. `chalk`).

### Exports

- Export in a single block at the end of the file, one item per line — even for a single export. Never export inline on the declaration.
- Type exports go in their own `export type { }` block, placed **before** the value `export { }` block. Both are sorted alphabetically, which `sort-exports` enforces as an error:

  ```ts
  const doThing = () => { ... }
  const doOtherThing = () => { ... }

  export type {
    ThingOptions,
  }

  export {
    doOtherThing,
    doThing,
  }
  ```

- No default exports in `src/`. Named exports only — consistent naming across the codebase, and autocomplete/grep-ability at import sites. `config/` is the deliberate exception: ESLint and Stylelint config files have to default-export their config object.
- Only export what's genuinely needed outside the file. A type or value used solely within its own file should stay unexported, even if related exported items live nearby.

### Types

- Use `interface` for plain object shapes; use `type` for unions, function types, and shapes composed from utility types (`Pick`, `Record`, intersections).
- Add explicit return types to exported functions.
- Avoid `any`. Use `unknown` when the type is genuinely unknown and narrow it before use.

### Destructuring

Destructured keys are sorted alphabetically, enforced as an error by `sort-destructure-keys`. Write them sorted rather than relying on `--fix`.

## Testing

Wait until the implementation is approved before writing tests — testing a design that's still likely to change is wasted effort. Once approved:

1. **Write `it.todo` stubs first** for the planned cases and confirm the list before filling any in.
2. **Implement the first test, confirm the approach**, then write the rest — one-by-one or in bulk, as directed.
3. **Iterate with single-file/single-case runs** while writing.
4. **Finish with the full suite and coverage.** `jest.config.ts` sets a 100% threshold for branches, functions, lines, and statements, so anything below 100% fails the run.

Name test cases by what the code does, not what it "should" do — e.g. `it('returns null when the input is empty')`, not `it('should return null when...')`, since "should" implies uncertainty about whether it actually does.

Prefer `describe.each`/`test.each` over near-duplicate test blocks when cases differ only in input/output.

```bash
yarn test path/to/file.spec.ts  # single file
yarn test -t 'name'             # single case
yarn test --coverage            # full suite with coverage
```

## Commit guidelines

- **Title**: past tense, aim for 50 characters or fewer, ending with a relevant emoji — e.g. `Added retry logic to fetch client 🔁`, `Upgraded Zod to v4 ⬆️`.
- Titles should strike the right balance between concise and informative: say what changed without cataloguing every file.
- **Description (body)**: only include one when necessary — when a change has a nuance or peculiarity that the title and diff alone don't explain. In most cases the title and the commit itself are sufficient.

## PR guidelines

### Review

- Base a review only on the committed changes reachable from the PR link — never on local or staged uncommitted diffs.
- Don't flag something introduced and then fixed within the same PR's own commit history — only the final diff matters.

### Title

- Aim for 50 characters or fewer, describing the outcome, not the implementation.
- End with a relevant emoji.
- Prefer verbs: Added, Standardised, Introduced, Refactored, Enabled, Fixed, etc.

### Description

Follow the repo's PR template (`.github/pull_request_template.md`), which has two sections:

```md
### What have you changed?
<!-- List changes in past tense -->
- ...

### Why are you making these changes?
<!-- List reasons in present tense -->
- ...
```

- Each "what" bullet starts with a relevant emoji; the paired "why" bullet at the same index uses the **same emoji**. Non-negotiable — reviewing usually only needs the _what_; debugging often needs the _why_, and pairing keeps them separable but easy to traverse.
- **What**: past tense, factual, no justification, no criticism of previous work.
- **Why**: present tense, explanatory, neutral, focused on outcomes. If a prior implementation was wrong, avoid saying "wrong" — prefer "to ensure consistency", "to better align with expectations", "to avoid ambiguity".
- Order bullets structural/architectural → behavioural → developer-experience/tooling.
- Sub-bullets are fine (no emoji) for constraints or extra context — keep the top-level list scannable.
