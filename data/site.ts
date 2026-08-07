import { Github, Linkedin, Mail } from 'lucide-react';
import { Config } from '../types';

/**
 * Site-level identity: who this portfolio is for and how to reach them.
 *
 * Typed as a `Pick` of `Config` rather than a new interface, so this module cannot
 * drift from the aggregate contract the components consume.
 */
type SiteIdentity = Pick<
  Config,
  'name' | 'title' | 'tagline' | 'email' | 'about' | 'socials' | 'navItems'
>;

export const site: SiteIdentity = {
  name: "Hassan El Bahnasy",
  title: "DevOps Engineer",
  tagline: "I help businesses automate, secure, and scale their cloud systems.",
  email: "hassanelbahnasy85@gmail.com",

  about: {
    intro: "Results-driven DevOps Engineer with a security-first mindset.",
    bio: "I am a DevOps Engineer trained through NTI's elite DevSecOps program, specialized in delivering fast, secure, and scalable solutions. My background involves designing CI/CD pipelines, automating cloud infrastructure (AWS & Azure), and hardening systems. I am passionate about driving innovation, closing the gap between development and security, and building resilient high-impact systems."
  },

  // Order is render order — Contact renders these left to right.
  socials: [
    {
      platform: "GitHub",
      url: "https://github.com/Bahnasy2001",
      icon: Github
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/hassanbahnasy/",
      icon: Linkedin
    },
    {
      platform: "Email",
      url: "mailto:hassanelbahnasy85@gmail.com",
      icon: Mail
    }
  ],

  // Order is render order — Navbar renders these in both desktop and mobile menus.
  navItems: [
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ],
};
