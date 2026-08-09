# Implementation Plan: Projects Grouping

**Branch**: `feat/projects-grouping` | **Date**: 2026-08-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-projects-grouping/spec.md`

## Summary

Split the twelve work items into a projects group and a labs group inside the existing
`#projects` section, give each a sub-heading, render labs at reduced visual weight, show lab
counts, and switch card bodies from `description` to `summary`.

The substantive question this plan has to answer is FR-007: **how** labs read as secondary.
Phase 0 found that the site already answers it. `Skills.tsx` is an existing, owner-approved
**secondary tier** — `p-6`, `gap-6`, `w-8 h-8` icons, `text-slate-200 font-medium` titles —
sitting against `Projects.tsx`'s **primary tier** of `p-8`, `gap-8`, `w-10 h-10`,
`text-xl font-bold text-white`. So the lab treatment does not need inventing; it borrows a
density language the page already uses. Every class in the proposal below was verified to
exist in the codebase already.

> ✅ **BOTH APPROVALS GRANTED — 2026-08-09. Implementation is unblocked.**
> 1. **Q1 — resolved as Option C**, not the provisionally-planned Option A: the section heading
>    becomes **"Projects"**, with **"Featured Projects"** and **"Labs & Practice"** as the two
>    sub-headings. This required amending **FR-005**, which had protected the section heading's
>    text. The heading element and its classes are unchanged — only the words differ.
> 2. **FR-007 — approved as written**, including both judgement calls: keep `lg:grid-cols-3`,
>    and reject `opacity-80`.

## Technical Context

**Language/Version**: TypeScript 5.2 (`noEmit`) + React 18.2, Node v24.18.1 / npm 11.16.0

**Primary Dependencies**: React 18.2, Vite 5.4.21, Framer Motion 11, lucide-react 0.344;
TailwindCSS from CDN. Nothing added or removed.

**Storage**: N/A — static content modules

**Testing**: No test suite, linter, or visual-regression harness; Principle V forbids adding
one. Verification is `npm run build`, a class-inventory grep, DOM-level checks on the built
output, and a deliberate visual comparison.

**Target Platform**: Static site on GitHub Pages under `/hassanbahnasy/`

**Project Type**: Static single-page web application

**Performance Goals**: No regression. Bodies switch from `description` to `summary`, so the
bundle should shrink slightly or hold steady; growth beyond ~1 kB warrants a look.

**Constraints**: Zero build warnings; only `components/Projects.tsx` may change; no new
colour, font, or spacing value; all 12 items render; the `#projects` anchor keeps working.

**Content reality confirmed in Phase 0**: 12 items — **7 `project`, 5 `lab`**. All 5 labs
carry `labCount` (20/28/29/30/4). All 12 carry `summary`. **Only 3 of 5 labs carry
`repoUrl`**; none carries `demoUrl`. Labs carry 6–7 tags where projects carry ~5.

**Scale/Scope**: 1 file modified. Zero files created.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against constitution v1.0.1.

| Principle | Verdict | Basis |
|-----------|---------|-------|
| **I. Visual Preservation (NON-NEGOTIABLE)** | ✅ PASS **by explicit approval** | This is the first feature here that *intends* to change rendering. The principle's requirement is that visually impactful change be "explicitly flagged for approval before implementation" — the owner did exactly that. The `tailwind.config` block, palette, fonts, spacing scale, and `App.tsx` section order all remain untouched (FR-006, FR-014). The proposal reuses an existing on-page density tier rather than inventing a new visual language, and FR-007 keeps the one open sub-decision under the same approval gate. |
| **II. Data/UI Separation** | ✅ PASS | No content string enters the component. Sub-heading labels are structural UI chrome, not portfolio content — the same category as the existing "Portfolio" / "Featured Projects" headings already hardcoded in this file. Grouping is derived from the existing `kind` field; nothing is hardcoded per item. |
| **III. Type Safety First** | ✅ PASS | No data structure changes, so `types.ts` needs no edit — `kind`, `summary`, and `labCount` were all declared in feature 002 precisely so a feature like this could consume them. `npm run build` runs `tsc` and gates every step. |
| **IV. Incremental Safety** | ✅ PASS | On `feat/projects-grouping`, verified checked out. `main` stays deployable; merge only after a green build. |
| **V. No New Dependencies** | ✅ PASS | Nothing added. Phase 0 explicitly rejected adding a visual-regression tool despite this being a visual feature (research.md D-005). |
| **VI. Dual Audience** | ⚠️ **APPLIES — the sharpest instance yet** | The sub-headings are visitor-facing copy, and the grouping itself is a dual-audience device: it stops a non-technical reader over-weighting a lab collection while letting a technical reviewer see the depth of practice. "Labs & Practice" reads plainly to both. The projects-group wording is Q1 and is the owner's call. |

