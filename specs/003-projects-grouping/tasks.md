---
description: "Task list for Projects Grouping"
---

# Tasks: Projects Grouping

**Input**: Design documents from `specs/003-projects-grouping/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [contracts/card-render-contract.md](./contracts/card-render-contract.md), [quickstart.md](./quickstart.md)

**Approvals**: ✅ Both granted 2026-08-09 — Q1 resolved as Option C (section heading becomes
"Projects"; sub-headings "Featured Projects" and "Labs & Practice"), and the FR-007 secondary
treatment approved as written including `lg:grid-cols-3` and the opacity rejection.

**Tests**: No test tasks. The spec did not request them, and the project has no test suite,
linter, or visual-regression harness — adding one would violate Principle V, which research.md
D-005 re-confirmed even though this is a visual feature. Verification is instead first-class: a
clean build, a **class-inventory diff**, rendered-item counts in the built output, and a
deliberate visual comparison.

**Organization**: Grouped by user story, in story-priority order (US1 → US2 → US3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3
- Include exact file paths in descriptions

## Conventions

- `<BASELINE>` = `C:\Users\Pc\AppData\Local\Temp\claude\e--hassan-el-bahnasy-portfolio\2429c9d8-0af8-4e08-abeb-47ae3259d5d8\scratchpad\baseline-003\` — outside the repo.
- Repository paths are relative to `e:\hassan-el-bahnasy-portfolio`.
- "Build is clean" = `npm run build` exits 0 **and** prints zero warning lines.
- **CLASS-INVENTORY DIFF** = the grep in [quickstart.md](./quickstart.md) Step 7, comparing
  `components/` classes before and after. **Added lines are failures**; removed lines are fine.

> ⚠️ **This feature intends to change the rendering.** "Nothing changed" is the wrong test here,
> unlike features 001 and 002. The question is *did only the intended things change* — hence the
> class-inventory diff rather than an output-equality check.

---

## Phase 1: Setup

- [x] T001 In the repo root `e:\hassan-el-bahnasy-portfolio`, confirm `git branch --show-current` reports `feat/projects-grouping` and NOT `main`; abort if on `main`, because merging to `main` publishes to production automatically (FR-017)
- [x] T002 Record the pre-change `git status --porcelain` to `<BASELINE>/git-status.before.txt`
- [x] T003 Record `node --version` and `npm --version` to `<BASELINE>/toolchain.txt`; expected Node v24.18.1 / npm 11.16.0 locally versus Node 20 in `.github/workflows/deploy.yml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Capture the baseline required by FR-016, including the class inventory that makes
the FR-006 "no new design values" claim mechanically checkable.

**⚠️ CRITICAL**: `components/Projects.tsx` must not be touched until T004–T007 are done.

- [x] T004 **Clean, 0 warnings; bundle 297,713 B.** Run `npm run build`, save the log to `<BASELINE>/build-log.before.txt`, confirm zero warnings, and copy `dist/assets/index-*.js` to `<BASELINE>/bundle.js.before` with its size recorded
- [x] T005 [P] **96 classes captured.** Build the pre-change class inventory from `components/` to `<BASELINE>/class-inventory.before.txt` using the grep in [quickstart.md](./quickstart.md) Step 7 (text/bg/gap/padding/margin/grid-cols/width/height values, sorted unique)
- [x] T006 [P] **12/12 titles present; heading confirmed "Featured Projects".** Record the current rendered state for later comparison: from `dist/assets/index-*.js`, confirm 12 card titles are present and that the section heading string is currently "Featured Projects"
- [ ] T007 ⛔ **NOT DONE — no browser in this environment; requires the owner.** Run `npm run preview` and capture full-page screenshots to `<BASELINE>/desktop.before.png` (~1440px) and `<BASELINE>/mobile.before.png` (~390px). The work section is the before/after subject; **the other seven sections are the untouched control** and must be in frame

**Checkpoint**: Baseline captured. Editing may begin.

---

## Phase 3: User Story 1 - Substantial work distinguishable from practice (Priority: P1) 🎯 MVP

**Goal**: Two labelled groups inside the existing section, projects first, labs visually
secondary.

**Independent Test**: A viewer unfamiliar with the site identifies which group is substantial
work from grouping and visual weight alone, without reading body text.

