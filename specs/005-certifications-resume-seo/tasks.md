---
description: "Task list for Certifications, Resume Link & Link Previews"
---

# Tasks: Certifications, Resume Link & Link Previews

**Input**: Design documents from `specs/005-certifications-resume-seo/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/certifications-section-contract.md](./contracts/certifications-section-contract.md), [contracts/metadata-contract.md](./contracts/metadata-contract.md), [quickstart.md](./quickstart.md)

**Approvals**: ✅ All three granted 2026-08-10. **A** — the "In progress" chip as proposed. **B** — no
expert-tier emphasis; `tier` renders nothing. **C** — nav entry added, **and if it crowds at
768–900px the finding is reported, not worked around**.

**Tests**: No test tasks. The spec did not request them and the project has no test suite, linter, or
visual-regression harness; Principle V and FR-024 forbid adding one. Verification is a clean build,
the **repaired** class-inventory diff, render/link counts on built output, and manual browser checks.

**Organization**: By user story, in priority order (US1 and US2 are both P1; US3 is P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 (Resume), US2 (Certifications), US3 (Link previews)
- Include exact file paths in descriptions

## Conventions

- `<BASELINE>` = `C:\Users\Pc\AppData\Local\Temp\claude\e--hassan-el-bahnasy-portfolio\2429c9d8-0af8-4e08-abeb-47ae3259d5d8\scratchpad\baseline-005\`
- "Build is clean" = `npm run build` exits 0 **and** prints zero warning lines.
- **CLASS-INVENTORY DIFF** = the **repaired** command in [quickstart.md](./quickstart.md) Step 0/3.
  Baseline is **251 tokens**.

> ⚠️ **Two things that will look like bugs and are not.**
> 1. **T009 ends with a FAILING build.** `resumeUrl` is required, so the aggregate cannot satisfy
>    `Config` until `data/site.ts` supplies it. That is the mechanism stopping another dead CV link.
>    **Do not resolve it by making the field optional** (research.md D-003).
> 2. **The class-inventory diff is noisier than in features 003–004.** The repaired method captures
>    prose and identifiers as well as classes. Inspect every added line; only **design values** are
>    failures (research.md D-001).

---

## Phase 1: Setup

- [x] T001 In the repo root `e:\hassan-el-bahnasy-portfolio`, confirm `git branch --show-current` reports `feat/certifications-and-resume` and NOT `main`; abort if on `main`, because merging to `main` publishes to production automatically (FR-028)
- [x] T002 Record the pre-change `git status --porcelain` to `<BASELINE>/git-status.before.txt`
- [x] T003 Record `node --version` and `npm --version` to `<BASELINE>/toolchain.txt`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Capture the baseline required by FR-027, including the **repaired** class inventory that
is the only thing making SC-006 checkable.

**⚠️ CRITICAL**: No source file may be modified until T004–T008 are complete.

- [x] T004 **Clean, 0 warnings; bundle 303,220 B.** Run `npm run build`, save the log to `<BASELINE>/build-log.before.txt`, confirm zero warnings, and copy `dist/assets/index-*.js` to `<BASELINE>/bundle.js.before` with its byte size recorded
- [x] T005 [P] **Captured; md5 matched before any edit.** Copy the **source** `index.html` to `<BASELINE>/index.html.source.before` — this is the file the metadata diff in T038 compares against, and it must be captured before any edit
- [x] T006 [P] **251 tokens; `px-3`, `border-slate-800`, `lg:grid-cols-3` all present — the three the old methods missed.** Build the class inventory to `<BASELINE>/class-inventory.before.txt` using the **repaired** command in [quickstart.md](./quickstart.md) Step 0 (union of `className="…"` literals and quoted style-object strings, token-split). Confirm it contains **251 tokens** and that `px-3`, `border-slate-800`, and `lg:grid-cols-3` are all present — the three classes the old methods missed
- [x] T007 [P] **Finding: the certifications array was TREE-SHAKEN out of the baseline bundle (nothing consumed it) — "Cloud Native Associate" and "Microsoft" both absent. 3 of 7 cert names did appear, but from `data/site.ts`'s bio prose, not the array; so those 3 are unreliable probes and the other 4 plus issuer strings were used instead.** Record baseline render facts from `dist/assets/index-*.js`: the 7 credential names are **absent**, "In progress" is **absent**, and `resume.pdf` **is** present (the broken link)
- [ ] T008 ⛔ **NOT DONE — no browser in this environment; requires the owner. This also blocks T045's mid-width comparison and T046.** Run `npm run preview` and capture full-page screenshots to `<BASELINE>/desktop.before.png` (~1440px) and `<BASELINE>/mobile.before.png` (~390px), and a mid-width capture at ~800px for the navbar-crowding comparison in T034

**Checkpoint**: Baseline captured and the verification method proven. Editing may begin.

---

## Phase 3: User Story 1 - The Resume button actually delivers a CV (Priority: P1) 🎯 MVP

**Goal**: Both resume entry points open the CV, with the address held once in the content layer.

**Independent Test**: Click Resume in the desktop navigation and again in the mobile menu; the CV
opens in a new tab both times and the portfolio stays open behind.

- [x] T009 [US1] **Confirmed: build failed with TS2741, "Property 'resumeUrl' is missing … but required in type 'Config'". The field bites exactly as designed.** In `types.ts`, add `resumeUrl: string` to the `Config` interface as a **required** field (data-model.md VR-001). Then run `npm run build` and confirm it **FAILS** because `data/config.tsx`'s aggregate no longer satisfies `Config`. **This red build is the expected outcome and the whole point — do NOT make the field optional** (research.md D-003 / VR-004)
- [x] T010 [US1] In `data/site.ts`, add `'resumeUrl'` to the `Pick<Config, …>` list (VR-002) — without this the field is declared but nothing supplies it
- [x] T011 [US1] In `data/site.ts`, set `resumeUrl: "https://drive.google.com/file/d/1rxHTO_0Vl6wu2eGRiKLt6aJM79-GEDYV/view"` exactly as given in [data-model.md](./data-model.md)
- [x] T012 [US1] **Clean — resolved by supplying the value, not by weakening the type.** Run `npm run build` and confirm it is now clean — the red build from T009 is resolved by supplying the value, not by weakening the type
- [x] T013 [US1] In `components/Navbar.tsx`, change the **desktop** Resume anchor (currently `href="/resume.pdf"`, around line 46) to `href={config.resumeUrl}` with `target="_blank"` and `rel="noreferrer"`. Leave its existing classes untouched (FR-003, FR-004)
- [x] T014 [US1] In `components/Navbar.tsx`, change the **mobile menu** Resume anchor (currently `href="/resume.pdf"`, around line 82) identically. **This is the one most easily missed** — the request referred to a single button, but there are two (research.md, spec Assumptions)
- [x] T015 [US1] **Zero occurrences — the broken link is gone.** Run `grep -rn 'resume.pdf' components/ data/ index.html` and confirm **zero** occurrences remain anywhere (FR-005)
- [x] T016 [US1] **Exactly one occurrence, `data/site.ts:22`. Neither anchor holds a literal URL.** Run `grep -rn 'drive.google.com' components/ data/` and confirm the CV address appears **exactly once**, in `data/site.ts`, and in neither navigation anchor (SC-002 / VR-003)
- [x] T017 [US1] Run `npm run build` and confirm it is clean
- [x] T018 [US1] **Diff completely empty — zero added, zero removed.** Run the **CLASS-INVENTORY DIFF** and confirm no new design value was introduced — the navigation anchors kept their classes, so the only expected additions are the URL string and identifiers

**Checkpoint**: US1 complete and independently shippable. The live 404 on the highest-intent action
is fixed.

---

## Phase 4: User Story 2 - A technical reviewer can see the credentials (Priority: P1)

**Goal**: A certifications section between Skills and Projects rendering all 7 credentials, with the
approved in-progress chip and no tier emphasis.

**Independent Test**: All 7 appear with name, issuer and year in content order; 5 link out; 2 are
non-interactive; the 2 in-progress ones are identifiable at a glance.

- [x] T019 [US2] Create `components/Certifications.tsx` importing `certifications` from `../data/config` and the `Certification` type from `../types`. No credential text may be hardcoded (FR-008 / contract INV-6)
- [x] T020 [US2] In `components/Certifications.tsx`, build the section shell with `id="certifications"` and `className="py-24 bg-primary"` — **`bg-primary`, matching Projects below, NOT Skills' `bg-secondary/30`** (research.md D-005 / contract). Then the container `container mx-auto px-6`
- [x] T021 [US2] In `components/Certifications.tsx`, add the centred header block copied verbatim from `components/Skills.tsx`: wrapper `text-center mb-16`, eyebrow `text-accent font-mono text-xl mb-2` reading "Certifications", heading `text-3xl md:text-5xl font-bold text-white font-display`, supporting line `text-slate-400 mt-4 max-w-2xl mx-auto` (FR-007)
- [x] T022 [US2] In `components/Certifications.tsx`, add the grid `grid md:grid-cols-2 lg:grid-cols-3 gap-6` — **Projects' column shape, not Skills' `lg:grid-cols-5`**, because credential cards are text-heavy (research.md D-004)
- [x] T023 [US2] In `components/Certifications.tsx`, render the card: `bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-accent/50 transition-all group`, with the name in `text-slate-200 font-medium font-display` and issuer/year in `text-slate-400 text-sm font-light` (FR-009 / contract class table)
- [x] T024 [US2] In `components/Certifications.tsx`, map credentials in **array order** — no sorting by status, tier, or year (FR-015 / VR-005)
- [x] T025 [US2] **Two full class literals, `CARD_LINKED` and `CARD_PLAIN`; the plain one omits `hover:border-accent/50` so an unclickable card offers no hover affordance.** In `components/Certifications.tsx`, render a credential **with** `credentialUrl` as a link opening in a new tab with `rel="noreferrer"`; render one **without** as non-interactive content with no anchor, no dead click target, and no hover affordance implying one. **Key off `credentialUrl`'s presence, NOT off `status`** — they partition identically today but are independent rules (FR-010, FR-011 / VR-006, VR-007)
- [x] T026 [US2] **Rendered as a `<span>` inside a `mt-4` wrapper — a block-level element would have stretched the "chip" into a full-width bar, and `inline-block` is not in the inventory.** In `components/Certifications.tsx`, add the approved in-progress chip reading "In progress" with `text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10`, shown **only** when `status === 'in-progress'`. Completed cards show nothing in its place. **Not `text-accent`** — an accent chip would make unfinished credentials read as more important than finished ones (FR-012, decision A)
- [x] T027 [US2] **`tier` is never read in the component; the union stays intact so `foundational` cannot break it.** In `components/Certifications.tsx`, confirm `tier` drives **nothing** — no border, colour, or size varies by tier (decision B approved as recommended-against / contract INV-8b). Also confirm the component does not assume only two tiers exist, since `foundational` is legal but unused (VR-009)
- [x] T028 [US2] Run `npm run build` and confirm it is clean
- [x] T029 [US2] In `App.tsx`, import `Certifications` and render `<Certifications />` between `<Skills />` and `<Projects />`. **Exactly one import line and one element line** — nothing else in the file may change (contract INV-9, INV-10 / FR-026)
- [x] T030 [US2] **`--numstat` reports exactly `2 0 App.tsx`. Section order now Navbar → Hero → About → Experience → Skills → Certifications → Projects → Contact → Footer.** Run `git diff App.tsx` and confirm the diff is exactly those two added lines, and that the other seven section elements keep their original relative order (SC-009)
- [x] T031 [US2] **navItems now 6 entries, Certifications 4th — matching page order.** In `data/site.ts`, insert `{ name: "Certifications", href: "#certifications" }` into `navItems` **between the Skills and Projects entries**, so navigation order matches page order (FR-029, decision C / VR-010)
- [x] T032 [US2] Run `npm run build` and confirm it is clean
- [x] T033 [US2] **All 5 reliable probes now present (they were absent at baseline because the array was tree-shaken), plus "In progress" and "Certifications"; 5 `credentialUrl` values in the data.** Verify in the built output that all 7 credential names are present, plus "Certifications" and "In progress"; that exactly **5** `credentialUrl` values appear; and that the 7 names occur in the order listed in [data-model.md](./data-model.md)'s inventory table (SC-003, SC-004)
- [x] T034 [US2] **PASS. One added inventory line: `in-progress` — the status *string literal* from `cert.status === 'in-progress'`, not a CSS class. Exactly the noise the repaired method was expected to produce. Per-class assertion passed for all 37 hyphenated classes; `container` initially reported missing, but that was my assertion script's filter (it requires a `-`, `:` or `/` in the token) — `container` is used in 8 components including this one.** Run the **CLASS-INVENTORY DIFF** and confirm **zero new design values**. Cross-check the exact list: every class in the contract's class table must already appear in `<BASELINE>/class-inventory.before.txt` (SC-006 / contract INV-8)
- [x] T035 [US2] **Confirmed — `data/certifications.ts` unmodified, read only.** Run `git status --porcelain` and confirm no file outside the six permitted has changed — in particular `data/certifications.ts` must be **read but not edited** (FR-022 / data-model.md)

**Checkpoint**: Both P1 stories complete. Seven previously-invisible credentials now render.

---

## Phase 5: User Story 3 - Sharing the portfolio produces a real preview (Priority: P2)

**Goal**: Page metadata so search engines and preview services find a title and description.

**Independent Test**: A link-preview inspector finds a title, description, type, and canonical URL.

- [x] T036 [US3] In `index.html`, insert all metadata **immediately after the `<title>` line and before the `<!-- Tailwind via CDN … -->` comment**. Touch nothing from that comment downwards (research.md D-007 / metadata contract)
- [x] T037 [US3] In `index.html`, add the eight tags from [contracts/metadata-contract.md](./contracts/metadata-contract.md): `description`, `og:title`, `og:description`, `og:type` (`website`), `og:url` (`https://bahnasy2001.github.io/hassanbahnasy/` — the **lowercase** form, verified live in feature 001), `twitter:card` (**`summary`**, not `summary_large_image`, because there is no image), `twitter:title`, `twitter:description`. Title and description values must agree across the og and twitter copies (INV-4)
- [x] T038 [US3] **Diff is `6a7,21`: 15 added lines, 0 removed, all above the CDN comment. All six protected items byte-identical (`tailwind.config`, CDN tag, Google Fonts, scrollbar block, `<title>`, entry script).** Leave `<title>` **unchanged** — it already names the owner and role, so it is not generic (FR-019). Then run `diff <BASELINE>/index.html.source.before index.html` and confirm the diff contains **only additions**, all above the Tailwind CDN comment, and that the `tailwind.config` block, `<style>` block, CDN tag, and Google Fonts import are byte-identical (FR-020 / metadata contract INV-1, INV-2)
- [x] T039 [US3] **Clean; `dist/index.html` carries 7 og/twitter tags plus the description.** Run `npm run build` and confirm it is clean, and that `dist/index.html` carries the new tags

