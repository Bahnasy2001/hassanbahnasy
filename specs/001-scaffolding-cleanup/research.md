# Phase 0 Research: Scaffolding Cleanup

**Date**: 2026-08-04 | **Branch**: `chore/repo-cleanup` | **Plan**: [plan.md](./plan.md)

The spec had no `NEEDS CLARIFICATION` markers, so Phase 0 was spent verifying the
assumptions it recorded rather than resolving unknowns. Every claim below was checked
against the repository or a real build — none is inferred.

## Baseline Evidence (captured before any file was modified)

This satisfies the *evidence* half of FR-013. The remaining half (screenshots) is a
task-level step because it needs a browser.

### Build log — `npm run build`, Node v24.18.1 / npm 11.16.0

```text
> hassan-portfolio@1.0.0 build
> tsc && vite build

vite v5.4.21 building for production...

/index.css doesn't exist at build time, it will remain unchanged to be resolved at runtime
transforming...
✓ 1835 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  2.59 kB │ gzip:  1.17 kB
dist/assets/index-BNL2Oep4.js  285.88 kB │ gzip: 91.27 kB
✓ built in 6.25s
```

**Confirmed**: `tsc` passes. Exactly **one** warning, and it is the in-scope stylesheet
reference — no unrelated warnings hiding behind it. This is the measurement SC-001
improves on (1 warning → 0).

### Built output — `dist/index.html`

Both dead artifacts survive into the shipped HTML:

- `<link rel="stylesheet" href="/index.css">` is emitted **unchanged, as an absolute
  path**. Vite says so in the warning: it cannot resolve the file, so it leaves the tag
  alone. Because the site is served from the `/hassanbahnasy/` subpath, `/index.css`
  resolves against the domain root and 404s. This is the SC-002 measurement (1 → 0).
- The entire `<script type="importmap">` block is emitted **verbatim**.

Baseline figures to compare against after the change: `dist/index.html` = 2.59 kB
(gzip 1.17 kB), `dist/assets/index-*.js` = 285.88 kB (gzip 91.27 kB). The JS bundle
must not change at all; the HTML must shrink.

## Decisions

### D-001 — Remove the dead stylesheet link

**Decision**: Delete `<link rel="stylesheet" href="/index.css">` from `index.html`.

**Rationale**: `index.css` exists nowhere in the repository (confirmed by search: the
only reference is the tag itself). It is the sole cause of the build warning and of a
404 on every page load. Removing the tag is strictly subtractive — a stylesheet that
never loaded cannot have contributed a single style.

**Alternatives considered**: *Create an empty `index.css`* — silences the warning and
the 404 but adds a pointless file and a real network request, and Vite would then also
have to process it. *Change the path to a relative `./index.css`* — still 404s, since
the file does not exist at any path.

### D-002 — Remove the importmap block

**Decision**: Delete the entire `<script type="importmap">` block from `index.html`.

**Rationale**: Proven inert, not assumed inert. The built HTML loads exactly one
module, `./assets/index-BNL2Oep4.js`, into which Vite has bundled React, Framer Motion
and lucide-react. No bare specifier survives to runtime, so the browser never consults
the importmap. It is also actively misleading: it declares React `^19.2.3`, Framer
Motion `^12.23.26` and lucide-react `^0.562.0`, while `package.json` pins React
`^18.2.0`, Framer Motion `^11.0.8` and lucide-react `^0.344.0` — a two-major-version
gap on React. It even lists `vite` and `@vitejs/plugin-react`, which are build tools
that have no meaning in a browser importmap at all.

**Alternatives considered**: *Correct the versions to match `package.json`* — creates a
second source of dependency truth that nothing validates, which is the exact drift this
cleanup removes. *Leave it, since it is harmless* — it ships ~500 bytes of confusing
misinformation to every visitor and would mislead the next maintainer into thinking the
site loads dependencies from a CDN.

**Residual check for implementation**: the baseline measured only the *production* path.
`npm run dev` must be opened once to confirm the dev server also renders correctly
without the importmap.

### D-003 — Delete the `homepage` field rather than fix its casing

**Decision**: Remove `"homepage"` from `package.json` entirely, per the amended FR-006.

**Rationale**: `homepage` is read by exactly one thing in this project — the `gh-pages`
CLI being removed in D-004. `vite.config.ts` sets `base: './'`, so asset URLs are
relative and completely independent of this field (confirmed in the built HTML:
`src="./assets/index-BNL2Oep4.js"`). Once `gh-pages` is gone, no tool, script, or build
step reads it. A corrected value would be an unverifiable claim that no process can
keep accurate — the same failure mode as the importmap in D-002.

**Alternatives considered**: *Correct the casing to `hassanbahnasy`* — the original
request, revised by the owner after this analysis. *Keep it as documentation* — the
README (FR-009) documents the live URL where a human will actually look for it.

### D-004 — Remove the manual publish path; the workflow is verified self-sufficient

