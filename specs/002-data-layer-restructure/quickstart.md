# Validation Guide: Data Layer Restructure

**Date**: 2026-08-04 | **Branch**: `feat/data-architecture` | **Plan**: [plan.md](./plan.md)

How to prove this feature is done. Each step maps to a success criterion in
[spec.md](./spec.md). Baseline figures come from [research.md](./research.md).

## Prerequisites

- Node 20+ and npm (verified on Node v24.18.1 / npm 11.16.0)
- Dependencies installed
- On `feat/data-architecture`, **not** `main` — merging to `main` deploys to production
  automatically (Constitution IV)
- A browser with developer tools, for Step 6

Baseline artifacts live outside the repo:
`C:\Users\Pc\AppData\Local\Temp\claude\e--hassan-el-bahnasy-portfolio\2429c9d8-0af8-4e08-abeb-47ae3259d5d8\scratchpad\baseline-002\`
(referred to below as `<BASELINE>`).

> ⚠️ **Do not use the byte-identical-bundle check from feature 001.** It does not apply
> here: this feature adds slugs and summaries, so the bundle *must* change and its content
> hash *must* move. Bundle size is a sanity signal only. The content inventory in Step 3
> replaces it as the mechanical proof. See research.md D-001.

## Step 0 — Baseline (BEFORE editing anything)

Required by FR-014. **Already captured**: build log, `bundle.js.before`,
`index.html.before`, and the 80-string inventory verified 80/80 against the baseline
bundle. Baseline figures: `dist/index.html` 2.14 kB, `dist/assets/index-BNL2Oep4.js`
285.88 kB (gzip 91.27 kB), md5 `b4bb8c138f13bdca4684d298b2d950f4`.

**Still to capture** (needs a browser): full-page screenshots at desktop (~1440px) and
mobile (~390px) widths, covering all eight sections.

## Step 1 — Build is clean → SC-001

```bash
npm run build
```

**Expected**: exits 0, zero warnings, zero errors.

**Note on the expected red build**: after extending `types.ts` but before migrating the
four projects, `tsc` **should fail** with missing `slug`/`kind`/`summary`. That is the
Principle III mechanism proving the required fields bite — not a problem to route around by
making them optional.

## Step 2 — Bundle size sanity (NOT an equality check)

```bash
ls -l dist/assets/
```

**Expected**: grown by under ~1 kB from 285.88 kB — roughly four slugs plus four
summaries. The content hash **will** differ from `index-BNL2Oep4.js`; that is correct.

**Investigate if**: growth exceeds a few kB. That suggests a module got included twice, or
content was duplicated rather than moved.

## Step 3 — Content inventory: all 80 strings survive → SC-003 (mechanical half)

The core check. Every string in
[contracts/content-inventory.txt](./contracts/content-inventory.txt) must still appear
verbatim in the built bundle:

```bash
while IFS= read -r s; do
  grep -qF -- "$s" dist/assets/index-*.js || echo "MISSING: $s"
done < specs/002-data-layer-restructure/contracts/content-inventory.txt
```

**Expected**: no output. Any `MISSING:` line means content was lost, truncated, or edited
while being moved — stop and fix before going further.

**What this does not catch** (so do not treat it as sufficient): reordering, duplication,
layout, or styling. Steps 4, 5, and 6 cover those.

## Step 4 — Ordering preserved → SC-003 (the half the inventory can't see)

Order is render order (contract INV-4). Confirm each array's sequence is unchanged:

| Array | Expected order |
|---|---|
| `projects` | Secure Cloud-Native Microservices CI/CD → Serverless Image Editor → Pulumi Azure Infrastructure – NDC Core → To-Do List GitOps Pipeline |
| `experience` | Sheen Information Technology → IT Visionary → National Telecommunications Institute (NTI) |
| `navItems` | About → Experience → Skills → Projects → Contact |
| `socials` | GitHub → LinkedIn → Email |
| `skills` | Linux Administration first … Security Tools (SonarQube, Trivy) last (10 total) |

Also confirm each project's `tags` array keeps its original order.

## Step 5 — Single source of truth → SC-007

`data/config.tsx` must compose and re-export only, holding no content of its own
(contract INV-6):

```bash
grep -nE '"(Hassan|Designed|Deployed|A fast|I am a|I help)' data/config.tsx || echo "no content literals (expected)"
grep -c "export" data/config.tsx
```

**Expected**: no content literals in `data/config.tsx`. Then confirm each content item
appears in exactly one module:

```bash
grep -rl "Sheen Information Technology" data/   # expect: data/experience.ts only
grep -rl "Linux Administration"          data/   # expect: data/skills.ts only
grep -rl "Serverless Image Editor"       data/   # expect: data/projects.ts only
grep -rl "hassanelbahnasy85"             data/   # expect: data/site.ts only
```

**Expected**: exactly one file per string. Two files means duplicated content, which the
inventory check cannot detect.

## Step 6 — Visually identical → SC-003 (final)

```bash
npm run preview
```

Compare against the Step 0 screenshots at both widths. **Expected**: no perceptible
difference in text, colors, fonts, spacing, section order, or animations. Pay particular
attention to:

- Project cards show the **`description`**, not the new shorter `summary` (contract INV-5)
- Each card's GitHub button is present (all four projects have `repoUrl`) and no demo
  button appears (none has `demoUrl`)
- Scroll-triggered animations and the custom scrollbar still work

## Step 7 — New shape accepts content → SC-005, SC-006

```bash
grep -c "slug:" data/projects.ts        # expect 4
grep -oE "slug: '[^']+'" data/projects.ts | sort -u | wc -l   # expect 4 (all unique)
grep -c "kind: 'project'" data/projects.ts   # expect 4
grep -c "summary:" data/projects.ts     # expect 4
```

**Expected**: 4 / 4 unique / 4 / 4. Each slug must match
`^[a-z0-9]+(-[a-z0-9]+)*$` (VR-002), and `problem`, `approach`, `impact`, `year`, `image`,
`readmeUrl` must be **absent**, not empty strings (FR-006).

Then confirm extensibility without type edits — temporarily add `year: '2025'` and
`problem: 'test'` to one project, build, confirm it compiles, then revert. Same for a
certification entry in `data/certifications.ts`.

## Step 8 — Nothing that renders was touched → SC-002

```bash
git status --porcelain components/ App.tsx index.tsx index.html vite.config.ts tsconfig.json .github/
```

**Expected**: **completely empty**. Any output here is a hard failure of FR-009.

```bash
git status --porcelain
```

**Expected**: `M types.ts`, `M data/config.tsx`, and five new `data/*.ts` files. Nothing
else.

## Step 9 — Confirm in CI before merging

Push the branch and let the workflow run — it pins Node 20 while local verification used
Node 24.

**Expected**: green. Only then merge to `main`, because that merge publishes to production
with no further gate.

## Done When

| Criterion | Check |
|---|---|
| SC-001 zero build warnings | Step 1 |
| SC-002 zero rendering files modified | Step 8 |
| SC-003 visually identical | Steps 3, 4, 6 |
| SC-004 one file per content type | Step 5 |
| SC-005 4 unique slugs, kinds, summaries | Step 7 |
| SC-006 depth/certs need no type change | Step 7 |
| SC-007 single source of truth | Step 5 |
