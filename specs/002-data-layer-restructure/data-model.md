# Phase 1 Data Model: Data Layer Restructure

**Date**: 2026-08-04 | **Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

All shapes live in `types.ts` and MUST be declared before any data is written against them
(Constitution III / FR-011).

## Project (extended)

Existing fields are unchanged in name, type, and optionality (FR-003). New fields are
grouped by purpose.

| Field | Type | Req? | Status | Notes |
|---|---|:--:|---|---|
| `slug` | `string` | ✅ | **new** | Unique identity. Derived per the rule below, written as a literal. |
| `kind` | `'project' \| 'lab'` | ✅ | **new** | Union, not `string` — an invalid value must be a compile error. |
| `summary` | `string` | ✅ | **new** | Short one-liner for compact display. Currently unrendered. |
| `title` | `string` | ✅ | unchanged | Rendered on cards. |
| `description` | `string` | ✅ | unchanged | Rendered on cards. MUST stay byte-identical. |
| `tags` | `string[]` | ✅ | unchanged | Rendered as chips, in array order. |
| `repoUrl` | `string` | ➖ | unchanged | Card renders a GitHub button only when present. |
| `demoUrl` | `string` | ➖ | unchanged | Card renders a demo button only when present. |
| `problem` | `string` | ➖ | **new** | Case-study depth. Left unset by this feature. |
| `approach` | `string` | ➖ | **new** | Case-study depth. Left unset. |
| `impact` | `string` | ➖ | **new** | Case-study depth. Left unset. |
| `year` | `string` | ➖ | **new** | `string`, not `number` — accommodates "2025", "2024–2025", "Ongoing". |
| `image` | `string` | ➖ | **new** | Left unset. |
| `readmeUrl` | `string` | ➖ | **new** | Left unset. |
| `featured` | `boolean` | ➖ | **new** | Absent means not featured; no default needed. |
| `labCount` | `number` | ➖ | **new** | Only meaningful when `kind` is a collection entry. |

### Validation rules

- **VR-001**: `slug` MUST be unique across all projects. Four projects, four distinct
  slugs — verifiable by counting unique values.
- **VR-002**: `slug` MUST match `^[a-z0-9]+(-[a-z0-9]+)*$` — lowercase alphanumerics
  separated by single hyphens, no leading, trailing, or doubled hyphens.
- **VR-003**: `kind` MUST be `'project'` or `'lab'`. Enforced by the union type at compile
  time, so no runtime guard is needed.
- **VR-004**: `summary` MUST be non-empty and SHOULD be shorter than `description`.
- **VR-005**: Making `slug`, `kind`, and `summary` **required** is deliberate: a project
  added without them fails the build instead of rendering a blank field. This is the
  Principle III mechanism doing real work.

### Why every link field is optional

`repoUrl`, `demoUrl`, `image`, and `readmeUrl` are all optional because real projects have
different subsets of them (FR-003). This is already safe at the display layer — verified in
`components/Projects.tsx`, which guards each link with `{project.repoUrl && …}`, so an
absent link renders no button rather than a broken one.

### Slug derivation

Lowercase the title; replace each run of non-alphanumeric characters with a single `-`;
trim leading and trailing `-`.

| Title | Slug |
|---|---|
| Secure Cloud-Native Microservices CI/CD | `secure-cloud-native-microservices-ci-cd` |
| Serverless Image Editor | `serverless-image-editor` |
| Pulumi Azure Infrastructure – NDC Core | `pulumi-azure-infrastructure-ndc-core` |
| To-Do List GitOps Pipeline | `to-do-list-gitops-pipeline` |

Written as literals, never computed at runtime — slugs are identity, and a future title
edit must not silently change one (research.md D-004).

### Migration values

`kind: 'project'` for all four. `summary` = first sentence of the existing `description`:

| Slug | Summary |
|---|---|
| `secure-cloud-native-microservices-ci-cd` | Designed a secure end-to-end CI/CD pipeline for a microservices app (Node.js, Go, Python). |
| `serverless-image-editor` | A fast, secure, and scalable serverless image processing application built on AWS. |
| `pulumi-azure-infrastructure-ndc-core` | Designed production-ready Azure infrastructure using Pulumi (Python). |
| `to-do-list-gitops-pipeline` | Deployed a Node.js App with MongoDB using Docker, Ansible, and Kubernetes. |

`problem`, `approach`, `impact`, `year`, `image`, `readmeUrl` are **omitted entirely** —
not set to `""` or `null` (FR-006). An omitted optional field and an empty string are
different states, and only omission means "not yet written".

## Certification (new)

| Field | Type | Req? | Notes |
|---|---|:--:|---|
| `name` | `string` | ✅ | e.g. "AWS Certified Solutions Architect – Associate" |
| `issuer` | `string` | ✅ | e.g. "Amazon Web Services" |
| `year` | `string` | ✅ | `string` for consistency with `Project.year` and to allow "In progress". |
| `status` | `'completed' \| 'in-progress'` | ✅ | Union — invalid values are compile errors. |
| `tier` | `'expert' \| 'associate' \| 'foundational'` | ✅ | Signals seniority. |
| `credlyUrl` | `string` | ➖ | Optional: not every credential has a public badge. |

### Validation rules

- **VR-006**: `status` and `tier` MUST be the unions above, enforced at compile time.
- **VR-007**: The certifications collection MUST be typed `Certification[]` even while
  empty, so the first entry added is type-checked immediately (FR-010).
- **VR-008**: An in-progress certification MUST be valid without `credlyUrl` — an
  unfinished credential has no badge to link.

## Unchanged entities

`NavItem`, `Skill`, `Experience`, `SocialLink`, and `Config` are **unchanged in shape**.
Their content is unchanged too; only its file location moves.

`Config` in particular is deliberately untouched — it is the contract all eight components
depend on. See [contracts/config-aggregate.md](./contracts/config-aggregate.md).

## Content distribution across modules

| Module | Exports | Content |
|---|---|---|
| `data/site.ts` | `site` | `name`, `title`, `tagline`, `email`, `about`, `socials`, `navItems` |
| `data/experience.ts` | `experience` | 3 roles — unchanged |
| `data/skills.ts` | `skills` | 10 skills — unchanged (holds the lucide icon imports) |
| `data/projects.ts` | `projects` | 4 projects — migrated to the extended shape |
| `data/certifications.ts` | `certifications` | Empty `Certification[]` |
| `data/config.tsx` | `config`, `certifications`, types | **No content.** Assembly and re-export only. |

**Single source of truth (SC-007)**: exactly one module owns each content item.
`data/config.tsx` MUST NOT contain content literals — it composes `site`, `experience`,
`skills`, and `projects` into the `Config`-shaped `config` object and re-exports.

**Ordering is content.** Array order determines render order for project cards, skill
tiles, experience entries, nav links, and social icons. Preserving order is a requirement,
and it is the one thing the content inventory cannot check (research.md D-001).
