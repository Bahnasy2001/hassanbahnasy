# Feature Specification: Scaffolding Cleanup

**Feature Branch**: `chore/repo-cleanup`

**Created**: 2026-08-03

**Status**: Draft

**Input**: User description: "Repository cleanup: correct inconsistencies left over from the original scaffolding tool. No visual or functional change to the rendered site."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clean, warning-free build output (Priority: P1)

A maintainer builds the site for production and gets a completely clean result: no
warnings in the build log, and no failed asset requests when the built site is
loaded in a browser. Today the build emits a warning and the served page requests a
stylesheet that does not exist, returning a 404 — noise that trains maintainers to
ignore build output and hides real problems.

**Why this priority**: Build noise is the highest-cost defect here. Because every
push to the main branch deploys automatically with no manual gate, a maintainer who
has learned to ignore warnings is the only thing standing between a real error and
production. Fixing this restores the signal value of the build log, and it delivers
value even if nothing else in this cleanup ships.

**Independent Test**: Run a production build and confirm zero warnings. Serve the
built output, open it in a browser, and confirm the network log shows no 404 or other
failed requests. Compare the rendered page against the pre-change baseline to confirm
it is unchanged.

**Acceptance Scenarios**:

1. **Given** the repository before this change, **When** a maintainer runs a
   production build, **Then** the build log contains at least one warning about a
   referenced file that cannot be resolved.
2. **Given** the repository after this change, **When** a maintainer runs a
   production build, **Then** the build completes successfully and the log contains
   zero warnings.
3. **Given** the built site is served locally after this change, **When** a visitor
   loads any page, **Then** the browser network log records no failed (404) requests.
4. **Given** the built site is served locally after this change, **When** a visitor
   views the page, **Then** every section renders identically to the pre-change
   baseline, including colors, fonts, spacing, section order, and animations.

---

### User Story 2 - One unambiguous deployment path (Priority: P2)

A maintainer wanting to know how the site reaches production finds exactly one
answer. Today two competing deployment paths exist — an automated one that actually
runs, and a manual one that a maintainer could invoke by hand — creating a risk that
someone publishes from an unbuilt or stale local working copy and silently overwrites
what automation published.

**Why this priority**: This removes a genuine footgun rather than just tidying, but
it is second to P1 because the redundant path causes harm only when someone actually
invokes it, whereas the build noise misleads on every single build.

**Independent Test**: Inspect the project's declared scripts and dependencies and
confirm no manual publish command or publishing tool remains. Then confirm the
automated path still deploys successfully by observing a run of it.

**Acceptance Scenarios**:

1. **Given** the repository after this change, **When** a maintainer lists the
   available project scripts, **Then** no script exists that publishes the site
   manually.
2. **Given** the repository after this change, **When** a maintainer inspects the
   declared development dependencies, **Then** the manual publishing tool is absent.
3. **Given** the repository after this change, **When** a change is merged to the
   main branch, **Then** the automated deployment still builds and publishes the site
   successfully, with no regression in the deployed result.
4. **Given** the repository after this change, **When** a maintainer inspects the
   project's declared metadata, **Then** the public site address field is absent, and
   the only place the live address is stated is the README.

---

### User Story 3 - README a newcomer can trust (Priority: P3)

A newcomer — or the site owner returning after months away — opens the README to
update their bio or add a project, follows its instructions literally, and succeeds
on the first attempt. Today the README points at a content path that does not exist
in the repository and documents a deployment procedure that is no longer how the site
is published, so following it literally leads to confusion or to an unintended manual
publish.

**Why this priority**: This is documentation accuracy: it costs a maintainer time and
confidence but never breaks the running site, so it ranks below the two changes that
affect build integrity and deployment safety.

**Independent Test**: Have someone unfamiliar with the repository follow the README's
content-editing instructions to make one small content edit, and read its deployment
section. Confirm the path it names exists, the edit succeeds without guesswork, and
the deployment description matches what the automation actually does.

**Acceptance Scenarios**:

1. **Given** the README after this change, **When** a maintainer follows its
   instructions to locate editable content, **Then** the path it names exists in the
   repository and contains the content described.
2. **Given** the README after this change, **When** a maintainer reads the deployment
   section, **Then** it describes deployment as automatic on merge to the main branch
   and does not instruct the reader to run any manual publish command.
3. **Given** the README after this change, **When** a maintainer follows the live
   site link, **Then** the link resolves to the working live site.

---

### User Story 4 - No dead scaffolding files (Priority: P3)

A maintainer browsing the repository root encounters only files that are actually
used. Today an unused descriptor file left behind by the original generator sits in
the root, where a future maintainer may waste time reading it, or worse, edit it
believing it configures something.

**Why this priority**: Lowest impact of the four — the file is inert and harms
nothing at runtime. It is included because it is cheap to remove while this cleanup
is already open, and leaving it contradicts the purpose of the cleanup.

**Independent Test**: Confirm the file is absent, then run a production build and
serve the result to confirm nothing depended on it.

**Acceptance Scenarios**:

1. **Given** the repository after this change, **When** a maintainer lists the
   repository root, **Then** the unused generator descriptor file is absent.
2. **Given** the file has been removed, **When** a maintainer runs a production
   build, **Then** the build succeeds and the rendered site is unchanged.

---

### Edge Cases

- **What if removing the redundant publishing tool changes the resolved versions of
  unrelated packages?** The dependency lockfile must be regenerated so it stays
  consistent with the declared dependencies, and the build must be re-verified
  afterward. An unrelated version drift introduced by regeneration is a visual/
  functional risk and must be caught by the visual comparison before merge.
