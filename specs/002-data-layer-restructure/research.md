# Phase 0 Research: Data Layer Restructure

**Date**: 2026-08-04 | **Branch**: `feat/data-architecture` | **Plan**: [plan.md](./plan.md)

The spec carried no `NEEDS CLARIFICATION` markers, so Phase 0 went to work on the thing
that actually made this feature risky: the verification method from feature 001 does not
transfer. Two findings below were established by running things, not by reasoning.

## Baseline Evidence (captured before any file was modified)

### Build — `npm run build`, Node v24.18.1 / npm 11.16.0

```text
vite v5.4.21 building for production...
transforming...
✓ 1835 modules transformed.
dist/index.html                  2.14 kB │ gzip:  1.01 kB
dist/assets/index-BNL2Oep4.js  285.88 kB │ gzip: 91.27 kB
✓ built in 9.17s
```

Zero warnings, confirming feature 001 landed. Bundle md5 `b4bb8c138f13bdca4684d298b2d950f4`,
content hash `index-BNL2Oep4.js`. These are recorded for size comparison only — **not** as
an equality target, for the reason in D-001.

## Decisions

### D-001 — The byte-identical-bundle proof does not transfer; build a content inventory instead

**Decision**: Verify content preservation with an **80-string content inventory**
extracted from `data/config.tsx`, asserting every string is still present in the
post-change bundle. Do not compare bundles for equality.

**Rationale**: Feature 001 was a pure deletion, so an unchanged compiled bundle was
available as near-proof of safety. This feature adds four slugs and four summaries and
reorganises modules, so the bundle *must* change — reusing that check would report a
failure that means nothing, and the real danger is the opposite mistake: someone shrugging
off a genuine difference because "the bundle always changes now."

So Phase 0 built a replacement and **verified it works end to end**:

1. Extracted every double-quoted string literal from `data/config.tsx`, dropped the two
   import specifiers, deduplicated → **80 content strings**.
2. Confirmed all 80 appear **verbatim** in the baseline bundle. Zero missing.

Vite does not mangle string literals, so this holds after minification. The inventory is
committed at [contracts/content-inventory.txt](./contracts/content-inventory.txt) so it is
reviewable and reusable rather than a throwaway.

**What it proves**: no displayed content string was lost, truncated, or edited while being
moved between files — mechanically, with no browser.

**What it does NOT prove**, stated plainly so nobody over-trusts it:
- **Ordering.** A reordered `projects` or `navItems` array passes the inventory while
  visibly changing the page. Ordering gets its own explicit check (quickstart Step 4).
- **Duplication.** Content appearing twice still passes. Covered by the
  single-source-of-truth grep (quickstart Step 5).
- **Layout and styling.** Nothing string-based can see those; that is what the screenshot
  comparison is for.

**Alternatives considered**: *Compare bundles for equality* — guaranteed false failure.
*Trust the build alone* — a green build cannot detect deleted content, since a shorter
string is still a valid string. *Add a visual-regression tool* — violates Principle V.

### D-002 — `isolatedModules` forbids bare type re-exports (verified empirically)

**Decision**: Every type re-export in the new `data/config.tsx` must use `export type`,
never a bare `export`.

**Rationale**: `tsconfig.json` sets `isolatedModules: true`. Rather than assume the
consequence, Phase 0 tested it with a throwaway probe file:

```text
# probe A — export { Config } from '../types';
data/__probe.ts(2,10): error TS1205: Re-exporting a type when 'isolatedModules'
                       is enabled requires using 'export type'.

# probe B — export type { Config } from '../types';
(clean — no output)
```

The probe was deleted and the tree confirmed clean. This is the one trap in this feature
that would otherwise be hit blind on the first build of step 5, and it applies to `Config`,
`Project`, `Certification`, and every other type the aggregate layer re-exposes.

**Alternatives considered**: *Relax `isolatedModules`* — a build-configuration change,
out of scope, and it would weaken a setting that exists to keep per-file transpilation
sound. *Do not re-export types at all* — components import only `{ config }` today, so
strictly optional; but re-exporting types keeps the module a complete entry point for
future consumers, and `export type` makes it free.

### D-003 — `.ts` for the new modules, `.tsx` retained for `config.tsx`

**Decision**: Create the five new modules as `.ts`. Keep `data/config.tsx` at its current
path and extension.

**Rationale**: The current file contains **no JSX** — verified by reading it. Its lucide
imports are icon *values* (`Github`, `Cloud`, …) assigned to fields typed `LucideIcon`,
which is ordinary value code. So `.ts` is correct for the new files, and `skills.ts` can
hold the icon imports without issue. `config.tsx` keeps its extension because all eight
components import `from '../data/config'` extensionless; renaming it would either break
resolution or force edits to eight component files, violating FR-009 for no benefit.

