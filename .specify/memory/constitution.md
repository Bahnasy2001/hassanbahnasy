<!--
Sync Impact Report
==================
Version change: 1.0.0 → 1.0.1 (PATCH — factual corrections only; no principle added, removed, or redefined)
Modified principles:
  - IV. Incremental Safety — name, intent, and rationale unchanged. One factual clause corrected: the
    auto-deploy trigger is now stated as the GitHub Actions workflow at .github/workflows/deploy.yml
    building and publishing to gh-pages, replacing the incorrect reference to the npm `deploy` script.
    The governing rule (one feature per branch; main MUST always be deployable) is untouched.
  - I, II, III, V, VI — unchanged in wording and intent from 1.0.0.
Modified sections:
  - Additional Constraints (Technology & Deployment) — three corrections:
    1. Deployment is now described accurately as automated CI: the GitHub Actions workflow at
       .github/workflows/deploy.yml builds and publishes to gh-pages on every push to main.
       The npm "deploy"/"predeploy" scripts are a redundant second path scheduled for removal and
       are no longer named as the deployment mechanism.
    2. Removed the reference to index.html's import map as part of the declared stack. It is leftover
       scaffolding that Vite ignores at build time and its declared versions conflict with package.json;
       package.json is now stated as the single source of truth for dependencies.
    3. Content location is now the `data/` directory generally rather than the specific file
       data/config.tsx, since the data layer will be split into multiple typed modules.
Added sections: none
Removed sections: none
Templates checked for alignment:
  - .specify/templates/plan-template.md ✅ Constitution Check gate is generic ("[Gates determined based on constitution file]") — no edit required, gates should be populated per-feature from Principles I-VI above
  - .specify/templates/spec-template.md ✅ no principle-specific references — no edit required
  - .specify/templates/tasks-template.md ✅ no principle-specific references — no edit required
  - .claude/skills/speckit-*/SKILL.md ✅ scanned, contain no project-specific or outdated principle names requiring update
Follow-up TODOs:
  - README.md references `src/data/config.tsx` for content customization; the real path is under `data/`
    with no `src/` prefix, and per correction 3 no single filename should be named. Flagged for a manual
    doc fix so README stays consistent with Principle II.
  - README.md also documents `npm run deploy` as the deploy procedure; update it to describe push-to-main
    CI when the redundant npm scripts are removed.
-->

# Hassan El Bahnasy Portfolio Constitution

## Core Principles

### I. Visual Preservation (NON-NEGOTIABLE)

The existing design is final and approved. The Tailwind theme configuration block
in `index.html` (the `tailwind.config` script, including the `colors`, `fontFamily`,
`backgroundImage`, and `animation` extensions), the color palette, fonts, spacing
scale, and the section order rendered in `App.tsx` (`Navbar`, `Hero`, `About`,
`Experience`, `Skills`, `Projects`, `Contact`, `Footer`) MUST NOT be modified. New UI
components MUST reuse the styling patterns (class combinations, spacing, motion
conventions) already established by existing components rather than introducing new
visual patterns. Any proposed change with visual impact — new colors, new spacing
values, new fonts, reordered sections, new layout patterns — MUST be explicitly
flagged and approved by the user before implementation begins.

**Rationale**: The design has already been decided and approved; this project's
risk is design drift through incremental, unreviewed changes, not a lack of design
direction.

### II. Data/UI Separation

All content (text, links, project entries, skills, experience, social handles, etc.)
MUST live in the `data/` directory. Components MUST NOT contain hardcoded content
strings. Components read content exclusively from typed data modules; if a
component needs new content, the content is added to a data module first, then
consumed via props or imports.

**Rationale**: Keeping content out of components lets the site's text and structure
be updated without touching or risking component/rendering logic.

### III. Type Safety First

Every data structure MUST be declared in `types.ts` before any data is written
against it. `npm run build` (which runs `tsc` before `vite build`) MUST pass before
any commit.

**Rationale**: Declaring shape before content catches structural mistakes at compile
time instead of at render time, and keeps `data/` and `components/` contractually in
sync.

### IV. Incremental Safety

One feature per branch. The `main` branch MUST always be deployable, because
pushing to `main` triggers the GitHub Actions workflow at
`.github/workflows/deploy.yml`, which builds the site and publishes it to the
`gh-pages` branch automatically.

**Rationale**: Automatic deployment on push removes the safety net of a manual
release step, so every commit that reaches `main` must already be production-ready.

### V. No New Dependencies

Do not add npm packages without explicit user approval and a written justification
of why the existing toolset (React, Vite, TailwindCSS via CDN, Framer Motion,
lucide-react, TypeScript) is insufficient for the task.

**Rationale**: A small, fixed dependency set keeps the build simple, keeps the CDN-
based Tailwind config (which has no local build step) working, and avoids
unreviewed supply-chain risk.

### VI. Dual Audience

This portfolio serves both non-technical business visitors and technical
reviewers. Every content change MUST remain legible and credible to both: no
jargon-only phrasing that excludes non-technical readers, and no oversimplification
that undersells technical depth to reviewers evaluating engineering skill.

**Rationale**: The portfolio's purpose is to win trust from two different audiences
at once; optimizing for only one undermines the other.

## Additional Constraints (Technology & Deployment)

- Stack is fixed to React + TypeScript + Vite + TailwindCSS (via CDN in
  `index.html`) + Framer Motion + lucide-react. `package.json` is the single
  source of truth for dependencies and their versions. Changes to this stack are
  a Principle V decision, not a routine one.
- Deployment is static and fully automated in CI: every push to `main` runs the
  GitHub Actions workflow at `.github/workflows/deploy.yml`, which builds the site
  and publishes the output to the `gh-pages` branch served by GitHub Pages. There
  is no manual release step and no server-side runtime; features requiring one are
  out of scope.
- Content customization is intended to happen entirely inside the `data/`
  directory — which may be split across several typed modules — with the
  corresponding shapes declared in `types.ts` per Principle III, and without
  editing component files, per Principle II.

## Development Workflow (Branching, Review & Change Classification)

- One feature or fix per branch (Principle IV); branches merge to `main` only when
  `npm run build` passes.
- Before implementation, classify the change: **content-only** (data/`types.ts`
  changes, no visual impact), **structural** (new component, new data shape, no
  visual impact), or **visual** (anything touching theme, palette, fonts, spacing,
  or section order). Visual changes MUST be flagged and approved per Principle I
  before code is written.
- Because pushes to `main` auto-deploy, verify the build locally (`npm run build`)
  before merging — there is no staging environment to catch a broken build first.

## Governance

This constitution supersedes ad-hoc practice for this repository. Amendments are
made by editing this file directly, and MUST include an updated Sync Impact Report
(as the HTML comment at the top of this file) describing what changed and why.

Versioning follows semantic versioning applied to governance text:
- **MAJOR**: backward-incompatible principle removal or redefinition (e.g.,
  relaxing Principle I to allow visual changes without approval).
- **MINOR**: a new principle or materially expanded guidance is added.
- **PATCH**: wording clarifications, typo fixes, non-semantic edits.

Every non-trivial change MUST be checked against the six Core Principles before
implementation; a change that conflicts with a principle requires either revising
the approach or amending this constitution first (not silently overriding it).
Since there is no CI gate enforcing this today, compliance is a manual review
step the implementer (human or agent) MUST perform before merging to `main`.

**Version**: 1.0.1 | **Ratified**: 2026-08-02 | **Last Amended**: 2026-08-02
