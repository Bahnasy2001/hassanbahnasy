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
  'name' | 'title' | 'tagline' | 'email' | 'resumeUrl' | 'about' | 'socials' | 'navItems'
>;

export const site: SiteIdentity = {
  name: "Hassan El Bahnasy",
  title: "DevOps Engineer",
  tagline: "I help businesses automate, secure, and scale their cloud systems.",
  email: "hassanelbahnasy85@gmail.com",

  // The one place the CV address lives. Both navbar Resume links read it from here.
  resumeUrl: "https://drive.google.com/file/d/1rxHTO_0Vl6wu2eGRiKLt6aJM79-GEDYV/view",

  about: {
    intro: "I run production cloud infrastructure — and make it cheaper, faster, and safer to ship.",
    bio: "I'm a DevOps Engineer who owns the Azure infrastructure and delivery pipelines behind 11 production applications. My work is measured in outcomes: 35% off the monthly cloud bill with zero downtime, a daily release cadence across .NET, Node.js, and Java services, and an observability stack built from nothing that now handles 40 GB of logs a day.\n\nI came into this through Ain Shams University's Computer and Systems Engineering program and intensive DevOps training with NTI, DEPI, and Red Hat, and I've since gone deep on Azure — certified through AZ-305 Solutions Architect Expert, with AZ-400 and CKA in progress — and work on AWS as an AWS Certified Solutions Architect. I work across Terraform, Pulumi, Kubernetes, and GitHub Actions, and I care most about the boring things that decide whether a system survives: cost, visibility, and safe deployment."
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
    { name: "Certifications", href: "#certifications" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ],
};