- **What if the site is currently relying on the leftover module-resolution
  declarations at runtime rather than at build time?** The built and served output
  must be verified in a browser, not just at build time, since a build that succeeds
  does not by itself prove the browser resolved every module.
- **What if the live site address casing in the corrected documentation does not
  match how the hosting platform actually serves the site?** The corrected link must
  be opened and confirmed to resolve before merge, rather than assumed correct.
- **What if the automated deployment depends on something being removed here?** The
  automated deployment definition must be read and confirmed independent of every
  removed script, dependency, and file before merge.
- **What if the build emits a warning unrelated to the items in scope?** Achieving a
  fully warning-free build is the stated goal; if an unrelated warning surfaces, it
  must be reported to the owner as a scope decision rather than silently left in
  place or silently fixed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The production build MUST complete successfully with zero warnings in
  its output.
- **FR-002**: The served site MUST produce no failed asset requests; the reference to
  a stylesheet file that does not exist in the repository MUST be removed.
- **FR-003**: The leftover module-resolution declarations that the build ignores, and
  whose declared versions conflict with the project's declared dependencies, MUST be
  removed so that the declared dependency manifest is the only source of dependency
  versions.
- **FR-004**: The manual publish command and its accompanying pre-publish command
  MUST be removed from the project's scripts, and the publishing tool they depend on
  MUST be removed from the declared development dependencies, leaving the automated
  deployment as the only path to production.
- **FR-005**: The dependency lockfile MUST be regenerated so that it contains no
  trace of the removed publishing tool and remains consistent with the declared
  dependencies.
- **FR-006**: The declared public site address field MUST be deleted rather than
  corrected. Once the manual publishing tool is removed, no tooling reads that field,
  so a corrected value would be an unverified claim that no process can keep accurate
  — exactly the class of drift this cleanup exists to remove. The live address remains
  documented in the README (FR-009), where a reader can act on it.
- **FR-007**: The README MUST name the actual location of editable content, and MUST
  NOT reference a path that does not exist in the repository.
- **FR-008**: The README MUST describe deployment as automatic on merge to the main
  branch, and MUST NOT instruct the reader to run a manual publish command or to
  configure the hosting source by hand.
- **FR-009**: The README MUST link to the live site using the correct address,
  verified to resolve.
- **FR-010**: The unused descriptor file left by the original generator MUST be
  deleted, after confirming no file references it.
- **FR-011**: The rendered site MUST be visually identical to the pre-change
  baseline: identical colors, fonts, spacing, section order, content, and animations,
  verified at both a desktop and a mobile viewport width.
- **FR-012**: The theme configuration block, all component files, all files in the
  content directory, and the automated deployment definition MUST NOT be modified by
  this change.
- **FR-013**: A visual baseline of the current site MUST be captured before any file
  is modified, so that the "visually identical" claim in FR-011 can be verified
  against evidence rather than asserted from memory.
- **FR-014**: The work MUST be done on a dedicated feature branch and MUST NOT be
  committed directly to the main branch, because merging to the main branch publishes
  to production automatically.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A production build produces zero warnings and zero errors — down from
  at least one warning today.
- **SC-002**: Loading the served site produces zero failed requests, down from one
  404 today.
- **SC-003**: The rendered site is visually indistinguishable from the pre-change
  baseline across all eight sections, at both desktop and mobile widths, under
  side-by-side comparison.
- **SC-004**: Exactly one deployment path exists, down from two today; a maintainer
  inspecting the project can find no way to publish manually.
- **SC-005**: Every file path and address stated in the README resolves correctly —
  100% of them, up from a documented content path that does not exist and a live link
  with incorrect casing.
- **SC-006**: A maintainer unfamiliar with the repository can locate and edit site
  content by following the README alone, without needing to search the repository or
  ask a question.
- **SC-007**: Exactly one file is deleted by this change — the unused descriptor file
  left by the original generator — and no other file in the repository is deleted.

## Assumptions

- The live site address is `https://bahnasy2001.github.io/hassanbahnasy/` in
  lowercase, as stated by the owner. This is taken as authoritative and will be
  confirmed by opening the link before merge, since it reflects the hosting
  platform's actual behavior rather than anything inside the repository.
- Because the build is configured to reference its assets relatively rather than from
  a fixed absolute path, the declared address casing does not affect whether the built
  site's assets load. That field is read only by the manual publishing tool being
  removed, so after this change nothing consumes it — which is why FR-006 deletes the
  field instead of correcting it. Deleting it is assumed safe on the same basis and
  will be confirmed by a successful build and deployment.
- The automated deployment is assumed to be self-contained — installing dependencies
  and building from scratch, independent of the scripts and dependency being removed.
  This will be confirmed by reading the automation definition before merge.
- Regenerating the dependency lockfile is assumed to be in scope, since it is not
  listed as excluded and leaving stale entries would contradict the goal of internal
  consistency.
- "No warnings" is assumed to mean no warnings from the project's own build, not from
  the dependency installation step, which can emit advisories outside this project's
  control.
- No automated visual regression testing or test suite exists in this project, so
  visual verification is assumed to be a manual side-by-side comparison against a
  baseline captured before the change.
- No automated check enforces documentation accuracy, so the README corrections are
  assumed to be verified by human reading rather than by tooling.
- The existing build warning and 404 are reported by the owner and have not yet been
  reproduced by running a build. The presence of a reference to a stylesheet file that
  does not exist in the repository has been confirmed by inspection, which is
  consistent with both symptoms. The baseline build required by FR-013 will confirm
  the exact warning text before any file is changed.