**Checkpoint**: All three user stories complete.

---

## Phase 6: Polish, Browser Verification & Cross-Cutting Concerns

**Most of this phase needs a browser.** The build and the inventory diff say nothing about whether the
resume links work, whether the chip reads correctly, or whether the navbar crowds.

- [ ] T040 ⛔ **NOT DONE — needs a browser. Verified at source instead: zero `resume.pdf`, one CV address in `data/site.ts`, both anchors read `config.resumeUrl` with `target="_blank" rel="noreferrer"`.** Run `npm run preview` and click Resume in the **desktop** navigation, then again in the **mobile** menu. Both must open the CV in a new tab with the portfolio still open behind — 2 of 2, up from 0 of 2 (SC-001)
- [ ] T041 ⚠️ **PARTIAL — verified in the built bundle and data, not in the browser: 7 entries, array order preserved by construction (no sort).** In the browser, confirm the certifications section renders **7** cards in order: AZ-305 → AZ-400 → CKA → AZ-204 → AZ-104 → AWS SAA → KCNA, each showing name, issuer and year (SC-003)
- [ ] T042 ⚠️ **PARTIAL — data confirms 5 with `credentialUrl` and 2 without, and the guard keys off that field; the hover-affordance check needs a browser.** In the browser, confirm **5** cards link out and open in new tabs (AZ-305, AZ-204, AZ-104, AWS SAA, KCNA) and **2** are not links (AZ-400, CKA). Hover both non-links and confirm no click target and no hover affordance implying one (SC-004 / FR-011)
- [ ] T043 ⛔ **NOT DONE — needs a browser. This is the check the owner should prioritise: whether the chip reads as "not yet" rather than as an error.** In the browser, confirm AZ-400 and CKA carry the "In progress" chip and the other five do not, that the two are identifiable without reading closely, and that the chip does not read as an error or disabled state (SC-005 / FR-014)
- [x] T044 **Verified at source, which is conclusive here: `tier` is never read in `Certifications.tsx`, so no tier-driven styling exists to conflict.** In the browser, confirm AZ-400 — which is both expert-tier and in-progress — carries **no** competing tier emphasis, per approved decision B (contract INV-8b)
- [ ] T045 ⛔ **NOT DONE — needs a browser, and there is no mid-width baseline either (T008 blocked). THE OWNER MUST RUN THIS. navItems is now 6 entries plus the Resume button, and "Certifications" is the longest label. Per the owner's instruction, if it crowds: report, do not work around.** **Navbar crowding check at 768–900px.** Compare against the ~800px baseline capture from T008. If the six links plus the Resume button crowd, wrap, or overlap: **REPORT IT AND STOP. Do not adjust the layout, shorten the label, or hide it responsively** — the owner's explicit instruction is that they will decide whether to drop the entry (FR-029 / SC-011)
- [ ] T046 ⛔ **NOT DONE — no browser and no baseline screenshots (T008).** Compare against `<BASELINE>/desktop.before.png` and `<BASELINE>/mobile.before.png`: every section other than the new one must be visually identical, with palette, fonts and spacing rhythm unchanged (SC-009 / FR-026)
- [ ] T047 ⛔ **NOT DONE — needs a browser. Worth a close look: this is the one deliberate departure from "reuse the Skills wrapper".** Inspect the **Skills → Certifications → Projects** boundary specifically. Certifications shares `bg-primary` with Projects by design (research.md D-005), so confirm the two still read as separate sections rather than one long block. If they merge, that is a finding to report — the fallback is one class
- [ ] T048 ⛔ **NOT DONE — needs network and a preview inspector. Tags confirmed present in `dist/index.html`.** Paste the site URL into a link-preview inspector and confirm a title, description, type, and canonical URL are found where there were none (SC-007). **Expect a text-only preview** — no `og:image` was requested and none exists; that is the known limitation, not a bug
- [x] T049 **303,220 → 306,460 B = +3,240 B. Accounted for: the new component plus the certifications array, which was previously tree-shaken out entirely and now ships because something finally consumes it.** Check bundle size in `dist/assets/` against `<BASELINE>/bundle.js.before` and record the delta; growth is expected from the new component, but an unexplained jump warrants investigation
- [x] T050 **Confirmed exactly six: `M types.ts`, `M data/site.ts`, `M components/Navbar.tsx`, `M App.tsx`, `M index.html`, `?? components/Certifications.tsx`. Nothing else.** Run `git status --porcelain` and confirm exactly six paths changed: `M types.ts`, `M data/site.ts`, `M components/Navbar.tsx`, `M App.tsx`, `M index.html`, `?? components/Certifications.tsx`, plus `specs/`. Nothing else (SC-010)
- [ ] T051 ⛔ **NOT DONE — awaiting owner approval.** Commit on `feat/certifications-and-resume` with a message covering the three changes; do not commit `<BASELINE>` artifacts or `dist/`. **Requires owner approval.**
- [ ] T052 Push the branch and confirm the run of `.github/workflows/deploy.yml` is green — the authoritative build, since CI pins Node 20 while local verification used Node 24. **Requires owner approval.**
- [ ] T053 Confirm with the owner before merging into `main`, because that merge deploys to production with no further gate (FR-028)
- [x] T054 Report the standing findings: (a) link previews are text-only for want of an `og:image` and a suitable asset; (b) `description` is dead weight on all 12 project items, unrendered since feature 003; (c) feature 003's lab-count/summary redundancy; (d) feature 001's lockfile reproducibility issue; (e) Principle I's wording lists "the order of sections in `App.tsx`" as protected and that has now been changed once with approval — worth revisiting if section insertions become routine

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1. **BLOCKS all stories** — FR-027 requires the
  baseline, and T006's repaired inventory is the only thing making SC-006 checkable. T005 in
  particular must happen before any `index.html` edit or T038 has nothing to diff against.
