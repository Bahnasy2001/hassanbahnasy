/**
 * Aggregate entry point for all site content.
 *
 * This module holds NO content of its own. It composes the focused data modules into
 * the single `config` object that every component imports, which is what allows the
 * data layer to be reorganised without touching a single component file.
 *
 * Content lives in:
 *   ./site.ts            name, title, tagline, email, about, socials, navItems
 *   ./experience.ts      work history
 *   ./skills.ts          technical skills
 *   ./projects.ts        portfolio projects
 *   ./certifications.ts  credentials (currently empty)
 *
 * `certifications` is exported alongside `config` rather than inside it, so the
 * `Config` shape that all eight components depend on stays unchanged.
 */
import { Config } from '../types';
import { site } from './site';
import { experience } from './experience';
import { skills } from './skills';
import { projects } from './projects';

export const config: Config = {
  ...site,
  experience,
  skills,
  projects,
};

export { certifications } from './certifications';

// Type re-exports MUST use `export type` — `isolatedModules` rejects a bare
// re-export of a type with error TS1205.
export type {
  Config,
  Project,
  Certification,
  Skill,
  Experience,
  NavItem,
  SocialLink,
} from '../types';