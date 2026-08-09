# Feature Specification: Projects Grouping

**Feature Branch**: `feat/projects-grouping`

**Created**: 2026-08-09

**Status**: Approved — Q1 resolved and FR-007 treatment approved by the owner on 2026-08-09

**Input**: User description: "Group the projects grid into two labeled sub-sections inside the existing Projects section. This is a VISUAL change and is approved by the owner."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A recruiter can tell substantial work from practice work (Priority: P1)

A hiring manager or recruiter scans the portfolio's work section. Today all twelve items sit
in one undifferentiated grid, so a 30-lab practice collection occupies the same visual
weight as a production CI/CD platform. The visitor cannot tell at a glance which items
represent substantial engineering and which represent self-directed learning, so either
they over-weight the practice work or they discount everything.

**Why this priority**: This is the entire point of the feature. Someone evaluating the owner
professionally needs the signal within seconds, and getting it wrong costs an opportunity.
Everything else here is refinement of this one outcome.

**Independent Test**: Show the section to someone unfamiliar with it and ask which items are
substantial projects and which are practice. They should answer correctly without reading
any body text, purely from grouping and visual weight.

**Acceptance Scenarios**:

1. **Given** the work section, **When** a visitor looks at it, **Then** substantial projects
   appear as one labelled group and practice work as a separate labelled group, with the
   substantial group first.
2. **Given** the two groups, **When** a visitor compares them, **Then** practice items read
   as clearly secondary in visual weight without looking broken, disabled, or unfinished.
3. **Given** the section, **When** a visitor counts the items, **Then** all twelve appear —
   seven substantial, five practice — with none dropped or duplicated.
4. **Given** the grouped section, **When** a visitor views it, **Then** the colours, fonts,
   and spacing rhythm are indistinguishable from the rest of the site.

---

### User Story 2 - Practice collections communicate their scale (Priority: P2)

A visitor sees a practice entry and needs to know whether it represents one afternoon or
sustained effort. A collection of 30 labs and a collection of 4 are very different signals,
and today neither is visible.

**Why this priority**: It converts the practice group from a vague catch-all into concrete
evidence of volume, which is what makes the group worth showing at all rather than hiding.
Second to P1 because the grouping must exist before the counts have anywhere to live.

**Independent Test**: Look at each practice card and confirm the number of labs it contains
is stated in plain language.

**Acceptance Scenarios**:

1. **Given** a practice entry that records a lab count, **When** a visitor views its card,
   **Then** the count appears in readable prose, e.g. "20 hands-on labs".
2. **Given** a practice entry with **no** recorded lab count, **When** a visitor views its
   card, **Then** no count line, empty space, or placeholder such as "undefined labs"
   appears.
3. **Given** a substantial project, **When** a visitor views its card, **Then** no lab count
   appears, because the concept does not apply.

---

### User Story 3 - Card text reads as a scannable one-liner (Priority: P3)

A visitor scanning twelve cards wants the gist of each in one line, not a paragraph. Today
each card carries the long description, which makes the grid dense and slow to scan.

**Why this priority**: A real readability improvement, but the section communicates its main
message through grouping and weight even if the body text stays long, so it ranks last.

**Independent Test**: Read the cards and confirm each body is a single short line rather
than a multi-sentence paragraph, and that the text is the item's own summary rather than
truncated or invented copy.

**Acceptance Scenarios**:

1. **Given** any card, **When** a visitor reads its body text, **Then** it shows the item's
   short summary, not its long description.
2. **Given** the summaries are shorter than the descriptions, **When** the grid renders,
   **Then** card heights stay visually consistent within each group and no card collapses
   to an awkward sliver.

---

### Edge Cases

- **What if a group is empty?** Not the case today (7 and 5), but a group with no items MUST
  render nothing at all — no orphaned sub-heading above empty space. This matters because
  the two groups are driven by data that is edited independently of this display code.
- **What if the sub-heading text duplicates the section heading?** The section heading
  already reads "Featured Projects". A sub-heading with the same words directly beneath it
  would read as a rendering bug. **This is the open question Q1 below** and must be resolved
  before implementation, since both readings produce materially different visible results.
- **What if a practice item has no repository link?** The existing card already omits link
  buttons that have no target, so it must continue to render cleanly with no empty button.
- **What if "secondary" is taken too far?** Practice items must remain legible and clearly
  clickable. Reduced weight must not become reduced usability — text must stay readable and
  links must stay operable, including on a touch screen.
- **What if a lab count is zero?** A zero count MUST be treated as "no meaningful count" and
  omitted rather than rendered as "0 hands-on labs", which would undersell the entry.
- **What if the two groups are viewed on a narrow screen?** Both groups must remain
  single-column and readable at mobile widths, and the visual distinction between them must
  survive — grouping cannot depend on a multi-column layout to be perceptible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The work items MUST be split into exactly two display groups by their existing
  category field: substantial projects and practice items. No item may appear in both or
  neither.
- **FR-002**: The substantial-projects group MUST render before the practice group.
- **FR-003**: Each group MUST carry its own visible sub-heading. The substantial group's
  sub-heading MUST read "Featured Projects" and the practice group's MUST read
  "Labs & Practice" (owner-approved wording, Q1).
- **FR-004**: A group containing no items MUST render nothing — neither its sub-heading nor
  an empty container.
- **FR-005**: Both groups MUST remain inside the existing work section, reusing its existing
  outer wrapper and container. The section's top-level heading MUST keep its existing element
  and styling classes, but its **text changes from "Featured Projects" to "Projects"** so that
  "Featured Projects" can serve as the substantial group's sub-heading without the phrase
  appearing twice (owner-approved, Q1). No new section or landmark may be introduced, and the
  section's anchor MUST keep working so the navigation link still lands correctly.
