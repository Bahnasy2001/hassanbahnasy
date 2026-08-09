# Specification Quality Checklist: Certifications, Resume Link & Link Previews

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-08-10
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

**16 of 16 pass on the first iteration. Zero clarification markers** — the owner pre-empted the two
genuinely open design decisions by routing them to the plan for approval (FR-012, FR-013), which is
the right place for them.

**Update 2026-08-10 — all three plan-stage decisions approved.** A: the in-progress chip as proposed.
B: the recommendation against expert emphasis was accepted, so `tier` renders nothing. C: the nav
entry is added, **with an explicit instruction that mid-width crowding is to be reported rather than
worked around**. FR-012 and FR-013 were rewritten from "propose in the plan" to the approved
outcomes, and **FR-029 plus SC-011 were added** to carry decision C, which had no requirement before
it was approved.

### Two corrections to the request's premises, both verified

- **The Resume button is broken, not blank.** The request said it "currently has no destination".
  It has one: `/resume.pdf`, an absolute path to a file that exists nowhere in the site, so it
  **404s today**. Same defect class as the dead stylesheet reference removed in feature 001. This
  reframes User Story 1 from an enhancement into a live-defect fix on the highest-intent action on
  the page, which is why it is P1 despite being a two-line change.
- **There are two Resume links, not one.** Desktop navigation and mobile menu each carry their own
  hardcoded `/resume.pdf`. The request said "the button" singular; fixing only one leaves mobile
  visitors — plausibly the majority — still hitting a 404. FR-003 and SC-001 both state "2 of 2".

### One premise I doubted and was wrong about

The request specified `credentialUrl`. Feature 002 had defined that field as `credlyUrl`, so I
expected a naming mismatch. **Checked, and the request is correct**: the field was renamed since,
and `credentialUrl` is what the type declares today. Worth recording because acting on my stale
memory instead of the current source would have produced a spec that contradicted the code.

### Data verified rather than assumed

7 credentials: 5 completed, 2 in progress; 5 associate, 2 expert; 5 with a verification link, 2
without. The two without a link are **exactly** the two in-progress ones — so the link rule and the
status rule happen to partition the data identically today. FR-010 deliberately keys off the link's
presence rather than the status, so the two rules stay independent if that coincidence ever ends.

Also: **one expert credential is completed and the other is in progress.** So an expert emphasis and
an in-progress treatment can land on the same card, and must not fight each other — a constraint the
plan's FR-013 proposal has to account for.

### Judgement calls recorded as assumptions rather than questions

- **Section background.** The page alternates backgrounds strictly, so inserting a section between
  two existing ones breaks the alternation on one side. Defaulted to matching the projects section
  below, contrasting with skills above, because skills and certifications are the two most
  conceptually similar sections and would read as one merged block if they matched. This slightly
  departs from "reuse the skills wrapper" read literally, and is a one-class decision that is
  trivial to reverse — not worth a blocking question.
- **The application root must change** even though the request's exclusion list omits it from the
  permitted set, because Feature A explicitly says to render the new section there. Read as an
  oversight in the list, not an instruction to render it nowhere.
- **The page title stays.** The instruction was to change it only if generic; it already names the
  owner and their role.

### Limitation stated rather than glossed

**Link previews will be text-only.** No image metadata was requested and no suitable image exists in
the site. In practice an image dominates a link preview, so the result will be markedly weaker than
a complete preview card. Recorded in Assumptions so "link previews work" is not read as more than it
is.

### Constitution note

This is the **first feature to change the section order in the application root**, which Principle I
names explicitly as protected. The principle allows it when flagged and approved before
implementation, and the owner did that in the request — but the spec calls it out in its own section
so the approval is visible in the record rather than implied. Principle II is respected on all three
changes: the resume URL moves *into* the content layer rather than staying in markup, and the
credentials section reads existing content. Principle III is strengthened deliberately: FR-002 makes
the resume field **required**, so a missing CV address becomes a compile error rather than another
dead button. Principle V is untouched — FR-024 forbids dependencies. Principle VI is served by both
new surfaces: credentials speak to technical reviewers, and the CV and link previews serve the
business reader.
