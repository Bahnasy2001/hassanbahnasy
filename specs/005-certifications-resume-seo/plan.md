# Implementation Plan: Certifications, Resume Link & Link Previews

**Branch**: `feat/certifications-and-resume` | **Date**: 2026-08-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-certifications-resume-seo/spec.md`

## Summary

Three independent changes: fix the two broken Resume links by moving the CV address into the
content layer, render the seven existing credentials in a new section between Skills and Projects,
and add page metadata so shared links produce a preview.

Phase 0 produced three things worth reading before implementation:

1. **A repaired verification method.** The class-inventory check used in features 003–004 had two
   blind spots that would have made this feature's "no new design values" claim unverifiable. Both
   are fixed — see research.md D-001. This matters more than usual because this feature adds a whole
   new component.
2. **A recommendation *against* the expert-tier emphasis** (FR-013), on evidence rather than taste:
   both expert credentials already say "Expert" in their names.
3. **A third decision the request did not mention**: the new section will have no navigation entry
   unless one is added, and `data/site.ts` is in scope.

> ✅ **ALL THREE DECISIONS APPROVED — 2026-08-10. Implementation is unblocked.**
> **A**: the "In progress" chip as proposed. **B**: recommendation accepted — no expert-tier emphasis.
> **C**: nav entry added between Skills and Projects, **with the owner's explicit instruction that if
> it crowds the navbar at 768–900px the finding is to be REPORTED, not worked around** — no layout
> tweak, no abbreviated label, no responsive hiding. The owner decides whether to drop it.

## Technical Context

**Language/Version**: TypeScript 5.2 (`noEmit`) + React 18.2, Node v24.18.1 / npm 11.16.0

**Primary Dependencies**: React 18.2, react-dom 18.2, Vite 5.4.21, Framer Motion 11,
lucide-react 0.344, TailwindCSS from CDN. **Nothing added** (FR-024).

**Storage**: N/A — static content modules

**Testing**: No test suite, linter, or visual-regression harness; Principle V forbids adding one.
Verification is `npm run build`, the repaired class-inventory diff, render/link counts on built
output, and manual checks for appearance and link previews.

**Target Platform**: Static site on GitHub Pages under `/hassanbahnasy/`

**Project Type**: Static single-page web application

**Performance Goals**: No regression. One new component plus metadata; growth should be small.

**Constraints**: Zero build warnings; only 6 files may change; no new colour, font, or spacing
value; all 7 credentials render in order; every other section unchanged.

**Content reality confirmed in Phase 0**: 7 credentials — 5 completed / 2 in-progress, 5 associate /
2 expert, 5 with `credentialUrl` / 2 without. The 2 without are exactly the 2 in-progress. **One
expert credential is completed (AZ-305) and one is in-progress (AZ-400)**, so the two treatments can
land on the same card. Both Resume anchors currently point at `/resume.pdf`, which does not exist.

**Scale/Scope**: 5 files modified, 1 file created.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against constitution v1.0.1.

| Principle | Verdict | Basis |
|-----------|---------|-------|
| **I. Visual Preservation (NON-NEGOTIABLE)** | ✅ PASS **by explicit approval — and this is the biggest crossing yet** | This is the **first feature to change the section order in `App.tsx`**, which the principle names by name as protected. The owner flagged and approved it, which is exactly the escape hatch the principle defines. Everything else stays intact: `index.html`'s `tailwind.config` block, `<style>` block, CDN tag and font tags are explicitly untouched (FR-020) with only metadata added; the palette, fonts and spacing scale are unchanged (FR-023). The new section reuses the Skills section's wrapper and heading pattern verbatim, so it inherits the approved design rather than proposing one. Two visual sub-decisions are held at the owner's gate. |
| **II. Data/UI Separation** | ✅ PASS — **improved by this feature** | The resume URL moves *out of* markup and *into* `data/site.ts` (FR-001), which is a net gain: the navigation currently hardcodes a URL, which is exactly what this principle forbids. The credentials section reads existing content and hardcodes none of it. Only structural labels ("Certifications", the eyebrow text, "In progress") live in the component, consistent with how every other section's headings already work. |
| **III. Type Safety First** | ✅ PASS — **deliberately strengthened** | `resumeUrl` is added to `Config` as **required**, not optional. That means `data/site.ts` must supply it or the build fails — converting "the CV link is missing" from a silent 404 into a compile error. This is the lever that was unavailable in feature 004, and it is used here on purpose. `Certification` needs no change. |
| **IV. Incremental Safety** | ✅ PASS | On `feat/certifications-and-resume`, verified checked out with 004 merged (PR #5). Merge only after a green build. |
| **V. No New Dependencies** | ✅ PASS | Nothing added. No icon library change, no SEO helper, no head-management library — the metadata is static tags in the page shell. |
| **VI. Dual Audience** | ✅ PASS — **served on both sides at once** | Credentials are the strongest signal for a technical reviewer; the working CV link and link previews are what a business reader and recruiter act on. The feature happens to serve each audience through a different one of its three parts. |

**Gate result**: PASS, conditional on the three approvals below. No violations to justify;
Complexity Tracking omitted.

## Decisions — all APPROVED 2026-08-10

### A. In-progress treatment *(FR-012 — APPROVED as proposed)*

**Proposal: a status chip on in-progress cards only, and nothing on completed cards.**

```text
text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10
```

Reading **"In progress"**. Every class verified present in the codebase (the chip shape comes from
the Projects tag chip; the neutral `bg-white/5` / `border-white/10` pairing comes from the navbar's
Resume button).

**Why this and not dimming the card**: presence-or-absence of a pill is glanceable, and the words
remove all ambiguity, which a colour shift alone cannot do — a purely tonal cue also fails for
colour-blind visitors. Marking the **minority** (2) rather than the majority (5) keeps the section
quiet and draws the eye to the exception. And the completed cards already have their own affordance:
they are links.

**Why neutral rather than accent**: `text-accent` is the site's emphasis colour. An accent chip on an
unfinished credential would read as *more* important than the finished ones. Neutral grey reads as
"secondary, not yet" without looking like an error, which FR-014 requires.

**Rejected**: dimming the name to `text-slate-500` — reads as disabled; `opacity-*` — none exists and
it was rejected on legibility grounds in feature 003.

### B. Expert-tier emphasis *(FR-013 — recommendation ACCEPTED: none will be added)*

**Recommendation: do NOT add one.** The request invited a recommendation against it, and Phase 0
found the evidence for one.

**Both expert credentials already say "Expert" in their names:**

| Credential | Tier | Says it in the name? |
|---|---|---|
| Azure Solutions Architect **Expert** (AZ-305) | expert | ✅ |
| Azure DevOps Engineer **Expert** (AZ-400) | expert | ✅ |
| Azure Developer **Associate** (AZ-204) | associate | ✅ |
| Azure Administrator **Associate** (AZ-104) | associate | ✅ |
| AWS Certified Solutions Architect – **Associate** | associate | ✅ |
| Kubernetes and Cloud Native **Associate** (KCNA) | associate | ✅ |
| Certified Kubernetes Administrator (CKA) | associate | ❌ |

Six of seven state their tier in the text a visitor is already reading, including **both** experts.
A separate visual emphasis would therefore duplicate information rather than add any, while
introducing a **third** visual axis onto a seven-card grid that already has to carry completed
versus in-progress. And because AZ-400 is both expert **and** in-progress, the two treatments would
collide on that one card — the emphasis saying "this one matters most" while the chip says "this one
isn't finished".

**If the owner wants it anyway**, the least noisy option using existing classes is the card border:
`border-accent/20` instead of `border-slate-800`. That would need approval as a fourth item.

### C. Navigation entry for the new section *(Phase 0 surfaced it — APPROVED, with a reporting instruction)*

The new section gets `id="certifications"`, but `navItems` in `data/site.ts` currently lists five
entries and none of them is Certifications. **Left alone, the site would have a section the
navigation cannot reach.** `data/site.ts` is inside the permitted scope, so this is fixable here.

**Recommendation: add it**, between Skills and Projects to match the page order.

**The risk, stated honestly**: the desktop navigation would go from five links plus a Resume button
to six plus a button, and "Certifications" is the longest label of the six. That may crowd at
mid-widths around 768–900px. The validation guide checks this explicitly, and the fallback is simply
to drop the entry.

**Alternative**: leave `navItems` untouched and accept a section reachable only by scrolling. Cheap,
but inconsistent with every other section.

**Owner's instruction on the crowding risk**: if the navigation crowds at 768–900px, **report it and
stop** — do not adjust the layout, shorten the label, or hide it responsively. The owner will decide
whether to drop the entry. Encoded as FR-029 and SC-011.

## Project Structure

### Documentation (this feature)

```text
specs/005-certifications-resume-seo/
├── spec.md
├── plan.md                                # This file
├── research.md                            # Phase 0 — 7 decisions
├── data-model.md                          # Phase 1 — resumeUrl + the credential shape as consumed
├── contracts/
│   ├── certifications-section-contract.md # Phase 1 — section/card structure + class list
│   └── metadata-contract.md               # Phase 1 — exact tags, and what must not be touched
├── quickstart.md                          # Phase 1 — validation guide
├── checklists/requirements.md
└── tasks.md                               # Phase 2 (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
.
├── types.ts                            # MODIFY — add required resumeUrl to Config
├── data/site.ts                        # MODIFY — supply resumeUrl; extend the Pick; maybe navItems (C)
├── components/Certifications.tsx        # CREATE — the new section
├── components/Navbar.tsx               # MODIFY — both Resume anchors read from content
├── App.tsx                             # MODIFY — insert the section between Skills and Projects
├── index.html                          # MODIFY — metadata only, inside <head>
├── components/*.tsx (8 others)         # UNTOUCHED
├── data/*.ts (4 others), config.tsx    # UNTOUCHED
└── .github/workflows/                  # UNTOUCHED
```

**Structure Decision**: `data/site.ts` types its export as `Pick<Config, …>`. Adding a **required**
`resumeUrl` to `Config` therefore does nothing until `'resumeUrl'` is added to that `Pick` list —
and the aggregate in `data/config.tsx` will fail to satisfy `Config` until `site.ts` supplies the
value. That failure is the intended mechanism, not an obstacle (research.md D-003).

## Implementation Sequence

| Step | Story | Change | Gate before proceeding |
|------|-------|--------|------------------------|
| 0 | — | Baseline: build, bundle, **repaired** class inventory, screenshots | Baseline stored outside the repo |
| 1 | — | ~~Obtain approval for A, B, and C~~ | ✅ **All three granted 2026-08-10** |
| 2 | US1 | `types.ts`: add required `resumeUrl` to `Config` | Build **fails** — expected, proves the field bites |
| 3 | US1 | `data/site.ts`: extend the `Pick`, supply `resumeUrl` | Build clean |
| 4 | US1 | `Navbar.tsx`: both anchors read `config.resumeUrl`, new tab, `rel="noreferrer"` | Build clean; zero `/resume.pdf` left |
| 5 | US2 | Create `Certifications.tsx` — Skills wrapper/heading, 7 cards, links, chip | Build clean |
| 6 | US2 | `App.tsx`: insert between `<Skills />` and `<Projects />` | Build clean; order otherwise unchanged |
| 7 | US2 | `data/site.ts`: nav entry, if approved under C | Build clean; nav not crowded at mid-width |
| 8 | US3 | `index.html`: metadata inside `<head>` only | Build clean; protected blocks untouched |
| 9 | — | Full quickstart validation, class-inventory diff, visual comparison | SC-001…SC-010 satisfied |

The three features are genuinely independent, so steps 2–4, 5–7, and 8 could be done in any order.
This order runs the live defect first, the largest piece second, and the invisible change last.

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| **The class-inventory check silently misses a new value** — the old pattern had two blind spots | **Was certain; now fixed** | Repaired in Phase 0 (D-001): the union of `className="…"` literals and quoted style-object strings, token-split. Verified to catch `px-3`, `border-slate-800`, and `lg:grid-cols-3`, all of which the old checks missed. Plus every class the new component uses is asserted against the baseline individually. |
| Editing `index.html` damages a protected block | Medium — it is the most constrained file in the project | Metadata is inserted between the `<title>` and the Tailwind CDN comment, touching nothing below it. Quickstart Step 7 diffs the file and asserts the theme block, style block, CDN tag and font tags are byte-identical. |
| Section-order change alters more than intended | Medium | `App.tsx` gains exactly one line. Quickstart Step 6 asserts the other seven section elements appear in their original relative order. |
| Seven cards leave an orphan on the last grid row | Low | Already the established look: the Featured Projects grid renders 7 cards in a 3-column grid today. Consistent, not novel. |
| Adding a sixth nav item crowds the desktop navigation | Medium | Quickstart Step 8 checks 768–900px specifically. **Owner's standing instruction: report it, do not work around it** (FR-029). |
| The two treatments collide on AZ-400 (expert *and* in-progress) | **Certain if B is accepted** | The core argument for recommending against B. If accepted anyway, the border-only variant is the least conflicting. |
| Link previews look bare without an image | **Certain** | No `og:image` was requested and no asset exists. Recorded in the spec and re-flagged at completion; a genuine limitation, not a defect to hide. |
| `resumeUrl` required breaks the build mid-implementation | **Certain, and intended** | Step 2 ends red by design; step 3 resolves it. Called out so nobody "fixes" it by making the field optional. |

## Post-Design Constitution Re-Check

Re-evaluated after Phase 0 and Phase 1. **Result: PASS, conditional on the three approvals.**

- **Principle I** — the crossing is real and now fully documented: section order changes for the
  first time, under explicit owner approval. What Phase 0 added is *containment*: every class the new
  section uses was individually verified present, the metadata insertion point was chosen to leave
  every protected block in `index.html` untouched, and the verification method that proves all of
  this was repaired after being found defective. The principle is being honoured more rigorously than
  in the features that did not touch it.
- **Principle II** — this feature *repays* the principle rather than merely respecting it: a
  hardcoded URL in markup moves into the content layer.
- **Principle III** — the strongest use of it since feature 002. Making `resumeUrl` required means
  the specific bug this feature fixes (a dead CV link) cannot silently recur.
- **Principle IV** — correct branch verified; CI gate before merge.
- **Principle V** — held; a metadata feature is a common excuse for a head-management library, and
  none is needed for static tags.
- **Principle VI** — best-balanced instance so far, with each of the three parts serving a different
  audience.

One thing worth the owner's attention beyond this feature: **Principle I's text lists "the order of
sections in `App.tsx`" as protected**, and that has now been changed once with approval. The
principle worked as designed, so no amendment is required — but if section insertions become routine,
the wording deserves revisiting. Recorded, not acted on.

Standing out-of-scope items still open: `description` is dead weight on all 12 project items
(feature 004), feature 003's lab-count/summary redundancy, and feature 001's lockfile
reproducibility finding.