- **FR-006**: Sub-headings MUST reuse typography and colour classes already present in the
  codebase. No new colour, font, or spacing value may be introduced, and the theme
  configuration MUST NOT be modified.
- **FR-007**: Practice cards MUST read as visually secondary to project cards while reusing
  the same card structure and styling primitives. The effect MUST be achieved with utility
  classes already available, and the **specific approach MUST be proposed in the plan and
  approved before implementation** (the owner explicitly reserved this decision).
- **FR-008**: Practice cards MUST remain fully legible and interactive. Whatever reduces
  their visual weight MUST NOT reduce text legibility below the site's existing standard, and
  MUST NOT impair link operability at any viewport width.
- **FR-009**: Where a practice item records a lab count, the card MUST show that count in
  readable prose, e.g. "20 hands-on labs", using existing text styling.
- **FR-010**: Where an item records no lab count, or a count of zero, the card MUST omit the
  count entirely — no placeholder, no empty line, no "undefined".
- **FR-011**: Every card MUST render the item's short summary as its body text instead of
  its long description.
- **FR-012**: All twelve items MUST render — seven substantial, five practice. None dropped,
  duplicated, or reordered within its group.
- **FR-013**: Item order within each group MUST match the order in the underlying content,
  which is the deliberate order the owner curated.
- **FR-014**: The change MUST be confined to the work section's display code. The page shell
  and its theme configuration, every other display component, the application root, all
  content files, the content type definitions, and the deployment workflow MUST NOT be
  modified.
- **FR-015**: The production build MUST pass with zero warnings before any commit.
- **FR-016**: A visual baseline MUST be captured before any file is modified. Unlike previous
  features this one *intends* to change the rendering, so the baseline serves a different
  purpose: proving that only the intended aspects changed and that colours, fonts, and
  spacing rhythm did not.
- **FR-017**: The work MUST be done on a dedicated feature branch and MUST NOT be committed
  directly to the main branch, because merging to the main branch publishes to production
  automatically.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 12 items render — 7 in the substantial group, 5 in the practice group.
  Zero dropped, zero duplicated.
- **SC-002**: A viewer unfamiliar with the site correctly identifies which group is
  substantial work and which is practice, from grouping and visual weight alone, without
  reading body text.
- **SC-003**: Zero new colour, font, or spacing values are introduced — every class used
  already appears in the codebase, verifiable by inspection.
- **SC-004**: The theme configuration and all files outside the work section's display code
  are unmodified — measurably zero changes.
- **SC-005**: All 5 practice items display their lab count in prose; 0 substantial items
  display one.
- **SC-006**: 12 of 12 cards show the item's short summary as body text; 0 show the long
  description.
- **SC-007**: The production build produces zero warnings and zero errors.
- **SC-008**: Practice cards remain legible and their links remain operable at both desktop
  and mobile widths — no unreadable text, no unclickable link.
- **SC-009**: The section anchor still works: activating the navigation link still scrolls to
  the work section.

## Assumptions

- **The data is already in place.** Verified: the content holds 12 items — 7 categorised as
  substantial projects and 5 as practice — and all 5 practice items record a lab count
  (20, 28, 29, 30, and 4). All 12 carry a short summary. So no content work is needed, which
  is consistent with content files being out of scope.
- **Every practice item currently has a lab count**, so FR-010's omission path is not
  exercised by today's data. It is still required, because a future practice entry without a
  count must not render "undefined labs".
- **"Visually secondary" is deliberately left open.** The owner reserved the specific
  approach for plan-stage approval (FR-007). The spec therefore states the *outcome* —
  secondary but legible and operable — and does not prescribe a mechanism. Candidate
  approaches from the request are a denser grid, reduced opacity, or smaller text.
- **This is an approved visual change.** The owner stated so explicitly, which satisfies the
  project's requirement that visually impactful changes be flagged and approved before
  implementation. FR-007 keeps one sub-decision under that same approval gate.
- **Sub-heading wording is visitor-facing copy** and must work for both a non-technical
  business reader and a technical reviewer. "Labs & Practice" reads clearly to both. The
  substantial group's wording is pending Q1.
- **Verification is manual.** No test suite, linter, or visual-regression harness exists and
  adding one is out of scope, so the intended-change verification is a build plus a
  deliberate visual comparison against the pre-change baseline.
- **Card structure is reused, not rebuilt.** Both groups render the same card structure; only
  the surrounding grouping and the weight-reducing classes differ. No second card
  implementation is introduced.

### Q1 — RESOLVED (owner decision, 2026-08-09)

**The collision**: the section's top-level heading already read "Featured Projects", and the
request also asked for a sub-heading with that text, which would have rendered the phrase
twice adjacently.

**Owner's decision — Option C**: change the **section heading to "Projects"**, and use
**"Featured Projects"** and **"Labs & Practice"** as the two sub-headings.

The resulting hierarchy, top to bottom:

```text
Portfolio                 (existing eyebrow, unchanged)
Projects                  (section heading — text changed from "Featured Projects")
  Featured Projects       (sub-heading, 7 items)
  Labs & Practice         (sub-heading, 5 items)
```

No phrase repeats, and the ladder reads correctly for both audiences: a business visitor sees
a plain "Projects" section split into headline work and practice, and a technical reviewer sees
the practice depth labelled honestly rather than hidden.

**Consequence for scope**: FR-005 was amended to permit this one text change. The heading's
element and styling classes stay exactly as they are — only the words change — and the section
anchor is untouched.

### FR-007 — APPROVED (owner decision, 2026-08-09)

The secondary-treatment proposal in [plan.md](./plan.md) is approved as written, explicitly
including both judgement calls: **keep `lg:grid-cols-3`** rather than introduce a new column
value, and **reject `opacity-80`** because it would push lab body text toward unreadable.
