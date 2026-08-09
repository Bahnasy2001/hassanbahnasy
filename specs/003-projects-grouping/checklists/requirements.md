# Specification Quality Checklist: Projects Grouping

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-08-09
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

**16 of 16 pass** as of 2026-08-09, when the owner resolved Q1 and approved the FR-007
treatment. History below is kept deliberately — it records why the question was asked rather
than guessed.

- **Q1 — RESOLVED (Option C).** The owner chose: section heading becomes **"Projects"**, with
  **"Featured Projects"** and **"Labs & Practice"** as sub-headings. This required amending
  **FR-005**, which had protected the existing top-level heading text; the heading's element and
  classes remain untouched and only the words change. **FR-003** now pins both sub-heading
  strings. Asking rather than guessing paid off here: the chosen answer was the one option that
  needed a scope amendment, so a silent default would have either shipped the duplication or
  quietly exceeded the stated scope.
- **FR-007 — APPROVED as written**, including the two judgement calls: keep `lg:grid-cols-3`
  rather than introduce a new column value, and reject `opacity-80` on legibility grounds.
- **Original note on why Q1 was raised (retained):** it was blocking and could not be defaulted
  away. The work section's top-level heading
  already reads "Featured Projects" (`components/Projects.tsx` line 21), and the request asks
  for a sub-heading with the same text while keeping that heading. Rendered, the phrase would
  appear twice adjacently and read as a duplication bug. Every resolution changes what a
  visitor sees, and this project treats visible design as an owner decision (visual changes
  must be approved before implementation), so guessing here would be substituting my taste
  for the owner's on exactly the kind of choice the owner reserved. Four options with their
  trade-offs are laid out at the end of spec.md. Everything else in the spec is complete, so
  planning can start the moment Q1 is answered.
- **The "12 projects" figure was checked, not taken on trust.** The content holds exactly 12
  items: 7 `project` and 5 `lab`. All 5 labs carry a lab count (20, 28, 29, 30, 4) and all 12
  carry a summary. This matters because the feature would have been unbuildable as written if
  the labs did not exist yet — content files are out of scope, so this feature cannot create
  them. They exist, so it is buildable.
- **FR-007 intentionally does not specify how "secondary" is achieved.** The owner asked for
  the approach to be proposed in the plan for approval, so the spec pins the required
  *outcome* (secondary, yet legible and operable) and leaves the mechanism to the plan. This
  is why FR-008 exists: it is the guard rail that stops "secondary" from quietly becoming
  "hard to read".
- **Three requirements were added beyond the user's stated scope:**
  - **FR-004** (empty group renders nothing) — no group is empty today, but the two groups are
    driven by content edited independently of this display code, so an orphaned sub-heading
    over empty space is a real future state.
  - **FR-010** (omit zero or absent lab counts) — the request said "where a lab has labCount";
    this makes the negative path explicit so no card can ever render "undefined labs".
  - **FR-008** (legibility and operability floor) — necessary because "visually secondary" is
    otherwise unbounded and could be satisfied by making text unreadable.
- **SC-009 covers a regression risk the request did not mention**: restructuring the section's
  internals could disturb the anchor the navigation link targets. Cheap to check, annoying to
  discover in production.
- **Key Entities section omitted**: this feature introduces no data shapes. It reads fields
  that already exist (`kind`, `summary`, `labCount`) and content files plus the type
  definitions are both out of scope.
- **Constitution alignment** (v1.0.1): **Principle I applies most directly and is satisfied by
  the owner's explicit approval** of this visual change; FR-006 and FR-014 keep the theme
  block and every other file untouched, and FR-007 keeps the one undecided visual sub-choice
  under the same approval gate. Principle II holds — no content moves into the component; the
  component only reads and groups. Principle III: no new types, and the build gate is FR-015.
  Principle IV: FR-017. Principle V: no dependency added. **Principle VI is engaged** — the
  sub-heading wording is visitor-facing copy that must work for both a non-technical business
  reader and a technical reviewer, which is part of what Q1 is asking the owner to weigh.
