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
 * No self-assigned proficiency level. Every candidate claims "Expert"; the claim
 * carries no information and invites contradiction. The certifications section and
 * the project case studies are the evidence instead.
 *
 * Icons come from lucide-react; import any new one above before using it here.
 */
export const skills: Skill[] = [
  { name: "Azure", icon: Cloud },
  { name: "AWS", icon: Cloud },
  { name: "Docker & Kubernetes", icon: Container },
  { name: "Terraform & Pulumi", icon: Server },
  { name: "CI/CD (GitHub Actions, Azure DevOps, Jenkins)", icon: Workflow },
  { name: "Ansible", icon: Code },
  { name: "Linux Administration", icon: Terminal },
  { name: "Git & Version Control", icon: GitBranch },
  { name: "Observability (New Relic, OpenSearch, Grafana)", icon: Globe },
  { name: "Security Tools (SonarQube, Trivy, Snyk, Checkov)", icon: Shield },
  { name: "Python & Bash", icon: Terminal },
];