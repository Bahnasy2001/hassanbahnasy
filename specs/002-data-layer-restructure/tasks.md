---
description: "Task list for Data Layer Restructure"
---

# Tasks: Data Layer Restructure

**Input**: Design documents from `specs/002-data-layer-restructure/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: No test tasks. The spec did not request tests, and the project has no test
suite, linter, or visual-regression harness — adding one would violate Constitution
Principle V (confirmed in research.md D-005, which rejected `tsx`/`ts-node` for exactly
this reason). Verification is instead first-class: a clean build, the **80-string content
inventory**, ordering checks, single-source-of-truth greps, and a visual comparison.

**Organization**: Grouped by user story so each is independently completable and verifiable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Conventions

- `<BASELINE>` = `C:\Users\Pc\AppData\Local\Temp\claude\e--hassan-el-bahnasy-portfolio\2429c9d8-0af8-4e08-abeb-47ae3259d5d8\scratchpad\baseline-002\`
  — outside the repository so baseline artifacts are never committed.
- Repository paths are relative to `e:\hassan-el-bahnasy-portfolio`.
- "Build is clean" = `npm run build` exits 0 **and** prints zero warning lines.
- **INVENTORY CHECK** = every string in `specs/002-data-layer-restructure/contracts/content-inventory.txt`
  is present verbatim in `dist/assets/index-*.js`. Baseline: 80/80.

> ⚠️ **Do NOT reuse the byte-identical-bundle check from feature 001.** This feature adds
> slugs and summaries, so the bundle and its content hash **must** change. Bundle size is a
> sanity signal only. The inventory check replaces equality as the mechanical proof
> (research.md D-001).

---

## Phase 1: Setup

**Purpose**: Confirm the environment matches what the plan assumed.

- [x] T001 In the repo root `e:\hassan-el-bahnasy-portfolio`, confirm `git branch --show-current` reports `feat/data-architecture` and NOT `main`; abort if on `main`, because merging to `main` publishes to production automatically (Constitution IV / FR-015)
- [x] T002 Record the pre-change `git status --porcelain` to `<BASELINE>/git-status.before.txt`; it should show only the untracked `specs/002-data-layer-restructure/` directory and a modified `.specify/feature.json`
- [x] T003 Record `node --version` and `npm --version` to `<BASELINE>/toolchain.txt`; expected Node v24.18.1 / npm 11.16.0 locally versus Node 20 in `.github/workflows/deploy.yml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Capture the baseline required by FR-014 and prove the inventory harness works
*before* anything depends on it.

**⚠️ CRITICAL**: No source file may be modified until T004–T007 are complete.

- [x] T004 Run `npm run build` and save the full log to `<BASELINE>/build-log.before.txt`; confirm zero warnings (feature 001 removed the only one)
- [x] T005 [P] Copy `dist/index.html` to `<BASELINE>/index.html.before` and `dist/assets/index-*.js` to `<BASELINE>/bundle.js.before`, recording the md5 and content-hash filename in `<BASELINE>/toolchain.txt` (baseline: md5 `b4bb8c138f13bdca4684d298b2d950f4`, `index-BNL2Oep4.js`, 285.88 kB)
- [x] T006 [P] Run the INVENTORY CHECK against the baseline bundle and confirm **80/80** strings present, zero missing — this validates the verification harness itself before any change relies on it
- [ ] T007 ⛔ **NOT DONE — no browser available in this environment; requires the owner.** Run `npm run preview` and capture full-page screenshots to `<BASELINE>/desktop.before.png` (~1440px) and `<BASELINE>/mobile.before.png` (~390px), covering all eight sections rendered by `App.tsx`

**Checkpoint**: Baseline captured, harness proven. Editing may begin.

---

## Phase 3: User Story 1 - A content model that can hold case-study depth (Priority: P1) 🎯 MVP

**Goal**: Extend `Project` with identity and case-study fields, and migrate the four
existing projects into the new shape.

**Independent Test**: Each of the four projects has a unique slug, `kind: 'project'`, and a
summary; the depth fields accept content with no type change; the site renders as before.

