# Feature Specification: Case Study Modal

**Feature Branch**: `feat/project-popups`

**Created**: 2026-08-09

**Status**: Approved — Q1 resolved by the owner on 2026-08-09 (Option A, two behavioural classes)

**Input**: User description: "Add a case study popup to the Projects section. This is a VISUAL change, approved by the owner."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A reviewer can read the story behind a project (Priority: P1)

A hiring manager or technical reviewer sees a project card with a one-line summary and wants
the substance: what problem it solved, how it was approached, what it achieved. Today that
depth exists in the content but is invisible — nothing renders it — so a reviewer's only options
are the one-liner or leaving the site for a repository.

**Why this priority**: This is the whole feature. The depth is already written and currently
wasted. Making it readable without leaving the page is what turns a card grid into evidence.

**Independent Test**: Open a project's case study, read all three sections, and close it again
without the page state changing underneath.

**Acceptance Scenarios**:

1. **Given** a card whose content includes a problem, an approach, and an impact, **When** a
   visitor looks at the card, **Then** a "Read case study" affordance appears at the bottom of
   that card.
2. **Given** that affordance, **When** the visitor activates it, **Then** a popup opens showing
   the item's title followed by three clearly labelled sections: Problem, Approach, Impact.
3. **Given** a card missing any one of problem, approach, or impact, **When** a visitor looks at
   it, **Then** **no** case-study affordance appears.
4. **Given** the popup is open, **When** the visitor closes it, **Then** they return to exactly
   the same scroll position and page state as before opening it.

---

### User Story 2 - A reviewer can reach every repository behind a multi-part item (Priority: P2)

One item — the collection of four early standalone exercises — is four separate pieces of work
in four separate repositories. Today it carries a single link pointing at the owner's profile
page, which tells a reviewer nothing about which repository is which. A reviewer wanting to
inspect the Jenkins-to-Minikube pipeline specifically has no way to get there.

**Why this priority**: It converts a dead-end link into four addressable pieces of evidence.
Second to P1 because it affects one item, whereas P1 affects eight.

**Independent Test**: Open that item's case study and confirm four distinctly named repository
links are listed and each opens the correct repository in a new tab.

**Acceptance Scenarios**:

1. **Given** an item carrying a set of named links, **When** its popup is open, **Then** those
   links are listed at the bottom under a "Repositories" heading, each showing its own name.
2. **Given** a listed repository link, **When** the visitor activates it, **Then** the
   repository opens in a new tab and the portfolio page remains as it was.
3. **Given** an item with case-study content but **no** named links, **When** its popup is open,
   **Then** no "Repositories" heading and no empty list appear.
4. **Given** the multi-part item, **When** a visitor looks at its card, **Then** the single
   profile-level link it used to carry is gone, replaced by the named links inside the popup.

---

### User Story 3 - Closing the popup never traps the visitor (Priority: P1)

A visitor who opens the popup must always be able to get out, by whichever means they reach for
first: the close control, clicking outside it, or pressing Escape. A popup a visitor cannot
dismiss is worse than no popup at all.

**Why this priority**: Equal to P1 with User Story 1, deliberately. An unescapable overlay on a
portfolio is an outright defect — a reviewer who gets stuck simply leaves. The feature is not
shippable without this, so it is not a lower-priority refinement.

**Independent Test**: Open the popup and close it three separate times, once by each method,
confirming each works independently.

**Acceptance Scenarios**:

1. **Given** the popup is open, **When** the visitor activates the close control, **Then** it
   closes.
2. **Given** the popup is open, **When** the visitor clicks the area outside the popup panel,
   **Then** it closes.
3. **Given** the popup is open, **When** the visitor presses Escape, **Then** it closes.
4. **Given** the popup is open, **When** the visitor clicks **inside** the popup panel — on
   text, a heading, or whitespace — **Then** it does **not** close.
