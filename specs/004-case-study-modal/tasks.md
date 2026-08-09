---
description: "Task list for Case Study Modal"
---

# Tasks: Case Study Modal

**Input**: Design documents from `specs/004-case-study-modal/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/case-study-dialog-contract.md](./contracts/case-study-dialog-contract.md), [quickstart.md](./quickstart.md)

**Approvals**: ✅ Q1 granted 2026-08-09 — Option A, exactly two behavioural classes (`max-h-full`,
`overflow-y-auto`). `cursor-pointer` offered and **declined**.

**Tests**: No test tasks. The spec did not request them and the project has no test suite, linter,
or visual-regression harness; research.md D-005 re-confirmed Principle V even against three dialog
libraries that would have supplied focus trapping. Verification is a clean build, a class-inventory
diff, render-string checks on built output, and — carrying most of the weight here — **manual
interaction testing**.

**Organization**: By user story, in priority order. US1 and US3 are **both P1** (spec ranks
dismissal equal to the popup itself), so US3 follows US1 only because it modifies the component US1
creates.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3
- Include exact file paths in descriptions

## Conventions

- `<BASELINE>` = `C:\Users\Pc\AppData\Local\Temp\claude\e--hassan-el-bahnasy-portfolio\2429c9d8-0af8-4e08-abeb-47ae3259d5d8\scratchpad\baseline-004\`
- Repository paths are relative to `e:\hassan-el-bahnasy-portfolio`.
- "Build is clean" = `npm run build` exits 0 **and** prints zero warning lines.
- **CLASS-INVENTORY DIFF** = the grep in [quickstart.md](./quickstart.md) Step 0/3. The pattern is
  **wider than feature 003's** — it also captures `max-h-*`, `overflow-*`, and `z-*`, which is what
  makes the two-new-class claim checkable. **Expected result: exactly two added lines.**

> ⚠️ **The build proves almost nothing here.** This feature is mostly interaction: three dismissal
> paths, an inside-click guard, focus management, a scroll lock that must not leak, and mobile
> reachability. None of that is mechanically verifiable. Phases 4 and 6 are where it actually gets
> validated, and they need a browser and a keyboard.

---

## Phase 1: Setup

- [x] T001 In the repo root `e:\hassan-el-bahnasy-portfolio`, confirm `git branch --show-current` reports `feat/project-popups` and NOT `main`; abort if on `main`, because merging to `main` publishes to production automatically (FR-026)
- [x] T002 Record the pre-change `git status --porcelain` to `<BASELINE>/git-status.before.txt`
- [x] T003 Record `node --version` and `npm --version` to `<BASELINE>/toolchain.txt`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Baseline capture, plus the type and content changes. The content change sits here
rather than in a story phase because it is a prerequisite for **two** stories: US1's 8-card
affordance count depends on the labs item gaining its three case-study fields, and US2's links block
depends on the `links` data.

**⚠️ CRITICAL**: No component may be touched until T004–T007 are complete.

- [x] T004 **Clean, 0 warnings; bundle 298,864 B.** Run `npm run build`, save the log to `<BASELINE>/build-log.before.txt`, confirm zero warnings, and copy `dist/assets/index-*.js` to `<BASELINE>/bundle.js.before` with its byte size recorded
- [x] T005 [P] **98 classes captured; `max-h-*` and `overflow-y-*` both confirmed at zero.** Build the pre-change class inventory from `components/` to `<BASELINE>/class-inventory.before.txt` using the **wide** pattern in [quickstart.md](./quickstart.md) Step 0 — it must include `max-[wh]-*`, `overflow-*`, and `z-*`, or the two-new-class check cannot work
- [x] T006 [P] **12 titles present; "Read case study" and "Repositories" confirmed absent.** Record baseline render facts from `dist/assets/index-*.js`: 12 card titles present, and the strings "Read case study", "Problem", "Approach", "Impact", "Repositories" **absent**
- [ ] T007 ⛔ **NOT DONE — no browser in this environment; requires the owner.** Run `npm run preview` and capture full-page screenshots to `<BASELINE>/desktop.before.png` (~1440px) and `<BASELINE>/mobile.before.png` (~390px)
- [x] T008 In `types.ts`, add `links?: { label: string; url: string }[]` to the `Project` interface, as an inline object type per data-model.md. Leave every existing field unchanged (FR-001, FR-002)
- [x] T009 **Green as predicted — no red build, because the field is optional. Recorded: the type is not carrying the "all three" rule.** Run `npm run build` and confirm it is clean — the new field is optional, so this will **not** fail. Note for the record: unlike feature 002, the type cannot enforce the "all three case-study fields" rule, so no red build is expected here (research.md D-006)
- [x] T010 **Removed; `repoUrl` count in the file went 10 → 9.** In `data/projects.ts` on the item with slug `individual-labs-early-projects`, **remove** `repoUrl: "https://github.com/Bahnasy2001"` entirely (FR-003)
- [x] T011 In `data/projects.ts` on the same item, add the `links` array with the four entries in the order given in [data-model.md](./data-model.md): SemiColon Registration Pipeline, Jenkins + Terraform + Ansible EC2, Minikube CI/CD Pipeline, LAMP Stack Deployment — labels and URLs exactly as listed (FR-003)
- [x] T012 **All three confirmed byte-exact in the built bundle, straight apostrophes intact.** In `data/projects.ts` on the same item, add `problem`, `approach`, and `impact` **verbatim** from [data-model.md](./data-model.md). Do not reflow, re-punctuate, or replace the straight apostrophes in "there's" and "they're" with typographic ones (FR-004)
- [x] T013 **Diff confirms 9 insertions, 1 deletion, all inside the one entry.** Confirm **no other item** in `data/projects.ts` was changed — diff the file and check only the one entry differs (FR-005)
- [x] T014 **4/4 new URLs present. Correction to my own check: the bare profile URL still appears in the bundle, but its only source is now `data/site.ts` (the GitHub social link) — it is gone from `data/projects.ts`, which is what the requirement asked.** Run `npm run build` and confirm it is clean, then confirm in the built output that all four new repository URLs are present and `"https://github.com/Bahnasy2001"` as a standalone profile URL is **gone**

**Checkpoint**: Type and content ready. 8 items now carry all three case-study fields.

---

## Phase 3: User Story 1 - A reviewer can read the story behind a project (Priority: P1) 🎯 MVP

**Goal**: A "Read case study" affordance on the 8 qualifying cards, opening a dialog with the title
and three labelled sections.

**Independent Test**: Open a project's case study, read all three sections, close it, and find the
page exactly as it was.

- [x] T015 [US1] Create `components/CaseStudyDialog.tsx` accepting `project: Project | null` and `onClose: () => void`, rendering nothing when `project` is null — a single nullable value rather than a boolean plus separate item, so stale content cannot flash on reopen (contract Interface section)
- [x] T016 [US1] In `components/CaseStudyDialog.tsx`, render through `createPortal(…, document.body)` from `react-dom`. **This is required, not stylistic**: cards are `motion.div` with `whileHover={{ y: -10 }}`, whose transform creates a stacking context and containing block that would trap the dialog under the fixed navbar and shrink its `fixed inset-0` backdrop to one card (research.md D-002 / contract INV-1)
- [x] T017 [US1] In `components/CaseStudyDialog.tsx`, build the backdrop with `fixed inset-0 z-50 bg-primary/80 backdrop-blur-md flex items-center justify-center p-6` and the panel with `bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative max-h-full overflow-y-auto` — all existing classes except the two approved additions (contract Class contract)
- [x] T018 [US1] In `components/CaseStudyDialog.tsx`, render the title with `text-2xl font-bold text-white font-display mb-6`, then a `space-y-6` stack of three sections, each a label (`text-accent font-mono text-sm mb-2`) reading "Problem", "Approach", "Impact" in that order plus its body (`text-slate-400 leading-relaxed font-light`) (FR-009)
- [x] T019 [US1] **Placed in a `flex justify-between items-start mb-6` header row rather than absolutely positioned — that composite already exists on the card, and absolute positioning would have needed `m-4`, which is not in the inventory.** In `components/CaseStudyDialog.tsx`, add the close control using the card's existing link-button classes `text-slate-400 hover:text-white transition-colors p-1 bg-white/5 rounded-md hover:bg-accent/20`, positioned top-right, with an accessible label
- [x] T020 [US1] In `components/CaseStudyDialog.tsx`, wrap the dialog in Framer Motion's `AnimatePresence` with an `exit` transition, following the pattern already in `components/Navbar.tsx` lines 62–89. No new animation dependency (FR-019 / contract INV-9)
- [x] T021 [US1] In `components/Projects.tsx`, add state holding the currently-open item (`Project | null`), render `<CaseStudyDialog>` once at the section level, and pass a close handler that resets it to null (FR-012)
- [x] T022 [US1] **Guard extracted as `hasCaseStudy()`; no `cursor-pointer`.** In `components/Projects.tsx`, render a "Read case study" `<button>` at the bottom of the card **only when all three** of `problem`, `approach`, and `impact` are present, styled `text-accent font-mono text-xs hover:text-accentHover transition-colors mt-4`. The type cannot enforce this rule, so the guard is the only thing that does (FR-006, FR-007 / contract INV-4). No `cursor-pointer` — declined by the owner
- [x] T023 [US1] In `components/Projects.tsx`, confirm the repository icon button is **untouched** and still navigates directly — it must not open the dialog (FR- "exactly one popup" / contract INV-10)
- [x] T024 [US1] Run `npm run build` and confirm it is clean
- [x] T025 [US1] **12/12 titles plus all four new strings present.** Verify in the built output that all 12 card titles are present and the strings "Read case study", "Problem", "Approach", "Impact" now appear (SC-001)
- [x] T026 [US1] **PASS — exactly two added lines, `max-h-full` and `overflow-y-auto`, nothing else.** Run the **CLASS-INVENTORY DIFF** and confirm **exactly two** added lines — `max-h-full` and `overflow-y-auto` — and nothing else (SC-009 / FR-024)
- [x] T027 [US1] **Confirmed — exactly the four permitted paths.** Run `git status --porcelain` and confirm only the four permitted paths appear: `M types.ts`, `M data/projects.ts`, `M components/Projects.tsx`, `?? components/CaseStudyDialog.tsx` (SC-010 / FR-021)

**Checkpoint**: US1 shippable — case studies are readable. Dismissal hardening comes next and is
also P1, so **do not ship before Phase 4**.

---

## Phase 4: User Story 3 - Closing the popup never traps the visitor (Priority: P1)

**Goal**: Three independent exits, no accidental closes, no keyboard trap, no leaked scroll lock.

**Independent Test**: Close the dialog three times, once by each method; click five places inside
without it closing; complete a keyboard-only open/read/close with focus restored.

- [x] T028 [US3] In `components/CaseStudyDialog.tsx`, close on the close control's click (FR-013)
- [x] T029 [US3] **Implemented as `event.target === event.currentTarget` — no `stopPropagation`.** In `components/CaseStudyDialog.tsx`, close on backdrop click **only when the event target is the backdrop element itself** — do not rely on `stopPropagation` from the panel, which leaks as soon as the panel gains interactive children or padding is clicked (FR-013, FR-014 / research.md D-003 / contract INV-3)
- [x] T030 [US3] In `components/CaseStudyDialog.tsx`, close on Escape via a `keydown` listener **attached when the dialog opens and removed when it closes** — never bound while closed, never stacked across reopens (FR-013 / research.md D-004 / contract INV-7)
- [x] T031 [US3] In `components/CaseStudyDialog.tsx`, add `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` referencing the title element's id (FR-016 / contract INV-5)
- [x] T032 [US3] **Also fixed a bug the task did not anticipate: `onClose` is held in a ref so the effect depends only on `isOpen`. An inline-arrow `onClose` from the caller would otherwise re-run the effect every render, re-binding the listener and yanking focus back to the first element.** In `components/CaseStudyDialog.tsx`, move focus into the dialog on open, keep Tab cycling within it while open, and return focus to the affordance that opened it on close. Hand-rolled because no dialog library is permitted, which is exactly why T041 verifies it by keyboard rather than by inspection (FR-017 / contract INV-6 / research.md D-005)
- [x] T033 [US3] In `components/CaseStudyDialog.tsx`, set `overflow-hidden` on `document.body` while open and remove it on close **and in the effect's cleanup so it also runs on unmount** — a leaked lock leaves the whole page permanently unscrollable, worse than the problem it solves (FR-015 / research.md D-007 / contract INV-8)
- [x] T034 [US3] Run `npm run build` and confirm it is clean
- [x] T035 [US3] **PASS — still exactly two; `overflow-hidden` correctly did not register as an addition.** Re-run the **CLASS-INVENTORY DIFF** and confirm still exactly two added lines — `overflow-hidden` is applied to `document.body` at runtime and already exists in `components/`, so it must not appear as an addition

**Checkpoint**: The dialog is escapable three ways and safe for keyboard visitors. Both P1 stories
are now complete.

---

## Phase 5: User Story 2 - A reviewer can reach every repository (Priority: P2)

**Goal**: The multi-part item's dialog lists its four named repositories.

**Independent Test**: Open that item's case study; four named links, each opening the right
repository in a new tab.

- [x] T036 [US2] In `components/CaseStudyDialog.tsx`, render a "Repositories" heading (`text-accent font-mono text-sm mb-2`) and a list of `project.links`, each an anchor styled `text-slate-400 hover:text-accent transition-colors`, with `target="_blank"` and `rel="noreferrer"` matching the existing card links (FR-010 / contract INV-11)
- [x] T037 [US2] **Implemented as `links && links.length > 0`.** In `components/CaseStudyDialog.tsx`, omit the heading and the list entirely when `links` is absent **or an empty array** — the two must behave identically, so test length rather than mere presence (FR-011 / data-model.md VR-003)
- [x] T038 [US2] Run `npm run build` and confirm it is clean
- [x] T039 [US2] **"Repositories" plus all 4 labels present.** Verify in the built output that "Repositories" appears and all four link labels are present
- [x] T040 [US2] **PASS — still exactly two.** Re-run the **CLASS-INVENTORY DIFF** and confirm still exactly two added lines

**Checkpoint**: All three user stories complete.

---

## Phase 6: Polish, Interaction Verification & Cross-Cutting Concerns

**This phase is where the feature is actually proven.** Everything above verifies structure; these
verify behaviour, and most need a browser.

- [ ] T041 ⛔ **NOT DONE — needs a browser and keyboard. THIS IS THE ONE TO PRIORITISE: the focus trap is hand-rolled and unverified.** Run the keyboard-only pass from [quickstart.md](./quickstart.md) Step 7: Tab to an affordance, open with Enter/Space, confirm focus lands inside, Tab cycles within the dialog and never reaches the page behind, Escape closes, and focus returns to the affordance (SC-007). **This is the requirement most likely to be quietly wrong**
- [ ] T042 ⛔ **NOT DONE — needs a browser.** Run the dismissal matrix from [quickstart.md](./quickstart.md) Step 6: each of the three exits independently, reopening between tests (SC-003)
- [ ] T043 ⛔ **NOT DONE — needs a browser. Implementation uses `target === currentTarget`, which is the form that should pass, but unverified.** Click **at least 5 different places inside the panel** — title, section label, body prose, blank padding, Repositories heading — and confirm **0 of 5** close the dialog (SC-004)
- [ ] T044 ⛔ **NOT DONE — needs a browser.** Open and close the dialog at least 3 times, re-testing Escape each time, to catch a stale or duplicated key listener (research.md D-004)
- [ ] T045 ⛔ **NOT DONE — needs a browser. Structurally guarded: `project` is the only open state, so stale content has no place to live.** Open one item's dialog, close it, open a **different** item's, and confirm no content is retained from the first (FR-012 / spec US3 scenario 5)
- [ ] T046 ⛔ **NOT DONE — needs a browser. Cleanup is in the effect return, so it runs on close and unmount, but unverified at runtime.** Confirm the scroll lock does not leak: with the dialog closed again, the page scrolls normally, and closing returns the visitor to the same scroll position they opened from (FR-015 / INV-8)
- [ ] T047 ⛔ **NOT DONE — needs a browser. This is what the two approved classes exist for, so it is the second priority after T041.** At ~390px, open **"Individual Labs & Early Projects"** — the longest case study — and confirm every part is reachable, the panel scrolls internally, no content is cut off, no horizontal page scrolling occurs, all three exits still work, and the close control is a comfortable touch target (SC-006)
- [ ] T048 ⚠️ **PARTIAL — verified on the data side, not in the browser: `data/projects.ts` has 12 items, of which `problem`/`approach`/`impact` each appear 8 times, and the render guard requires all three. So 8 affordances and 4 without follows from verified premises, but was not observed rendered.** Count affordances in the browser: exactly **8** cards show "Read case study" — the 7 in Featured Projects plus Individual Labs & Early Projects — and the other **4** labs cards (DevOps Fundamentals, AWS Hands-On, Azure DevOps, GitLab CI) show **none** (SC-002)
- [ ] T049 ⛔ **NOT DONE — needs a browser. All four URLs confirmed present in the built bundle.** Open all **4** repository links from the multi-part item's dialog and confirm each reaches its correct destination in a new tab with the portfolio page unchanged behind (SC-005)
- [ ] T050 ⚠️ **PARTIAL — guard verified at source (`links && links.length > 0`) and only 1 of 12 items has `links`; not observed rendered.** Confirm a project's dialog (no `links`) shows **no** "Repositories" heading and no empty list (FR-011)
- [ ] T051 ⛔ **NOT DONE — no browser and no baseline screenshots (T007).** Compare against `<BASELINE>/desktop.before.png` and `<BASELINE>/mobile.before.png`: 8 cards gain one small accent line, the multi-part labs card **loses its repository icon button** (its `repoUrl` was removed — intended), and everything else including the other seven sections, palette, fonts, and spacing rhythm is identical (FR-012)
- [x] T052 **`id="projects"` confirmed still on the outer `<section>`.** Verify the `#projects` anchor still resolves and the navbar "Projects" link still scrolls to the section
- [x] T053 **298,864 → 303,220 B = +4,356 B. Accounted for: the new dialog component plus ~900 characters of new case-study prose. No unexplained jump.** Check bundle size in `dist/assets/` against `<BASELINE>/bundle.js.before` and record the delta; growth is expected from the new component plus the added prose, but an unexplained jump warrants investigation
- [x] T054 **Confirmed: `M types.ts`, `M data/projects.ts`, `M components/Projects.tsx`, `?? components/CaseStudyDialog.tsx`, plus `specs/` and `.specify/feature.json`. Nothing else.** Run `git status --porcelain` and confirm exactly the four permitted paths changed, plus `specs/`. Nothing else
- [ ] T055 ⛔ **NOT DONE — awaiting owner approval.** Commit on `feat/project-popups` with a message describing the type extension, the content change, and the dialog; do not commit `<BASELINE>` artifacts or `dist/`. **Requires owner approval.**
- [ ] T056 Push the branch and confirm the run of `.github/workflows/deploy.yml` is green — the authoritative build, since CI pins Node 20 while local verification used Node 24. **Requires owner approval.**
- [ ] T057 Confirm with the owner before merging `feat/project-popups` into `main`, because that merge deploys to production with no further gate (FR-026)
- [x] T058 Report the standing out-of-scope findings: (a) `description` is now dead weight on all 12 items — unrendered since feature 003, and the new `approach` text closely echoes it on the multi-part item (data-model.md); (b) feature 003's lab-count/summary redundancy; (c) feature 001's lockfile reproducibility issue

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1. **BLOCKS all stories** — the baseline is required
  by FR-025, and the type plus content changes are prerequisites for two separate stories.
