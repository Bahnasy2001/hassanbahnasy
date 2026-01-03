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
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string; // Link to GitHub Repository
  demoUrl?: string; // Link to Live Demo
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