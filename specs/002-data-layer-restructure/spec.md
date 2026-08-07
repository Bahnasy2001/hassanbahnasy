# Feature Specification: Data Layer Restructure

**Feature Branch**: `feat/data-architecture`

**Created**: 2026-08-04

**Status**: Draft

**Input**: User description: "Restructure the data layer. No visual change to the rendered site."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A content model that can hold case-study depth (Priority: P1)

The site owner wants to eventually present each project as a proper case study — the
problem it solved, the approach taken, the measurable impact — and to distinguish
substantial projects from smaller hands-on labs. Today the content model holds only a
title, one description paragraph, tags, and two optional links. There is nowhere to put
depth, no stable identifier to address a single project by, and no way to mark one as
featured or to say whether it is a project or a lab.

**Why this priority**: Every other part of this work sits on top of this shape. It is
also the change that removes a future migration: once each project carries a stable
identifier and depth fields, richer presentation becomes a display decision rather than
another data migration. It delivers value alone, even if nothing else ships.

**Independent Test**: Confirm each of the four existing projects carries a unique stable
identifier, a category, and a short summary; confirm the depth fields exist and accept
content without any type change; confirm the site renders exactly as before.

**Acceptance Scenarios**:

1. **Given** the extended content model, **When** the owner inspects any of the four
   projects, **Then** it has a unique stable identifier, a category of "project", and a
   one-line summary.
2. **Given** the extended content model, **When** the owner adds problem/approach/impact
   text, a year, an image, or a README link to a project, **Then** it is accepted with no
   change to the type definitions.
3. **Given** the extended content model, **When** a project has no repository link, no
   demo link, no image, and no README link, **Then** it is still valid content and still
   renders without empty or broken link buttons.
4. **Given** all four projects have been migrated, **When** the site is built and viewed,
   **Then** every project card shows the same title, the same description text, and the
   same tags as before, in the same order.

---

### User Story 2 - Content organised by what it is, not all in one file (Priority: P2)

The owner wants to update work experience without scrolling past skills, projects, and
social links. Today every kind of content lives in one file, so any edit means navigating
an unrelated wall of content, and two people editing different content types collide in
the same file.

**Why this priority**: This is the change the owner feels on every future content edit,
but it is second to P1 because it reorganises content rather than enabling anything new.

**Independent Test**: Open the location for one content type (say, work experience) and
confirm it contains only that content. Confirm no component file changed and the site
renders identically.

**Acceptance Scenarios**:

1. **Given** the restructured content, **When** the owner wants to edit work experience,
   **Then** they open exactly one file containing only work experience.
2. **Given** the restructured content, **When** the site is built, **Then** no file that
   renders the page has been modified.
3. **Given** the restructured content, **When** the site is viewed, **Then** all eight
   sections render identically to before, with identical text and ordering.
4. **Given** the restructured content, **When** a future maintainer adds a new kind of
   content, **Then** the pattern for where to put it is obvious from the existing layout.

---

### User Story 3 - Certifications ready to populate (Priority: P3)

The owner holds cloud and DevOps certifications and wants to show them, distinguishing
completed from in-progress and signalling seniority. This feature prepares the shape so
that adding them later is pure content entry, with no structural work and no type design
under time pressure.

**Why this priority**: Lowest priority because it changes nothing a visitor sees today.
It is included now because designing the shape while the data layer is already open is
much cheaper than reopening it later.

**Independent Test**: Confirm a certification shape exists that expresses name, issuer,
year, completion status, and seniority tier with an optional credential link, and that a
certification can be added without editing type definitions.

**Acceptance Scenarios**:

1. **Given** the certification shape, **When** the owner adds a completed certification
   with a credential link, **Then** it is accepted with no type changes.
2. **Given** the certification shape, **When** the owner adds an in-progress
   certification with no credential link, **Then** it is accepted.
3. **Given** the certification list is empty, **When** the site is built and viewed,
   **Then** nothing changes visually and no empty section appears.

---

### Edge Cases

