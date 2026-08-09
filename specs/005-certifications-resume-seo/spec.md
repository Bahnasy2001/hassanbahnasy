# Feature Specification: Certifications, Resume Link & Link Previews

**Feature Branch**: `feat/certifications-and-resume`

**Created**: 2026-08-10

**Status**: Approved — all three plan-stage decisions granted by the owner on 2026-08-10 (A: in-progress chip; B: no expert emphasis; C: nav entry added)

**Input**: User description: "Three changes. All are VISUAL and approved by the owner." (Certifications section, Resume link, SEO and link previews)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The Resume button actually delivers a CV (Priority: P1)

A recruiter lands on the portfolio, and the first thing they want is the CV. They click the
prominent "Resume" button in the navigation — and today they get a **404**. The button is not
merely undestined: it points at a file that does not exist in the site, so the single most
valuable action on the page fails silently.

**Why this priority**: This is a live defect on the highest-intent action a visitor can take, and
the fix is two lines. Nothing else in this feature has that ratio of harm to effort. A recruiter
who clicks Resume and gets an error page does not come back.

**Independent Test**: Click Resume in both the desktop navigation and the mobile menu. The CV
opens in a new tab, and the portfolio tab remains where it was.

**Acceptance Scenarios**:

1. **Given** the desktop navigation, **When** a visitor activates Resume, **Then** the CV opens in
   a new tab and the portfolio page stays open and unchanged behind it.
2. **Given** the mobile menu, **When** a visitor activates Resume, **Then** the same thing happens
   — both entry points must work, not just one.
3. **Given** the CV destination, **When** it is changed in future, **Then** it is changed in one
   place in the content layer, not in the navigation markup.

---

### User Story 2 - A technical reviewer can see the credentials (Priority: P1)

A hiring manager assessing a DevOps candidate wants to know which cloud and Kubernetes
certifications they hold. The owner holds seven — five completed, two in progress, two at expert
level — and **not one of them is visible anywhere on the site**. The content exists but nothing
renders it, so a reviewer's only conclusion is that there are none.

**Why this priority**: Certifications are among the strongest credibility signals for this role,
and seven of them are currently invisible. This is the largest single gap between what the owner
has and what a visitor can see.

**Independent Test**: Open the site, find the certifications section, and confirm all seven appear
with name, issuer, and year; that completed ones with a credential link open it; and that
in-progress ones are distinguishable at a glance.

**Acceptance Scenarios**:

1. **Given** the page, **When** a visitor scrolls, **Then** a certifications section appears
   between the skills section and the projects section, with its own heading.
2. **Given** the section, **When** a visitor reads it, **Then** all **seven** credentials appear,
   each showing its name, issuing body, and year, in the order the content defines.
3. **Given** a completed credential that has a verification link, **When** a visitor activates it,
   **Then** the credential opens in a new tab.
4. **Given** a credential with no verification link, **When** a visitor views it, **Then** it is
   not a link and offers no broken or dead click target.
5. **Given** the two in-progress credentials, **When** a visitor glances at the section, **Then**
   they can tell those two apart from the five completed ones without reading closely.

---

### User Story 3 - Sharing the portfolio produces a real preview (Priority: P2)

The owner shares the portfolio link in a message, a post, or an application. Today the recipient
sees a bare URL with no title, no description, and no context, because the page carries none of
the metadata that messaging and social platforms read. The link looks like something nobody
bothered to finish.

**Why this priority**: It shapes first impressions before anyone even visits, but unlike the
Resume 404 nothing is broken for someone already on the site, and unlike the certifications
nothing the owner has is being hidden.

**Independent Test**: Paste the site URL into a link-preview inspector or a messaging app and
confirm a title and description appear.

**Acceptance Scenarios**:

1. **Given** the page, **When** a search engine or preview service reads it, **Then** it finds a
   description of the site rather than nothing.
2. **Given** the page URL, **When** it is pasted into a platform that renders link previews,
   **Then** a title, a description, a type, and a canonical address are available to it.
3. **Given** the metadata is added, **When** the page is viewed normally, **Then** nothing about
   its appearance changes — metadata is invisible to visitors.

---

### Edge Cases

- **What happens at the boundary between the new section and its neighbours?** The page currently
  alternates section backgrounds strictly. Inserting a section between two existing ones breaks
  that alternation on one side or the other, so the new section will share a background with a
  neighbour. Which neighbour is a deliberate choice, recorded in Assumptions.
- **What if a credential has no verification link?** It renders as plain, non-interactive content.
  Two of the seven are in this state today, and both are in-progress.
- **What if a credential is in progress but somehow has a link?** The link rule follows the
  presence of a link, not the status, so it would still link. Status governs appearance only.
