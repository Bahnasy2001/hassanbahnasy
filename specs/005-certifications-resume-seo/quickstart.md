# Validation Guide: Certifications, Resume Link & Link Previews

**Date**: 2026-08-10 | **Branch**: `feat/certifications-and-resume` | **Plan**: [plan.md](./plan.md)

Each step maps to a success criterion in [spec.md](./spec.md).

> ⚠️ **The class-inventory check changed in this feature.** The method used in 003–004 was found to
> have two blind spots and was repaired (research.md D-001). Use the command in Step 0 — the older
> pattern would miss a new padding value or border colour, which is exactly what this feature could
> introduce.

## Prerequisites

- Node 20+, dependencies installed
- On `feat/certifications-and-resume`, **not** `main` — merging to `main` deploys to production
- A browser, for Steps 5–9
- **Decisions A, B and C approved** (in-progress chip, no expert emphasis, nav entry)

Baseline outside the repo:
`C:\Users\Pc\AppData\Local\Temp\claude\e--hassan-el-bahnasy-portfolio\2429c9d8-0af8-4e08-abeb-47ae3259d5d8\scratchpad\baseline-005\`
(`<BASELINE>`).

## Step 0 — Baseline, before editing

```bash
npm run build
cp dist/assets/index-*.js <BASELINE>/bundle.js.before
cp index.html <BASELINE>/index.html.source.before

# REPAIRED class inventory: union of className literals and quoted style-object strings
grep -rhoE "'[^']*'|\"[^\"]*\"" components/ \
  | sed "s/^['\"]//; s/['\"]$//" | tr ' ' '\n' \
  | grep -E '^[a-z]' | grep -E '[-:/]' | grep -vE '^https?:|^\.|^@|/>|^mailto' \
  | sort -u > <BASELINE>/class-inventory.before.txt
```

Baseline is **251 tokens**. Screenshot the whole page at ~1440px and ~390px — the Skills→Projects
boundary matters, since a new section is being inserted there.

## Step 1 — Build is clean → SC-008

**Expected**: exits 0, zero warnings.

**Note on the intended red build**: after `resumeUrl` is added to `Config` but before `data/site.ts`
supplies it, the build **fails**. That is the mechanism proving the field is required
(research.md D-003). Do not resolve it by making the field optional.

## Step 2 — Only the six permitted files changed → SC-010

```bash
git status --porcelain
```

**Expected**: `M types.ts`, `M data/site.ts`, `M components/Navbar.tsx`, `M App.tsx`,
`M index.html`, `?? components/Certifications.tsx` (plus `specs/`). Anything else — especially
another component or `data/certifications.ts` — is a hard FR-022 failure.

## Step 3 — Class inventory: zero new design values → SC-006

```bash
diff <BASELINE>/class-inventory.before.txt <(grep -rhoE "'[^']*'|\"[^\"]*\"" components/ \
  | sed "s/^['\"]//; s/['\"]$//" | tr ' ' '\n' \
  | grep -E '^[a-z]' | grep -E '[-:/]' | grep -vE '^https?:|^\.|^@|/>|^mailto' | sort -u)
```

**Expected**: added lines contain **no new colour, font, or spacing value**. Because the repaired
method also captures prose and identifiers, some added lines are expected noise — for example the
chip label and the section's own copy. **Inspect every added line rather than counting them**; only
design values are failures.

Then the exact check: every class in
[contracts/certifications-section-contract.md](./contracts/certifications-section-contract.md)'s class
table must already appear in the baseline file.

## Step 4 — Resume link, both entry points → SC-001, SC-002

```bash
grep -rn 'resume.pdf' components/ ; echo "(no output = the broken link is gone)"
grep -rn 'drive.google.com' components/ data/ | cat
```

**Expected**: zero occurrences of `resume.pdf` anywhere. The CV address appears **exactly once**, in
`data/site.ts`. Neither navigation anchor contains a literal URL.

Then in the browser: click Resume in the **desktop** navigation and again in the **mobile** menu.
Both must open the CV in a new tab with the portfolio still open behind. **Both** — the mobile menu
has its own anchor and is easy to miss.

## Step 5 — Seven credentials, in order → SC-003

**Expected**: the section renders 7 cards in exactly the order in
[data-model.md](./data-model.md)'s inventory table:

AZ-305 → AZ-400 → CKA → AZ-204 → AZ-104 → AWS SAA → KCNA

Each showing name, issuer, and year. No sorting by status, tier, or year.

## Step 6 — Links and non-links → SC-004

**Expected**: **5** cards link to a credential and open in a new tab — AZ-305, AZ-204, AZ-104,
AWS SAA, KCNA. **2** cards are not links: **AZ-400** and **CKA**.

Hover the two non-links: they must offer **no** click target and no hover affordance implying one.

## Step 7 — In-progress distinguishable → SC-005

**Expected**: AZ-400 and CKA carry an "In progress" chip; the other five carry nothing in its place.
A viewer should identify those two without reading the card closely.

**Also confirm the chip does not read as an error or a disabled state** (FR-014), and that AZ-400 —
which is both expert-tier and in progress — does not carry any competing emphasis, since decision B
recommends none.

## Step 8 — Nothing else moved → SC-009

```bash
git diff App.tsx
```

**Expected**: exactly one added import and one added `<Certifications />` element between `<Skills />`
and `<Projects />`. The other seven section elements keep their original relative order.

Then compare against the Step 0 screenshots: **every other section identical**, palette, fonts and
spacing rhythm unchanged. Check the **Skills → Certifications → Projects** boundary specifically —
the new section shares `bg-primary` with Projects by design (D-005), so confirm the two still read as
separate sections rather than one long block.

**If decision C was approved**: check the desktop navigation at **768–900px** for crowding with six
links plus the Resume button. If it crowds, dropping the nav entry is the fallback.

## Step 9 — Metadata → SC-007

```bash
diff <BASELINE>/index.html.source.before index.html
```

**Expected**: additions only, all of them **above** the Tailwind CDN comment. The `tailwind.config`
block, the `<style>` block, the CDN tag and the Google Fonts import must be untouched
([contracts/metadata-contract.md](./contracts/metadata-contract.md) INV-1, INV-2).

Then paste the site URL into a link-preview inspector.

**Expected**: a title, a description, a type, and the canonical lowercase URL where there was nothing.
**Expected limitation**: no image, so the preview is text-only. That is the known gap, not a bug.

## Step 10 — Confirm in CI before merging

Push and let the workflow run (Node 20 in CI, Node 24 locally).

**Expected**: green. Only then merge to `main`, because that merge publishes to production.

## Done When

| Criterion | Check |
|---|---|
| SC-001 both Resume links work | Step 4 |
| SC-002 CV address appears once | Step 4 |
| SC-003 7 credentials in order | Step 5 |
| SC-004 5 link, 2 do not | Step 6 |
| SC-005 2 identifiable as in progress | Step 7 |
| SC-006 no new design values | Step 3 |
| SC-007 link preview metadata present | Step 9 |
| SC-008 zero build warnings | Step 1 |
| SC-009 every other section unchanged | Step 8 |
| SC-010 only 6 files changed | Step 2 |