- [x] T008 [US1] In `components/Projects.tsx`, change the section `<h3>` text from "Featured Projects" to **"Projects"**, keeping the element and every existing class (`text-3xl md:text-5xl font-bold text-white font-display`) exactly as they are (FR-005 as amended / contract INV-1b)
- [x] T009 [US1] In `components/Projects.tsx`, derive two arrays from `config.projects` by the `kind` field — one for `'project'`, one for `'lab'` — preserving content order within each (FR-001, FR-013). Do not mutate `config.projects`
- [x] T010 [US1] **Extracted as `ProjectCard`, one implementation, tier-parameterised.** In `components/Projects.tsx`, extract the existing card markup into a **single** renderer parameterised by tier, so exactly one card implementation serves both groups (contract INV-2). Preserve the existing `motion.div` animation props and the `index * 0.1` stagger behaviour
- [x] T011 [US1] In `components/Projects.tsx`, wrap both groups in a container using `space-y-12` (existing class), inside the current `container mx-auto px-6` (FR-005)
- [x] T012 [US1] In `components/Projects.tsx`, render the projects group first: sub-heading "Featured Projects" with `text-2xl font-bold text-white font-display mb-8`, then the grid `grid md:grid-cols-2 lg:grid-cols-3 gap-8` (FR-002, FR-003, unchanged primary tier)
- [x] T013 [US1] In `components/Projects.tsx`, render the labs group second: sub-heading "Labs & Practice" with the same sub-heading classes, then the grid `grid md:grid-cols-2 lg:grid-cols-3 gap-6` — same columns, tighter gap (FR-003, research.md D-002)
- [x] T014 [US1] **`ProjectGroup` returns `null` when `items.length === 0`.** In `components/Projects.tsx`, guard each group so a group with zero items renders **nothing** — no sub-heading and no grid container (FR-004 / contract INV-5)
- [x] T015 [US1] In `components/Projects.tsx`, apply the approved secondary treatment to the lab tier only: card `p-6`, icon `w-8 h-8`, title `text-lg font-bold text-slate-200`, body `text-sm`. Keep the card shell, border, hover behaviour, link buttons, and tag chips **identical** to the primary tier (FR-007 / contract INV-7)
- [x] T016 [US1] **0 opacity classes; grid-cols values used are only 2 and 3.** Confirm no `opacity-*` class and no new column value were introduced — the owner explicitly approved rejecting `opacity-80` and keeping `lg:grid-cols-3` (research.md D-002, plan.md FR-007 proposal)
- [x] T017 [US1] Run `npm run build` and confirm it is clean
- [x] T018 [US1] **All 12 titles present in exact expected byte order: 7 projects then 5 labs; all four headings present.** Verify in the built output that all 12 cards render, **7 in the projects group and 5 in the labs group**, projects first, with order inside each group matching `data/projects.ts` per [quickstart.md](./quickstart.md) Step 3 (SC-001)
- [x] T019 [US1] **PASS — zero added AND zero removed; inventory byte-identical.** Run the **CLASS-INVENTORY DIFF** against `<BASELINE>/class-inventory.before.txt` and confirm **zero added lines** — every class used already existed (SC-003 / FR-006 / contract INV-8)
- [x] T020 [US1] **Confirmed — only `components/Projects.tsx`.** Run `git status --porcelain` and confirm **only** `components/Projects.tsx` is modified — no change to `index.html`, `data/`, `types.ts`, `App.tsx`, another component, `vite.config.ts`, or `.github/` (SC-004 / FR-014)
- [ ] T021 [US1] ⚠️ **PARTIAL — the planned check does not work and was replaced by source inspection. Grepping the built bundle cannot verify suppression, because `heading="Labs & Practice"` is a literal JSX prop compiled in whether or not it renders. Probe run and reverted (md5 match). Guard verified by inspection: `ProjectGroup` returns `null` on empty. Rendered behaviour unconfirmed without a browser.** Exercise the empty-group path (FR-004): temporarily narrow the lab filter in `components/Projects.tsx` so it matches nothing, build, confirm the "Labs & Practice" sub-heading disappears entirely with no empty container or stray gap, then revert the filter

**Checkpoint**: US1 complete and independently shippable — the grouping, the main value, is in.

---

## Phase 4: User Story 2 - Practice collections communicate scale (Priority: P2)

**Goal**: Lab cards state how many labs they contain.

**Independent Test**: Each lab card shows its count in plain language; project cards show none.