- **What if two project titles produce the same identifier?** Identifiers must be unique.
  The four current titles produce four distinct identifiers, but the derivation rule must
  be documented so a future addition that collides is detected rather than silently
  duplicated.
- **What if a title contains punctuation, slashes, or a dash character?** The current
  titles include a slash ("CI/CD"), hyphens ("Cloud-Native", "To-Do"), and an en dash
  ("– NDC Core"). The derivation rule must handle all of these deterministically and
  produce identifiers safe for use in a web address, since these identifiers are intended
  to become addressable later.
- **What if the aggregate view of content and the split modules disagree?** There must be
  exactly one source of truth per content item. The compatibility layer must re-expose
  the split modules, never hold its own copy of the content.
- **What if the new summary text differs from the description a visitor already sees?**
  The description shown on project cards must not change. The summary is a new, separate,
  currently-unrendered field; introducing it must not alter any displayed text.
- **What if a required new field is added but an existing project is missed?** All four
  projects must carry every required field; a partially migrated set must fail the build
  rather than render blank content.
- **What if verification relies on the compiled output being unchanged?** It cannot here.
  Unlike a pure deletion, this feature adds real content (identifiers and summaries) and
  reorganises modules, so the compiled output necessarily changes. Equivalence must be
  judged on what renders, not on comparing build artefacts byte-for-byte.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project content shape MUST gain three required fields: a stable
  identifier, a category limited to "project" or "lab", and a short summary.
- **FR-002**: The project content shape MUST gain optional fields for problem, approach,
  and impact narrative; a year; an image reference; a README link; a featured flag; and a
  count of contained labs.
- **FR-003**: The existing project fields — title, description, tags, repository link,
  and demo link — MUST remain unchanged in name, type, and optionality. Repository link,
  demo link, image, and README link MUST all be optional, because projects legitimately
  have only some of them and the display already omits links that are absent.
- **FR-004**: A certification content shape MUST be defined with required name, issuer,
  year, completion status limited to "completed" or "in-progress", and seniority tier
  limited to "expert", "associate", or "foundational", plus an optional credential link.
- **FR-005**: Project identifiers MUST be unique across all projects and derived from the
  title by a single documented, deterministic rule that produces values safe for use in a
  web address.
- **FR-006**: All four existing projects MUST be migrated to the new shape: category set
  to "project", a summary set from their existing content, and an identifier derived per
  FR-005. The problem, approach, impact, year, image, and README fields MUST be left
  unset rather than filled with placeholder text.
- **FR-007**: Content MUST be split so that each kind of content — site-level identity,
  work experience, skills, projects, certifications — lives in its own dedicated location.
- **FR-008**: A compatibility layer MUST re-expose the split content in the exact shape
  the existing display code already consumes, so that **zero** files that render the page
  need to change. The compatibility layer MUST NOT hold its own copy of any content.
- **FR-009**: No file that renders the page may be modified: every file under the
  components directory, the application root and entry point, the page shell, the theme
  configuration, the build configuration, and the deployment workflow MUST be untouched.
- **FR-010**: The certification list MUST exist as an empty but correctly typed
  collection, so certifications can later be added as pure content entry.
- **FR-011**: Every new or changed content shape MUST be declared before any content is
  written against it, and the production build MUST pass with zero warnings before any
  commit.
- **FR-012**: The rendered site MUST be visually identical to the pre-change baseline —
  identical text, colors, fonts, spacing, section order, and animations — verified at both
  a desktop and a mobile viewport width.
- **FR-013**: Equivalence for FR-012 MUST be verified against rendered output, not by
  comparing compiled build artefacts. Adding identifiers and summaries and reorganising
  modules necessarily changes the compiled output, so an artefact comparison would report
  a false failure here.
- **FR-014**: A visual baseline MUST be captured before any file is modified, so FR-012
  is checked against evidence rather than memory.
- **FR-015**: The work MUST be done on a dedicated feature branch and MUST NOT be
  committed directly to the main branch, because merging to the main branch publishes to
  production automatically.

