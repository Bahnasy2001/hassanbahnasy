import { Project } from '../types';

/**
 * Portfolio projects. Order is render order — Projects renders these as cards.
 *
 * `slug` is a stable identifier written as a literal, NOT derived from `title` at
 * runtime: it is intended for use in URLs, so editing a title must never silently
 * change a project's identity.
 *
 * `problem`, `approach`, `impact`, `year`, `image`, and `readmeUrl` are deliberately
 * omitted rather than set to empty strings — omission means "not written yet".
 */
export const projects: Project[] = [
  {
    slug: "secure-cloud-native-microservices-ci-cd",
    kind: "project",
    title: "Secure Cloud-Native Microservices CI/CD",
    summary: "Designed a secure end-to-end CI/CD pipeline for a microservices app (Node.js, Go, Python).",
    description: "Designed a secure end-to-end CI/CD pipeline for a microservices app (Node.js, Go, Python). Integrated Terraform for IaC, Docker, and security tools like Checkov, Trivy, and Snyk. Automated notifications via AWS SES and Slack.",
    tags: ["GitHub Actions", "Terraform", "Docker", "AWS", "Security"],
    repoUrl: "https://github.com/Bahnasy2001/Secure-Cloud-Native-Microservices-CICD-Platform",
  },
  {
    slug: "serverless-image-editor",
    kind: "project",
    title: "Serverless Image Editor",
    summary: "A fast, secure, and scalable serverless image processing application built on AWS.",
    description: "A fast, secure, and scalable serverless image processing application built on AWS. Users upload images via web interface, and the system automatically resizes them using Lambda triggers, S3, and API Gateway.",
    tags: ["AWS Lambda", "S3", "API Gateway", "Serverless", "Python"],
    repoUrl: "https://github.com/Bahnasy2001/Serverless-Image-Editor",
  },
  {
    slug: "pulumi-azure-infrastructure-ndc-core",
    kind: "project",
    title: "Pulumi Azure Infrastructure – NDC Core",
    summary: "Designed production-ready Azure infrastructure using Pulumi (Python).",
    description: "Designed production-ready Azure infrastructure using Pulumi (Python). Provisions secure environment with VNets, segmented subnets, NSGs, Linux VMs, and Azure App Service with private integration.",
    tags: ["Pulumi", "Azure", "Python", "IaC", "Networking"],
    repoUrl: "https://github.com/Bahnasy2001/Pulumi-Azure-Infrastructure-NDC-Core",
  },
  {
    slug: "to-do-list-gitops-pipeline",
    kind: "project",
    title: "To-Do List GitOps Pipeline",
    summary: "Deployed a Node.js App with MongoDB using Docker, Ansible, and Kubernetes.",
    description: "Deployed a Node.js App with MongoDB using Docker, Ansible, and Kubernetes. Migrated to a GitOps workflow using ArgoCD for continuous deployment and drift detection.",
    tags: ["Kubernetes", "ArgoCD", "Ansible", "GitOps", "Node.js"],
    repoUrl: "https://github.com/Bahnasy2001/Todo-List-CICD-Project",
  }
];
