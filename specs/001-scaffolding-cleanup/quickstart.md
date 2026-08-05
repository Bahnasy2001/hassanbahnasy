# Validation Guide: Scaffolding Cleanup

**Date**: 2026-08-04 | **Branch**: `chore/repo-cleanup` | **Plan**: [plan.md](./plan.md)

How to prove this feature is done. Every check maps to a success criterion in
[spec.md](./spec.md). Baseline figures come from [research.md](./research.md).

## Prerequisites

- Node 20+ and npm (verified on Node v24.18.1 / npm 11.16.0)
- Dependencies installed (`node_modules/` already present)
- Checked out on `chore/repo-cleanup`, **not** `main` — merging to `main` deploys to
  production automatically (Constitution IV)
- A browser with developer tools, for the network and visual checks

Store baseline artifacts **outside the repository** so they are never committed. Use
the session scratchpad:
`C:\Users\Pc\AppData\Local\Temp\claude\e--hassan-el-bahnasy-portfolio\2429c9d8-0af8-4e08-abeb-47ae3259d5d8\scratchpad\baseline\`

## Step 0 — Capture the baseline (BEFORE editing any file)

Required by FR-013. Skipping this makes SC-003 unverifiable.

```bash
npm run build                 # save the full log
cp dist/index.html   <baseline>/index.html.before
cp dist/assets/*.js  <baseline>/bundle.js.before
npm run preview               # serve the built output
```

With the preview server running, capture screenshots of the **full page** at a desktop
width (~1440px) and a mobile width (~390px). All eight sections must be in frame across
the captures: Navbar, Hero, About, Experience, Skills, Projects, Contact, Footer.

**Already captured** (see research.md): the build log, the one expected warning, and
these figures — `dist/index.html` 2.59 kB / gzip 1.17 kB, `dist/assets/index-*.js`
285.88 kB / gzip 91.27 kB. Screenshots still need a browser and remain to be taken.

## Step 1 — Build is clean → SC-001

```bash
npm run build
```

**Expected**: exits 0, and the log contains **no** warning line. Specifically, this line
from the baseline must be gone:

```text
/index.css doesn't exist at build time, it will remain unchanged to be resolved at runtime
```

**Fails if**: any warning appears. A *new* warning unrelated to the five scope items is
not to be silently fixed or ignored — report it to the owner as a scope decision (spec
edge case).

## Step 2 — Built output changed only where intended → SC-003

```bash
diff <baseline>/bundle.js.before dist/assets/index-*.js
diff <baseline>/index.html.before dist/index.html
```

**Expected**:

- The **JS bundle is byte-identical** — no diff output, and the content hash in the
  filename is unchanged (`index-BNL2Oep4.js`). This is the strongest single signal that
  no rendered behaviour changed: no component, no `data/` module, and no Tailwind config
  was touched, so the compiled bundle has no reason to differ. A changed hash means
  something in scope leaked into the application code — stop and investigate.
- The **HTML diff shows only removals**, and only these two: the `/index.css` link tag
  and the `<script type="importmap">` block. `dist/index.html` shrinks from 2.59 kB.
- The `tailwind.config` script, the `<style>` block, the Tailwind CDN tag, the `<title>`,
  and the module script tag are all **unchanged** (Constitution I).

## Step 3 — No failed requests → SC-002

```bash
npm run preview
```

Open the served URL with developer tools on the Network tab, hard-reload.

**Expected**: no 404 and no other failed request. The baseline request for `/index.css`
must be absent entirely — not merely still failing.

**Note**: requests to `cdn.tailwindcss.com` and `fonts.googleapis.com` are expected and
must still succeed — those are how the site gets its styling and fonts. If either
fails, the page will look wrong for reasons unrelated to this change.

## Step 4 — Visually identical → SC-003

With the preview server running, compare against the Step 0 screenshots at both widths.

**Expected**: no perceptible difference in colors, fonts, spacing, section order,
content, or animations. Check the scroll-triggered animations and the custom scrollbar,
since those come from the `<style>` block and the CDN Tailwind config rather than from
the bundle.

Also open the dev server once — the baseline only measured the production build, and
the importmap removal is the one change that could in principle behave differently
there (research.md D-002):

```bash
npm run dev
```

**Expected**: renders identically; no console errors about unresolved module specifiers.

## Step 5 — One deployment path → SC-004

```bash
npm run            # list available scripts
```

**Expected**: `dev`, `build`, `preview` only. No `deploy`, no `predeploy`. Then confirm
in `package.json` that `gh-pages` is absent from `devDependencies` and that the
`homepage` field is gone (FR-006 — deleted, not corrected).

```bash
grep -c gh-pages package-lock.json    # expect 0 matches
```

**Expected**: zero occurrences after regeneration (FR-005). Remember the lockfile is
untracked, so this is local hygiene only — see research.md D-005.

Finally, re-read `.github/workflows/deploy.yml` and confirm it is **unmodified** and
still self-sufficient: `npm install` → `npm run build` → publish `dist`. It must not
reference any removed script, field, or package.

## Step 6 — README is accurate → SC-005, SC-006, and Constitution VI

Read the README and verify, one by one:

- The content path it names **exists**. It must point into `data/` — not
  `src/data/config.tsx`, which does not exist in this repository.
- The deployment section describes **push/merge to `main` → GitHub Actions builds and
  publishes**. It must not tell the reader to run a manual publish command, and must not
  walk them through configuring the Pages source by hand.
- The live site link **opens the working site**. This is the one check that needs
  network access and is the last owner-stated assumption still unverified:
  `https://bahnasy2001.github.io/hassanbahnasy/` (lowercase).
- **Dual audience (Constitution VI)**: a non-technical visitor can still understand what
  the project is and how content gets updated, and a technical reviewer finds the
  deployment description precise rather than hand-wavy. Neither audience is served at
  the other's expense.

## Step 7 — Exactly one deletion → SC-007

```bash
git status --porcelain
```

**Expected**: `metadata.json` is the **only** deleted file. Modified: `index.html`,
`package.json`, `README.md`. Untracked: `package-lock.json` (as before), plus the
`specs/` directory and `.specify/feature.json`.

**Fails if**: any other file shows as deleted. Required-but-unimported files —
`README.md`, `.gitignore`, `tsconfig.json`, `.github/workflows/deploy.yml` — must all
survive.

## Step 8 — Confirm in CI before merging

Push the branch and let the workflow run. This is the authoritative build: it pins
Node 20 while local verification used Node 24 (research.md D-004).

**Expected**: the workflow succeeds and the deployed site is unchanged. Only then merge
to `main`, because that merge publishes to production with no further gate.

## Done When

| Criterion | Check |
|---|---|
| SC-001 zero build warnings | Step 1 |
| SC-002 zero failed requests | Step 3 |
| SC-003 visually identical | Steps 2 and 4 |
| SC-004 one deployment path | Step 5 |
| SC-005 README paths/links resolve | Step 6 |
| SC-006 newcomer can edit content from README alone | Step 6 |
| SC-007 exactly one file deleted | Step 7 |
