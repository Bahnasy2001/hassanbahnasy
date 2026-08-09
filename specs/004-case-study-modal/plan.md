# Implementation Plan: Case Study Modal

**Branch**: `feat/project-popups` | **Date**: 2026-08-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-case-study-modal/spec.md`

## Summary

Add an optional named-link set to the item shape, give the multi-part labs item its case-study
content and four named repository links, and render a dismissible case-study dialog from any card
carrying problem, approach, and impact — which is **8 of the 12 cards**.

Phase 0 answered Q1 far more cheaply than the spec feared, and found one structural trap:

1. **Q1 costs exactly two classes.** A full survey of `components/` found every overlay and panel
   primitive already present — `fixed`, `inset-0`, `z-50`, `backdrop-blur-md`, `bg-slate-900`,
   `border-slate-700`, `rounded-2xl`, `shadow-2xl`, `max-w-2xl`, `overflow-hidden`,
   `flex items-center justify-center`. The only genuine gaps are **`max-h-full`** and
   **`overflow-y-auto`**. Neither is a colour, font, or spacing value.
2. **The dialog cannot be nested inside a card.** Each card is a `motion.div` with
   `whileHover={{ y: -10 }}`, so Framer Motion applies a `transform`, which creates a stacking
   context. A dialog rendered inside it would be trapped beneath the fixed navbar and clipped.
   The fix is a portal to `document.body` using `react-dom`, already a dependency.

> ✅ **Q1 APPROVED — 2026-08-09. Implementation is unblocked.** Option A, with exactly the two
> classes enumerated below: `max-h-full` and `overflow-y-auto`. **`cursor-pointer` was offered and
> declined**, so the affordance relies on its accent-colour hover like every other interactive
> element on the page.

## Technical Context

**Language/Version**: TypeScript 5.2 (`noEmit`) + React 18.2, Node v24.18.1 / npm 11.16.0

**Primary Dependencies**: React 18.2, **react-dom 18.2** (already present; supplies the portal),
Vite 5.4.21, **Framer Motion 11** (already used with `AnimatePresence` in the navbar),
lucide-react 0.344, TailwindCSS from CDN. **Nothing added.**

**Storage**: N/A — static content modules

**Testing**: No test suite, linter, or visual-regression harness; Principle V forbids adding one.
Verification is `npm run build`, a class-inventory diff, render counts on built output, and manual
interaction testing (the three dismissal paths, focus, mobile).

**Target Platform**: Static site on GitHub Pages under `/hassanbahnasy/`

**Project Type**: Static single-page web application

**Performance Goals**: No regression. The dialog mounts only while open. Expect the bundle to grow
by roughly the new component plus the added content prose.

**Constraints**: Zero build warnings; only 4 files may change; no new colour, font, or spacing
value; all 12 cards render; the `#projects` anchor keeps working.

**Content reality confirmed in Phase 0**: 12 items — 7 `project`, 5 `lab`. **7 items already carry
problem/approach/impact, and all 7 are the `project` items.** Adding them to
`individual-labs-early-projects` makes **8 cards** show the affordance and 4 show none. That item
currently carries `repoUrl: "https://github.com/Bahnasy2001"` — a profile link, not a repository.

**Scale/Scope**: 3 files modified, 1 file created.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against constitution v1.0.1.