**Alternatives considered**: *Rename to `config.ts`* — Vite would still resolve the
extensionless import, but the file is untouched-by-contract for components and there is no
gain worth the risk. *Make the new files `.tsx` for consistency* — misleading, since none
contains JSX.

### D-004 — Slug rule, and slugs as stable identifiers

**Decision**: `title` → lowercase → replace each run of non-alphanumeric characters with a
single `-` → trim leading/trailing `-`. Yielding:

| Title | Slug |
|---|---|
| Secure Cloud-Native Microservices CI/CD | `secure-cloud-native-microservices-ci-cd` |
| Serverless Image Editor | `serverless-image-editor` |
| Pulumi Azure Infrastructure – NDC Core | `pulumi-azure-infrastructure-ndc-core` |
| To-Do List GitOps Pipeline | `to-do-list-gitops-pipeline` |

**Rationale**: The rule had to be explicit because the real titles exercise three separate
edge cases: a slash (`CI/CD` → `ci-cd`), internal hyphens (`Cloud-Native`, `To-Do`, which
must not double up), and a **non-ASCII en dash** (`– NDC Core`, which a naive
`[a-z0-9]`-only rule silently drops rather than converting). All four results are distinct
and URL-safe.

Slugs are written as **literal values, not computed at runtime**, precisely because they
are identity: a future title edit must not silently change a project's identifier and break
an inbound link. The rule documents how they were derived; it is not a function shipped in
the bundle.

**Alternatives considered**: *Derive slugs at runtime from titles* — makes identity a
function of display text, so a copy edit becomes a breaking URL change. *Hand-pick shorter
slugs* — loses the mechanical audit trail from title to slug.

### D-005 — Verification stays inside the existing toolchain

**Decision**: Implement the inventory check with `grep` against the built bundle. Add no
tooling.

**Rationale**: The obvious way to compare content before and after is to import the data
module and diff the resolved object — which needs `tsx`, `ts-node`, or a throwaway Vite
entry point. The first two are new dependencies (Principle V); the third means touching
build configuration that FR-009 protects. Since string literals survive minification
verbatim — confirmed in D-001 — `grep` over the bundle gets the same signal for free.

**Alternatives considered**: *`npx tsx` without installing* — still fetches a package, and
a real dependency decision should not hide behind `npx`. *A temporary Vite entry* — touches
protected configuration and leaves scaffolding to clean up, exactly the class of leftover
feature 001 just removed.

### D-006 — Certifications sit beside the aggregate, not inside it

**Decision**: Export `certifications` as a named export from the aggregate layer. Do not
add a `certifications` field to the `Config` interface.

**Rationale**: All eight components depend on `Config`. Adding a required field forces a
value nothing renders; adding an optional one puts a permanently-undefined field in the
interface every component depends on. Keeping it a sibling export means the frozen consumer
contract in [contracts/config-aggregate.md](./contracts/config-aggregate.md) stays exactly
as it is, while certifications are still reachable for the future feature that renders
them — which is the natural moment to decide whether they belong in the aggregate.

**Alternatives considered**: *Add to `Config` now* — churns the contract every component
depends on, for content that does not exist. *Skip certifications entirely* — the owner
asked for the shape now, and designing it while the data layer is already open is cheaper
than reopening it.

## Cross-Reference: Spec Assumptions → Verification Status

| Spec assumption | Status |
|---|---|
| Slug derivation rule and the four resulting values | ✅ Confirmed; edge cases (slash, en dash, existing hyphens) analysed in D-004 |
| Slugs are stable once set | ✅ Reinforced — D-004 makes them literals rather than computed, so a title edit cannot move them |
| Summary = first sentence of each description | ✅ Held; still a judgement call, and unrendered so cheap to revise |
| Certifications beside the aggregate, not inside it | ✅ Confirmed as D-006, with the reversal point named |
| Compiled output will change, and equality checks are invalid | ✅ Confirmed, and **replaced** by a working check (D-001) rather than left as a gap |
| No display code reads the new fields | ✅ Verified — project cards read only `title`, `description`, `tags`, `repoUrl`, `demoUrl` |
| Verification is manual | ⚠️ **Improved.** Content preservation is now mechanical (80/80 inventory). Only ordering, layout, and styling still need human eyes |
| No dependency is added | ✅ Held under pressure — see D-005 |
| Type re-exports work as written | ✅ **Empirically tested** — bare re-export fails with TS1205; `export type` is clean (D-002) |