5. **Given** the popup has opened and closed, **When** the visitor opens a different item's
   popup, **Then** it shows that item's content, with no content left over from the previous one.

---

### Edge Cases

- **Does the popup fit on a phone?** The longest case study is a title, three prose sections
  (one over 400 characters), and four links. That exceeds a typical phone viewport, so the popup
  must remain fully readable and every part reachable at mobile width. **This is the subject of
  Q1**, because the means of achieving it may conflict with the styling constraint.
- **What happens to the page behind the popup?** While the popup is open, the content behind it
  must not scroll in a way that makes the popup appear to drift or lose position.
- **What if an item has only some of the three case-study fields?** The affordance appears only
  when all three are present. Partial content shows nothing — no half-empty popup.
- **What if a link set is present but empty?** Treated the same as absent: no "Repositories"
  heading, no empty list.
- **Does the existing repository icon change behaviour?** No. It continues to navigate directly
  to its target. Exactly one thing on the page opens a popup, and it is the case-study
  affordance.
- **Can two popups be open at once?** No. At most one is open at any time.
- **What about a keyboard-only visitor?** Escape support implies keyboard users are expected, so
  the affordance must be reachable and operable by keyboard, and opening a popup must not leave
  keyboard focus stranded behind the overlay.
- **What if the multi-part item's old link is removed but the named links are not added?** That
  would silently lose a reference a visitor can currently follow. Both halves of that content
  change are required together.

## Requirements *(mandatory)*

### Functional Requirements

**Content shape**

- **FR-001**: The item content shape MUST gain an optional set of named links, each carrying a
  display label and a destination address. Existing fields MUST be unchanged.
- **FR-002**: The named-link set MUST be optional, because eleven of twelve items do not have one.

**Content change**

- **FR-003**: On the multi-part item (the collection of four early standalone exercises), the
  existing single repository reference MUST be removed and replaced by four named links:
  - "SemiColon Registration Pipeline" → `https://github.com/Bahnasy2001/semi-colon-pipeline`
  - "Jenkins + Terraform + Ansible EC2" → `https://github.com/Bahnasy2001/jenkins-terraform-ansible-ec2-pipeline`
  - "Minikube CI/CD Pipeline" → `https://github.com/Bahnasy2001/CICD_SimpleApp`
  - "LAMP Stack Deployment" → `https://github.com/Bahnasy2001/LAMP_Task`
- **FR-004**: That same item MUST gain problem, approach, and impact content, reproduced
  **verbatim** as supplied by the owner. No paraphrasing, reflowing, or re-punctuation.
- **FR-005**: No other item's content may be changed.

**Affordance**

- **FR-006**: A "Read case study" affordance MUST render at the bottom of every card whose
  content includes **all three** of problem, approach, and impact.
- **FR-007**: Cards missing any one of the three MUST NOT render the affordance.
- **FR-008**: The affordance MUST be operable by both pointer and keyboard.

**Popup content**

- **FR-009**: The popup MUST show the item's title, then three sections labelled Problem,
  Approach, and Impact, in that order.
- **FR-010**: Where the item carries named links, the popup MUST list them at the bottom under a
  "Repositories" heading, each labelled and each opening in a new tab.
- **FR-011**: Where the item carries no named links, or an empty set, the popup MUST omit the
  heading and the list entirely.
- **FR-012**: At most one popup may be open at a time, and its content MUST correspond to the
  card that opened it, with nothing retained from a previously opened item.

**Dismissal**

- **FR-013**: The popup MUST close via a close control, via activation of the area outside the
  popup panel, and via the Escape key. All three MUST work independently.
- **FR-014**: Interaction **inside** the popup panel MUST NOT close it.
- **FR-015**: Closing MUST restore the page to the same scroll position and state as before
  opening.

**Accessibility**

- **FR-016**: The popup MUST be announced as a dialog to assistive technology and MUST be
  associated with its title.
