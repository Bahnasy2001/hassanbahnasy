# Phase 0 Research: Certifications, Resume Link & Link Previews

**Date**: 2026-08-10 | **Branch**: `feat/certifications-and-resume` | **Plan**: [plan.md](./plan.md)

The spec had no blocking clarifications, so Phase 0 went after three things: repair the verification
method (it turned out to be broken), find real evidence for the two design recommendations the owner
asked for, and check whether anything about the request's shape was wrong.

## Baseline

`npm run build` clean on this branch (004 merged as PR #5). 8 sections in `App.tsx`, 7 credentials in
content and none rendered, two Resume anchors both pointing at a missing file.

## Decisions

### D-001 — The class-inventory check was broken; it is now fixed *(most important finding)*

**Decision**: Build the inventory from the **union** of `className="…"` literals **and** all quoted
string literals in `components/`, split on whitespace into individual tokens.

**Rationale**: This check is the mechanism behind "no new colour, font, or spacing value" in features
003, 004, and now 005. Testing it against classes I knew were present revealed **two independent
blind spots**:

| Method | Missed | Why |
|---|---|---|
| The regex pattern used in 003/004 | `px-3`, `py-1`, `border-slate-800` | The pattern had `p-[0-9]+` (no `px`/`py` variants) and `border-[a-z0-9/]+`, whose character class excludes the hyphen inside `slate-800` |
| Token-splitting `className="…"` only | `lg:grid-cols-3`, `gap-8` | Since feature 003, `Projects.tsx` holds grid and card classes in the `TIERS` **object** as single-quoted strings, not in `className="…"` attributes |

Either blind spot alone would have let this feature add a new padding value or a new border colour
**without the check noticing** — and this is the first feature to add a whole new component, so the
exposure was at its highest exactly when the check was weakest.

The union method was verified against 26 known classes spanning both storage styles, including all
three previously-missed cases. Baseline: **251 tokens**.

**Honest limitation**: extracting every quoted string also captures prose and URLs, so the diff is
noisier than before. That is the right trade — a noisy check that catches everything beats a clean one
that misses padding values. Each added line gets inspected rather than counted.

**Belt and braces**: because noise makes the diff weaker as a pass/fail gate, the contract also
enumerates every class the new component will use, each asserted present in the baseline
individually. That check is exact.

**Alternatives considered**: *Keep the 003/004 pattern* — demonstrably misses three real classes.
*Parse with a Tailwind-aware tool* — a new dependency, forbidden by Principle V and by FR-024.

### D-002 — Recommend against expert-tier emphasis, on evidence

**Decision**: Recommend **no** separate expert treatment (FR-013), while offering a minimal variant
if the owner disagrees.

**Rationale**: The request invited "or recommend against it", so the question was whether there is a
real argument rather than a preference. There is: reading the actual credential names, **both** expert
credentials state "Expert" in their own titles — "Azure Solutions Architect **Expert** (AZ-305)" and
"Azure DevOps Engineer **Expert** (AZ-400)". Four of the five associates likewise say "Associate".
A visual emphasis would restate what the visitor is already reading.

Two further arguments, both from the data rather than taste:

- It would be a **third** visual axis on a seven-card grid that must already carry completed versus
  in-progress. Three axes on seven small cards is noise, not signal.
- **AZ-400 is both expert and in-progress.** So the two treatments land on the same card and say
  opposite things — one "this is the most senior", the other "this is not finished yet".

**Alternatives considered**: *Accent border on expert cards* — offered as the minimal variant if the
owner wants it, because it adds no new class and does not compete with the chip for the same visual
slot. *Larger or brighter expert text* — would break the uniform card rhythm the Skills grid
establishes.

### D-003 — Make `resumeUrl` required, and expect a red build

**Decision**: Add `resumeUrl` to `Config` as a **required** field, and add `'resumeUrl'` to the
`Pick` in `data/site.ts`.

**Rationale**: The bug being fixed is a dead CV link. Making the field optional would leave exactly
the same failure mode available forever. Required means `data/config.tsx`'s aggregate cannot satisfy
`Config` until `site.ts` supplies a value, so a missing CV address is a compile error.

This is the lever that was **unavailable** in feature 004 — there, all the relevant fields were
optional, so the "all three present" rule had to live in a runtime guard. Here the type can carry the
requirement, so it should.

**Consequence to expect**: step 2 of the implementation sequence ends with a **failing build**. That
is the mechanism working. It must not be "fixed" by making the field optional.

**Alternatives considered**: *Optional `resumeUrl`* — permits the exact bug being fixed. *Keep the
URL in the navigation component* — violates Principle II and leaves two copies to drift.

### D-004 — Reuse the Skills pattern verbatim; borrow the Projects grid shape

**Decision**: Take the section wrapper, container, centred header block, eyebrow heading, section
heading, and supporting line from `Skills.tsx` exactly. Take the **grid** shape from `Projects.tsx`
(`md:grid-cols-2 lg:grid-cols-3`) rather than Skills' `lg:grid-cols-5`.

**Rationale**: Skills' five-column grid is built for a single short label plus an icon. Credential
cards carry a long name, an issuer, a year, and sometimes a chip — five columns would crush them. The
Projects grid is the established shape for text-bearing cards on this page. Both grids already exist,
so this is a choice between two approved patterns rather than a new one.

**On the awkward seventh card**: 7 items in a 3-column grid leaves one alone on the last row. That is
**already the established look** — the Featured Projects group renders exactly 7 cards in exactly
this grid today. Consistent rather than novel.

**Alternatives considered**: *Skills' `lg:grid-cols-5`* — too narrow for the content. *A new
4-column value* — would introduce a new design value, forbidden.

### D-005 — Section background: contrast with Skills, match Projects

**Decision**: Give the new section `bg-primary`, matching the Projects section below rather than the
Skills section above.

**Rationale**: The page alternates strictly — About `bg-secondary/30`, Experience `bg-primary`,
Skills `bg-secondary/30`, Projects `bg-primary`. Inserting anywhere breaks the alternation on one
side; the only question is which boundary to blur. Blurring the Skills boundary is worse: Skills and
Certifications are the two most conceptually similar sections on the page, and sharing a background
would make them read as one long merged block. The Projects boundary is carried by that section's
very large heading.

This departs slightly from FR-007 read literally ("reuse the section wrapper used by Skills") — the
wrapper is reused except for its one background class. Flagged rather than buried, and reversible by
changing one class.

**Alternatives considered**: *`bg-secondary/30`, literal reuse* — merges visually with Skills.
*A new background value* — forbidden.

### D-006 — The navigation gap

**Finding**: `navItems` has five entries and no Certifications. A new section with `id="certifications"`
would be unreachable from the navigation.

**Decision**: Surface it as decision C for the owner, recommending the entry be added, and flag the
mid-width crowding risk rather than discovering it after the fact.

**Rationale**: `data/site.ts` is in the permitted scope, so this is fixable now; a section the
navigation cannot reach is the kind of inconsistency that reads as unfinished. But it is unrequested
scope and it makes the desktop navigation six links plus a button, with "Certifications" the longest
label — so it is the owner's call, not mine.

### D-007 — Metadata insertion point in the most constrained file in the project

**Decision**: Insert all metadata immediately after the existing `<title>` and **before** the
`<!-- Tailwind via CDN -->` comment. Touch nothing from that comment downwards.

**Rationale**: `index.html` carries four things FR-020 protects — the `tailwind.config` script, the
`<style>` block, the Tailwind CDN tag, and the Google Fonts import — and this project's history
includes one feature whose entire purpose was cleaning that file up. Everything protected sits at or
below the CDN comment; the region above it holds only `charset`, `viewport`, and `<title>`. Inserting
there makes "nothing protected was touched" verifiable as a diff confined to the top of the file.

**On the title**: left unchanged. The instruction was to update it only if generic, and
"Hassan El Bahnasy | DevOps Engineer" names the person and the role.

**On the missing image**: `og:image` was not requested and no suitable asset exists in the site, so
previews will be text-only. Recorded as a limitation in the spec and re-flagged at completion rather
than quietly treated as complete.

## Cross-Reference: Spec Assumptions → Verification Status

| Spec assumption | Status |
|---|---|
| Both Resume links point at a missing `/resume.pdf` | ✅ Verified — desktop and mobile, both hardcoded |
| The field is `credentialUrl`, and the request is right | ✅ Verified against the current type — my recollection of `credlyUrl` was stale |
| 7 credentials: 5 completed / 2 in-progress, 5 with links / 2 without | ✅ Verified; the 2 without links are exactly the 2 in-progress |
| One expert is completed, one is in-progress | ✅ Verified — AZ-305 and AZ-400. This is the crux of D-002 |
| Tier is largely redundant with the credential name | ✅ Verified — 6 of 7, including **both** experts |
| Skills pattern is reusable for the new section | ✅ Verified, with one deliberate departure each on grid (D-004) and background (D-005) |
| Class inventory can prove "no new design values" | ❌ **It could not.** The method was broken two different ways and has been repaired (D-001) |
| App root must change despite the request's omission | ✅ Confirmed — required by Feature A |
| Title is not generic | ✅ Verified |
| No new dependency needed | ✅ Held — static tags, no head-management library |
| Link previews will be text-only | ✅ Confirmed as a real limitation |
