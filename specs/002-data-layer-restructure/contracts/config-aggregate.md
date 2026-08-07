# Contract: The `config` Aggregate (FROZEN)

**Consumer**: all 8 files in `components/` | **Provider**: `data/config.tsx`

This is the internal interface that makes this feature safe. Components depend on this
contract, **not** on how content is organised into files. Honouring it is what allows the
data layer to be reorganised with zero component edits (FR-008 / SC-002).

## The contract

```typescript
import { config } from '../data/config';
```

`config` MUST satisfy the `Config` interface in `types.ts`, unchanged by this feature.

## Every access the components actually make

Enumerated from the current source, not assumed. This is the complete set — nothing outside
this list may be relied upon, and nothing in it may change.

| Consumer | Access | Used for |
|---|---|---|
| `Hero.tsx` | `config.name` | Split on spaces, rendered word by word |
| `Hero.tsx` | `config.title` | Job title |
| `Hero.tsx` | `config.tagline` | Headline |
| `About.tsx` | `config.about.intro` | Intro line |
| `About.tsx` | `config.about.bio` | Biography paragraph |
| `Contact.tsx` | `config.socials[]` | Mapped to social icon links |
| `Contact.tsx` | `config.email` | Interpolated into a `mailto:` href |
| `Navbar.tsx` | `config.navItems[]` | Mapped twice — desktop and mobile menus |
| `Experience.tsx` | `config.experience[]` | Mapped to timeline entries |
| `Skills.tsx` | `config.skills[]` | Mapped to skill tiles |
| `Projects.tsx` | `config.projects[]` | Mapped to project cards |
| `Footer.tsx` | `config.name` | Copyright line |

### What `Projects.tsx` reads from each project

**This is the critical detail of the whole feature.** Per-project, the card reads only:

- `project.title` — heading
- `project.description` — body paragraph
- `project.tags[]` — chips, in array order
- `project.repoUrl` — guarded: `{project.repoUrl && …}`
- `project.demoUrl` — guarded: `{project.demoUrl && …}`

It reads **nothing else**. Therefore every field this feature adds — `slug`, `kind`,
`summary`, `problem`, `approach`, `impact`, `year`, `image`, `readmeUrl`, `featured`,
`labCount` — has **no render path** and cannot change the page. That is what makes SC-003
("visually identical") a structural guarantee rather than a hope.

The two link fields being guarded is also why adding more optional link fields is safe: the
existing pattern already handles absence.

## Invariants

- **INV-1**: The import path `'../data/config'` MUST keep resolving. `data/config.tsx`
  therefore keeps its name and extension.
- **INV-2**: The export name `config` MUST NOT change.
- **INV-3**: The `Config` interface MUST NOT gain or lose fields in this feature. This is
  why `certifications` is exported as a sibling rather than added to `Config`
  (research.md D-006).
- **INV-4**: Array **order** MUST be preserved for `socials`, `navItems`, `experience`,
  `skills`, and `projects`. Order is render order. The content inventory cannot detect a
  reorder, so this is checked by hand (quickstart Step 4).
- **INV-5**: `project.description` MUST stay byte-identical. The new `summary` is additive
  and MUST NOT replace it.
- **INV-6**: `data/config.tsx` MUST hold no content literals. It composes and re-exports
  only, so each content item has exactly one owner (SC-007).
- **INV-7**: Type re-exports MUST use `export type` — `isolatedModules` makes a bare
  re-export a build error (TS1205, verified in research.md D-002).

## Additive surface (not part of the frozen contract)

New named exports MAY be added alongside `config`, since adding an export cannot break an
existing importer. This feature adds:

- `certifications` — `Certification[]`, currently empty
- type re-exports for convenience, using `export type`

## How to verify this contract held

1. `git status --porcelain components/` → empty. Zero component files modified.
2. `npm run build` → clean. If the aggregate shape drifted, `tsc` fails at the consumers.
3. All 80 strings in [content-inventory.txt](./content-inventory.txt) present in the built
   bundle.
4. Ordering spot-check per INV-4.
5. Visual comparison against the pre-change screenshots.