- [x] T008 [US1] In `types.ts`, add three **required** fields to the `Project` interface: `slug: string`, `kind: 'project' | 'lab'`, `summary: string` — use string-literal unions for `kind`, not `string`, so an invalid value is a compile error (data-model.md VR-003)
- [x] T009 [US1] In `types.ts`, add eight **optional** fields to `Project`: `problem?`, `approach?`, `impact?`, `year?` (string, not number — must accept "2024–2025" and "Ongoing"), `image?`, `readmeUrl?` (all string), `featured?: boolean`, `labCount?: number`. Leave `title`, `description`, `tags`, `repoUrl?`, `demoUrl?` exactly as they are (FR-003)
- [x] T010 [US1] **Confirmed: exactly 4 × TS2739 errors, one per project.** Run `npm run build` and confirm `tsc` **FAILS** with missing `slug`/`kind`/`summary` on all four projects in `data/config.tsx`. **This red build is the expected outcome** and is the proof that the required fields bite (data-model.md VR-005). Do NOT resolve it by making the fields optional
- [x] T011 [US1] In `data/config.tsx`, migrate all four projects using the exact values in [data-model.md](./data-model.md): slugs `secure-cloud-native-microservices-ci-cd`, `serverless-image-editor`, `pulumi-azure-infrastructure-ndc-core`, `to-do-list-gitops-pipeline`; `kind: 'project'` for all four; summaries as listed. Write slugs as **literals**, never computed from `title` (research.md D-004 — slugs are identity and must survive a title edit)
- [x] T012 [US1] In `data/config.tsx`, confirm `problem`, `approach`, `impact`, `year`, `image`, `readmeUrl` are **omitted entirely** from all four projects — not set to `""` or `null`, since an omitted optional field and an empty string are different states (FR-006)
- [x] T013 [US1] Run `npm run build` and confirm it is clean
- [x] T014 [US1] **80/80 PASS.** Run the INVENTORY CHECK against `dist/assets/index-*.js` and confirm 80/80 — no content was lost or edited during migration
- [x] T015 [US1] **4 slugs / 4 unique / 4 match regex.** Verify in `data/config.tsx` that all four `slug` values are unique and each matches `^[a-z0-9]+(-[a-z0-9]+)*$` (data-model.md VR-001, VR-002) — note `pulumi-azure-infrastructure-ndc-core` derives from a title containing a non-ASCII en dash, which must have become a hyphen rather than being dropped
- [x] T016 [US1] Verify each project's `description` in `data/config.tsx` is byte-identical to the baseline and that the new shorter `summary` has NOT replaced it anywhere (contract INV-5)

**Checkpoint**: US1 complete and independently shippable. The richer model exists and the
page is unchanged.

---

## Phase 4: User Story 3 - Certifications ready to populate (Priority: P3)

**Goal**: Define the certification shape and an empty typed collection.

**Independent Test**: A completed certification with a credential link and an in-progress
one without a link both compile with no type edits.

> **Sequencing note**: US3 (P3) runs before US2 (P2) despite lower priority, for a hard
> dependency reason: the aggregate layer rewritten in T029 re-exports `certifications`, so
> `data/certifications.ts` must already exist. Doing US2 first would mean editing
> `data/config.tsx` twice. `types.ts` is therefore edited in both Phase 3 (Project) and
> this phase (Certification) — two separate, sequential edits to one file.

- [x] T017 [US3] In `types.ts`, add the `Certification` interface: required `name: string`, `issuer: string`, `year: string`, `status: 'completed' | 'in-progress'`, `tier: 'expert' | 'associate' | 'foundational'`, plus optional `credlyUrl?: string` (data-model.md VR-006, VR-008 — an in-progress credential has no badge to link)
- [x] T018 [US3] Create `data/certifications.ts` exporting `certifications` as an **empty but typed** `Certification[]`, importing the type from `../types`, so the first entry added is type-checked immediately (FR-010 / VR-007)
- [x] T019 [US3] Run `npm run build` and confirm it is clean
- [x] T020 [US3] **Both variants compiled; negative probe `tier: "guru"` correctly rejected (TS2322); reverted to empty (md5 match).** Temporarily add one completed certification with a `credlyUrl` and one in-progress certification without one to `data/certifications.ts`, build to confirm both compile with no change to `types.ts`, then revert `data/certifications.ts` to the empty array (SC-006)

**Checkpoint**: Certification shape ready; adding real certifications is now pure content entry.

---

## Phase 5: User Story 2 - Content organised by what it is (Priority: P2)

**Goal**: Split content into five focused modules while `data/config.tsx` becomes a pure
assembly and re-export layer, with zero component edits.

**Independent Test**: Editing one content type means opening exactly one file; no component
file changed; the site renders identically.