- **What if the resume destination changes?** It must be editable in one place in the content
  layer. Two separate navigation entry points must both read from that one place, or they will
  drift apart.
- **What if a visitor opens the resume and comes back?** The portfolio must still be open and at
  the same position, so the CV opens in a new tab rather than replacing the page.
- **What if the new section's heading pattern differs from its neighbours?** It must not. The
  section is new, but it should read as part of the same page, not as a bolt-on.
- **What if metadata claims something the page does not deliver?** The description and title must
  describe this portfolio accurately; misleading preview text is worse than none.
- **Will link previews show an image?** No image metadata is being added, so previews will be
  text-only. Recorded in Assumptions as a known limitation rather than a defect.

## Requirements *(mandatory)*

### Functional Requirements

**Resume link**

- **FR-001**: The resume destination MUST live in the content layer as a single named field, and
  MUST NOT be hardcoded in the navigation markup.
- **FR-002**: The aggregate content type MUST declare that field, so a missing resume destination
  is a build failure rather than a silent broken link.
- **FR-003**: **Both** resume entry points — the desktop navigation and the mobile menu — MUST
  read from that single field. Neither may retain the current hardcoded value.
- **FR-004**: Both MUST open the CV in a new tab, without granting the opened page a reference
  back to the portfolio.
- **FR-005**: The current destination, which points at a file absent from the site and therefore
  fails, MUST be removed entirely.

**Certifications section**

- **FR-006**: A new certifications section MUST render, identified by an anchor consistent with
  the other sections, positioned between the skills section and the projects section.
- **FR-007**: It MUST reuse the existing section wrapper, container, heading, and eyebrow-heading
  pattern already used by the skills section, so it reads as part of the same page.
- **FR-008**: It MUST read the credential list already exposed by the content layer. No credential
  content may be hardcoded in the display code.
- **FR-009**: Each credential MUST show its name, issuing body, and year.
- **FR-010**: A credential carrying a verification link MUST link to it, opening in a new tab
  without granting a reference back.
- **FR-011**: A credential with no verification link MUST render as non-interactive content — no
  dead link, no empty click target.
- **FR-012**: In-progress credentials MUST be distinguishable from completed ones at a glance,
  using only classes already present in the display code. **APPROVED treatment**: a neutral
  "In progress" chip on in-progress cards only, with nothing in its place on completed cards.
- **FR-013**: Expert-tier credentials MUST NOT carry additional visual emphasis. **APPROVED as
  recommended against**: both expert credentials already state "Expert" in their own names, a third
  visual axis would add noise rather than signal, and one expert credential is also in progress so
  the two treatments would contradict each other on the same card.
- **FR-014**: Whatever distinguishes in-progress or expert credentials MUST NOT reduce legibility
  or make any credential look like an error state.
- **FR-015**: Credentials MUST render in the order the content defines.
- **FR-016**: Card styling MUST reuse the primitives already used by the skills and projects
  sections.

**Link previews and search**

- **FR-017**: The page MUST carry a description of the site for search engines and preview
  services.
- **FR-018**: The page MUST carry title, description, type, and canonical-address metadata for
  platforms that render link previews, plus the equivalent card metadata for the platform that
  uses its own.
- **FR-019**: The existing page title MUST be left as it is, because it already names the owner
  and their role rather than being generic.
- **FR-020**: Only metadata may be added to the page shell. The theme configuration block, the
  inline style block, the styling framework tag, and the font tags MUST NOT be touched.
- **FR-021**: The metadata MUST describe the portfolio accurately and MUST NOT change anything a
  visitor sees on the page.

**Scope and verification**

- **FR-022**: Only these may change: the content type definitions, the site-level content file, the
  navigation component, the application root (to place the new section), the page shell (metadata
  only), and one new certifications component. Every other component, every other content file,
  and the deployment workflow MUST NOT be modified.
- **FR-023**: No new colour, font, or spacing value may be introduced anywhere, verified by
  comparing the class inventory before and after.
- **FR-024**: No dependency may be added.
- **FR-025**: The production build MUST pass with zero warnings before any commit.
- **FR-026**: Every existing section MUST render unchanged apart from the two navigation resume
  links, and the page's section order MUST otherwise be preserved — only the new section is
  inserted.
- **FR-027**: A visual baseline MUST be captured before any file is modified.
- **FR-028**: The work MUST be done on a dedicated feature branch and MUST NOT be committed
  directly to the main branch, because merging to the main branch publishes to production
  automatically.
