import { Project } from '../types';

/**
 * Portfolio projects and lab collections.
 *
 * `kind: 'project'`  — substantial builds, shown as Featured Projects.
 * `kind: 'lab'`      — collections of hands-on exercises, grouped separately so
 *                      practice work never competes visually with production work.
 *
 * `slug` is a stable identifier written as a literal, NOT derived from `title` at
 * runtime: it is intended for use in URLs, so editing a title must never silently
 * change a project's identity.
 *
 * `summary` is the business-facing one-liner; `problem` / `approach` / `impact` are
 * the technical case study, shown on demand. Both audiences are served from one
 * record rather than from two parallel datasets.
 *
 * Order is render order.
 */
export const projects: Project[] = [
  // ---------------------------------------------------------------------------
  // Featured projects
  // ---------------------------------------------------------------------------
  {
    slug: "secure-cloud-native-microservices-ci-cd",
    kind: "project",
    featured: true,
    title: "Secure Cloud-Native Microservices CI/CD Platform",
    summary: "A production-grade delivery pipeline for a three-language microservices application, with security scanning built into every stage rather than bolted on at the end.",
    description: "A production-grade delivery pipeline for a three-language microservices application, with security scanning built into every stage rather than bolted on at the end.",
    problem: "Microservices multiply the attack surface: three services in three languages means three dependency trees, three container images, and infrastructure code that can drift silently. Most pipelines catch these problems in production, if at all.",
    approach: "Built an end-to-end GitHub Actions pipeline for a Node.js UI, a Go authentication service, and a Python weather API. Four scanning layers run before anything ships — Checkov for Terraform, Trivy for container images, SonarQube for code quality, and Snyk for dependencies. Infrastructure is provisioned with Terraform, workloads run in Docker, and Prometheus and Grafana provide runtime visibility. Results are reported automatically to Slack and email via AWS SES.",
    impact: "Every commit is checked at four independent layers before deployment, and pipeline failures are visible without anyone watching a dashboard.",
    tags: ["GitHub Actions", "Terraform", "Docker", "AWS", "Checkov", "Trivy", "SonarQube", "Snyk", "Prometheus", "Grafana"],
    repoUrl: "https://github.com/Bahnasy2001/IT-Visionary-Devsecops-Project"
  },
  {
    slug: "pulumi-azure-infrastructure-ndc-core",
    kind: "project",
    featured: true,
    title: "Pulumi Azure Infrastructure — NDC Core",
    summary: "A secure, modular Azure environment provisioned entirely as code — private networking, segmented workloads, and centralized logging, designed for production rather than demonstration.",
    description: "A secure, modular Azure environment provisioned entirely as code — private networking, segmented workloads, and centralized logging, designed for production rather than demonstration.",
    problem: "Cloud environments built by hand drift, and environments built as throwaway demos don't survive contact with real requirements — private workloads, controlled public access, cost limits, and an audit trail.",
    approach: "Designed and implemented the infrastructure in Pulumi with Python: virtual networks with segmented subnets, role-based network security groups, Linux virtual machines, and Azure App Service integrated privately into the VNet rather than exposed publicly. Storage is centralized for both shared data and application logging. The codebase is modular so environments can be reproduced rather than recreated.",
    impact: "The environment is reproducible from code, private by default, and structured so new workloads are added by extending a module rather than clicking through a portal.",
    tags: ["Pulumi", "Python", "Azure", "VNet", "NSG", "App Service", "IaC"],
    repoUrl: "https://github.com/hassanbahnasy/Pulumi-NDC-Core"
  },
  {
    slug: "three-tier-app-deployment-azure",
    kind: "project",
    featured: true,
    title: "Three-Tier App Deployment on Azure",
    summary: "A complete three-tier application deployed to Azure through Terraform, with a CI/CD pipeline that authenticates without storing a single secret.",
    description: "A complete three-tier application deployed to Azure through Terraform, with a CI/CD pipeline that authenticates without storing a single secret.",
    problem: "Most CI/CD pipelines authenticate to the cloud with long-lived credentials stored as repository secrets. Those credentials rarely rotate, and anyone with repository access effectively has cloud access.",
    approach: "Built a static frontend, a Go REST API, and a private PostgreSQL database, provisioned end to end with Terraform. The GitHub Actions pipeline authenticates to Azure through OIDC federation — no stored credentials, no secrets to rotate. The database is private with no public endpoint. Run as a deliberate deploy-verify-destroy exercise to prove the infrastructure is fully reproducible from code.",
    impact: "Zero long-lived cloud credentials in the repository, and the entire environment can be rebuilt from scratch or destroyed on demand.",
    tags: ["Terraform", "Azure", "GitHub Actions", "OIDC", "Go", "PostgreSQL", "IaC"],
    repoUrl: "https://github.com/Bahnasy2001/devops-3tier-azure"
  },
  {
    slug: "serverless-image-editor",
    kind: "project",
    featured: true,
    title: "Serverless Image Editor",
    summary: "An event-driven image processing service on AWS — users upload through a web interface, and images are resized automatically with no server to manage or pay for when idle.",
    description: "An event-driven image processing service on AWS — users upload through a web interface, and images are resized automatically with no server to manage or pay for when idle.",
    problem: "Image processing is bursty. A server sized for peak traffic sits idle most of the time and still costs money; a server sized for average traffic fails when it matters.",
    approach: "Built a fully serverless pipeline: a static site on S3 handles uploads through an API Gateway endpoint, which invokes a Lambda function to resize the image and write the result back to storage. No always-on compute, no infrastructure to patch, and the whole stack scales with demand rather than with provisioning.",
    impact: "Costs scale to zero when nothing is being processed, and the system handles a burst of uploads without any capacity planning.",
    tags: ["AWS Lambda", "S3", "API Gateway", "Serverless", "Python", "Event-Driven"],
    repoUrl: "https://github.com/Bahnasy2001/Serverless-Image-Processing"
  },
  {
    slug: "todo-list-cicd-gitops",
    kind: "project",
    featured: true,
    title: "To-Do List CI/CD + GitOps",
    summary: "A Node.js application taken from a single container to a GitOps deployment on Kubernetes — the same app, deployed four progressively better ways.",
    description: "A Node.js application taken from a single container to a GitOps deployment on Kubernetes — the same app, deployed four progressively better ways.",
    problem: "Learning DevOps by reading gives you vocabulary, not judgement. You only understand why GitOps exists after you've felt the pain of the deployment methods that came before it.",
    approach: "Containerized a Node.js app with MongoDB, then deployed it four ways in sequence: Docker Compose with Watchtower for automatic updates, infrastructure provisioning with Ansible, a CI pipeline on GitHub Actions, and finally a migration to Kubernetes with ArgoCD for GitOps-based continuous deployment and drift detection.",
    impact: "A working comparison of four deployment models against one application, ending with a cluster that reconciles itself against Git rather than being pushed to.",
    tags: ["Kubernetes", "ArgoCD", "GitOps", "Docker", "Ansible", "GitHub Actions", "Node.js", "MongoDB"],
    repoUrl: "https://github.com/Bahnasy2001/todo-list-node-DevOps"
  },
  {
    slug: "microservices-cicd-gitlab",
    kind: "project",
    featured: true,
    title: "Microservices CI/CD with GitLab",
    summary: "Three independent services, each built, tested, and deployed on its own schedule — with shared pipeline templates so adding a fourth service costs almost nothing.",
    description: "Three independent services, each built, tested, and deployed on its own schedule — with shared pipeline templates so adding a fourth service costs almost nothing.",
    problem: "Microservices only pay off if each service can ship independently. If every change triggers one pipeline that builds everything, you've split the code but kept the coupling — and paid the complexity cost for nothing.",
    approach: "Built a monorepo CI/CD platform on GitLab for a frontend, a products service, and a shopping cart service. Each service builds, tests, and deploys independently using reusable CI templates and `extends` to avoid duplicating pipeline logic. Docker images are versioned dynamically and pushed to a private registry, with caching to keep builds fast and multi-stage deployments through dev, staging, and production. Kubernetes deployment targets an EKS cluster.",
    impact: "A new service inherits the existing pipeline through a template instead of requiring one to be written, and any service can ship without waiting on the others.",
    tags: ["GitLab CI", "Kubernetes", "EKS", "Docker", "Monorepo", "CI Templates"],
    repoUrl: "https://gitlab.com/hassanbahnasy872/microservice-cicd"
  },
  {
    slug: "kubeseal-reencrypt-design-proposal",
    kind: "project",
    featured: true,
    title: "kubeseal Re-encryption — Design Proposal",
    summary: "A design proposal for a new reencrypt command in the kubeseal CLI, written as an infrastructure internship task for Instabug — analysis and architecture, not shipped code.",
    description: "A design proposal for a new reencrypt command in the kubeseal CLI, written as an infrastructure internship task for Instabug — analysis and architecture, not shipped code.",
    problem: "SealedSecrets are encrypted against a controller's public key. When that key rotates, every existing SealedSecret still holds data encrypted under the old key. There's no native command to re-encrypt them, so operators either delete and recreate secrets by hand or leave them tied to a retired key.",
    approach: "Designed a reencrypt command integrated into the kubeseal CLI as a native subcommand. The proposed flow lists SealedSecrets across all namespaces, decrypts them with the old private key where available, re-encrypts with the current public certificate, and updates each resource in place without deletion. The design covers failure handling, behaviour at cluster scale, and safe handling of private key material.",
    impact: "A written proposal for making SealedSecret key rotation automated and consistent with kubeseal's existing workflow, rather than a manual operation.",
    tags: ["Kubernetes", "SealedSecrets", "Go", "Design Proposal", "Security"],
    repoUrl: "https://github.com/Bahnasy2001/Instabug_Task"
  },

  // ---------------------------------------------------------------------------
  // Labs & practice — grouped collections, not individual exercises
  // ---------------------------------------------------------------------------
  {
    slug: "devops-fundamentals-labs",
    kind: "lab",
    labCount: 20,
    title: "DevOps Fundamentals Labs",
    summary: "Twenty progressive labs from Linux basics to Terraform three-tier architectures on AWS and Azure.",
    description: "Twenty progressive labs covering Linux administration, Docker from first container to multi-stage builds, Docker Compose networking and load balancing, the ELK stack, Jenkins freestyle through advanced pipelines, Kubernetes workloads, and Terraform three-tier architectures on both AWS and Azure.",
    tags: ["Docker", "Kubernetes", "Jenkins", "Terraform", "Ansible", "Linux"],
    repoUrl: "https://github.com/Bahnasy2001/DEPI_DevOpsTasks"
  },
  {
    slug: "aws-hands-on-labs",
    kind: "lab",
    labCount: 28,
    title: "AWS Hands-On Labs",
    summary: "Twenty-eight labs across compute, storage, networking, IAM, and serverless on AWS.",
    description: "Twenty-eight labs across the AWS service surface: EC2 and EBS operations, EFS, AMIs and snapshots, autoscaling, S3 lifecycle policies and presigned URLs, VPC peering and PrivateLink, IAM condition-based policies, RDS, Lambda automation, CloudFront, CloudFormation, CloudWatch, and ECS.",
    tags: ["AWS", "EC2", "S3", "VPC", "IAM", "Lambda", "CloudFormation"]
  },
  {
    slug: "azure-devops-labs",
    kind: "lab",
    labCount: 29,
    title: "Azure DevOps Labs",
    summary: "Twenty-nine labs spanning classic and YAML pipelines, from App Service slots to self-hosted agents on AKS.",
    description: "Classic and YAML pipelines end to end: App Service deployment with staging slots, variable groups and token replacement, IIS deployment on Azure VMs, Azure Container Apps with ACR, AKS deployment with Helm, then YAML depth — stages, variables, parameters, conditions, loops, templates, caching, environments, and containerized self-hosted agents on AKS.",
    tags: ["Azure DevOps", "YAML Pipelines", "AKS", "Helm", "ACR"]
  },
  {
    slug: "gitlab-ci-labs",
    kind: "lab",
    labCount: 30,
    title: "GitLab CI Labs",
    summary: "Thirty labs from pipeline basics to a reusable CI template library across monorepo and polyrepo strategies.",
    description: "Pipeline configuration through to platform work: jobs, stages, rules, and merge request triggers; runner setup across shared, specific, group, and self-managed on EC2; SAST scanning; dynamic image versioning; multi-stage environments; and monorepo versus polyrepo strategies with a reusable CI template library.",
    tags: ["GitLab CI", "Docker", "Kubernetes", "EKS", "CI Templates"],
    repoUrl: "https://gitlab.com/hassanbahnasy872/node-project"
  },
  {
    slug: "individual-labs-early-projects",
    kind: "lab",
    labCount: 4,
    title: "Individual Labs & Early Projects",
    summary: "Four standalone exercises from earlier in the journey, covering Jenkins, Terraform, Ansible, and LAMP.",
    description: "Four standalone exercises from earlier in the journey: a backend registration system deployed with Terraform, Ansible, Jenkins, and Docker Compose; a Jenkins pipeline where Ansible configures EC2 instances discovered dynamically from Terraform tags; a Jenkins-to-Minikube deployment pipeline; and a LAMP stack built and deployed on cloud infrastructure.",
    tags: ["Jenkins", "Terraform", "Ansible", "Minikube", "LAMP"],
    repoUrl: "https://github.com/Bahnasy2001"
  }
];