- [x] T021 [P] [US2] Create `data/site.ts` exporting `site` with `name`, `title`, `tagline`, `email`, `about` (`intro`, `bio`), `socials`, and `navItems`, moved verbatim from `data/config.tsx` — preserving `socials` order (GitHub → LinkedIn → Email) and `navItems` order (About → Experience → Skills → Projects → Contact). Include the lucide icon imports these need
- [x] T022 [P] [US2] Create `data/experience.ts` exporting `experience: Experience[]` with all three roles moved verbatim, preserving order: Sheen Information Technology → IT Visionary → National Telecommunications Institute (NTI), and each role's `description` bullet order
- [x] T023 [P] [US2] Create `data/skills.ts` exporting `skills: Skill[]` with all ten skills moved verbatim, preserving order (Linux Administration first … Security Tools (SonarQube, Trivy) last) and the lucide icon imports each entry references
- [x] T024 [P] [US2] Create `data/projects.ts` exporting `projects: Project[]` with all four migrated projects moved verbatim from `data/config.tsx`, preserving project order and each project's `tags` order
- [x] T025 [US2] Run `npm run build` and confirm it is clean — the four new modules type-check even though nothing consumes them yet
- [x] T026 [US2] Rewrite `data/config.tsx` as a pure assembly and re-export layer: import `site`, `experience`, `skills`, `projects`, and `certifications`, compose them into a `config` object satisfying `Config`, and re-export `config` plus `certifications`. Keep the filename and `.tsx` extension so the eight `from '../data/config'` imports resolve unchanged (contract INV-1, INV-2)
- [x] T027 [US2] **Used `export type { Config, Project, Certification, Skill, Experience, NavItem, SocialLink }`; build clean, no TS1205.** In `data/config.tsx`, ensure every type re-export uses `export type { … }` and never a bare `export { … }` — `isolatedModules: true` makes a bare type re-export error **TS1205**, verified empirically in research.md D-002 (contract INV-7)
- [x] T028 [US2] **Confirmed — 43 lines, zero content literals.** Confirm `data/config.tsx` contains **no content literals** — it must compose and re-export only, so each content item has exactly one owner (FR-008 / contract INV-6 / SC-007)
- [x] T029 [US2] **Clean; 1840 modules (was 1835, +5 new).** Run `npm run build` and confirm it is clean; if the aggregate shape drifted, `tsc` fails at the eight consumers in `components/`
- [x] T030 [US2] **80/80 PASS.** Run the INVENTORY CHECK against `dist/assets/index-*.js` and confirm 80/80 — nothing was lost while moving content between five files. This is the single most valuable check in the feature
- [x] T031 [US2] **All four resolved to exactly one file each.** Verify single source of truth by confirming each of these appears in exactly one file under `data/`: "Sheen Information Technology" → `experience.ts`, "Linux Administration" → `skills.ts`, "Serverless Image Editor" → `projects.ts`, "hassanelbahnasy85" → `site.ts` (SC-007 — the inventory check cannot detect duplication)
- [x] T032 [US2] **All sequences match: projects 4, experience 3, navItems 5, socials 3, skills 10, tags per project.** Verify ordering is preserved in `data/projects.ts`, `data/experience.ts`, `data/skills.ts`, and `data/site.ts` against the expected sequences in [quickstart.md](./quickstart.md) Step 4 — the inventory proves presence, **not order**, and a reordered array silently changes the page (contract INV-4)
- [x] T033 [US2] **Output empty — zero rendering files touched.** Run `git status --porcelain components/ App.tsx index.tsx index.html vite.config.ts tsconfig.json .github/` and confirm the output is **completely empty** (FR-009 / SC-002)

