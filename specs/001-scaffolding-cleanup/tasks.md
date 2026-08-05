---
description: "Task list for Scaffolding Cleanup"
---

# Tasks: Scaffolding Cleanup

**Input**: Design documents from `specs/001-scaffolding-cleanup/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [quickstart.md](./quickstart.md)

**Tests**: No test tasks. The spec did not request tests, and the project has no test
suite, linter, or visual-regression harness — adding one would violate Constitution
Principle V. Verification is instead explicit: a warning-free build, a byte-identical
JS bundle, and a visual comparison against a captured baseline. Those verification
tasks are first-class below, not optional extras.

**Organization**: Grouped by user story so each is independently completable and
verifiable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Conventions

- `<BASELINE>` = `C:\Users\Pc\AppData\Local\Temp\claude\e--hassan-el-bahnasy-portfolio\2429c9d8-0af8-4e08-abeb-47ae3259d5d8\scratchpad\baseline\`
  — deliberately outside the repository so baseline artifacts are never committed.
- All repository paths are relative to the repo root `e:\hassan-el-bahnasy-portfolio`.
- "Build is clean" means `npm run build` exits 0 **and** prints zero warning lines.

---

## Phase 1: Setup

**Purpose**: Confirm the working environment matches what the plan assumed.

- [x] T001 In the repo root `e:\hassan-el-bahnasy-portfolio`, confirm `git branch --show-current` reports `chore/repo-cleanup` and NOT `main`; abort if on `main`, because merging to `main` publishes to production automatically (Constitution IV / FR-014)
- [x] T002 Record the pre-change `git status --porcelain` output to `<BASELINE>/git-status.before.txt`, so Phase 7's "exactly one deletion" check (SC-007) has something to compare against
- [x] T003 Confirm `node --version` and `npm --version` and note them in `<BASELINE>/toolchain.txt`; expected Node v24.18.1 / npm 11.16.0 locally, versus Node 20 in `.github/workflows/deploy.yml` (research.md D-004)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Capture the baseline required by FR-013. Without it, SC-003 ("visually
identical") cannot be verified at all — only asserted.

**⚠️ CRITICAL**: No file may be modified until T004–T008 are complete.

- [x] T004 Run `npm run build` and save the complete log to `<BASELINE>/build-log.before.txt`; confirm it contains exactly one warning, the `/index.css doesn't exist at build time` line, and no others
- [x] T005 [P] Copy `dist/index.html` to `<BASELINE>/index.html.before`
- [x] T006 [P] Copy `dist/assets/index-*.js` to `<BASELINE>/bundle.js.before` and record its content-hash filename (baseline: `index-BNL2Oep4.js`) in `<BASELINE>/toolchain.txt`
- [ ] T007 ⛔ **NOT DONE — no browser available in this environment; requires the owner.** Start `npm run preview` and capture full-page screenshots at desktop width (~1440px) to `<BASELINE>/desktop.before.png` and mobile width (~390px) to `<BASELINE>/mobile.before.png`, covering all eight sections rendered by `App.tsx` (Navbar, Hero, About, Experience, Skills, Projects, Contact, Footer)
- [ ] T008 ⛔ **NOT DONE — no browser available; substituted a built-output proxy (see T014).** With `npm run preview` still running, record the Network-tab request list to `<BASELINE>/network.before.txt`, confirming the `/index.css` 404 is present as the baseline for SC-002

**Checkpoint**: Baseline captured and stored outside the repo. Editing may begin.

---

## Phase 3: User Story 1 - Clean, warning-free build output (Priority: P1) 🎯 MVP

**Goal**: Remove the two dead references in `index.html` so the build emits zero
warnings and the served page makes zero failed requests.

**Independent Test**: `npm run build` produces no warnings; the served site's Network
tab shows no 404; the rendered page matches the Phase 2 screenshots.