### Key Entities

- **Project**: A piece of work the owner wants to show. Identified by a unique stable
  identifier derived from its title. Carries a category distinguishing a substantial
  project from a smaller lab, a short summary for compact display, the existing longer
  description shown on cards today, and a set of technology tags. Optionally carries
  case-study narrative (problem, approach, impact), a year, an image, links to its
  repository, live demo, and README, a featured flag, and — for a collection entry — a
  count of the labs it contains. Every link-shaped field is optional because real
  projects have different subsets of them.
- **Certification**: A credential the owner holds or is pursuing. Carries a name, the
  issuing body, a year, whether it is completed or in progress, and a seniority tier
  distinguishing expert from associate from foundational. Optionally carries a link to
  the published credential. No certifications exist yet; the shape is being defined ahead
  of the content.
- **Site identity**: The owner's name, professional title, headline, contact address,
  introduction and biography, social links, and navigation entries. Unchanged in content
  by this feature; only its location changes.
- **Work experience** and **Skills**: Unchanged in both shape and content by this
  feature; only their location changes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The production build passes with zero warnings and zero errors.
- **SC-002**: Exactly **zero** files that render the page are modified — measurably, the
  change touches no component file, no application root or entry point, and no
  configuration.
- **SC-003**: The rendered site is visually indistinguishable from the pre-change
  baseline across all eight sections, at both desktop and mobile widths, under
  side-by-side comparison — including identical project titles, description text, and tag
  ordering.
- **SC-004**: Editing any single kind of content requires opening exactly one file, down
  from one shared file holding all five kinds today.
- **SC-005**: All four projects carry a unique identifier, a category, and a summary —
  4 of 4, with zero duplicate identifiers.
- **SC-006**: Adding case-study depth to a project, or adding a certification, requires
  zero changes to the content shape definitions.
- **SC-007**: No content item exists in more than one place; each has exactly one source
  of truth.

## Assumptions

- **Identifier derivation rule**: lowercase the title, replace every run of characters
  that are not letters or digits with a single hyphen, and trim leading and trailing
  hyphens. Applied to the four current titles this yields
  `secure-cloud-native-microservices-ci-cd`, `serverless-image-editor`,
  `pulumi-azure-infrastructure-ndc-core`, and `to-do-list-gitops-pipeline` — four
  distinct values. These identifiers are assumed to be **stable once set**, since they
  are intended to become part of web addresses later; renaming a project's title in
  future should therefore not silently change its identifier.
- **Summary content**: the summary is assumed to be the first sentence of each project's
  existing description, which reads naturally as a standalone one-liner in all four
  cases. The description itself is left byte-for-byte unchanged, so no visible text moves.
  This is a judgement call rather than a mechanical derivation, and is cheap to revise
  later because nothing renders the summary yet.
- **Certifications are exposed alongside the existing aggregate, not inside it.** The
  aggregate shape that display code consumes is assumed to stay exactly as it is, with
  certifications reachable as a separate collection. Adding an unused field to the shape
  every display file depends on would create churn for content nothing renders yet. This
  is reversible the moment a certifications section is actually built.
- **The compiled output will change, and that is expected.** New identifier and summary
  text plus a reorganised module layout necessarily alter the build artefacts. This is
  the key difference from the preceding cleanup feature, where an unchanged artefact was
  the primary proof of safety. Here that proof is unavailable and visual comparison
  carries the verification weight, which is why FR-014 makes the baseline mandatory.
- **No display code reads the new fields**, so they cannot affect rendering. Verified
  against the current display code: project cards read only title, description, tags, and
  the two link fields. The new fields are therefore inert until a future feature renders
  them.
- **Verification is manual.** The project has no test suite, no linter, and no
  visual-regression tooling, and adding one is out of scope, so equivalence is a manual
  side-by-side comparison against a baseline captured before the change.
- **Content is assumed to be correct as it stands.** This feature moves and re-shapes
  existing content; it does not rewrite, correct, or improve any wording.