**Checkpoint**: All three user stories complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T034 ⚠️ **PARTIAL — Steps 1,2,3,4,5,7,8 pass; Step 6 (visual) not run, no browser.** Run the full validation sequence in [quickstart.md](./quickstart.md) Steps 1–8 and confirm SC-001 through SC-007 are all satisfied
- [x] T035 **286,490 B vs 285,880 B baseline = +610 B, within budget; hash moved to `index-D9K8PFim.js` as expected.** Check bundle size in `dist/assets/`: expect growth under ~1 kB from the 285.88 kB baseline (four slugs plus four summaries). The content hash **will** differ from `index-BNL2Oep4.js` and that is correct; investigate only if growth exceeds a few kB, which would suggest a duplicated module or duplicated content
- [ ] T036 ⛔ **NOT DONE — no browser and no baseline screenshots (T007); requires the owner.** Run `npm run preview` and compare the served site against `<BASELINE>/desktop.before.png` and `<BASELINE>/mobile.before.png`; confirm project cards show `description` (not `summary`), each card has its GitHub button, no demo buttons appear (no project has `demoUrl`), and scroll animations plus the custom scrollbar are unchanged (FR-012 / SC-003)
- [x] T037 **Confirmed exactly as specified, nothing else.** Run `git status --porcelain` and confirm exactly: `M types.ts`, `M data/config.tsx`, and five new files `data/site.ts`, `data/experience.ts`, `data/skills.ts`, `data/projects.ts`, `data/certifications.ts` — plus the `specs/` additions. Nothing else
- [ ] T038 Commit on `feat/data-architecture` with a message describing the type extension and the module split; do not commit `<BASELINE>` artifacts or `dist/`. **Requires owner approval.**
- [ ] T039 Push the branch and confirm the run of `.github/workflows/deploy.yml` is green — the authoritative build, since CI pins Node 20 while local verification used Node 24. **Requires owner approval.**
- [ ] T040 Confirm with the owner before merging `feat/data-architecture` into `main`, because that merge triggers `.github/workflows/deploy.yml` and deploys to production with no further gate (Constitution IV)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1. **BLOCKS all user stories** — FR-014
  requires the baseline, and T006 proves the harness before anything trusts it.
- **US1 (Phase 3)**: Depends on Phase 2 only.
- **US3 (Phase 4)**: Depends on Phase 2. Independent of US1 in content, but sequenced after
  it because both edit `types.ts`.
- **US2 (Phase 5)**: Depends on **both** US1 (projects must already carry the new shape
  before being moved to `projects.ts`) and US3 (`certifications.ts` must exist before the
  aggregate re-exports it).
- **Polish (Phase 6)**: Depends on all three stories.

### Within-Story Dependencies

- **US1**: T008 → T009 (same file, `types.ts`) → T010 (expected red) → T011 → T012 (same
  file, `data/config.tsx`) → T013 → T014 → T015 → T016.
- **US3**: T017 → T018 → T019 → T020.
- **US2**: T021–T024 in parallel → T025 → T026 → T027 → T028 (same file,
  `data/config.tsx`) → T029 → T030 → T031 → T032 → T033.

### Parallel Opportunities

- **T005 and T006** — different work against the same read-only `dist/` output.
- **T021, T022, T023, T024** — the strongest parallel block in this feature: four brand-new
  files with no dependency on one another. Each extracts a different slice of
  `data/config.tsx`, which is not modified until T026.

Everything else is sequential. `types.ts` is edited by T008/T009/T017; `data/config.tsx` by
T011/T012/T026/T027/T028. Marking same-file edits `[P]` would be wrong, and verification
tasks share `dist/` so they cannot overlap either.

---

## Implementation Strategy

### MVP scope

**Phase 1 + Phase 2 + Phase 3 (US1)** — 16 tasks. Delivers the richer project model with
identity and case-study capacity, removing a future migration. Independently shippable and
satisfies SC-001, SC-003, and SC-005.

### Incremental delivery

1. Setup + Foundational → baseline captured, harness proven, editing unblocked
2. US1 → extended model, 4 projects migrated → verify → shippable (MVP)
3. US3 → certification shape ready → verify → shippable
4. US2 → five focused modules, zero component edits → verify → shippable
5. Polish → full quickstart validation, then owner-approved commit, push, and merge

### Notes

- **T010 is meant to fail.** Extending `types.ts` before migrating the data leaves the tree
  red, and that red build is the evidence the required fields do their job. Making
  `slug`/`kind`/`summary` optional to get past it would discard the whole Principle III
  benefit.
- **The three checks that actually protect this feature**, in order of value: the 80-string
  INVENTORY CHECK (T014, T030) proves no content was lost; the ordering check (T032) covers
  what the inventory structurally cannot see; the component-diff check (T033) proves the
  aggregate contract held.
- **T027 exists because of a verified trap**, not a hypothetical one — a bare type re-export
  fails with TS1205 under this project's `isolatedModules` setting.
- T038–T040 involve committing, pushing, and deploying to production and require explicit
  owner approval; they are listed for completeness, not to run unattended.