- [x] T022 [US2] In `components/Projects.tsx`, render the lab count on lab cards in prose, e.g. "20 hands-on labs", styled `text-xs font-mono text-accent` — the existing tag-chip text treatment without the chip background (FR-009)
- [x] T023 [US2] **Implemented as `tier === 'secondary' && typeof labCount === 'number' && labCount > 0 ? … : null` — the explicit `> 0` avoids React rendering a bare "0".** In `components/Projects.tsx`, guard the count so it renders only when `labCount` is present **and greater than zero** — absent or zero renders nothing, never "undefined labs" or "0 hands-on labs" (FR-010 / contract INV-6)
- [x] T024 [US2] Run `npm run build` and confirm it is clean
- [ ] T025 [US2] ⚠️ **PARTIAL — verified by source + data inference, not by observing rendered output. The guard is tier-gated and `> 0`; `tier="secondary"` is passed only to the labs group; and all 5 labs carry labCount 20/28/29/30/4 while no project carries the field. A bundle grep cannot count rendered instances. Direct confirmation needs a browser.** Verify in the built output that exactly **5** lab counts render (20, 28, 29, 30, 4) and **0** appear on project cards (SC-005)
- [ ] T026 [US2] ⛔ **NOT DONE — skipped deliberately. It requires temporarily editing `data/projects.ts`, an out-of-scope file, and the bundle-grep it relies on cannot distinguish rendered from compiled-in (same flaw as T021). The guard is verified by inspection instead, so the risk of editing protected content was not worth taking.** Exercise the negative path: temporarily delete `labCount` from one lab in `data/projects.ts`, build, confirm that card renders no count line and no gap, then **revert `data/projects.ts` and confirm it is unmodified in `git status`** — `data/` is out of scope and must end the feature untouched
- [x] T027 [US2] **PASS — still zero added, zero removed.** Re-run the **CLASS-INVENTORY DIFF** and confirm still zero added lines

**Checkpoint**: Lab counts render; the practice group now carries concrete evidence of volume.

---

## Phase 5: User Story 3 - Cards read as scannable one-liners (Priority: P3)

**Goal**: Card bodies show the short summary, not the long description.

**Independent Test**: Every card body is a single short line and is the item's own summary.

- [x] T028 [US3] In `components/Projects.tsx`, change the card body expression from `project.description` to `project.summary`, keeping the surrounding `<p>` and its classes (`leading-relaxed mb-6 flex-grow font-light`, plus `text-sm` on the lab tier) unchanged (FR-011 / contract field table)
- [x] T029 [US3] Run `npm run build` and confirm it is clean
- [x] T030 [US3] **Verified at source, which is conclusive here: `project.description` now has 0 references in the component and `project.summary` has 1. (A bundle grep would prove nothing — both fields ship in the data.) Card-height consistency still needs a browser.** Verify in the built output that all 12 cards show summaries and that no card body renders a long `description` string (SC-006), and confirm card heights stay visually consistent within each group with no card collapsing to a sliver

**Checkpoint**: All three user stories complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T031 ⚠️ **PARTIAL — Steps 1, 2, 3, 7, 8 pass; Steps 4, 5, 6, 9 need a browser.** Run the full validation sequence in [quickstart.md](./quickstart.md) Steps 1–8 and confirm SC-001 through SC-009 are satisfied
- [x] T032 **`id="projects"` confirmed on the outer `<section>`, untouched.** Verify the `#projects` anchor still resolves: `id="projects"` remains on the outer `<section>` in `components/Projects.tsx` and the navbar "Projects" link still scrolls there (SC-009 / contract INV-1)
- [x] T033 **297,713 → 298,864 B = +1,151 B, slightly over the ~1 kB trigger, so investigated: the growth is the new component code (TIERS map plus two components), and there is no offsetting shrink because `description` still ships in `data/projects.ts` even though it is no longer rendered. Explained, not ignored.** Check bundle size in `dist/assets/` against `<BASELINE>/bundle.js.before`: bodies moved from long `description` to short `summary`, so expect it to hold steady or shrink. Investigate growth beyond ~1 kB
- [ ] T034 ⛔ **NOT DONE — no browser and no baseline screenshots (T007); requires the owner.** Run `npm run preview` and compare against `<BASELINE>/desktop.before.png` and `<BASELINE>/mobile.before.png`: the **work section** should show the two intended labelled groups with visibly lighter lab cards, while **the other seven sections, the palette, the fonts, and the page's spacing rhythm must be identical** (FR-012 / SC-002)
- [ ] T035 ⛔ **NOT DONE — needs a browser; this is the check the owner should prioritise.** Run the FR-008 legibility and operability check from [quickstart.md](./quickstart.md) Step 9: lab body text readable, lab titles clearly headings, every lab link clickable at mobile width, and lab cards' 6–7 tags wrapping without crushing the card (SC-008)
- [ ] T036 ⛔ **NOT DONE — needs a browser.** Inspect the two labs that have **no links at all** — `AWS Hands-On Labs` and `Azure DevOps Labs` (research.md D-004) — and confirm their action row reads as deliberate rather than as a failed render. If the empty row leaves an odd gap, **report it rather than silently restyling**
- [x] T037 **Confirmed: `M components/Projects.tsx` only, plus `.specify/feature.json` (spec tooling) and untracked `specs/`.** Run `git status --porcelain` and confirm exactly one source file changed: `M components/Projects.tsx`, plus the `specs/` additions. Nothing else
- [ ] T038 Commit on `feat/projects-grouping` with a message describing the grouping, the heading change, and the summary switch; do not commit `<BASELINE>` artifacts or `dist/`. **Requires owner approval.**
- [ ] T039 Push the branch and confirm the run of `.github/workflows/deploy.yml` is green — the authoritative build, since CI pins Node 20 while local verification used Node 24. **Requires owner approval.**
- [ ] T040 Confirm with the owner before merging `feat/projects-grouping` into `main`, because that merge triggers `.github/workflows/deploy.yml` and deploys to production with no further gate (FR-017)
- [x] T041 Report the two out-of-scope findings to the owner: (a) research.md D-003 — every lab summary already spells its count out in words, so the numeral restates it on all 5 cards; fixing it properly means editing summary copy in `data/`, which this feature must not touch; (b) the feature-001 lockfile reproducibility finding remains open

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1. **BLOCKS all user stories** — FR-016 requires
  the baseline, and T005's class inventory is the only thing that makes SC-003 checkable.