- [x] T009 [US1] Remove the line `<link rel="stylesheet" href="/index.css">` from `index.html` (currently line 70); change nothing else in the file
- [x] T010 [US1] Run `npm run build` and confirm the `/index.css doesn't exist at build time` warning is gone and the build is clean; compare the log against `<BASELINE>/build-log.before.txt` (SC-001)
- [x] T011 [US1] Remove the entire `<script type="importmap">` … `</script>` block from `index.html`, including its JSON body; leave the following `<script type="module" src="/index.tsx">` tag intact
- [x] T012 [US1] Run `npm run build`; confirm it is clean and that `dist/assets/index-*.js` still has the hash recorded in T006 — a changed hash means a source change leaked in, so stop and investigate (quickstart.md Step 2)
- [x] T013 [US1] Diff `dist/index.html` against `<BASELINE>/index.html.before`; confirm the diff contains **only** the two removals and that the `tailwind.config` script, the `<style>` block, the Tailwind CDN tag, the `<title>`, and the module script tag are byte-for-byte unchanged (Constitution I / FR-012)
- [ ] T014 [US1] ⚠️ **PARTIAL — verified by proxy: zero `index.css`/importmap references remain in `dist/index.html`, and the only external refs left are the Tailwind CDN and Google Fonts. Browser Network tab NOT checked.** Run `npm run preview` to serve `dist/index.html`, hard-reload with the Network tab open, and confirm zero failed requests and no request for `/index.css` at all; compare against `<BASELINE>/network.before.txt`. Requests to `cdn.tailwindcss.com` and `fonts.googleapis.com` must still succeed (SC-002)
- [ ] T015 [US1] ⛔ **NOT DONE — depends on the T007 screenshots; requires the owner.** Compare the previewed page against `<BASELINE>/desktop.before.png` and `<BASELINE>/mobile.before.png`; verify colors, fonts, spacing, section order, content, scroll-triggered animations, and the custom scrollbar are unchanged (FR-011 / SC-003)
- [ ] T016 [US1] ⚠️ **PARTIAL — dev server started; it served the transformed HTML and returned HTTP 200 for the `/index.tsx` entry module, so module resolution works without the importmap. Visual render NOT confirmed (no browser).** Run `npm run dev` (which serves `index.html` unbundled) and confirm the page renders correctly with no console errors about unresolved module specifiers — the baseline measured only the production path, so the dev server is the one place the importmap removal could behave differently (research.md D-002 residual check)

**Checkpoint**: US1 is complete and independently shippable. SC-001 and SC-002 are met.

---

## Phase 4: User Story 2 - One unambiguous deployment path (Priority: P2)

**Goal**: Make the GitHub Actions workflow the only way the site can be published.

**Independent Test**: `npm run` lists no publish command; `package.json` has no
`gh-pages` and no `homepage`; the lockfile has zero `gh-pages` entries; the workflow
still deploys successfully.

- [x] T017 [US2] Remove the `"predeploy"` and `"deploy"` entries from the `scripts` block in `package.json`, leaving `dev`, `build`, and `preview`
- [x] T018 [US2] Remove `"gh-pages": "^6.1.1"` from `devDependencies` in `package.json`
- [x] T019 [US2] Delete the `"homepage"` field from `package.json` entirely — deleted, not corrected, because once `gh-pages` is gone no tooling reads it and `vite.config.ts` uses `base: './'` (FR-006 / research.md D-003)
- [x] T020 [US2] Regenerate `package-lock.json` (`npm install`) and confirm `grep -c gh-pages package-lock.json` returns 0; note this is local hygiene only, since the lockfile is untracked and CI runs `npm install` rather than `npm ci` (FR-005 / research.md D-005)
- [x] T021 [US2] Run `npm run build`; confirm it is clean and that `dist/assets/index-*.js` still matches the T006 hash — this is the guard against the lockfile regeneration drifting a transitive dependency into the bundle
- [x] T022 [US2] Run `npm run` and confirm only `dev`, `build`, `preview` are listed, with no `deploy` or `predeploy`; cross-check against the `scripts` and `devDependencies` blocks in `package.json` (SC-004)
- [x] T023 [US2] Re-read `.github/workflows/deploy.yml` and confirm it is **unmodified** and self-sufficient — `npm install` → `npm run build` → publish `dist` — referencing none of the removed scripts, fields, or packages (FR-012)

