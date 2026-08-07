# Implementation Plan: Data Layer Restructure

**Branch**: `feat/data-architecture` | **Date**: 2026-08-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-data-layer-restructure/spec.md`

## Summary

Extend the `Project` type with an identity and case-study fields, add a `Certification`
type, and split the single 127-line content file into five focused modules — while every
one of the eight components keeps importing `{ config }` from the same path, unchanged.

The interesting problem here is verification. The preceding feature proved safety by
showing the compiled bundle was byte-identical; that proof is unavailable now, because
this feature deliberately adds content. Phase 0 therefore built a replacement: a
**content inventory of 80 strings** extracted from the current data file, every one of
which was confirmed present in the baseline bundle. After the change, all 80 must still
be present. That is a mechanical, browser-free check that no displayed text was lost or
altered, and it is the backbone of this plan.

## Technical Context

**Language/Version**: TypeScript 5.2 (`noEmit`, type-check only) + React 18.2, on Node
v24.18.1 / npm 11.16.0

**Primary Dependencies**: React 18.2, Vite 5.4.21, Framer Motion 11, lucide-react 0.344;
TailwindCSS from CDN. No dependency is added or removed.

**Storage**: N/A — content is static TypeScript modules compiled into the bundle

**Testing**: No test suite, linter, or visual-regression harness exists, and Principle V
forbids adding one. Verification is `npm run build` (runs `tsc` first) + the 80-string
content inventory + manual visual comparison.

**Target Platform**: Static site on GitHub Pages under `/hassanbahnasy/`

**Project Type**: Static single-page web application

**Performance Goals**: No regression. The bundle will grow by roughly the size of four
slugs and four summaries (< 1 kB); anything beyond that warrants investigation.

**Constraints**: Zero build warnings; zero changes to any rendering file; all 80
inventory strings preserved; rendered output visually identical.

**Key constraint discovered in Phase 0**: `tsconfig.json` sets `isolatedModules: true`,
which makes a bare type re-export a hard compile error (TS1205). Verified empirically —
see research.md D-002. All type re-exports must use `export type`.

**Scale/Scope**: 1 type file extended, 5 data modules created, 1 file converted to a
re-export layer, 4 project records migrated. Zero component files touched.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against constitution v1.0.1.

| Principle | Verdict | Basis |
|-----------|---------|-------|
| **I. Visual Preservation (NON-NEGOTIABLE)** | ✅ PASS | No component, no `App.tsx`, no `index.html`, no theme block is touched. Verified in Phase 0 that project cards read only `title`, `description`, `tags`, `repoUrl`, `demoUrl` — every added field is unrendered and has no path to the page. `description` stays byte-identical, so no visible text moves. FR-012/FR-014 enforce evidence-based checking. |
| **II. Data/UI Separation** | ✅ PASS — **this feature is the principle** | Content stays entirely under `data/`; the split makes the separation sharper. FR-008 keeps components depending on a stable aggregate rather than on file layout, which is what lets the layout change without touching them. |
| **III. Type Safety First** | ✅ PASS — **directly exercised** | `types.ts` is extended *before* any data is written against it (FR-011). Making `slug`, `kind`, and `summary` required means a missed project is a compile error, not a blank card. `npm run build` runs `tsc` and gates every step. |
| **IV. Incremental Safety** | ✅ PASS | On `feat/data-architecture`, verified checked out with a clean tree; 001 is merged via PR #1. `main` stays deployable — merge only after a green build. |
| **V. No New Dependencies** | ✅ PASS | Nothing added. Phase 0 explicitly rejected adding a visual-regression tool and rejected `tsx`/`ts-node` for data introspection, building the inventory check out of the existing toolchain instead (research.md D-005). |
| **VI. Dual Audience** | ✅ N/A | No visitor-facing copy changes. The summary field is new and unrendered; when a future feature renders it, that feature owns the Principle VI review. |

**Gate result**: PASS. No violations; Complexity Tracking is empty and omitted.

## Project Structure

### Documentation (this feature)

```text
specs/002-data-layer-restructure/
├── spec.md                          # Feature specification (input)
├── plan.md                          # This file
├── research.md                      # Phase 0 — decisions + empirical findings
├── data-model.md                    # Phase 1 — entity shapes and validation rules
├── contracts/
│   ├── config-aggregate.md          # Phase 1 — the frozen consumer contract
│   └── content-inventory.txt        # Phase 1 — 80 strings that MUST survive
├── quickstart.md                    # Phase 1 — validation guide
├── checklists/requirements.md       # Spec quality checklist
└── tasks.md                         # Phase 2 (/speckit-tasks — NOT created here)
```

Unlike feature 001, **`data-model.md` and `contracts/` are both generated here** — this
feature is entirely about data shapes, and it has a real internal interface contract: the
aggregate shape the eight components consume, which must not change.

### Source Code (repository root)

```text
.
├── types.ts                    # MODIFY — extend Project, add Certification
├── data/
│   ├── site.ts                 # CREATE — name, title, tagline, email, about, socials, navItems
│   ├── experience.ts           # CREATE — experience[] (content unchanged)
│   ├── skills.ts               # CREATE — skills[] (content unchanged)
│   ├── projects.ts             # CREATE — projects[] migrated to the new shape
│   ├── certifications.ts       # CREATE — empty typed array
│   └── config.tsx              # REWRITE — assembles and re-exports; holds no content
├── components/                 # UNTOUCHED — all 8 files
├── App.tsx, index.tsx          # UNTOUCHED
├── index.html                  # UNTOUCHED — theme block protected
├── vite.config.ts              # UNTOUCHED
└── .github/workflows/          # UNTOUCHED
```

**Structure Decision**: `data/config.tsx` keeps its name and extension so the eight
existing imports (`from '../data/config'`) resolve unchanged. It becomes a pure assembly
and re-export layer holding no content of its own (FR-008), which is what guarantees a
single source of truth per item (SC-007). The new modules use `.ts` rather than `.tsx`
because none contains JSX — confirmed: the current file's only imports are lucide icon
*values*, not JSX.

## Implementation Sequence

Ordered so each step ends at a green build, and so the riskiest step (the aggregate
rewrite) happens while the content is still verifiable against the inventory.

| Step | Story | Change | Gate before proceeding |
|------|-------|--------|------------------------|
| 0 | — | Capture baseline: build log, bundle, `dist/index.html`, screenshots | Baseline stored outside the repo; inventory confirmed 80/80 |
| 1 | US1 | Extend `Project`, add `Certification` in `types.ts` | `tsc` fails loudly on the 4 un-migrated projects — this is expected and is the proof the required fields bite |
| 2 | US1 | Migrate the 4 projects in place (slug, kind, summary) | Build clean; 80/80 inventory strings present |
| 3 | US3 | Create `data/certifications.ts` as an empty typed array | Build clean |
| 4 | US2 | Create `site.ts`, `experience.ts`, `skills.ts`, `projects.ts` | Build clean (new modules not yet consumed) |
| 5 | US2 | Rewrite `config.tsx` as assembly + re-export; remove its content | Build clean; **80/80 inventory**; zero component diffs |
| 6 | — | Full `quickstart.md` validation, visual comparison | All of SC-001…SC-007 satisfied |

Step 1 intentionally leaves the tree in a non-compiling state, resolved by step 2 — this
is the Principle III mechanism working as designed rather than an error to route around.
Steps 4 and 5 must be sequential: the re-export layer cannot reference modules that do
not exist yet.

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| A bare type re-export breaks the build (TS1205) | **Certain if unguarded** | Confirmed empirically in Phase 0 and confirmed that `export type` fixes it. Documented as a hard rule in research.md D-002. |
| Content silently altered while being moved between files | Medium | The 80-string inventory catches any lost or edited string mechanically. This is the single most valuable check in the plan. |
| Array ordering changes while moving content, reordering cards or nav items | Medium | The inventory proves presence, **not order**. Ordering must be checked explicitly: projects, skills, experience, navItems, and socials each preserve their exact sequence. Called out in quickstart Step 4. |
| `config.tsx` ends up holding a second copy of content | Low | FR-008 forbids it; quickstart Step 5 greps the re-export layer for content literals, which must find none. |
| Summary text accidentally replaces description on cards | Low | `description` must remain byte-identical; both the inventory and the visual check cover this. |
| Bundle grows unexpectedly, hinting at a duplicated module | Low | Baseline is 285.88 kB; growth beyond ~1 kB is investigated rather than accepted. |
| Visual regression that no mechanical check can see | Low | No component changes and an unchanged aggregate shape make this very unlikely, but the screenshot comparison remains mandatory (FR-014). |

## Post-Design Constitution Re-Check

Re-evaluated after Phase 0 and Phase 1. **Result: PASS, and better evidenced than at the
pre-design gate.**

- **Principle I** — the pre-design argument was "no component changes, so nothing can
  render differently". Phase 0 upgraded that from argument to measurement: the 80-string
  inventory is a mechanical assertion that no displayed content was lost, and reading the
  display code confirmed the new fields have no render path. One honest limit remains,
  now explicit: the inventory proves *presence*, not *ordering*, so ordering is checked
  separately in quickstart Step 4 rather than assumed.
- **Principle II** — strengthened rather than merely respected. Documenting the aggregate
  as a frozen contract (`contracts/config-aggregate.md`) means future data reorganisation
  stays invisible to components by design, not by luck.
- **Principle III** — the mechanism is load-bearing here. Making the three new fields
  required converts "someone forgot a project" from a silent blank card into a build
  failure, which is why step 1 deliberately ends red.
- **Principle IV** — unchanged and verified: correct branch, clean tree, 001 merged.
- **Principle V** — held under real pressure. Introspecting the data object would have
  been easiest with `tsx` or `ts-node`; both were rejected and the inventory check was
  built from `grep` against the existing build output instead (research.md D-005).
- **Principle VI** — not engaged; no visitor-facing copy changes.

No new out-of-scope issues surfaced. The lockfile reproducibility finding from feature
001 (research.md D-005 there) remains open and still belongs in its own feature.
