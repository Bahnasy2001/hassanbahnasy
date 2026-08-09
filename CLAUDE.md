# CLAUDE.md

Project rules for Claude Code. Read this before making any change.

## What this is

Hassan El Bahnasy's portfolio site. React 18 + TypeScript + Vite 5, Tailwind
loaded from CDN, Framer Motion for animation, lucide-react for icons.
Deployed to GitHub Pages automatically on every push to `main`.

**Two audiences, equally weighted:** recruiters hiring a DevOps engineer, and
business clients hiring freelance cloud work. Every content decision serves
both or it isn't made.

## Hard rules

1. **Never modify the `tailwind.config` block in `index.html`.** The colour
   palette, fonts, and spacing scale are final. Any change with visual impact
   must be flagged and approved before implementation.
2. **All content lives in `data/`.** Components never hardcode content strings.
   Section headings and structural labels are the only exception.
3. **Declare types in `types.ts` before writing data against them.**
   `npm run build` must pass before any commit.
4. **One feature per branch. Never commit to `main` directly.** Pushing to
   `main` deploys to production with no gate.
5. **No new npm dependencies** without explicit approval and a written reason
   why the existing toolset is insufficient.
6. **Reuse existing Tailwind classes.** Before adding any class, check whether
   it already appears in `components/`. New colours, fonts, and spacing values
   need approval; layout primitives like `block` and `h-full` do not.

## Content rules

These were decided deliberately. Don't reverse them without being asked.

- **The intro stays cloud-neutral.** Depth in Azure and competence in AWS are
  shown in the bio, not the opening line. A client on AWS or GCP must not
  self-reject at line one.
- **Certifications are international only.** Local training — NTI, DEPI,
  Red Hat — appears as one sentence in `site.ts` `about.bio`, never in the
  certifications list. It carries weight only in the Egyptian market and
  dilutes the list beside AZ-305 and CKA.
- **AZ-900 is excluded.** Implied by AZ-104, AZ-204, and AZ-305. A
  fundamentals badge beside an Expert one makes the set look padded.
- **In-progress certifications are shown**, clearly marked with the chip.
  Momentum reads as well as completion. They must never look completed.
- **No self-assigned skill levels.** Every candidate claims "Expert"; the
  claim carries no information and invites contradiction. Certifications and
  project case studies are the evidence instead.
- **Labs stay separate from Featured Projects.** Practice work and production
  work are different claims. Never merge the two groups.
- **Nothing goes on the site that can't be defended in an interview.**
  Applies to tags, tool names, and numbers alike. One thing that can't be
  explained damages everything else on the page.
- **Design proposals are labelled as such.** The kubeseal card says "Design
  Proposal" in its title, summary, and tags because it is analysis, not
  shipped code.

## Data model

| File | Holds |
|---|---|
| `data/site.ts` | name, title, tagline, email, about, socials, navItems, resumeUrl |
| `data/experience.ts` | work history — employment only, not training |
| `data/skills.ts` | tool list, no proficiency levels |
| `data/projects.ts` | 7 featured projects + 5 lab collections |
| `data/certifications.ts` | 7 credentials, order is deliberate |
| `data/config.tsx` | assembly and re-export only — holds no content |

`data/config.tsx` composes the modules into the single `config` object every
component imports. Type re-exports there must use `export type` — a bare
re-export fails under `isolatedModules` with TS1205.

### Project fields

- `kind: 'project' | 'lab'` drives the two groups in the Projects section
- `summary` is the business-facing one-liner shown on the card
- `problem` / `approach` / `impact` are the technical case study shown in the
  modal; all three must be present or the "Read case study" link won't render
- `links` holds multiple named repositories, shown in the modal
- `description` is dead weight — unrendered since the grouping feature.
  Slated for removal.

## Workflow

```bash
git checkout main && git pull
git checkout -b <type>/<name>
# make changes
npm run build && npm run preview   # look at it in a browser
git add -A
npm run build && git commit -m "..." && git push -u origin <branch>
gh pr create --fill
gh pr merge --merge
```

Chain with `&&`, never newlines — a failed build must stop everything after it.

**Spec Kit** (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` →
`/speckit-implement`) is for changes touching several files or work that will
be revisited. Small single-file changes are faster with a plain prompt.

**Always stop before committing, pushing, or merging.** Those need explicit
approval.

## Known open items

- `package-lock.json` is committed but CI runs `npm install`, not `npm ci` —
  builds are not reproducible until the workflow is updated
- `description` is unused on all 12 project items
- Lab summaries spell out their count in words, and the card also shows the
  numeral — mild redundancy
- No `og:image`, so link previews are text-only
- AWS Labs and Azure DevOps Labs cards have no repo link; the lab PDFs are
  only on the local machine