- **FR-017**: Opening the popup MUST move keyboard focus into it; closing MUST return focus to
  the affordance that opened it. A keyboard visitor MUST NOT be able to reach content behind the
  overlay while it is open.

**Presentation constraints**

- **FR-018**: The popup MUST remain fully readable and every part of it reachable at mobile
  width, including the longest case study. Achieved via the two owner-approved behavioural classes
  (`max-h-full`, `overflow-y-auto`) — Q1 resolved.
- **FR-019**: Open and close transitions MUST be animated using the animation library already
  in the project. No new animation dependency.
- **FR-020**: Styling MUST reuse classes already present in the display components, with exactly
  **two** owner-approved exceptions: `max-h-full` and `overflow-y-auto`, both behavioural. **No new
  colour, font, or spacing value** may be introduced, and the theme configuration MUST NOT be
  modified. `cursor-pointer` was considered and explicitly declined.

**Scope and verification**

- **FR-021**: Only these files may change: the content type definitions, the one content file
  holding the items, the work-section display component, and one new popup component. The page
  shell and its theme configuration, the application root, every other display component, every
  other content file, and the deployment workflow MUST NOT be modified.
- **FR-022**: All twelve cards MUST still render, in the same two groups and the same order.
- **FR-023**: The production build MUST pass with zero warnings before any commit.
- **FR-024**: A class-inventory comparison MUST show **exactly two** added values — `max-h-full`
  and `overflow-y-auto` — and no new colour, font, or spacing value. A third addition of any kind
  is a failure.
- **FR-025**: A visual baseline MUST be captured before any file is modified.
- **FR-026**: The work MUST be done on a dedicated feature branch and MUST NOT be committed
  directly to the main branch, because merging to the main branch publishes to production
  automatically.

### Key Entities

- **Named link**: A label plus a destination. Exists so one item can point at several
  repositories with each identified by name, replacing a single unlabelled reference. Optional on
  every item; present on exactly one today.
- **Case study**: Not a new entity — a view over three fields (problem, approach, impact) that
  already exist on the item shape, plus the item's title and any named links. It becomes
  addressable content for the first time; nothing about its storage changes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 12 cards render, in the same two groups and the same order as before.
- **SC-002**: **8 of 12** cards show the "Read case study" affordance — the 7 items in the
  projects group plus the multi-part labs item — and the remaining **4** show none.
- **SC-003**: The popup closes by all three means; 3 of 3 methods work independently.
- **SC-004**: Clicking inside the popup panel closes it 0 times out of at least 5 attempts on
  different areas.
- **SC-005**: The multi-part item's popup lists exactly 4 named repository links, each opening
  its correct destination in a new tab; the previous single profile link appears nowhere.
- **SC-006**: The longest case study is fully readable at mobile width, with 0 content
  unreachable and 0 horizontal page scrolling.
- **SC-007**: A keyboard-only visitor can open, read, and close the popup without a mouse, and
  focus returns to where it started.
- **SC-008**: The production build produces zero warnings and zero errors.
- **SC-009**: Zero new colour, font, or spacing values are introduced, verifiable by comparing
  the class inventory before and after.
- **SC-010**: Files outside the four permitted by FR-021 are unmodified — measurably zero.

## Assumptions

- **The case-study affordance will appear on 8 of 12 cards, not 1.** Verified in the content: 7
  items — all of them in the projects group — already carry problem, approach, and impact from an
  earlier content pass. Adding those fields to the multi-part labs item brings the total to 8.
  The request described the rule rather than the count, so this is stated explicitly because it
  is a larger visible change than "add a popup to one card" might suggest. The other 4 labs items
  have none of the three fields and will show nothing.
- **"Exactly one popup behaviour" is read as: exactly one dialog, opened only by the case-study
  affordance.** The navigation menu's existing mobile expand/collapse is a menu rather than a
  dialog, is untouched, and is out of scope. The repository icon keeps navigating directly.
