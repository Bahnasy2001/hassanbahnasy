import { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
}

export interface Skill {
  name: string;
  icon: LucideIcon;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface Project {
  // --- Identity ---
  slug: string;                      // Stable, URL-safe identifier. Set once; never derived at runtime.
  kind: 'project' | 'lab';           // Substantial project vs. hands-on lab collection.

  // --- Display ---
  title: string;
  summary: string;                   // Short one-liner for compact display.
  description: string;               // Longer text shown on project cards.
  tags: string[];

  // --- Case-study depth (optional) ---
  problem?: string;
  approach?: string;
  impact?: string;
  year?: string;                     // String, not number: accommodates "2024–2025", "Ongoing".

  // --- Links (all optional: projects have different subsets) ---
  repoUrl?: string;                  // Link to GitHub Repository
  demoUrl?: string;                  // Link to Live Demo
  image?: string;
  readmeUrl?: string;

  // Several named repositories for one entry, listed in the case-study dialog.
  // Independent of repoUrl: an entry may have either, both, or neither.
  links?: { label: string; url: string }[];

  // --- Presentation flags (optional) ---
  featured?: boolean;
  labCount?: number;                 // Only meaningful for a lab collection entry.
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;                      // String for consistency with Project.year.
  status: 'completed' | 'in-progress';
  tier: 'expert' | 'associate' | 'foundational';
  credentialUrl?: string;            // Microsoft Learn or Credly. Absent for in-progress credentials.
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: LucideIcon;
}

export interface Config {
  name: string;
  title: string;
  tagline: string;
  email: string;
  resumeUrl: string;                 // Required on purpose: a missing CV address is a build
                                     // failure, not another silently dead button.
  about: {
    intro: string;
    bio: string;
  };
  socials: SocialLink[];
  navItems: NavItem[];
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
}