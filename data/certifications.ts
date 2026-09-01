import { Certification } from '../types';

/**
 * Certifications. Order is deliberate, not chronological:
 *   1. Expert-tier first — the strongest credential leads.
 *   2. In-progress expert/associate next — signals direction and momentum.
 *   3. Remaining completed associates.
 *
 * AZ-900 (Azure Fundamentals) is intentionally omitted: it is implied by AZ-104,
 * AZ-204, and AZ-305, and listing a fundamentals badge beside an Expert one makes
 * the set look padded.
 *
 * Local training (NTI, DEPI, Red Hat) is intentionally not here. Those carry weight
 * only in the Egyptian market; placing them beside international certifications
 * dilutes the list. They appear as one sentence in site.ts `about.bio` instead.
 */
export const certifications: Certification[] = [
  {
    name: "Azure Solutions Architect Expert (AZ-305)",
    issuer: "Microsoft",
    year: "2026",
    status: "completed",
    tier: "expert",
    credentialUrl: "https://learn.microsoft.com/en-us/users/hassanelbahnasy-2682/credentials/bc15c6f0514fc57d"
  },
  {
    name: "Azure DevOps Engineer Expert (AZ-400)",
    issuer: "Microsoft",
    year: "2026",
    status: "completed",
    tier: "expert",
    credentialUrl: "https://learn.microsoft.com/api/credentials/share/en-us/hassanElbahnasy-2682/EA120EFA83068F60?sharingId=8BBCCFDDBE078E45"
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    issuer: "Linux Foundation",
    year: "",
    status: "in-progress",
    tier: "associate"
  },
  {
    name: "Azure Developer Associate (AZ-204)",
    issuer: "Microsoft",
    year: "2026",
    status: "completed",
    tier: "associate",
    credentialUrl: "https://learn.microsoft.com/en-us/users/hassanelbahnasy-2682/credentials/42bf5e08291e8e75"
  },
  {
    name: "Azure Administrator Associate (AZ-104)",
    issuer: "Microsoft",
    year: "2026",
    status: "completed",
    tier: "associate",
    credentialUrl: "https://learn.microsoft.com/en-us/users/hassanelbahnasy-2682/credentials/d828f572967c0940"
  },
  {
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    year: "2026",
    status: "completed",
    tier: "associate",
    credentialUrl: "https://www.credly.com/badges/b5149e71-2ccb-4b34-9e19-39f58bff1580/public_url"
  },
  {
    name: "Kubernetes and Cloud Native Associate (KCNA)",
    issuer: "Linux Foundation",
    year: "2026",
    status: "completed",
    tier: "associate",
    credentialUrl: "https://www.credly.com/badges/343963d3-3593-487c-8afc-cd41035c5bcd/public_url"
  }
];