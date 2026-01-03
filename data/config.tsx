import { 
  Github, 
  Linkedin, 
  Mail, 
  Terminal, 
  Cloud, 
  Container, 
  Server, 
  GitBranch, 
  Globe, 
  Database,
  Cpu,
  Workflow,
  Shield,
  Code
} from 'lucide-react';
import { Config } from '../types';

export const config: Config = {
  name: "Hassan El Bahnasy",
  title: "DevOps Engineer",
  tagline: "I help businesses automate, secure, and scale their cloud systems.",
  email: "hassanelbahnasy85@gmail.com",
  
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

  navItems: [
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ],

  about: {
    intro: "Results-driven DevOps Engineer with a security-first mindset.",
    bio: "I am a DevOps Engineer trained through NTI's elite DevSecOps program, specialized in delivering fast, secure, and scalable solutions. My background involves designing CI/CD pipelines, automating cloud infrastructure (AWS & Azure), and hardening systems. I am passionate about driving innovation, closing the gap between development and security, and building resilient high-impact systems."
  },

  experience: [
    {
      company: "Sheen Information Technology",
      role: "DevOps Engineer",
      period: "Sep 2025 – Present",
      description: [
        "Built CI/CD pipelines with GitHub Actions, automated deployments, and Bash scripts for environment provisioning.",
        "Developed infrastructure using Pulumi (Python) and integrated New Relic dashboards to monitor Azure App Service metrics and Java WAR APM."
      ]
    },
    {
      company: "IT Visionary",
      role: "DevSecOps Intern",
      period: "Jul 2025 – Aug 2025",
      description: [
        "Designed and implemented a secure, automated backup and restore tool with encryption and remote storage support using Bash scripting.",
        "Implemented secure CI/CD pipelines using GitHub Actions, Terraform, Docker, and security tools (Checkov, Trivy, SonarQube, Snyk).",
        "Added infrastructure and application monitoring using Prometheus and Grafana."
      ]
    },
    {
      company: "National Telecommunications Institute (NTI)",
      role: "DevSecOps Trainee",
      period: "Feb 2025 – May 2025",
      description: [
        "Gained hands-on experience with Linux, Bash, Git, Python, and secure coding practices.",
        "Automated cloud infrastructure with Docker, Kubernetes, AWS, Terraform, and Ansible.",
        "Built and secured CI/CD pipelines using Jenkins, integrating vulnerability scanning tools."
      ]
    }
  ],

  skills: [
    { name: "Linux Administration", icon: Terminal, level: "Expert" },
    { name: "AWS & Azure", icon: Cloud, level: "Expert" },
    { name: "Docker & Kubernetes", icon: Container, level: "Expert" },
    { name: "Terraform & Ansible", icon: Server, level: "Expert" },
    { name: "CI/CD (Jenkins, GitHub Actions)", icon: Workflow, level: "Expert" },
    { name: "Pulumi", icon: Code, level: "Expert" },
    { name: "Git & Version Control", icon: GitBranch, level: "Expert" },
    { name: "Prometheus & Grafana", icon: Globe, level: "Intermediate" },
    { name: "Python & Bash", icon: Terminal, level: "Intermediate" },
    { name: "Security Tools (SonarQube, Trivy)", icon: Shield, level: "Intermediate" },
  ],

  projects: [
    {
      title: "Secure Cloud-Native Microservices CI/CD",
      description: "Designed a secure end-to-end CI/CD pipeline for a microservices app (Node.js, Go, Python). Integrated Terraform for IaC, Docker, and security tools like Checkov, Trivy, and Snyk. Automated notifications via AWS SES and Slack.",
      tags: ["GitHub Actions", "Terraform", "Docker", "AWS", "Security"],
      repoUrl: "https://github.com/Bahnasy2001/Secure-Cloud-Native-Microservices-CICD-Platform", // Example link
    },
    {
      title: "Serverless Image Editor",
      description: "A fast, secure, and scalable serverless image processing application built on AWS. Users upload images via web interface, and the system automatically resizes them using Lambda triggers, S3, and API Gateway.",
      tags: ["AWS Lambda", "S3", "API Gateway", "Serverless", "Python"],
      repoUrl: "https://github.com/Bahnasy2001/Serverless-Image-Editor",
    },
    {
      title: "Pulumi Azure Infrastructure – NDC Core",
      description: "Designed production-ready Azure infrastructure using Pulumi (Python). Provisions secure environment with VNets, segmented subnets, NSGs, Linux VMs, and Azure App Service with private integration.",
      tags: ["Pulumi", "Azure", "Python", "IaC", "Networking"],
      repoUrl: "https://github.com/Bahnasy2001/Pulumi-Azure-Infrastructure-NDC-Core",
    },
    {
      title: "To-Do List GitOps Pipeline",
      description: "Deployed a Node.js App with MongoDB using Docker, Ansible, and Kubernetes. Migrated to a GitOps workflow using ArgoCD for continuous deployment and drift detection.",
      tags: ["Kubernetes", "ArgoCD", "Ansible", "GitOps", "Node.js"],
      repoUrl: "https://github.com/Bahnasy2001/Todo-List-CICD-Project",
    }
  ]
};