**Decision**: Remove the `predeploy` and `deploy` scripts and the `gh-pages`
devDependency from `package.json`.

**Rationale**: The spec assumed the GitHub Actions workflow is self-contained; this is
now verified by reading `.github/workflows/deploy.yml`. It checks out the repo, sets up
Node 20, runs `npm install`, runs `npm run build`, and publishes `dist` via
`JamesIves/github-pages-deploy-action@v4`. It never invokes `npm run deploy`, never
reads `homepage`, and never uses the `gh-pages` package. Every item being removed is
therefore unreachable from the deployment path. Keeping a second publish route that
uploads from a developer's local working copy risks silently overwriting what CI
published, from a tree that was never type-checked.

**Alternatives considered**: *Keep `deploy` as an emergency manual fallback* — an
emergency path that is never exercised is a path that does not work; re-running the
workflow is the real fallback.

**Note for the implementation phase (not a scope change)**: the workflow pins Node 20
while local verification ran on Node 24. Both produce a green build here, but "zero
warnings" is strictly only verified for the local version. The authoritative check is
the workflow run on the branch.

### D-005 — `package-lock.json` is untracked; regenerate locally, and flag committing it

**Decision**: Regenerate the lockfile after removing `gh-pages` and verify no
`gh-pages` entries remain, satisfying FR-005. Do **not** add it to version control as
part of this feature.

**Rationale — this is the most consequential finding of Phase 0.** `package-lock.json`
is **not tracked by git**. `git status` reports it as untracked (`??`) and `.gitignore`
does not cover it (confirmed with `git check-ignore`, which found no match), so it has
simply never been committed. Two consequences:

1. FR-005 is purely local hygiene. The stale `gh-pages` entries in it were never
   published and cannot affect CI.
2. The workflow runs `npm install`, not `npm ci`, so CI resolves dependencies from
   `package.json` afresh on every run and would ignore the lockfile even if it were
   committed.

**Open question for the owner (deliberately out of scope):** an uncommitted lockfile
means CI builds are not reproducible — a transitive dependency can publish a new
version and change the deployed bundle with no repository change to explain it. The fix
is to commit the lockfile and switch the workflow to `npm ci`. That touches the
deployment workflow, which this feature explicitly protects (FR-012), so it belongs in
a separate feature. Raised here so the decision is recorded rather than lost.

### D-006 — Delete `metadata.json`

**Decision**: Delete the file.

**Rationale**: Verified unreferenced. A repository-wide search for `metadata.json`
returns no hits outside the file itself; it is not imported by any module, not listed
in `tsconfig.json` (which has no `include`/`files` array and no reference to it), and
not read by the workflow. Its contents — a name, a description, and an empty
`requestFramePermissions` array — describe a sandbox preview environment that this
project no longer runs in. It is tracked by git, so the deletion is recoverable from
history if that judgement is ever wrong.

**Alternatives considered**: *Keep it as project metadata* — `package.json` and the
README already hold the name and description, and a duplicate that nothing reads is the
drift pattern this cleanup exists to remove.

### D-007 — Verification method, given no test tooling exists

**Decision**: Three-layer manual verification, defined concretely in
[quickstart.md](./quickstart.md): (1) build log must be warning-free, (2) built-output
diff — the JS bundle byte-identical, the HTML shrunk by exactly the removed lines,
(3) visual comparison of the served site against screenshots captured before editing,
at a desktop and a mobile width.

**Rationale**: The project has no test suite, no linter, and no visual-regression
harness, and Principle V forbids adding one for this. Layer 2 is what makes "visually
identical" cheap and near-objective here: because no component, no file in `data/`, and
no Tailwind configuration is touched, the compiled JS bundle should be *byte-identical*
to the baseline. If it is, the only possible visual delta lives in the HTML `<head>`,
which is small enough to eyeball in a diff. The screenshots then confirm what the byte
comparison implies.

**Alternatives considered**: *Add a visual-regression tool* — violates Principle V for
a one-off change. *Trust the build alone* — a green build cannot detect a visual
regression, and FR-011 demands evidence.

## Cross-Reference: Spec Assumptions → Verification Status

| Spec assumption | Status |
|---|---|
| Live URL is lowercase `hassanbahnasy` | ⏳ Owner-stated; must be confirmed by opening the link (task-level, needs network) |
| Address casing does not affect asset loading | ✅ Verified — `base: './'`, built HTML uses `./assets/...` |
| Workflow is self-contained and independent of removals | ✅ Verified by reading `deploy.yml` (D-004) |
| Lockfile regeneration is in scope | ✅ Confirmed, with the important correction that it is untracked (D-005) |
| "No warnings" means the project's own build | ✅ Confirmed — baseline has exactly one, and it is in scope |
| No visual-regression tooling exists | ✅ Verified — no test/lint/CI check beyond the build |
| Build warning and 404 were owner-reported, not reproduced | ✅ **Now reproduced.** Warning text captured above; the 404 mechanism is confirmed by the absolute `/index.css` in the built HTML |