**Checkpoint**: Exactly one deployment path exists. SC-004 is met.

---

## Phase 5: User Story 4 - No dead scaffolding files (Priority: P3)

**Goal**: Remove the unused generator descriptor from the repository root.

**Independent Test**: `metadata.json` is absent; the build succeeds and the page
renders unchanged.

> **Sequencing note**: US4 is done before US3 even though both are P3. US3 rewrites the
> README's description of how deployment works, which is most accurate to write once
> every other change has landed. US4 and US3 are otherwise fully independent and may be
> swapped freely.

- [x] T024 [US4] Delete `metadata.json` from the repository root; it is referenced by no module, absent from `tsconfig.json`, and unread by the workflow (FR-010 / research.md D-006)
- [ ] T025 [US4] ⚠️ **PARTIAL — build clean and bundle byte-identical confirmed; screenshot comparison NOT done (no browser).** Run `npm run build`, confirm it is clean and `dist/assets/index-*.js` still matches the T006 hash, then serve `dist/` and confirm the page renders identically to `<BASELINE>/desktop.before.png` and `<BASELINE>/mobile.before.png`

**Checkpoint**: The repository root contains no dead scaffolding files.

---

## Phase 6: User Story 3 - README a newcomer can trust (Priority: P3)

**Goal**: Make every path, link, and instruction in the README true.

**Independent Test**: Someone unfamiliar with the repo can locate and edit site content
following the README alone; every path exists; the live link opens the site.

- [x] T026 [US3] In `README.md`, correct the content-customization section to point at `data/config.tsx` (the real path) instead of `src/data/config.tsx`, which does not exist; this affects the intro line and all three sub-sections that name the file (FR-007)
- [x] T027 [US3] In `README.md`, replace the entire "How to Deploy" section — the `npm run deploy` instructions and the manual GitHub Pages source-configuration walkthrough — with a description of the real process: merging to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to the `gh-pages` branch automatically (FR-008)
- [x] T028 [US3] **Verified: lowercase URL returns HTTP 200; original casing returns 404.** In `README.md`, correct the live site URL to `https://bahnasy2001.github.io/hassanbahnasy/` (lowercase) and open it to confirm it resolves — this is the last owner-stated assumption still unverified and requires network access (FR-009)
- [x] T029 [US3] **Self-review done; owner should confirm the tone judgement.** Review `README.md` against Constitution Principle VI: a non-technical visitor must still understand what the project is and how content is updated, while a technical reviewer finds the deployment description precise rather than hand-wavy; neither audience served at the other's expense
- [x] T030 [US3] Walk the instructions in `README.md` literally, end to end, and confirm every path it names exists on disk (notably `data/config.tsx`) and no step requires guesswork (SC-005 / SC-006)

