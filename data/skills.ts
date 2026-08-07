import {
  Terminal,
  Cloud,
  Container,
  Server,
  GitBranch,
  Globe,
  Workflow,
  Shield,
  Code
} from 'lucide-react';
import { Skill } from '../types';

/**
 * Technical skills. Order is render order — Skills renders these as a grid of tiles.
 *
 * Icons come from lucide-react; import any new one above before using it here.
 */
export const skills: Skill[] = [
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
];