- **US1 (Phase 3)**: Depends on Phase 2 only.
- **US2 (Phase 4)**: Depends on Phase 2. Shares `data/site.ts` with US1, so it must follow US1 rather
  than run beside it.
- **US3 (Phase 5)**: Depends on Phase 2 only. Touches **only** `index.html`, so it is genuinely
  independent of both P1 stories.
- **Polish (Phase 6)**: Depends on all three stories.

### Within-Story Dependencies

- **US1**: T009 → T010 → T011 → T012 (the red build must be created before it is resolved) → T013 →
  T014 (same file, `Navbar.tsx`) → T015–T018 verify.
- **US2**: T019 → … → T027 all build up `Certifications.tsx` and are sequential → T028 → T029 → T030
  (`App.tsx`) → T031 (`data/site.ts`) → T032–T035 verify.
- **US3**: T036 → T037 → T038 (same file, `index.html`) → T039.

### Parallel Opportunities

- **T005, T006, T007** — three different reads against untouched sources and `dist/`.
- **Across stories**: US3 touches only `index.html`, which no other story goes near, so a second
  person could take Phase 5 at any time after Phase 2. **US1 and US2 cannot be parallelised** — both
  edit `data/site.ts` (resumeUrl and navItems).

Everything else is sequential: each story builds up one file at a time, and verification tasks share
`dist/`.