- **The three prose fields are used exactly as supplied.** They are owner-authored copy; the spec
  treats them as verbatim content, not as text to edit.
- **Accessibility requirements FR-016 and FR-017 were added beyond the stated request.** Escape-
  key support was asked for, which implies keyboard visitors are expected; a dialog that takes
  keyboard focus without managing it strands those visitors behind the overlay. These are
  attribute- and behaviour-level requirements and introduce no styling.
- **Both halves of the content change are one unit.** Removing the old single link without adding
  the four named ones would lose a reference a visitor can follow today, so FR-003 treats removal
  and addition as inseparable.
- **Verification is manual for interaction.** No test suite, linter, or visual-regression harness
  exists and adding one is out of scope, so dismissal, focus behaviour, and mobile usability are
  checked by hand. The class inventory and render counts remain mechanically checkable.
- **The popup renders inside the work section's component tree** rather than being relocated to
  the application root, because the root is out of scope. This is assumed not to cause stacking
  problems; if it does, that is a finding for the plan.

### Q1 — The styling constraint conflicts with mobile usability *(blocking)*

**Context**: FR-020 requires reusing classes already present in the display components and adds
"no new colours, fonts, or spacing values". FR-018 requires the popup to be fully usable at
mobile width.

**The conflict**: a survey of every utility class currently used in `components/` found the
overlay primitives available — `fixed`, `inset-0`, `z-50`, `backdrop-blur`, `max-w-*` — but
**no height-constraining or scrolling utility exists at all**: zero occurrences of
`overflow-y-auto`, zero of any `max-h-*`. The longest case study (title, three prose sections of
which one exceeds 400 characters, plus four links) will not fit a phone viewport. Without a way
to cap the panel's height and scroll its contents, the popup either extends past the screen with
its lower part unreachable, or the page scrolls behind it — both failing FR-018 and SC-006.

**Why this needs the owner**: the two instructions cannot both be satisfied literally, and this
project treats visible design as an owner decision. Note that the classes in question are
**behavioural** (scrolling, height limits), not colours, fonts, or spacing — so one reading of
the instruction permits them and another forbids them.

| Option | Answer | Implications |
|--------|--------|--------------|
| A | Permit a small, listed set of **behavioural** utilities — height cap, vertical scroll, and page-scroll lock — while keeping "no new colours, fonts, or spacing values" absolute | Popup is properly usable on a phone. Adds 2–4 classes that are structural rather than decorative; the palette, type, and spacing scale stay untouched. The exact list would be enumerated in the plan for approval. |
| B | Strictly no new classes of any kind | Literal compliance. The longest case study will overflow on a phone with content unreachable, knowingly failing FR-018 and SC-006. |
| C | Avoid the need for scrolling by shortening what the popup shows on small screens | Keeps the class rule absolute, but hides owner-authored content from mobile visitors — a large share of traffic — which undercuts the point of the feature. |
| D | Make the case study a full-page view rather than an overlay | Sidesteps height constraints, since the page scrolls naturally. A much larger change than requested, and it breaks FR-015's "return to the same scroll position". |

**Recommendation: A.** It is the only option that delivers the feature on a phone, and it keeps
the constraint that actually protects the approved design — the palette, fonts, and spacing scale
— fully intact.

### RESOLVED — Option A (owner decision, 2026-08-09)

The owner approved **Option A** with the exact list Phase 0 produced:

| Class | Purpose |
|---|---|
| `max-h-full` | Caps the panel to its padded viewport container |
| `overflow-y-auto` | Lets the capped panel scroll its own content |

**`cursor-pointer` was offered and explicitly declined** — the affordance relies on its accent-colour
hover change, consistent with every other interactive element on the page.

Everything else in the dialog is built from classes already present in `components/`: the panel is
About's panel verbatim, the backdrop is the navbar's, the close control is the card's link button,
and the body scroll lock uses `overflow-hidden`, which already exists. Nothing about the palette,
fonts, or spacing scale changes.
