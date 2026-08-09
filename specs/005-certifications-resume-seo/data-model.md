# Phase 1 Data Model: Certifications, Resume Link & Link Previews

**Date**: 2026-08-10 | **Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

Only one shape changes. The credential shape is already defined and already populated — this feature
renders it for the first time.

## Config (extended)

| Field | Type | Req? | Status | Notes |
|---|---|:--:|---|---|
| `resumeUrl` | `string` | ✅ **required** | **new** | Address of the owner's CV |
| `name`, `title`, `tagline`, `email`, `about`, `socials`, `navItems`, `skills`, `experience`, `projects` | — | — | unchanged | |

### Validation rules

- **VR-001**: `resumeUrl` MUST be **required**, not optional. This is the whole point: an absent CV
  address becomes a compile error instead of another dead button (research.md D-003).
- **VR-002**: `'resumeUrl'` MUST be added to the `Pick<Config, …>` in `data/site.ts`. Without it the
  field is declared but nothing supplies it, and `data/config.tsx`'s aggregate will not satisfy
  `Config`.
- **VR-003**: The value MUST appear exactly **once** in the codebase, in `data/site.ts` (SC-002).
  Neither navigation anchor may retain a literal URL.
- **VR-004**: Because the field is required, **the build will fail between adding it to `Config` and
  supplying it in `site.ts`.** That failure is the mechanism, not a defect. Do not resolve it by
  making the field optional.

### Value

```text
resumeUrl: "https://drive.google.com/file/d/1rxHTO_0Vl6wu2eGRiKLt6aJM79-GEDYV/view"
```

## Certification (unchanged — consumed for the first time)

No field is added or altered. Recorded here because this feature is its first consumer.

| Field | Type | Req? | How the section uses it |
|---|---|:--:|---|
| `name` | `string` | ✅ | Card heading |
| `issuer` | `string` | ✅ | Secondary line |
| `year` | `string` | ✅ | Secondary line |
| `status` | `'completed' \| 'in-progress'` | ✅ | Drives the chip: in-progress gets one, completed does not |
| `tier` | `'expert' \| 'associate' \| 'foundational'` | ✅ | **Not rendered** — see research.md D-002 |
| `credentialUrl` | `string` | ➖ | When present, the card links to it |

### Validation rules

- **VR-005**: Render order MUST follow array order (FR-015). No sorting by status, tier, or year.
- **VR-006**: The link decision MUST key off `credentialUrl`'s presence, **not** off `status`. They
  partition the data identically today, but they are independent rules.
- **VR-007**: A card without `credentialUrl` MUST be non-interactive — not a link with no href, not a
  disabled-looking button (FR-011).
- **VR-008**: `tier` is deliberately unrendered. If the owner overrides research.md D-002, it drives a
  border colour only.
- **VR-009**: `foundational` is a legal tier that **no credential currently uses**. The section must
  not assume only two tiers exist, even though nothing renders tier today.

## Content inventory — the source of the success criteria

| # | Credential | status | tier | `credentialUrl`? |
|---|---|---|---|:--:|
| 1 | Azure Solutions Architect Expert (AZ-305) | completed | expert | ✅ |
| 2 | Azure DevOps Engineer Expert (AZ-400) | **in-progress** | **expert** | ❌ |
| 3 | Certified Kubernetes Administrator (CKA) | **in-progress** | associate | ❌ |
| 4 | Azure Developer Associate (AZ-204) | completed | associate | ✅ |
| 5 | Azure Administrator Associate (AZ-104) | completed | associate | ✅ |
| 6 | AWS Certified Solutions Architect – Associate | completed | associate | ✅ |
| 7 | Kubernetes and Cloud Native Associate (KCNA) | completed | associate | ✅ |

**Totals**: 7 credentials, **5 completed / 2 in-progress**, **5 associate / 2 expert**,
**5 linked / 2 unlinked**. This table is the source of SC-003 (7 render in this order), SC-004 (5
link, 2 do not), and SC-005 (2 identifiable as in progress).

**Row 2 is the crux of research.md D-002**: AZ-400 is simultaneously the most senior credential and
an unfinished one. Any expert emphasis would sit on the same card as the in-progress chip and
contradict it.

## navItems (conditional — decision C)

| Field | Change |
|---|---|
| `navItems` | **If decision C is approved**, insert `{ name: "Certifications", href: "#certifications" }` between the Skills and Projects entries, so navigation order matches page order |

- **VR-010**: If added, the entry MUST be positioned between Skills and Projects. Navigation order
  that disagrees with page order is worse than no entry.
- **VR-011**: If **not** added, the section still renders and remains reachable by scrolling. Nothing
  else changes.

## Nothing else changes

`Project`, `Skill`, `Experience`, `SocialLink`, `NavItem` are untouched. No content file other than
`data/site.ts` is modified — in particular `data/certifications.ts` is **read but not edited**.