- **FR-029**: A navigation entry for the new section MUST be added to the site-level content,
  positioned between the skills and projects entries so navigation order matches page order
  (**approved decision C**). **If the resulting navigation crowds at mid-width (roughly 768–900px),
  that MUST be reported to the owner rather than worked around** — no layout adjustment, no
  abbreviated label, no responsive hiding. The owner will decide whether to drop the entry.

### Key Entities

- **Resume destination**: A single address for the owner's CV, held in site-level content and
  declared on the aggregate content type. Required rather than optional, so its absence fails the
  build instead of shipping a dead button.
- **Credential**: Already defined and already populated — name, issuing body, year, completion
  status, seniority tier, and an optional verification link. This feature adds no field and
  changes no credential; it renders them for the first time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Both resume entry points open the CV — 2 of 2 working, up from **0 of 2**, since both
  currently point at a missing file.
- **SC-002**: The resume destination appears exactly **once** in the codebase, in the content layer.
- **SC-003**: The certifications section renders all **7** credentials in content order — zero
  missing, zero duplicated, zero reordered.
- **SC-004**: **5** credentials link to their verification page and **2** render as
  non-interactive, matching the content: every completed credential has a link and neither
  in-progress one does.
- **SC-005**: A viewer unfamiliar with the site can identify which **2** of the 7 are still in
  progress without reading the status closely.
- **SC-006**: Zero new colour, font, or spacing values are introduced, verifiable by comparing the
  class inventory before and after.
- **SC-007**: A link-preview inspector finds a title, a description, a type, and a canonical
  address where it currently finds none.
- **SC-008**: The production build produces zero warnings and zero errors.
- **SC-009**: Every section other than the new one is visually unchanged, and the existing section
  order is preserved with only the new section inserted.
- **SC-010**: Files outside the six permitted by FR-022 are unmodified — measurably zero.
- **SC-011**: The navigation lists **6** entries with Certifications third, and the navigation is
  inspected at mid-width; if it crowds, the finding is reported rather than mitigated.

## Assumptions

- **The resume button is broken, not blank.** Verified: both navigation entry points currently
  point at `/resume.pdf`, a file that exists nowhere in the site, so they 404 today. This is the
  same class of defect as the dead stylesheet reference removed in the first feature — an absolute
  path to a missing file. The request described it as having "no destination"; it has a bad one,
  which makes this a fix rather than an addition.
- **There are two resume links, not one.** Desktop navigation and mobile menu each have their own.
  The request referred to "the button" singular; both must be updated or the mobile menu keeps the
  broken link.
- **The credential field name is `credentialUrl`, and the request is correct.** Confirmed against
  the current type definition. An earlier feature had named it differently; it was renamed since,
  and the request matches today's reality.
- **Seven credentials, five completed and two in progress; two at expert tier.** Verified. The two
  without a verification link are exactly the two in-progress ones, so the link rule and the status
  rule happen to partition the same way today — but they are independent rules and FR-010 follows
  the link, not the status.
- **One expert credential is completed and the other is in progress.** So an expert treatment and
  an in-progress treatment can appear on the same card, and must not conflict visually. This is
  part of what the plan must propose.
- **The new section will share a background with one neighbour.** The page alternates section
  backgrounds strictly, so inserting a section between two of them necessarily breaks the
  alternation on one side. **Assumption: the new section takes the same background as the projects
  section below it, contrasting with the skills section above it.** Rationale: skills and
  certifications are the two most conceptually similar sections and would read as one merged block
  if they shared a background, whereas the boundary with projects is carried by that section's
  large heading. This slightly departs from "reuse the skills wrapper" literally, and is a
  one-class decision that is trivial to reverse.
- **The application root must change, despite not appearing in the request's permitted list.**
  Feature A explicitly says to render the new section in it, so it is in scope by direct
  instruction; the omission from the exclusion list is read as an oversight.
- **The page title stays as it is.** The instruction was to update it only if generic. It already
  names the owner and their role, so it is left alone.
- **Link previews will be text-only.** No image metadata was requested and no suitable image
  exists in the site, so previews will show title and description without a picture. This is a real
  limitation of the result — an image typically dominates a preview — and is recorded rather than
  silently accepted as complete.
- **Verification is manual for appearance and previews.** No test suite, linter, or
  visual-regression harness exists and adding one is out of scope. Class inventory, render counts,
  and link counts remain mechanically checkable; the at-a-glance distinguishability of in-progress
  credentials and the preview rendering are not.

### Note on the constitution

This is the first feature to change **the order of sections in the application root**, which the
project's first principle names explicitly as something that must not be modified. The principle
permits it when the change is flagged and approved before implementation, and the owner has done
exactly that in the request. It is called out here because it is the most significant visual
boundary crossed so far, and because the approval should be visible in the record rather than
implied.