**Gate result**: PASS, conditional on the two approvals named above. No violations to justify;
Complexity Tracking is empty and omitted.

## Project Structure

### Documentation (this feature)

```text
specs/003-projects-grouping/
├── spec.md                            # Feature specification (input; contains Q1)
├── plan.md                            # This file
├── research.md                        # Phase 0 — findings + the FR-007 proposal rationale
├── contracts/
│   └── card-render-contract.md        # Phase 1 — which fields each card tier reads
├── quickstart.md                      # Phase 1 — validation guide
├── checklists/requirements.md         # Spec quality checklist
└── tasks.md                           # Phase 2 (/speckit-tasks — NOT created here)
```

`data-model.md` is **not** generated: this feature introduces, removes, and changes zero data
structures. It consumes `kind`, `summary`, and `labCount`, all declared in feature 002, and
both `types.ts` and `data/` are out of scope. A `contracts/` entry *is* generated, because the
card's read-surface genuinely changes (`description` → `summary`, plus `labCount` and `kind`)
and that is a UI contract worth pinning.

### Source Code (repository root)

```text
.
├── components/Projects.tsx    # MODIFY — the only file this feature touches
├── components/*.tsx (7 more)  # UNTOUCHED
├── App.tsx, index.tsx         # UNTOUCHED — section order protected
├── index.html                 # UNTOUCHED — tailwind.config block protected
├── data/*.ts, data/config.tsx # UNTOUCHED — all content
├── types.ts                   # UNTOUCHED — no shape changes
├── vite.config.ts             # UNTOUCHED
└── .github/workflows/         # UNTOUCHED
```

**Structure Decision**: A single-file change. No new component is extracted. The card markup
is rendered once and parameterised by tier, so there is exactly one card implementation
(spec assumption: "card structure is reused, not rebuilt"), which is what keeps the two tiers
from drifting apart later.

## FR-007 Proposal: How labs read as secondary *(REQUIRES APPROVAL)*

**Every class below already appears in the codebase.** Counts are occurrences found by grep
across `components/`.

| Aspect | Project card (primary, unchanged) | Lab card (proposed secondary) | Precedent for the lab value |
|---|---|---|---|
| Grid gap | `gap-8` | `gap-6` | `Skills.tsx` grid (1 use) |
| Columns | `md:grid-cols-2 lg:grid-cols-3` | **same** | unchanged on purpose — see below |
| Card padding | `p-8` | `p-6` | `Skills.tsx` tile (1 use) |
| Icon size | `w-10 h-10` | `w-8 h-8` | `Skills.tsx` icon |
| Title | `text-xl font-bold text-white` | `text-lg font-bold text-slate-200` | `text-lg` (7 uses), `text-slate-200` (`Skills.tsx`) |
| Body | `text-slate-400 … font-light` | `text-sm text-slate-400 … font-light` | `text-sm` (7 uses) |
| Lab count | — | `text-xs font-mono text-accent` | the existing tag chip's text treatment, minus the chip background |
| Card shell, border, hover, tags | unchanged | **identical** | same primitives, so the tiers stay related |

**Sub-headings**: `text-2xl font-bold text-white font-display mb-8` — `text-2xl` (4 uses),
`mb-8` (2 uses). This completes a clean typographic ladder using only sizes already present:
section heading `text-3xl md:text-5xl` → sub-heading `text-2xl` → card title `text-xl`
(projects) / `text-lg` (labs).

**Group separation**: wrap the two groups in `space-y-12` (1 existing use). Avoids inventing a
margin value and avoids `mt-12`, which the codebase does not currently use.

**Why columns stay the same.** A denser column count was the obvious reading of "denser grid",
but the only existing values are 1, 2, 3, and 5. `grid-cols-4` would be a new value; and
`lg:grid-cols-5` happens to fit today's five labs in one row but is brittle — a sixth lab
would strand one card alone on a second row. Keeping `lg:grid-cols-3` and taking density from
padding, gap, icon, and type size gives four consistent secondary cues while preserving the
page's column rhythm.

**Why not opacity.** `opacity-80` was the cheapest option and is rejected: lab body text is
already `text-slate-400` on a dark panel, and fading it further pushes contrast toward
unreadable — a direct FR-008 violation. Reduced weight must not become reduced usability.

## Implementation Sequence

