# Hassan El Bahnasy — DevOps Portfolio

A modern, dark-themed personal portfolio website built with **React**, **Vite**, **TailwindCSS**, and **Framer Motion**.

🔗 **Live site:** <https://bahnasy2001.github.io/hassanbahnasy/>

---

## 🚀 Deployment

**Deployment is fully automatic. There is no manual publish step.**

Every push to the `main` branch triggers the GitHub Actions workflow at
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which installs
dependencies, builds the site, and publishes the result to the `gh-pages` branch that
GitHub Pages serves. The site updates a minute or two later.

```text
push to main  →  GitHub Actions  →  npm run build  →  publish dist/ to gh-pages  →  live site
```

> ⚠️ **Because pushing to `main` publishes to production, do your work on a branch and
> merge only once the build passes.** There is no staging environment and no manual
> approval gate between a merge and the live site.

To watch a deployment, open the **Actions** tab of the repository on GitHub.

### Working locally

```bash
npm install     # install dependencies (first time only)
npm run dev     # start the dev server with hot reload
npm run build   # type-check and build for production
npm run preview # serve the production build locally
```

Run `npm run build` before merging. It runs the TypeScript compiler first, so it catches
type errors that the dev server does not.

---

## 🛠️ Customization Guide

All site content lives in the **`data/`** directory — currently a single file,
[`data/config.tsx`](data/config.tsx). You never need to edit component code to change
your text, projects, or skills.

The shape of every field is defined in [`types.ts`](types.ts). If you add a new kind of
content, declare its type there first — the build will then tell you if the data and the
type disagree.

### 1. Personal info, bio, and social links

Open `data/config.tsx` and edit the `config` object:

| What you want to change | Field |
|---|---|
| Your name, job title, headline | `name`, `title`, `tagline` |
| Short intro line and longer bio | `about.intro`, `about.bio` |
| Contact email | `email` |
| GitHub / LinkedIn / email links | `socials` array |
| Navigation menu links | `navItems` array |

### 2. Skills

Find the `skills` array in `data/config.tsx`. Each entry needs a name, an icon, and a
level of `"Expert"`, `"Intermediate"`, or `"Learning"`:

```typescript
{ name: "New Tool", icon: NewIconName, level: "Expert" },
```

Icons come from [`lucide-react`](https://lucide.dev/icons/). Import the one you want at
the top of the file first:

```typescript
import { Github, Linkedin, /* ... */ NewIconName } from 'lucide-react';
```

### 3. Work experience

Find the `experience` array. Entries appear in the order listed, so put the most recent
role first. `description` is a list of bullet points:

```typescript
{
  company: "Company Name",
  role: "Your Role",
  period: "Jan 2025 – Present",
  description: [
    "First achievement or responsibility.",
    "Second achievement or responsibility."
  ]
},
```

### 4. Projects

Find the `projects` array. Both link fields are optional — omit either one and the
matching button simply will not render:

```typescript
{
  title: "Project Name",
  description: "Short description of what it does and which problem it solves.",
  tags: ["Tool1", "Tool2"],
  repoUrl: "https://github.com/...",   // optional — GitHub link
  demoUrl: "https://..."               // optional — live demo link
},
```

---

## 📁 Project Structure

```text
index.html          # page shell, fonts, and Tailwind theme configuration
index.tsx           # application entry point
App.tsx             # page layout and section order
components/         # one component per section (Hero, About, Skills, ...)
data/config.tsx     # ← all site content lives here
types.ts            # type definitions for the content in data/
```

The Tailwind colour palette, fonts, and animations are configured in the
`tailwind.config` block inside `index.html`. That block and the section order in
`App.tsx` define the approved visual design — changing either alters the look of the
whole site, so treat them as deliberate design decisions rather than routine edits.