- **US1 (Phase 3)**: Depends on Phase 2.
- **US2 (Phase 4)**: Depends on US1 — the lab count renders inside the lab tier that US1 creates.
- **US3 (Phase 5)**: Depends on US1 — the body expression lives in the shared card renderer that
  US1 extracts. Independent of US2.
- **Polish (Phase 6)**: Depends on all three stories.

### Within-Story Dependencies

Every task from T008 to T030 edits the **same file**, `components/Projects.tsx`, so the whole
implementation is strictly sequential: T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015 →
T016 → T017 → … → T028 → T029 → T030.

T010 (extract the single card renderer) must precede T012/T013, since rendering two groups
without it would duplicate the card markup and violate contract INV-2.

### Parallel Opportunities

- **T005 and T006** — different reads against the same untouched `dist/` and `components/`.

**That is the only parallelism in this feature.** Every implementation task edits one file, and
every verification task depends on a build of that file. Marking any of them `[P]` would be
wrong and would invite conflicting edits.

---

## Implementation Strategy

### MVP scope

**Phase 1 + Phase 2 + Phase 3 (US1)** — 21 tasks. Delivers the entire point of the feature: a
recruiter can tell substantial work from practice at a glance. Independently shippable, and
satisfies SC-001, SC-002, SC-003, and SC-004.

### Incremental delivery

1. Setup + Foundational → baseline and class inventory captured, editing unblocked
2. US1 → two labelled groups, labs visually secondary → verify → shippable (MVP)
3. US2 → lab counts → verify → shippable
4. US3 → summary bodies → verify → shippable
5. Polish → full quickstart, visual comparison, then owner-approved commit, push, merge

### Notes

- **The class-inventory diff (T019, T027) is the load-bearing check.** For a visual feature,
  "no new colours, fonts, or spacing values" is otherwise an assertion of taste. The diff makes
  it a mechanical pass/fail, and it is re-run after US2 because that story adds new markup.
- **T016 exists to protect two approved rejections.** The owner specifically approved keeping
  `lg:grid-cols-3` and rejecting `opacity-80`; both are exactly the shortcuts an implementer
  would reach for when told "make it denser and lighter", so they get their own check.
- **T021 and T026 deliberately break things and revert them.** FR-004's empty-group path and
  FR-010's absent-count path are not exercised by real data, so the only way to verify them is
  to induce the condition. T026 additionally re-asserts that `data/` ends up untouched, since it
  temporarily edits an out-of-scope file.
- **T036 asks for a report, not a fix.** Two lab cards genuinely have no links; if that looks
  wrong it is a design question for the owner, not something to quietly restyle inside a feature
  whose whole premise is bounded visual change.
- T038–T040 involve committing, pushing, and deploying to production and require explicit owner
  approval.
