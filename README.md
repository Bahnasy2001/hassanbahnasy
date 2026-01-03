# Hassan El Bahnasy - DevOps Portfolio

A modern, dark-themed personal portfolio website built with **React**, **Vite**, **TailwindCSS**, and **Framer Motion**.

## 🚀 How to Deploy (Fixed & Automated)

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Deploy to GitHub Pages**:
    Run this single command:
    ```bash
    npm run deploy
    ```
    
    **What this does:**
    1.  Builds your project (creates the `dist` folder).
    2.  Pushes that folder to a `gh-pages` branch on your GitHub repo.

3.  **Configure GitHub**:
    *   Go to your repository on GitHub.
    *   Click **Settings** > **Pages**.
    *   Under "Build and deployment" > "Source", select **Deploy from a branch**.
    *   Select the **`gh-pages`** branch and the **`/ (root)`** folder.
    *   Click **Save**.

Your site will be live at `https://bahnasy2001.github.io/HassanELBahnasy/` in a few minutes.

---

## 🛠️ Customization Guide

All content is managed in **`src/data/config.tsx`**. You do not need to touch the component code to update your text, projects, or skills.

### 1. How to Modify "About Me" & Personal Info
Open `src/data/config.tsx`. You will see the `config` object.
*   **Name/Title**: Update `name`, `title`, and `tagline`.
*   **Bio**: Update `about.intro` and `about.bio`.
*   **Email**: Update `email` and the `socials` array.

### 2. How to Add or Remove Skills
In `src/data/config.tsx`, locate the `skills` array.
**To add a new skill:**
1.  Import the icon you want from `lucide-react` at the top of the file.
    ```typescript
    import { ..., NewIconName } from 'lucide-react';
    ```
2.  Add an object to the `skills` list:
    ```typescript
    { name: "New Tool", icon: NewIconName, level: "Expert" },
    ```

### 3. How to Add a New Project
In `src/data/config.tsx`, locate the `projects` array.
```typescript
{
  title: "Project Name",
  description: "Short description.",
  tags: ["Tool1", "Tool2"],
  repoUrl: "https://github.com/...", // (Optional) GitHub Link
  demoUrl: "https://..." // (Optional) Live Demo Link
}
```