- **US1 (Phase 3)**: Depends on Phase 2 (needs `links` in the type and the labs item's three fields).
- **US3 (Phase 4)**: Depends on US1 — it hardens the component US1 creates. Same priority (P1), so
  **the feature is not shippable after Phase 3 alone**.
- **US2 (Phase 5)**: Depends on Phase 2 for the data and on US1 for the dialog to add a block to.
  Independent of US3.
- **Polish (Phase 6)**: Depends on all three stories.

### Within-Story Dependencies

- **Phase 2**: T004–T007 (baseline) → T008 → T009 → T010 → T011 → T012 → T013 → T014. T008 precedes
  T010–T012 because the type must exist before data is written against it (Principle III).
- **US1**: T015 → T016 → T017 → T018 → T019 → T020 (all one new file), then T021 → T022 → T023 (all
  `Projects.tsx`), then T024–T027 verify.
- **US3**: T028 → … → T033 all edit `CaseStudyDialog.tsx`; strictly sequential.
- **US2**: T036 → T037 (same file) → T038–T040 verify.

### Parallel Opportunities

- **T005 and T006** — different reads against untouched `components/` and `dist/`.

**That is the only parallelism.** Every implementation task edits one of two files, and each file is
edited by a long sequential run. Marking any of them `[P]` would invite conflicting edits.

---

## Implementation Strategy

### MVP scope

**Phases 1 + 2 + 3 + 4** — 35 tasks. Note this MVP spans **two** stories, not one: US1 makes case
studies readable and US3 makes the dialog escapable, and the spec ranks both P1 because an
inescapable overlay makes a reviewer leave the site. Shipping Phase 3 alone would be shipping a
trap.

### Incremental delivery

1. Setup + Foundational → baseline, type, and content ready
2. US1 → readable case studies on 8 cards → verify
3. US3 → three exits, keyboard-safe, no leaked lock → verify → **shippable**
4. US2 → four named repository links → verify → shippable
5. Polish → full interaction verification, then owner-approved commit, push, merge

### Notes

- **The class-inventory diff runs four times** (T026, T035, T040, and within T051's step) and must
  return **exactly two** added lines every time. Re-running it after each phase is what stops a
  convenience class from slipping in late, which is the realistic failure mode once markup grows.
- **T029, T030, and T033 each guard a specific known bug**, not a hypothetical: backdrop handlers
  that fire on inside clicks, Escape listeners that stack across reopens, and scroll locks that
  survive unmount. All three are named in research.md with reasoning.
- **T016 exists because of a verified trap.** The portal is not a style preference — the card's
  `whileHover` transform would otherwise break both `fixed` positioning and `z-50` layering.
- **T009 deliberately expects a green build**, unlike feature 002's equivalent step. Optional fields
  cannot make a missed migration a compile error, so this task's purpose is to record that the type
  system is *not* carrying the "all three" rule — T022's guard is.
- **T041 is the single highest-risk verification.** No dialog library means focus management is
  hand-rolled, so it gets a dedicated keyboard-only pass rather than being assumed from the code.
- T055–T057 involve committing, pushing, and deploying to production and require explicit owner
  approval.
