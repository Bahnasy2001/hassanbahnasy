# Specification Quality Checklist: Case Study Modal

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

**16 of 16 pass** as of 2026-08-09, when the owner approved Q1 as Option A. The history below is
kept deliberately — it records why the question was worth asking.

- **Q1 — RESOLVED (Option A).** Approved: `max-h-full` and `overflow-y-auto`, both behavioural.
  `cursor-pointer` offered and declined. Asking paid off in an unexpected direction: Phase 0's class
  survey shrank the answer from "how much of the design rulebook do we break for a modal?" to two
  utilities, because the panel and backdrop turned out to exist already in About and the navbar. Had
  I guessed instead of measuring, I would likely have written a bespoke modal style and burned far
  more of Principle I than was ever necessary. FR-018, FR-020, and FR-024 were amended accordingly,
  with FR-024 now naming the two classes so a third addition is a detectable failure.
- **Original note on why Q1 was raised (retained):** it was a genuine contradiction in the request
  rather than a gap. The
  request says styling must reuse classes already present in `components/`, *and* that the modal
  must be usable at mobile width. A survey of every utility class in `components/` found the
  overlay primitives available (`fixed`, `inset-0`, `z-50`, `backdrop-blur`, `max-w-*`) but
  **zero** height-capping or scrolling utilities — no `max-h-*`, no `overflow-y-auto`. The longest
  case study (title + three prose sections, one over 400 characters + four links) cannot fit a
  phone viewport, so without those the lower part of the popup is unreachable. Both instructions
  cannot hold literally. Recommendation is Option A: permit a short, enumerated list of
  **behavioural** classes while keeping "no new colours, fonts, or spacing values" absolute —
  which is the clause that actually protects the approved design.
- **The biggest thing the request understated: this affects 8 cards, not 1.** Verified in the
  content — 7 items already carry problem, approach, and impact from an earlier content pass, and
  all 7 are in the projects group. Adding those fields to the multi-part labs item makes 8 of 12
  cards sprout a "Read case study" affordance. The request stated the rule ("any card that has
  problem, approach, and impact") rather than the count, so SC-002 pins the number explicitly.
  Worth the owner's attention because it is a substantially larger visible change than "add a
  popup to one card".
- **Three requirements were added beyond the stated request:**
  - **FR-016 / FR-017** (dialog semantics, focus management) — Escape support was requested, which
    implies keyboard visitors are expected. A dialog that takes focus without managing it strands
    those visitors behind the overlay, which is a defect rather than a missing nicety. These are
    attribute- and behaviour-level and introduce no styling, so they do not touch Principle I.
  - **FR-014** (clicking inside must not close) — the request said backdrop-click closes; the
    inverse needs stating or a naive implementation closes on every click inside too. SC-004 makes
    it measurable.
- **User Story 3 is P1, equal to User Story 1, deliberately.** Dismissal is not a refinement of
  the popup — an overlay a reviewer cannot escape makes them leave the site, so the feature is not
  shippable without all three exits working.
- **FR-003 treats removal and addition as one unit.** Deleting the existing profile-level link
  without adding the four named ones would remove a reference a visitor can follow today. Split
  across two steps, a partial implementation is a regression.
- **Key Entities included** because this feature genuinely changes the content shape (the named-
  link set). The "case study" itself is explicitly noted as *not* a new entity — it is a view over
  three fields that already exist, which is why no data migration is involved.
- **Constitution alignment** (v1.0.1): **Principle I** is satisfied by the owner's explicit
  approval of this visual change; FR-020, FR-021, and FR-024 keep the theme block and all
  non-permitted files untouched, and Q1 holds the one unresolved visual decision at the owner's
  gate. **Principle II** holds — the popup reads existing content fields, and the only hardcoded
  strings are structural labels ("Problem", "Approach", "Impact", "Repositories", "Read case
  study"), consistent with how section headings already live in components. **Principle III**:
  FR-001 extends the type before data is written against it, and FR-023 is the build gate.
  **Principle IV**: FR-026. **Principle V** is satisfied — FR-019 explicitly requires the existing
  animation library and forbids a new dependency, which matters because a modal is a common excuse
  to reach for a dialog package. **Principle VI**: the case study makes technical depth available
  to reviewers without pushing it at business visitors, who can ignore the affordance — the
  grouping and summary layer still carries them.
