import { Experience } from '../types';

/**
 * Work history. Order is render order — most recent role first.
 */
export const experience: Experience[] = [
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
];