| Step | Story | Change | Gate before proceeding |
|------|-------|--------|------------------------|
| 0 | — | Capture baseline: build log, bundle, screenshots of the current section | Baseline stored outside the repo |
| 1 | — | ~~Obtain Q1 + FR-007 approval~~ | ✅ **Granted 2026-08-09** |
| 2 | US1 | Change the section heading text to "Projects" (Q1) | Build clean; heading classes unchanged |
| 3 | US1 | Partition items by `kind`; render two groups with sub-headings; suppress empty groups | Build clean; 7 + 5 = 12 render |
| 4 | US1 | Apply the approved secondary treatment to lab cards | Build clean; class inventory shows no new values |
| 5 | US2 | Render `labCount` in prose on lab cards; omit when absent or zero | Build clean; 5 counts render, 0 on projects |
| 6 | US3 | Switch card body from `description` to `summary` | Build clean; 12 summaries render |
| 7 | — | Full `quickstart.md` validation, visual comparison, anchor check | All of SC-001…SC-009 satisfied |

**Revised ordering note**: this sequence now runs in story-priority order (US1 → US2 → US3).
The earlier draft put the `summary` switch first as the smallest verifiable change, but that was
an ergonomic preference, not a dependency — the switch is a single expression inside the shared
card renderer and is unaffected by the restructuring around it. Priority order is preferred so
the highest-value story lands first. Steps 2–6 all edit `components/Projects.tsx` and are
therefore strictly sequential.

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| **Lab count duplicates the summary copy** — summaries already read "Twenty progressive labs…", "Twenty-eight labs…", so a "20 hands-on labs" line restates it | **High — present in today's data** | Flagged for the owner in research.md D-003 with options. The count still earns its place as a scannable numeral, but the owner may prefer a copy tweak in `data/` (out of scope here) or a different count phrasing. |
| Two lab cards have no links at all (only 3 of 5 have `repoUrl`, none has `demoUrl`) | **Certain — real data** | The existing `{project.repoUrl && …}` guard already handles it. Those two cards render a folder icon with an empty action row; quickstart Step 5 checks that this looks deliberate rather than broken. |
| Labs carry 6–7 tags in a card with less padding, so tags wrap more | Medium | Checked visually at desktop and mobile in quickstart Step 6; tag styling is deliberately left unchanged so the fix, if needed, is a scoped follow-up. |
| "Secondary" drifts into illegible | Low | Opacity rejected outright; the proposal only reduces size and softens the title to an existing colour. FR-008 is an explicit quickstart check. |
| Restructuring disturbs the `#projects` anchor | Low | The `id` stays on the outer section, which is not restructured. Explicitly verified in quickstart Step 7. |
| Empty-group logic untested by real data | Medium | No group is empty today, so quickstart Step 4 exercises it by temporarily filtering, then reverting. |
| Q1 answered differently after implementation | Medium | Only sub-heading text and possibly the section heading change; isolated to two lines. |

## Post-Design Constitution Re-Check

Re-evaluated after Phase 0 and Phase 1. **Result: PASS, conditional on the two named
approvals.**

- **Principle I** — this is the first feature that deliberately changes what visitors see, so
  the principle does its real work here. Phase 0 strengthened compliance in a way the
  pre-design gate did not anticipate: rather than designing a new secondary style, it found
  that the page **already contains** an approved secondary tier and borrowed its exact values.
  Every proposed class was verified present by grep, so "no new colours, fonts, or spacing
  values" is a checkable claim rather than an intention. The two genuinely new decisions —
  sub-heading wording and the secondary treatment — are both held behind owner approval.
- **Principle II** — holds, with one judgement worth stating plainly: the sub-heading strings
  live in the component, not in `data/`. That is consistent with the section's existing
  headings and with `data/` being out of scope, but it does mean two visitor-facing strings sit
  outside the content layer. If the owner wants them in `data/`, that is a separate feature.
- **Principle III** — no types change. Feature 002's `kind`/`summary`/`labCount` exist for
  exactly this consumer, so this feature is the payoff for that groundwork.
- **Principle IV** — correct branch verified; CI gate before merge.
- **Principle V** — held under pressure again: a visual feature is the strongest case yet for
  a screenshot-diff tool, and it was still rejected (research.md D-005).
- **Principle VI** — engaged more directly than in any prior feature, and partly unresolved by
  design: Q1 is in substance a dual-audience copy question.

One out-of-scope item surfaced: the lab-count/summary redundancy (D-003) is a content matter
in `data/`, which this feature must not touch. Recorded rather than absorbed. The feature-001
lockfile reproducibility finding also remains open.