**Checkpoint**: All four user stories complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T031 ⚠️ **PARTIAL — Steps 1, 2, 5, 6, 7 pass; Steps 3 and 4 (browser network + visual) not run.** Run the full validation sequence in [quickstart.md](./quickstart.md) Steps 1–7 and confirm every one of SC-001 through SC-007 is satisfied
- [x] T032 Run `git status --porcelain` and confirm `metadata.json` is the **only** deleted file, with `index.html`, `package.json`, and `README.md` modified — required-but-unimported files (`README.md`, `.gitignore`, `tsconfig.json`, `.github/workflows/deploy.yml`) must all survive (SC-007)
- [x] T033 Confirm `App.tsx`, all eight files in `components/`, `data/config.tsx`, `types.ts`, `vite.config.ts`, `tsconfig.json`, `index.tsx`, and `.github/workflows/deploy.yml` are untouched in the diff (FR-012)
- [ ] T034 ⛔ **NOT DONE — awaiting owner approval to commit.** Commit the change on `chore/repo-cleanup` with a message describing the five removals; do not commit `<BASELINE>` artifacts or `dist/`
- [ ] T035 Push the branch and confirm the run of `.github/workflows/deploy.yml` is green — this is the authoritative build, since CI pins Node 20 while local verification used Node 24 (quickstart.md Step 8). **Requires owner approval before pushing.**
- [ ] T036 Confirm with the owner before merging `chore/repo-cleanup` into `main`, because that merge triggers `.github/workflows/deploy.yml` and deploys to production with no further gate (Constitution IV)
- [x] T037 Report the out-of-scope finding from research.md D-005 to the owner: `package-lock.json` is untracked while the workflow runs `npm install`, so CI builds are not reproducible. The fix (commit the lockfile, switch CI to `npm ci`) touches the protected workflow file and belongs in a separate feature.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1. **BLOCKS every user story** — FR-013
  requires the baseline before any file is modified.
- **US1 (Phase 3)**: Depends on Phase 2 only.
- **US2 (Phase 4)**: Depends on Phase 2 only. Independent of US1.
- **US4 (Phase 5)**: Depends on Phase 2 only. Independent of US1 and US2.
- **US3 (Phase 6)**: Depends on Phase 2. Content-independent of the others, but
  sequenced last so it describes the final state accurately.
- **Polish (Phase 7)**: Depends on all stories being complete.

### Within-Story Dependencies

- **US1 is strictly sequential.** T009 → T010 → T011 → T012 → T013 → T014 → T015 →
  T016. T009 and T011 edit the same file (`index.html`), and each verification task
  gates the next edit.
- **US2 is sequential.** T017, T018, T019 all edit `package.json`; T020 must follow
  them (it regenerates the lockfile from the edited manifest); T021–T023 verify.
- **US4**: T024 → T025.
- **US3 is sequential.** T026, T027, T028 all edit `README.md`; T029 and T030 review the
  result.

### Parallel Opportunities

Genuinely limited — this feature edits four files, and three of the four stories make
multiple edits to a single file each. Honest accounting:

- **T005 and T006** are parallel: different destination files, both read-only against
  `dist/`.
- **Across stories**: US1, US2, and US4 touch disjoint files (`index.html`,
  `package.json` + lockfile, `metadata.json`), so a second person could take one each
  once Phase 2 is done. Their *verification* tasks would then conflict over shared build
  output (`dist/`) and must not run concurrently.
- **Within US1, US2, US3**: no parallelism. Marking same-file edits `[P]` would be
  wrong.

No other task is marked `[P]`. This is a small sequential cleanup, and pretending
otherwise would invite conflicting edits.

---

## Implementation Strategy

### MVP scope

**Phase 1 + Phase 2 + Phase 3 (US1)** — 16 tasks. This delivers the highest-value fix
on its own: a warning-free build and a 404-free page load. It is independently
shippable and satisfies SC-001 and SC-002.

### Incremental delivery

1. Setup + Foundational → baseline captured, editing unblocked
2. US1 → clean build, no 404 → verify → shippable (MVP)
3. US2 → single deployment path → verify → shippable
4. US4 → dead file gone → verify → shippable
5. US3 → trustworthy README → verify → shippable
6. Polish → full quickstart validation, then owner-approved push and merge

Each story can be committed and merged on its own; none breaks the previous.

### Notes

- Every task that edits a file is followed by a verification task. That density is
  deliberate: the success criterion is "nothing changed visually", which is only
  credible if checked after each step rather than once at the end.
- The bundle content-hash check (T012, T021, T025) is the cheapest strong signal in
  this whole plan. Since no component, `data/` module, or Tailwind config is touched,
  the compiled bundle should be byte-identical throughout. If the hash moves, something
  went wrong regardless of how the page looks.
- T035 and T036 involve pushing and deploying to production and require explicit owner
  approval — they are listed for completeness, not to be run unattended.
