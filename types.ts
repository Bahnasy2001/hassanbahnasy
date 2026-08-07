import { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
}

export interface Skill {
  name: string;
  icon: LucideIcon;
  level: "Expert" | "Intermediate" | "Learning";
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
  kind: 'project' | 'lab';           // Substantial project vs. smaller hands-on lab.

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

  // --- Presentation flags (optional) ---
  featured?: boolean;
  labCount?: number;                 // Only meaningful for a collection entry.
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;                      // String for consistency with Project.year.
  status: 'completed' | 'in-progress';
  tier: 'expert' | 'associate' | 'foundational';
  credlyUrl?: string;                // Optional: an in-progress credential has no badge yet.
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