# Implementation Plan: Scaffolding Cleanup

**Branch**: `chore/repo-cleanup` | **Date**: 2026-08-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-scaffolding-cleanup/spec.md`

## Summary

Remove five leftover inconsistencies from the original scaffolding generator without
changing a single rendered pixel: two dead references in `index.html`, the redundant
manual publish path in `package.json`, the stale README, and an unused descriptor
file. The approach is verification-first — a full baseline (build log, built HTML,
screenshots) is captured before any edit, so the "visually identical" claim is proven
against artifacts rather than asserted. Every removal has been confirmed inert by
inspecting the actual build output, not by reasoning about it.

## Technical Context

**Language/Version**: TypeScript 5.2 (`noEmit`, type-check only) + React 18.2, on Node
v24.18.1 / npm 11.16.0 (verified locally)

**Primary Dependencies**: React 18.2, Vite 5.4.21, Framer Motion 11, lucide-react
0.344; TailwindCSS loaded from CDN at runtime (not a build dependency)

**Storage**: N/A — no persistence; all content is static TypeScript modules

**Testing**: No test suite and no visual-regression tooling exists. Verification is
`npm run build` (which runs `tsc` first) plus manual side-by-side visual comparison
against a pre-change baseline.

**Target Platform**: Static site served by GitHub Pages from the `gh-pages` branch,
under the subpath `/hassanbahnasy/`

**Project Type**: Static single-page web application (no backend, no server runtime)

**Performance Goals**: No change intended. Bundle size must not grow; the two
`index.html` removals should shrink the served HTML slightly.

**Constraints**: Zero build warnings; zero failed network requests; rendered output
pixel-identical to baseline; `tailwind.config` block, all components, all of `data/`,
and the deployment workflow must remain untouched.

**Scale/Scope**: 4 files modified, 1 file deleted, 1 untracked local artifact
regenerated. No source component is touched.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against constitution v1.0.1.

| Principle | Verdict | Basis |
|-----------|---------|-------|
| **I. Visual Preservation (NON-NEGOTIABLE)** | ✅ PASS | `index.html` is modified, but the `tailwind.config` block, the `<style>` block, the CDN script tag, and section order are all explicitly out of scope. Both removed items are proven inert: the stylesheet target does not exist (hence the build warning), and the importmap is unreachable because the entry point is bundled. The owner explicitly approved this scope, satisfying the "flag before implementing" clause. FR-011/FR-013 enforce evidence-based verification. |
| **II. Data/UI Separation** | ✅ N/A | No component and no file under `data/` is touched; no content string moves in either direction. |
| **III. Type Safety First** | ✅ PASS | No data structure changes, so `types.ts` needs no edit. `npm run build` runs `tsc` and MUST pass before commit — enforced as a task-level gate after every change. |
| **IV. Incremental Safety** | ✅ PASS | Work is on `chore/repo-cleanup` (verified checked out), not `main`. One feature on the branch. `main` stays deployable because the branch only merges after a green build. |
| **V. No New Dependencies** | ✅ PASS | This change *removes* one devDependency (`gh-pages`) and adds none. Stack changes are a Principle V decision and the owner has explicitly approved this one. |
| **VI. Dual Audience** | ⚠️ APPLIES | The README rewrite (FR-007/008/009) is the only user-facing content change. It MUST stay readable for a non-technical visitor while remaining precise enough for a technical reviewer — no bare command dumps, no hand-wavy "it just deploys". Called out as an explicit review criterion on the README task. |

**Gate result**: PASS. No violations to justify; Complexity Tracking is therefore empty
and omitted.

## Project Structure

### Documentation (this feature)

```text
specs/001-scaffolding-cleanup/
├── spec.md              # Feature specification (input)
├── plan.md              # This file
├── research.md          # Phase 0 output — decisions + baseline evidence
├── quickstart.md        # Phase 1 output — validation guide
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

`data-model.md` and `contracts/` are intentionally **not** generated. Justification:

- **No data model.** This feature introduces, removes, and modifies zero data
  structures. The spec deliberately omits its Key Entities section for the same
  reason. An empty `data-model.md` would be noise, not documentation.
- **No interface contracts.** The project exposes no API, CLI, or schema. Its only
  external interface is the rendered page, and the binding contract on that interface
  is "byte-for-byte visual equivalence with the baseline" — already specified as
  FR-011 and operationalised in `quickstart.md`. A `contracts/` directory would
  duplicate it less precisely.

### Source Code (repository root)

The repository is a flat static site. Files this feature touches are marked:

