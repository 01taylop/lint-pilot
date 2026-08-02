# CLAUDE.md

## Working agreement

- **Sync before trusting state.** This repo is edited outside Claude Code too — pull the latest changes before starting, and re-read a file (or check `git status`/`git diff`) before asserting its contents, rather than relying on an earlier read in this conversation.
- **Avoid scope creep.** If new work surfaces mid-task, judge whether it's a genuine prerequisite (do it first, as its own PR, then resume), incidental (park it for later), or truly coupled to the current change (keep it together).
- **Ask before assuming.** Ask before deciding on naming, API shape, behaviour changes, or scope — don't guess. Mechanical follow-through (fixing a typo, updating a lockfile) doesn't need permission.

## Workflow

- **Testing** (see Testing): only once the implementation is approved, avoiding tests for a design that's still likely to change.
- **Commit** (see Commit guidelines): follow the title and description rules there.
- **Changeset** (`yarn changeset`): add it once told the feature is finalised, avoiding one for a shape that's still under review.
- **PR** (see PR guidelines): prepare or update it once asked, avoiding a rewrite after every commit pushed to the branch.

## Coding guidelines

### Imports

- Group imports in this order, separated by a blank line: (1) Node built-ins, (2) third-party packages, (3) internal modules.
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
- Use a separate `import type { }` statement for type-only imports rather than an inline modifier (`import { x, type y } from '...'`) — keeps type and value imports visually distinct.

### Exports

- Export everything in a single block at the end of the file, one item per line — even for a single export. Never export inline on the declaration:

  ```ts
  const doThing = () => { ... }
  const doOtherThing = () => { ... }

  export {
    doOtherThing,
    doThing,
  }
  ```

- No default exports. Named exports only — consistent renaming across the codebase, and autocomplete/grep-ability at import sites.
- Only export what's genuinely needed outside the file. A type or value used solely within its own file should stay unexported, even if related exported items live nearby.

### Types

- Prefer `interface` for object shapes that consumers may extend; use `type` for unions, intersections, and aliases.
- Add explicit return types to exported functions.
- Avoid `any`. Use `unknown` when the type is genuinely unknown and narrow it before use.

## Testing

Wait until the implementation is approved before writing tests — testing a design that's still likely to change is wasted effort. Once approved:

1. **Write `it.todo` stubs first** for the planned cases and confirm the list before filling any in.
2. **Implement the first test, confirm the approach**, then write the rest — one-by-one or in bulk, as directed.
3. **Iterate with single-file/single-case runs** while writing.
4. **Finish with the full suite and coverage** to confirm the threshold is met, plus the integration suite if the change touches integration-tested behaviour.

Name test cases by what the code does, not what it "should" do — e.g. `it('returns null when the input is empty')`, not `it('should return null when...')`, since "should" implies uncertainty about whether it actually does.

Prefer `describe.each`/`test.each` over near-duplicate test blocks when cases differ only in input/output.

```bash
yarn test path/to/file.spec.ts  # single file
yarn test -t 'name'            # single case
yarn test --coverage           # full suite with coverage
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
