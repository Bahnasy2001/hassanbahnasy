# Maintenance Guide

Ready prompts for common updates. Copy, edit the values in `<angle brackets>`,
paste into Claude Code.

**Every one of these follows the same loop:**

```bash
git checkout main && git pull
git checkout -b <branch-name>
# paste the prompt
npm run build && npm run preview   # LOOK AT IT
git add -A
npm run build && git commit -m "..." && git push -u origin <branch-name>
gh pr create --fill
gh pr merge --merge
```

Never skip the browser check. The build passing does not mean it looks right —
the certifications section built cleanly while rendering completely broken.

---

## Mark a certification as passed

Branch: `content/cert-<name>`

```
In data/certifications.ts, update the <AZ-400 / CKA> entry:
- change status from 'in-progress' to 'completed'
- set year to "<2026>"
- add credentialUrl: "<paste the Microsoft Learn or Credly link>"

Move the entry so completed expert-tier credentials stay ahead of
associate-tier ones, per the ordering comment at the top of the file.
Change nothing else.
```

Check afterwards: the "In progress" chip is gone, the card is now clickable,
and the link opens the right credential page.

---

## Add a new certification

Branch: `content/cert-<name>`

```
Add a certification to data/certifications.ts:
  name: "<full name as printed on the credential>"
  issuer: "<Microsoft / AWS / Linux Foundation / ...>"
  year: "<2026>"          (or "Expected 2026" if in progress, or "" if unknown)
  status: '<completed | in-progress>'
  tier: '<expert | associate | foundational>'
  credentialUrl: "<link, omit entirely if none>"

Place it by tier and status, not by date — the file's ordering comment
explains the rule. Change nothing else.
```

**Before adding, check it against the rules:** international only, no
fundamentals-tier badges that a higher cert already implies, and nothing you
couldn't discuss in an interview.

---

## Add a new project

Branch: `content/project-<slug>`

Write the copy yourself first, or ask for help with it. Then:

```
Add a project to data/projects.ts:
  slug: "<lowercase-hyphenated-stable-id>"
  kind: 'project'
  featured: true
  title: "<name>"
  summary: "<one sentence a non-technical client would understand>"
  description: "<same as summary for now>"
  problem: "<why this work needed doing — the pain, not the tools>"
  approach: "<what you built and with what — tools live here>"
  impact: "<what changed as a result; do not invent numbers>"
  tags: [<the tools, only ones you can defend>]
  repoUrl: "<link>"        (omit if none)
  demoUrl: "<link>"        (omit if none)

Place it among the other kind:'project' entries, before the labs.
Change nothing else.
```

The card shows `summary`. The modal shows `problem`, `approach`, `impact` —
and all three must be present or the "Read case study" link won't appear.

---

## Add a job to Experience

Branch: `content/experience-<company>`

```
Add an entry to the top of data/experience.ts:
  company: "<name>"
  role: "<title>"
  period: "<Mon YYYY – Present>"
  description: [
    "<achievement with a number in it>",
    "<achievement showing ownership, not tasks>",
    "<achievement showing something you introduced first>",
    "<achievement a business reader understands>"
  ]

Four bullets maximum. Change nothing else.
```

**Writing rules that make these bullets work:** lead with the outcome, not the
tool. Numbers beat adjectives. "Own" beats "built". "First" is worth saying
when true. Training programmes never go here — they belong in `about.bio`.

---

## Update the About bio

Branch: `content/about-update`

```
In data/site.ts, update about.bio: <describe the change>.

Constraints:
- about.intro must stay cloud-neutral. Do not name a single cloud provider
  in the opening line.
- Keep the NTI / DEPI / Red Hat sentence — it is the only place local
  training appears.
- Keep concrete numbers in the first paragraph.
Change nothing else.
```

---

## Add a repo link to a lab card

For the AWS Labs and Azure DevOps Labs cards, once the PDFs are on GitHub.

Branch: `content/lab-links`

```
In data/projects.ts, add repoUrl to the entry with slug
"<aws-hands-on-labs | azure-devops-labs>":
  repoUrl: "<link>"
Change nothing else.
```

---

## Swap the CV link

Branch: `content/resume-url`

```
In data/site.ts, change resumeUrl to "<new link>".
Change nothing else.
```

Then click Resume in both the desktop navbar and the mobile menu.

---

## Fix the reproducible-build issue

Branch: `chore/ci-npm-ci`

This one is worth doing properly with Spec Kit — it touches the deployment
workflow, and getting it wrong breaks deploys.

```
/speckit-specify

Make CI builds reproducible. .github/workflows/deploy.yml currently runs
`npm install`, which can resolve different transitive dependency versions
than package-lock.json specifies. Change it to `npm ci`, which installs
exactly what the lockfile pins and fails if the lockfile and package.json
disagree.

Verify package-lock.json is committed and in sync with package.json first.

Out of scope: everything except .github/workflows/deploy.yml.

Success criteria: the workflow runs green and deploys the site unchanged.
```

**Watch this deploy closely.** If the workflow breaks, the site stops updating.

---

## Remove the dead `description` field

Branch: `chore/remove-description`

```
The `description` field on Project is no longer rendered anywhere — cards
show `summary` and the modal shows problem/approach/impact.

Remove `description` from the Project interface in types.ts and from all 12
entries in data/projects.ts. Confirm no component reads it before removing.

Out of scope: components, all other data files, index.html.

Success criteria: npm run build passes and the site renders identically.
```

---

## Reviewing anything Claude Code produces

Three questions, every time:

1. Does it do what I asked?
2. **Does it do anything I did not ask?** — this is where the danger is
3. Can I explain it in one sentence? If not, ask for an explanation before
   accepting it.

And two habits:

- `git status` and `git diff` are proof. The completion report is not.
- If an agent says "I left X for scope reasons," that is a question addressed
  to you, not a resolution. Answer it deliberately.