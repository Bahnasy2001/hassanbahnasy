# Phase 0 Research: Projects Grouping

**Date**: 2026-08-09 | **Branch**: `feat/projects-grouping` | **Plan**: [plan.md](./plan.md)

Phase 0 had one job that mattered: answer FR-007 — how labs read as secondary — with something
better than taste. It also turned up three facts about the real data that change what the
implementation must handle.

## Baseline

`npm run build` on this branch is clean (feature 002 merged, then a content rewrite merged).
Current work section: one grid, `grid md:grid-cols-2 lg:grid-cols-3 gap-8`, twelve identical
cards.

## Decisions

### D-001 — The site already has a secondary tier; borrow it rather than invent one

**Decision**: Derive the lab treatment from `Skills.tsx`, which is an existing, already-shipped
secondary tier, instead of designing a new one.

**Rationale**: Grepping every utility class in `components/` showed the page is already built
on two density tiers:

| | Primary (`Projects.tsx`) | Secondary (`Skills.tsx`) |
|---|---|---|
| Grid gap | `gap-8` | `gap-6` |
| Card padding | `p-8` | `p-6` |
| Icon | `w-10 h-10` | `w-8 h-8` |
| Heading colour/weight | `text-xl font-bold text-white` | `text-slate-200 font-medium` |

This matters for Principle I. "Make labs look secondary" invites invention, and invention on an
approved design is exactly the drift the constitution exists to prevent. Reusing the values the
owner already approved elsewhere on the same page means the lab tier is not a new visual
language — it is the language the page already speaks, applied to a second place.

It also makes the FR-006 claim **checkable**: every class in the proposal was confirmed present
by grep, with occurrence counts. "No new colours, fonts, or spacing values" becomes a grep
rather than a promise.

**Alternatives considered**: *Design a bespoke lab style* — more expressive, but unverifiable
against "existing classes only" and squarely the kind of unreviewed visual decision Principle I
forbids. *Ask the owner to specify every class* — the owner asked for a proposal, not a
questionnaire.

### D-002 — Density from padding and type, not from column count

**Decision**: Keep `md:grid-cols-2 lg:grid-cols-3` for the lab grid. Take density from `gap-6`,
`p-6`, `w-8 h-8`, `text-lg` title, `text-sm` body.

**Rationale**: "A denser grid" was the request's first suggestion, so this needs justifying.
The column values already in the codebase are 1, 2, 3, and 5. `grid-cols-4` would introduce a
new value, which FR-006 forbids. `lg:grid-cols-5` is tempting because there are exactly five
labs today — but that is a coincidence, not a design: a sixth lab strands one card alone on a
second row, and five columns at `p-6` gives cards too narrow for 6–7 tags plus a title.

Holding the column count also preserves something worth keeping: the projects grid and labs
grid stay on the same column rhythm, so the two groups read as siblings at different weights
rather than as unrelated layouts.

**Alternatives considered**: *`lg:grid-cols-4`* — new value, rejected. *`lg:grid-cols-5`* —
brittle and too narrow, rejected.

### D-003 — The lab count duplicates copy that is already in the summary *(owner decision needed)*

**Finding**: FR-009 requires showing `labCount` in prose, e.g. "20 hands-on labs". But the
summaries **already state the counts in words**:

| labCount | Summary begins… |
|---|---|
| 20 | "**Twenty** progressive labs from Linux basics to…" |
| 28 | "**Twenty-eight** labs across compute, storage, networking…" |
| 29 | "**Twenty-nine** labs spanning classic and YAML pipelines…" |
| 30 | "**Thirty** labs from pipeline basics to a reusable CI template library…" |
| 4 | "**Four** standalone exercises from earlier in the journey…" |

So a lab card would render "20 hands-on labs" immediately above "Twenty progressive labs from
…". All five labs are affected.

**Decision**: Implement FR-009 as specified — the numeral still earns its place as a scannable
badge that a skimming reader picks up faster than a spelled-out word inside a sentence — and
**surface the redundancy to the owner** rather than silently resolving it. Resolving it properly
means editing summary copy in `data/`, which this feature explicitly must not touch (FR-014).