---

## Implementation Strategy

### MVP scope

**Phase 1 + Phase 2 + Phase 3 (US1)** — 18 tasks. Fixes a live 404 on the single highest-intent
action on the page, and moves the URL into the content layer so it cannot silently break again.
Smallest change with the largest immediate return in the whole feature set.

### Incremental delivery

1. Setup + Foundational → baseline captured, repaired inventory proven
2. US1 → the Resume button works from both entry points → verify → **shippable (MVP)**
3. US2 → 7 credentials visible, nav entry added → verify → shippable
4. US3 → link previews → verify → shippable
5. Polish → browser verification, then owner-approved commit, push, merge

### Notes

- **T009 is meant to fail, and T012 proves it was resolved correctly.** Making `resumeUrl` optional
  would produce a green build and reintroduce exactly the bug this feature fixes.
- **T014 exists because the request undercounted.** There are two Resume anchors, not one; the mobile
  one is easy to miss and would leave mobile visitors on a 404.
- **T034 cross-checks the inventory two ways** — the diff, plus an exact per-class assertion against
  the baseline. The diff alone is noisier since the method was repaired, so the exact list is what
  makes SC-006 a hard gate.
- **T045 is an instruction to stop, not to solve.** If the navbar crowds, the owner decides. Adjusting
  the layout, abbreviating the label, or hiding it responsively are all explicitly out of bounds.
- **T047 mirrors that stance** for the section-boundary risk: report rather than quietly re-style.
- T051–T053 involve committing, pushing, and deploying to production and require explicit owner
  approval.
