# Phase 1 Data Model: Case Study Modal

**Date**: 2026-08-09 | **Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

Shapes live in `types.ts` and MUST be declared before data is written against them
(Constitution III / FR-001).

## ProjectLink (new)

| Field | Type | Req? | Notes |
|---|---|:--:|---|
| `label` | `string` | ✅ | Human-readable name shown in the dialog, e.g. "Minikube CI/CD Pipeline" |
| `url` | `string` | ✅ | Destination, opened in a new tab |

Declared as an inline object type on the field, matching the request:

```text
links?: { label: string; url: string }[]
```

## Project (extended)

| Field | Type | Req? | Status | Notes |
|---|---|:--:|---|---|
| `links` | `{ label: string; url: string }[]` | ➖ | **new** | Named repository links. Present on 1 of 12 items |
| `problem` / `approach` / `impact` | `string` | ➖ | unchanged | Already existed; now rendered for the first time |
| `repoUrl` | `string` | ➖ | unchanged | Still used by the card's icon button. **Removed from one item's data**, not from the type |
| all other fields | — | — | unchanged | `slug`, `kind`, `title`, `summary`, `description`, `tags`, `demoUrl`, `year`, `image`, `readmeUrl`, `featured`, `labCount` |

### Validation rules

- **VR-001**: `links` MUST be optional — 11 of 12 items have none.
- **VR-002**: Every entry MUST carry both a non-empty `label` and a non-empty `url`.
- **VR-003**: An absent `links` field and an empty `links` array MUST behave identically: no
  "Repositories" heading, no empty list (FR-011).
- **VR-004**: `links` and `repoUrl` are **independent**. `repoUrl` continues to drive the card's
  icon button; `links` appears only inside the dialog. One item may have either, both, or neither.
- **VR-005 — the rule the type cannot express**: the case-study affordance requires **all three** of
  `problem`, `approach`, `impact`. All three are optional strings, so a partially-filled item is
  type-valid. This MUST be enforced by the render guard. See research.md D-006 — this is a known
  limitation, not an oversight.

## Content change — `individual-labs-early-projects` only

**Remove**: `repoUrl: "https://github.com/Bahnasy2001"` — a profile URL, not a repository, which is
why it is being replaced rather than kept alongside.

**Add** `links`, in this order:

| # | label | url |
|---|---|---|
| 1 | SemiColon Registration Pipeline | `https://github.com/Bahnasy2001/semi-colon-pipeline` |
| 2 | Jenkins + Terraform + Ansible EC2 | `https://github.com/Bahnasy2001/jenkins-terraform-ansible-ec2-pipeline` |
| 3 | Minikube CI/CD Pipeline | `https://github.com/Bahnasy2001/CICD_SimpleApp` |
| 4 | LAMP Stack Deployment | `https://github.com/Bahnasy2001/LAMP_Task` |

**Add** three fields, reproduced **verbatim** — no reflowing, no re-punctuation, no smart quotes
substituted for the apostrophes in "there's" and "they're":

- `problem`: "Individual exercises get abandoned half-finished when there's no pressure to complete them, and scattered across repositories they're impossible to point anyone at."
- `approach`: "Four standalone exercises, each taken to a working end state: a backend registration system deployed with Terraform, Ansible, Jenkins, and Docker Compose; a Jenkins pipeline where Ansible configures EC2 instances discovered dynamically from Terraform tags; a Jenkins-to-Minikube deployment pipeline; and a LAMP stack built and deployed on cloud infrastructure."
- `impact`: "Four separate delivery approaches, each finished and documented in its own repository."

**No other item's content may change** (FR-005).

### Note on an overlap worth the owner's eye

The new `approach` text and this item's existing `description` describe the same four exercises in
closely similar wording — `description` already reads "Four standalone exercises from earlier in the
journey: a backend registration system deployed with Terraform, Ansible, Jenkins, and Docker
Compose; …". Since feature 003, `description` is **no longer rendered** anywhere (cards show
`summary`), so there is no visible duplication today. Recorded because the two will drift apart as
copy is edited, and because `description` is now dead weight on all 12 items — a content question
outside this feature's scope.

## Case study — a view, not an entity

The dialog composes existing fields; it stores nothing new:

| Dialog element | Source |
|---|---|
| Title | `title` |
| Problem / Approach / Impact sections | `problem`, `approach`, `impact` |
| Repositories list | `links` (omitted when absent or empty) |

No migration, no defaults, no derived values persisted.

## Item inventory after this change

| Group | Items | Has all 3 case-study fields | Has `links` |
|---|:--:|:--:|:--:|
| Featured Projects (`kind: "project"`) | 7 | **7** | 0 |
| Labs & Practice (`kind: "lab"`) | 5 | **1** (`individual-labs-early-projects`) | **1** (same item) |
| **Total** | **12** | **8** | **1** |

This table is the source of SC-001, SC-002, and SC-005: 12 cards render, 8 show the affordance, 4 do
not, and exactly one dialog lists 4 repository links.