**Options for the owner**:
1. **Ship as planned.** The numeral acts as a badge; slight redundancy is tolerable and
   arguably reinforces the point.
2. **Trim the counts out of the summaries** in a separate content feature, so the numeral is
   the single source of the number.
3. **Change the count phrasing** to something that does not restate the summary, e.g. a bare
   "20 labs" chip.

**Alternatives considered**: *Silently drop FR-009 because the summary covers it* — that would
be discarding a stated requirement on my own judgement. *Rewrite the summaries here* — out of
scope, and content changes belong with the owner.

### D-004 — Two labs have no links, and that is real, not hypothetical

**Finding**: Only **3 of 5** labs carry `repoUrl` (`devops-fundamentals-labs`,
`gitlab-ci-labs`, `individual-labs-early-projects`). `aws-hands-on-labs` and
`azure-devops-labs` have **no links at all**, and no lab has `demoUrl`.

**Decision**: Rely on the card's existing `{project.repoUrl && …}` guard, which already omits
absent links, and verify the resulting two link-less cards look deliberate.

**Rationale**: This was listed as a spec edge case; it turns out to be current data, not a
future possibility. Those two cards will render a folder icon with an empty action row beside
it. That is the existing component's behaviour and needs a visual check rather than a code
change — an empty flex row can read as a missing element if it leaves an odd gap.

### D-005 — No visual-regression tooling, even for a visual feature

**Decision**: Verify by build, class-inventory grep, DOM checks on built output, and manual
comparison. Add no tooling.

**Rationale**: This is the strongest case so far for a screenshot-diff tool — the feature's
whole purpose is a visual change, and "did only the intended things change?" is precisely what
such a tool answers. It is still rejected: Principle V requires explicit approval and a written
justification that existing tools are insufficient, and a one-file change to one section does
not clear that bar. The substitute is narrower but real — because only `Projects.tsx` changes,
grepping the built output for class values and counting rendered items catches structural
mistakes, leaving human eyes responsible only for aesthetic judgement.

**Alternatives considered**: *Add Playwright screenshots* — a whole browser dependency for one
section. *Trust the build* — a green build cannot see a layout regression.

### D-006 — Q1 handled as a provisional decision, not a blocker

**Decision**: Plan on **Option A** (keep the section heading, give the projects group distinct
sub-heading wording) and hold implementation until the owner confirms.

**Rationale**: The plan is already an approval artifact because FR-007 requires it, so Q1 rides
the same gate rather than needing its own round trip. Proceeding costs nothing if the answer
changes: Q1 affects at most two lines of heading markup, and none of the grouping logic,
secondary styling, count rendering, or summary switch depends on it. Blocking the whole plan on
it would have delayed six other decisions for no benefit.

**Alternatives considered**: *Stop and wait* — would have produced nothing. *Pick B (literal
compliance) and ship the duplication* — knowingly shipping something that reads as a bug.

## Cross-Reference: Spec Assumptions → Verification Status

| Spec assumption | Status |
|---|---|
| 12 items exist: 7 projects, 5 labs | ✅ Verified in the content |
| All 5 labs record a lab count | ✅ Verified — 20, 28, 29, 30, 4 |
| All 12 carry a summary | ✅ Verified |
| FR-010's absent-count path is unexercised today | ✅ Confirmed — must still be implemented |
| "Visually secondary" left open for plan-stage approval | ✅ Now proposed with verified precedent (D-001, D-002) |
| Existing card omits absent link buttons | ✅ Verified, and **2 of 5 labs actually hit this path** (D-004) |
| No new colours/fonts/spacing needed | ✅ Verified by grep — every proposed class already exists, with counts |
| Sub-headings are visitor-facing copy needing dual-audience care | ✅ Holds; "Labs & Practice" is plain to both, projects wording pending Q1 |
| Verification is manual | ⚠️ Partly mechanical: item counts and class values are greppable; aesthetics are not |
| Feature is buildable without touching content | ✅ Confirmed — but see D-003, where the ideal fix *is* a content change |