| Principle | Verdict | Basis |
|-----------|---------|-------|
| **I. Visual Preservation (NON-NEGOTIABLE)** | ✅ PASS **by explicit approval**, with Q1 outstanding | Owner explicitly approved this visual change. The `tailwind.config` block, palette, fonts, spacing scale, `App.tsx`, `index.html`, and all other components stay untouched (FR-020, FR-021). The dialog is assembled entirely from existing primitives — its panel reuses About's exact panel classes and its backdrop reuses the navbar's. The only additions are two behavioural utilities, held at the owner's gate as Q1. |
| **II. Data/UI Separation** | ✅ PASS | All case-study prose lives in `data/projects.ts`; the component renders it without embedding any of it. The only hardcoded strings are structural labels — "Problem", "Approach", "Impact", "Repositories", "Read case study" — the same category as the section headings already in components. |
| **III. Type Safety First** | ✅ PASS — **directly exercised** | FR-001 extends `types.ts` **before** data is written against it. The new field is optional, so unlike feature 002 this will not produce a red build — which means the type is doing weaker work here, and the "all three present" rule must be enforced in the render guard rather than by the compiler. Noted as a real limitation, not glossed. |
| **IV. Incremental Safety** | ✅ PASS | On `feat/project-popups`, verified checked out with 003 merged (PR #4). Merge only after a green build. |
| **V. No New Dependencies** | ✅ PASS — **under the most pressure yet** | A modal is the classic excuse to install a dialog library (`@headlessui/react`, `react-modal`, `radix-ui`). All rejected. Portal comes from `react-dom`, animation from Framer Motion's existing `AnimatePresence` pattern, icons from lucide-react. See research.md D-005. |
| **VI. Dual Audience** | ✅ PASS | The dialog is the cleanest expression of this principle so far: technical depth is available on demand behind one affordance, so a business visitor reading summaries is never forced through it, while a technical reviewer gets problem/approach/impact and per-repository links. |

**Gate result**: PASS, conditional on Q1. No violations to justify; Complexity Tracking omitted.

## Q1: the exact new-class list *(APPROVED 2026-08-09)*

**Two classes. Both behavioural. Neither is a colour, font, or spacing value.**

| Class | Why it is needed | Existing alternative? |
|---|---|---|
| `max-h-full` | Caps the panel at the height of its padded viewport container so a long case study cannot run off-screen | None — zero `max-h-*` anywhere in `components/` |
| `overflow-y-auto` | Lets the capped panel scroll its own content | None — zero `overflow-y-*` anywhere |

`max-h-full` is deliberately chosen over an arbitrary value like `max-h-[80vh]`: it is a **named
Tailwind utility**, so it invents no magic number and adds nothing resembling a new spacing value.
Combined with a padded backdrop container it produces the same result.

**Everything else is already in the codebase**, verified by grep with occurrence counts:

| Element | Classes | Source |
|---|---|---|
| Backdrop | `fixed inset-0 z-50 bg-primary/80 backdrop-blur-md flex items-center justify-center p-6` | `fixed`/`z-50`/`bg-primary/80`/`backdrop-blur-md` from `Navbar.tsx`; `inset-0` from `About.tsx`; `flex`(43)/`items-center`(16)/`justify-center`(6)/`p-6` widely used |
| Panel | `bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative` | **`About.tsx`'s panel, verbatim** — plus `max-w-2xl`(3), `w-full`(7), `relative` |
| Close button | `text-slate-400 hover:text-white transition-colors p-1 bg-white/5 rounded-md hover:bg-accent/20` | `Projects.tsx` card link button, verbatim |
| Section labels | `text-accent font-mono text-sm mb-2` | eyebrow pattern from `Navbar`/section headers |
| Body prose | `text-slate-400 leading-relaxed font-light` | `Projects.tsx` card body |
| Dialog title | `text-2xl font-bold text-white font-display mb-6` | sub-heading pattern from feature 003 |
| Section spacing | `space-y-6` | `space-y-*` already used (4) |
| Affordance on card | `text-accent font-mono text-xs hover:text-accentHover transition-colors mt-4` | tag-chip text treatment + existing hover pattern |

**`cursor-pointer` — offered and DECLINED by the owner.** The affordance is a `<button>`, which gets
no pointer cursor by default, so it relies on the accent-colour hover change instead. That matches
how every other interactive element on the page signals itself. **The list stays at two**, and any
third added class is a verification failure (FR-024).

## Project Structure

### Documentation (this feature)

```text
specs/004-case-study-modal/
├── spec.md                              # Feature specification (contains Q1)
├── plan.md                              # This file
├── research.md                          # Phase 0 — 7 decisions
├── data-model.md                        # Phase 1 — the named-link shape + content change
├── contracts/
│   └── case-study-dialog-contract.md    # Phase 1 — props, behaviour, class list, invariants
├── quickstart.md                        # Phase 1 — validation guide
├── checklists/requirements.md           # Spec quality checklist
└── tasks.md                             # Phase 2 (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
.
├── types.ts                          # MODIFY — add optional links?: { label; url }[]
├── data/projects.ts                  # MODIFY — one item: drop repoUrl, add links + 3 fields
├── components/Projects.tsx           # MODIFY — affordance, open/close state, render dialog
├── components/CaseStudyDialog.tsx    # CREATE — the dialog
├── components/*.tsx (8 others)       # UNTOUCHED
├── App.tsx, index.tsx, index.html    # UNTOUCHED — theme block protected
├── data/*.ts (4 others)              # UNTOUCHED
└── .github/workflows/                # UNTOUCHED
```

**Structure Decision**: The dialog is its own component and **portals to `document.body`** via
`createPortal` from `react-dom`. This is forced, not stylistic — see research.md D-002. It also
keeps `App.tsx` out of scope, since no provider or root-level mount point is needed.

## Implementation Sequence

| Step | Story | Change | Gate before proceeding |
|------|-------|--------|------------------------|
| 0 | — | Baseline: build, bundle, class inventory, screenshots | Baseline stored outside repo |
| 1 | — | ~~Obtain Q1 approval~~ | ✅ **Granted 2026-08-09** |
| 2 | US1 | `types.ts`: add optional `links` | Build clean |
| 3 | US2 | `data/projects.ts`: drop `repoUrl`, add 4 links + verbatim problem/approach/impact | Build clean; strings byte-exact |
| 4 | US1 | Create `CaseStudyDialog.tsx` — portal, panel, three sections, links block | Build clean |
| 5 | US3 | Dismissal: close button, backdrop, Escape; inside-click must not close | All three verified independently |
| 6 | US3 | Accessibility: dialog role, labelled by title, focus in on open and restored on close | Keyboard-only pass |
| 7 | US1 | `Projects.tsx`: affordance on cards with all three fields; open/close state | Build clean; 8 affordances, 4 without |
| 8 | — | Full quickstart validation, class-inventory diff, visual comparison | SC-001…SC-010 satisfied |

Steps 4–6 all edit the new component and are sequential. Step 7 is last among the code steps
because the affordance is the entry point and is easiest to verify once the dialog it opens works.

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| **Dialog trapped in a card's transform stacking context** — cards are `motion.div` with `whileHover` | **Certain if nested** | Portal to `document.body` (D-002). Verified as the cause, not guessed: `whileHover={{ y: -10 }}` on line 49 of `Projects.tsx` produces a transform. |
| Backdrop click handler also fires for clicks inside the panel | **High — the classic bug** | FR-014 and SC-004 exist for this. Handler must compare event target to the backdrop element itself, not merely stop propagation blindly. Explicitly checked in quickstart Step 6 across at least 5 inside-areas. |
| Escape listener leaks after unmount, or stacks across repeated opens | Medium | Listener attached on open and removed on close; quickstart Step 6 opens and closes repeatedly and re-tests Escape. |
| Optional type means a partially-filled item silently shows a broken dialog | Medium | The type cannot enforce "all three or none" (III limitation, noted above), so the render guard must require all three. Quickstart Step 5 checks the 4 items with none show no affordance. |
| Focus returns to the wrong place, or nowhere, after close | Medium | FR-017; quickstart Step 7 is a keyboard-only pass. |
| Body scrolls behind the open dialog | Medium | Lock via `overflow-hidden` on `document.body` — a class that **already exists** (3 uses), so no addition. Must be removed on close, including on unmount. |
| Long case study unreachable on a phone | **Resolved by approval** | The two approved classes. No longer a risk; verification remains in quickstart Step 9. |
| The `Read case study` affordance appears on 8 cards, surprising the owner | Medium | Called out in the spec, SC-002, and the completion report. Owner may want it restricted; that would be a scope change. |
| Removing `repoUrl` loses a working link if the 4 named links are mistyped | Low | FR-003 treats both halves as one unit; quickstart Step 8 opens all four destinations. |

## Post-Design Constitution Re-Check

Re-evaluated after Phase 0 and Phase 1. **Result: PASS, conditional on Q1.**

- **Principle I** — the pre-design position was "we may have to add classes for a modal". Phase 0
  narrowed that from an open question to **exactly two behavioural utilities**, with every other
  class traced to an existing use and counted. The panel is literally About's panel and the
  backdrop is literally the navbar's — so the dialog inherits the approved design rather than
  proposing one. That is a materially stronger compliance story than the spec anticipated.
- **Principle II** — holds. Worth stating plainly: five structural labels are hardcoded in the new
  component. That matches existing practice for headings, but it is the second feature in a row to
  add visitor-facing strings outside `data/`. If that pattern is unwanted, moving section labels
  into the content layer deserves its own feature.
- **Principle III** — honestly weaker here than in feature 002, and the plan says so. An optional
  field cannot make a half-filled case study a compile error, so correctness rests on a runtime
  render guard. This is the one place where the type system is not carrying the requirement.
- **Principle IV** — correct branch verified; CI gate before merge.
- **Principle V** — the strongest test so far, and it held: three plausible dialog libraries were
  considered and rejected in favour of `react-dom`'s portal and the `AnimatePresence` pattern the
  navbar already uses (D-005).
- **Principle VI** — best-served yet: depth on demand for reviewers, invisible to visitors who do
  not want it.

Two out-of-scope items remain recorded rather than absorbed: the lab-count/summary redundancy from
feature 003 (its research D-003), and the feature-001 lockfile reproducibility finding.