```text
.
├── .github/workflows/deploy.yml   # UNTOUCHED (out of scope) — the sole deploy path
├── App.tsx                        # UNTOUCHED — section order is protected
├── components/                    # UNTOUCHED (8 components)
├── data/config.tsx                # UNTOUCHED — all site content
├── types.ts                       # UNTOUCHED — no data shapes change
├── vite.config.ts                 # UNTOUCHED — base:'./' already correct
├── tsconfig.json                  # UNTOUCHED
├── index.tsx                      # UNTOUCHED
├── index.html                     # MODIFY — remove dead stylesheet link + importmap
├── package.json                   # MODIFY — drop predeploy/deploy/gh-pages/homepage
├── package-lock.json              # REGENERATE — untracked; see research.md D-005
├── README.md                      # REWRITE — content path, live URL, deploy process
└── metadata.json                  # DELETE — referenced by nothing
```

**Structure Decision**: No structural change. The existing flat layout is preserved
exactly; this feature only removes files and lines from it.

## Implementation Sequence

Ordered so that the riskiest verification happens first and each step is independently
revertible. Story priorities come from the spec (US1 = P1 … US4 = P3).

| Step | Story | Change | Gate before proceeding |
|------|-------|--------|------------------------|
| 0 | — | Capture baseline: build log, `dist/index.html`, screenshots at desktop + mobile | Baseline artifacts exist and are stored outside the repo |
| 1 | US1 | `index.html`: remove the dead stylesheet `<link>` | Build emits zero warnings |
| 2 | US1 | `index.html`: remove the `<script type="importmap">` block | Build clean; served page renders identically; no 404 |
| 3 | US2 | `package.json`: remove `predeploy`, `deploy`, `gh-pages`, `homepage` | Build clean; workflow re-read and confirmed independent |
| 4 | US2 | Regenerate `package-lock.json`; confirm no `gh-pages` entries remain | Build clean after regeneration |
| 5 | US4 | Delete `metadata.json` | Build clean; page renders identically |
| 6 | US3 | Rewrite README (content path, live URL, deploy process) | Every path and link in it verified to resolve; Principle VI reviewed |
| 7 | — | Final verification against `quickstart.md`, then visual diff vs baseline | All of SC-001…SC-007 satisfied |

Steps 1–2 both edit `index.html` and must be sequential. Steps 3–4 are coupled.
Steps 5 and 6 are independent of everything before them and of each other.

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Regenerating the lockfile silently drifts a transitive dependency and changes rendered output | Low | Step 4 gate is a clean build; step 7 gate is a visual diff against the step-0 baseline. Lockfile is untracked, so a bad result is discardable with no history impact. |
| The importmap turns out to be load-bearing in dev (`npm run dev`) even though it is inert in the build | Low | Already disproven for the build (entry is bundled). Verify `npm run dev` renders correctly as well as the built output, since only the build path was measured in the baseline. |
| Removing `homepage` breaks something unread by the removed tool | Very low | Verified: only `gh-pages` consumes it; `vite.config.ts` uses `base:'./'`, so asset resolution is independent of it. Confirmed by a green build plus a successful deployment. |
| README rewrite drifts toward one audience | Medium | Explicit Principle VI review gate on step 6. |
| A build warning unrelated to the five scope items appears | Low | Baseline shows exactly one warning, and it is the in-scope one. Any new warning is reported to the owner as a scope decision, never silently fixed or ignored (spec edge case). |

## Post-Design Constitution Re-Check

Re-evaluated after Phase 0 and Phase 1. **Result: PASS, unchanged.** Phase 0 verified
every assumption the pre-design check rested on rather than weakening any of them:

- **Principle I** is now backed by evidence, not argument. The built HTML was inspected
  directly: both removed items ship to the browser but neither is reachable — the
  stylesheet does not exist, and the bundled entry point leaves no bare specifier for
  the importmap to resolve. `quickstart.md` Step 2 adds a stronger gate than originally
  planned: the compiled JS bundle must be **byte-identical** to the baseline, which
  mechanically proves no component or theme change leaked in.
- **Principle III** is unchanged; `tsc` already passes at baseline.
- **Principle IV** is satisfied and now verified — `chore/repo-cleanup` is checked out.
  `quickstart.md` Step 8 adds a CI confirmation before merge, since the workflow builds
  on Node 20 while local verification used Node 24.
- **Principle V** is satisfied: one dependency removed, none added. Phase 0 explicitly
  rejected adding visual-regression tooling for this reason (research.md D-007).
- **Principle VI** remains the one gate needing human judgement, on the README rewrite
  only. `quickstart.md` Step 6 makes it a checked item rather than an aspiration.

One out-of-scope issue surfaced and was deliberately **not** absorbed: `package-lock.json`
is untracked while the workflow runs `npm install`, so CI builds are not reproducible.
Fixing that requires editing the deployment workflow, which FR-012 protects. Recorded in
research.md D-005 as a follow-up feature instead of scope creep here.
