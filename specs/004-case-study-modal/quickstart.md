# Validation Guide: Case Study Modal

**Date**: 2026-08-09 | **Branch**: `feat/project-popups` | **Plan**: [plan.md](./plan.md)

Each step maps to a success criterion in [spec.md](./spec.md).

> ⚠️ **This feature is more interaction than markup.** The build and the class-inventory diff prove
> almost nothing about whether it *works* — dismissal, focus, and mobile reachability are the real
> risks and none is mechanically checkable. Steps 6, 7, and 9 carry the weight, and all three need a
> browser.

## Prerequisites

- Node 20+, dependencies installed
- On `feat/project-popups`, **not** `main` — merging to `main` deploys to production
- A browser with developer tools and a keyboard, for Steps 5–9
- **Q1 approved** (the two behavioural classes), or Step 9's mobile check is expected to fail

Baseline outside the repo:
`C:\Users\Pc\AppData\Local\Temp\claude\e--hassan-el-bahnasy-portfolio\2429c9d8-0af8-4e08-abeb-47ae3259d5d8\scratchpad\baseline-004\`
(`<BASELINE>`).

## Step 0 — Baseline, before editing

```bash
npm run build
cp dist/assets/index-*.js <BASELINE>/bundle.js.before
grep -rhoE 'text-[a-z0-9-]+|bg-[a-z0-9/-]+|gap-[0-9]+|p-[0-9]+|m[btlrxy]?-[0-9]+|grid-cols-[0-9]+|w-[0-9]+|h-[0-9]+|max-[wh]-[a-z0-9]+|overflow-[a-z-]+|z-[0-9]+' components/ \
  | sort -u > <BASELINE>/class-inventory.before.txt
```

Note the inventory pattern is **wider than feature 003's** — it now also captures `max-h-*`,
`overflow-*`, and `z-*`, which is what makes the two-new-class claim checkable.

Screenshot the work section at ~1440px and ~390px.

## Step 1 — Build is clean → SC-008

**Expected**: exits 0, zero warnings, zero errors.

## Step 2 — Only the four permitted files changed → SC-010

```bash
git status --porcelain
```

**Expected**: exactly `M types.ts`, `M data/projects.ts`, `M components/Projects.tsx`,
`?? components/CaseStudyDialog.tsx` (plus `specs/`). Any change to `index.html`, `App.tsx`,
`index.tsx`, another component, another data file, or `.github/` is a hard FR-021 failure.

## Step 3 — Class inventory: exactly two additions → SC-009

```bash
diff <BASELINE>/class-inventory.before.txt <(grep -rhoE '<same pattern as Step 0>' components/ | sort -u)
```

**Expected**: exactly two `>` lines — `max-h-full` and `overflow-y-auto`. **Zero** added colour,
font, or spacing values. Any third addition must be justified or replaced with an existing class.

## Step 4 — 12 cards, 8 affordances → SC-001, SC-002

**Expected**: 12 cards in two groups, order unchanged from feature 003. Exactly **8** show "Read
case study" — all 7 in Featured Projects, plus "Individual Labs & Early Projects" in Labs &
Practice. The other **4** labs cards show none:

- DevOps Fundamentals Labs, AWS Hands-On Labs, Azure DevOps Labs, GitLab CI Labs → **no affordance**

## Step 5 — Dialog content → SC-005

Open a project's case study. **Expected**: title, then Problem, Approach, Impact in that order, each
labelled, each showing the item's own text.

Open "Individual Labs & Early Projects". **Expected**: additionally a "Repositories" heading with
**4** links. Click each: correct repository, new tab, portfolio page unchanged behind. The old
profile link `https://github.com/Bahnasy2001` must appear **nowhere**.

Open any project (which has no `links`). **Expected**: **no** "Repositories" heading, no empty list.

## Step 6 — Dismissal, all three ways → SC-003, SC-004

Test each **independently**, reopening between tests:

1. Close control → closes
2. Click the backdrop (outside the panel) → closes
3. Escape → closes

Then the inverse, which is the classic bug (research.md D-003). With the dialog open, click **at
least 5 different places inside the panel** — the title, a section label, body prose, blank padding,
and the Repositories heading. **Expected: 0 of 5 close it.**

Then repeat open/close **at least 3 times** and re-test Escape each time — this catches a stale or
duplicated key listener (research.md D-004).

Finally: open a project's dialog, close it, then open a **different** project's. **Expected**: only
the second item's content, with nothing left over from the first.

## Step 7 — Keyboard-only pass → SC-007

Put the mouse away.

**Expected**: Tab reaches a "Read case study" affordance; Enter or Space opens it; focus lands inside
the dialog; Tab cycles **within** the dialog and never reaches the page behind it; Escape closes it;
and focus returns to the affordance that opened it.

This is the requirement most likely to be quietly wrong, because the project has no dialog library
doing it (research.md D-005).

## Step 8 — Page behind the dialog → FR-015, INV-8

**Expected**: while open, the page behind does not scroll. On close, the visitor is at exactly the
same scroll position as before opening.

**Then check the leak**: close the dialog and confirm the page scrolls normally again. A body lock
left in place makes the whole page permanently unscrollable — the worst possible outcome of this
feature.

## Step 9 — Mobile width → SC-006

At ~390px, open **"Individual Labs & Early Projects"** — the longest case study (title, three prose
sections, four links).

**Expected**: every part reachable, the panel scrolling internally, no content cut off, and no
horizontal page scrolling. Confirm all three dismissal paths still work at this width and that the
close control is a comfortable touch target.

**Under Q1 Option B this step is expected to fail** — the panel would extend past the viewport with
its lower part unreachable. That failure is the cost of Option B, not a bug.

## Step 10 — Visual comparison

Compare against Step 0 screenshots.

**Expected in the work section**: 8 cards gain one small accent-coloured line; nothing else moves.
The multi-part labs card **loses its repository icon button** (its `repoUrl` was removed) — this is
intended and is the one card whose top row changes.

**Expected everywhere else**: identical. Palette, fonts, spacing rhythm, and the other seven
sections unchanged.

## Step 11 — Confirm in CI before merging

Push and let the workflow run (Node 20 in CI, Node 24 locally).

**Expected**: green. Only then merge to `main`, because that merge publishes to production.

## Done When

| Criterion | Check |
|---|---|
| SC-001 12 cards render | Step 4 |
| SC-002 8 affordances, 4 without | Step 4 |
| SC-003 closes three ways | Step 6 |
| SC-004 inside clicks never close | Step 6 |
| SC-005 4 named links, old profile link gone | Step 5 |
| SC-006 usable at mobile width | Step 9 |
| SC-007 keyboard-only, focus restored | Step 7 |
| SC-008 zero build warnings | Step 1 |
| SC-009 exactly two new classes | Step 3 |
| SC-010 only 4 files changed | Step 2 |
