# Validation Guide: Projects Grouping

**Date**: 2026-08-09 | **Branch**: `feat/projects-grouping` | **Plan**: [plan.md](./plan.md)

Each step maps to a success criterion in [spec.md](./spec.md).

> ⚠️ **This feature intends to change the rendering.** Unlike features 001 and 002, "nothing
> changed" is the wrong test. The question is: *did only the intended things change?* So the
> baseline is used differently — to confirm colours, fonts, spacing rhythm, and every other
> section are untouched while the work section deliberately differs.

## Prerequisites

- Node 20+, dependencies installed
- On `feat/projects-grouping`, **not** `main` — merging to `main` deploys to production
- A browser with developer tools, for Steps 6–8
- **Both approvals in hand**: Q1 (sub-heading wording) and FR-007 (secondary treatment)

Baseline artifacts outside the repo:
`C:\Users\Pc\AppData\Local\Temp\claude\e--hassan-el-bahnasy-portfolio\2429c9d8-0af8-4e08-abeb-47ae3259d5d8\scratchpad\baseline-003\`
(`<BASELINE>` below).

## Step 0 — Baseline, before editing

```bash
npm run build
cp dist/assets/index-*.js <BASELINE>/bundle.js.before
grep -rhoE 'text-[a-z0-9-]+|bg-[a-z0-9/-]+|gap-[0-9]+|p-[0-9]+|m[btlrxy]?-[0-9]+|grid-cols-[0-9]+|w-[0-9]+|h-[0-9]+' components/ \
  | sort -u > <BASELINE>/class-inventory.before.txt
npm run preview
```

Capture full-page screenshots at ~1440px and ~390px. The **work section** shots are the
before/after comparison; the **other seven sections** are the untouched control.

## Step 1 — Build is clean → SC-007

```bash
npm run build
```

**Expected**: exits 0, zero warnings, zero errors.

## Step 2 — Only one file changed → SC-004

```bash
git status --porcelain
```

**Expected**: `M components/Projects.tsx` and nothing else (plus `specs/` additions). Any change
to `index.html`, `data/`, `types.ts`, `App.tsx`, another component, or `.github/` is a hard
failure of FR-014.

## Step 3 — All 12 items render, 7 then 5 → SC-001

Count rendered card titles in the built bundle, or count cards in the browser.

**Expected**: 12 total. The projects group has 7, the labs group has 5, projects first.
Order within each group matches `data/projects.ts` (FR-013):

- Projects: Secure Cloud-Native Microservices CI/CD Platform → Pulumi Azure Infrastructure —
  NDC Core → Three-Tier App Deployment on Azure → Serverless Image Editor → To-Do List CI/CD +
  GitOps → Microservices CI/CD with GitLab → kubeseal Re-encryption — Design Proposal
- Labs: DevOps Fundamentals Labs → AWS Hands-On Labs → Azure DevOps Labs → GitLab CI Labs →
  Individual Labs & Early Projects

## Step 4 — Empty group renders nothing → FR-004

No group is empty in real data, so exercise it deliberately: temporarily change the lab filter
to match nothing, build, and confirm the "Labs & Practice" sub-heading **disappears entirely**
rather than sitting above empty space. Then revert.

**Expected**: no orphaned heading, no empty grid container, no stray vertical gap.

## Step 5 — Lab counts, and the two link-less cards → SC-005

**Expected**: exactly 5 lab-count strings render — 20, 28, 29, 30, 4 — and **0** appear on
project cards.

Then check the two labs with no links at all (`AWS Hands-On Labs`, `Azure DevOps Labs`,
research.md D-004): their action row must look deliberate, not like a failed render. If the
empty row leaves an odd gap beside the folder icon, that is a finding to report, not to silently
restyle.

## Step 6 — Card bodies are summaries → SC-006

**Expected**: all 12 cards show the short `summary`, not the long `description`. Spot-check that
no card shows a multi-sentence paragraph, and that card heights stay consistent within each
group with no card collapsing to a sliver.

**Also note** (research.md D-003): each lab card will show its numeral *and* a summary that
already spells the number out — "20 hands-on labs" above "Twenty progressive labs…". This is
expected and was flagged for the owner; it is not a bug to fix here.

## Step 7 — No new colours, fonts, or spacing values → SC-003

```bash
grep -rhoE 'text-[a-z0-9-]+|bg-[a-z0-9/-]+|gap-[0-9]+|p-[0-9]+|m[btlrxy]?-[0-9]+|grid-cols-[0-9]+|w-[0-9]+|h-[0-9]+' components/ \
  | sort -u > /tmp/class-inventory.after.txt
diff <BASELINE>/class-inventory.before.txt /tmp/class-inventory.after.txt
```

**Expected**: **no added lines.** Every class used already existed. Removed lines are fine (the
`description` body class may drop out). An added line means a new design value slipped in —
stop and replace it with an existing one.

Then confirm `index.html`'s `tailwind.config` block is untouched via Step 2.

## Step 8 — Anchor still works → SC-009

**Expected**: clicking "Projects" in the navbar still scrolls to the work section. The
`id="projects"` must still be on the outer `<section>` (contract INV-1).

## Step 9 — Visual comparison → SC-002, SC-008

Compare against the Step 0 screenshots at both widths.

**Expected in the work section** (intended changes): two labelled groups, projects first; lab
cards visibly lighter — smaller padding, smaller icon, softer title, smaller body — while
clearly the same card family.

**Expected everywhere else** (must be identical): the other seven sections, the palette, the
fonts, and the page's spacing rhythm show no difference at all.

**FR-008 check** — lab cards must stay usable, not just lighter:

- Lab body text is readable at normal viewing distance, not washed out
- Lab titles are clearly headings
- Every lab link is clickable, including at mobile width with a touch-sized target
- Lab cards' 6–7 tags wrap without overflowing or crushing the card (research.md D-004 risk)

**The SC-002 test**: show it to someone unfamiliar and ask which group is substantial work.
They should answer correctly from grouping and weight alone, without reading body text.

## Step 10 — Confirm in CI before merging

Push and let the workflow run (it pins Node 20; local used Node 24).

**Expected**: green. Only then merge to `main`, because that merge publishes to production.

## Done When

| Criterion | Check |
|---|---|
| SC-001 all 12 render, 7 + 5 | Step 3 |
| SC-002 grouping legible to a stranger | Step 9 |
| SC-003 no new colour/font/spacing values | Step 7 |
| SC-004 only the one file changed | Step 2 |
| SC-005 5 lab counts, 0 on projects | Step 5 |
| SC-006 12 summaries, 0 descriptions | Step 6 |
| SC-007 zero build warnings | Step 1 |
| SC-008 labs legible and operable | Step 9 |
| SC-009 anchor works | Step 8 |
