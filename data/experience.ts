import { Experience } from '../types';

/**
 * Work history. Order is render order — most recent first.
 *
 * Training programmes (NTI, DEPI, Red Hat) are deliberately NOT listed here.
 * They are referenced in a single sentence in site.ts `about.bio` instead:
 * training is not employment, and listing it alongside real roles weakens both.
 */
export const experience: Experience[] = [
  {
    company: "Sheen Information Technology",
    role: "DevOps Engineer",
    period: "Sep 2025 – Present",
    description: [
      "Cut Azure hosting costs 35% — from ~$1,300 to ~$850/month — by profiling workload usage and migrating App Services to Azure Container Apps, executed with zero downtime.",
      "Own end-to-end CI/CD on GitHub Actions for 11 production applications across .NET, Node.js, and Java, supporting a daily release cadence.",
      "Built the team's first production observability stack: New Relic APM plus an 8-node OpenSearch cluster ingesting 40 GB/day through an OpenTelemetry pipeline.",
      "Introduced Azure Key Vault and App Configuration as the team's first centralized secrets layer, eliminating hardcoded credentials across .NET services."
    ]
  },
  {
    company: "IT Visionary",
    role: "DevSecOps Engineer Intern",
    period: "Jul 2025 – Aug 2025",
    description: [
      "Built a security-integrated CI/CD pipeline on GitHub Actions, embedding four scanning layers — Checkov for infrastructure, Trivy for containers, SonarQube for code quality, and Snyk for dependencies — with automated Slack and email reporting.",
      "Delivered infrastructure and application observability with Prometheus and Grafana, plus an encrypted backup and restore tool with remote storage support."
    ]
  }
];