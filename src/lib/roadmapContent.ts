import type { Role } from '../../db/schema'

export type RoadmapDeliverable = {
  roleOverview: string
  actualDuties: string[]
  prerequisites: string[]
  skills: string[]
  learningSequence: string[]
  tools: string[]
  projects: { beginner: string; intermediate: string; advanced: string }
  portfolioRequirements: string[]
  certifications: string[]
  jobTitles: string[]
  interviewPrep: string[]
  resources: string[]
}

type RoleExtras = {
  prerequisites: string[]
  tools: string[]
  projects: { beginner: string; intermediate: string; advanced: string }
  portfolioRequirements: string[]
  certifications: string[]
  jobTitles: string[]
  interviewPrep: string[]
  resources: string[]
}

const extrasBySlug: Record<string, RoleExtras> = {
  'mlops-engineer': {
    prerequisites: [
      'Comfortable writing Python scripts, not just notebooks',
      'Basic command-line and Git fluency',
      'Rough understanding of how a model is trained (you do not need to be a data scientist)',
    ],
    tools: ['Docker', 'Kubernetes', 'MLflow', 'Airflow', 'GitHub Actions', 'Prometheus + Grafana', 'Terraform'],
    projects: {
      beginner: 'Wrap a pretrained scikit-learn model in a FastAPI service and containerize it with Docker.',
      intermediate: 'Build a CI/CD pipeline that retrains a model nightly on fresh data and redeploys automatically.',
      advanced: 'Stand up a full MLOps stack (MLflow + Airflow + a model-serving layer) with drift detection that triggers retraining.',
    },
    portfolioRequirements: [
      'A public GitHub repo with a deployed, working model API — not just training code',
      'A README explaining the pipeline architecture with a diagram',
      'At least one project showing monitoring/alerting on a live model',
    ],
    certifications: [
      'AWS Certified Machine Learning – Specialty',
      'Google Professional Machine Learning Engineer',
      'Kubernetes CKA (shows you can operate the infra underneath)',
    ],
    jobTitles: ['MLOps Engineer', 'ML Platform Engineer', 'Machine Learning Infrastructure Engineer', 'ML Systems Engineer'],
    interviewPrep: [
      'Be ready to whiteboard a full model lifecycle: data -> training -> registry -> serving -> monitoring',
      'Know how to explain model drift and what you would automate to catch it',
      'Practice explaining a rollback strategy for a bad model deploy',
    ],
    resources: [
      '"Designing Machine Learning Systems" by Chip Huyen',
      'Made With ML MLOps course (free, madewithml.com)',
      'MLflow and Airflow official documentation and tutorials',
    ],
  },
  'site-reliability-engineer': {
    prerequisites: [
      'Solid Linux fundamentals (processes, permissions, networking basics)',
      'Ability to read and write scripts (bash or Python)',
      'Curiosity about why things fail, not just how to fix them',
    ],
    tools: ['Terraform', 'Prometheus + Grafana', 'PagerDuty or Opsgenie', 'Kubernetes', 'Ansible', 'OpenTelemetry'],
    projects: {
      beginner: 'Deploy a small app, then intentionally break it and practice diagnosing the outage from logs and metrics alone.',
      intermediate: 'Write Terraform to provision a small multi-service environment with monitoring built in from day one.',
      advanced: 'Run a chaos-engineering exercise (inject latency, kill a service) against a project and write a full postmortem.',
    },
    portfolioRequirements: [
      'A written incident postmortem for a real or simulated outage you handled',
      'A Terraform repo provisioning real infrastructure, with a README on design decisions',
      'Evidence of an on-call-style workflow (alerting rules, runbooks)',
    ],
    certifications: [
      'Google Cloud Professional Cloud DevOps Engineer',
      'HashiCorp Certified: Terraform Associate',
      'Linux Foundation Certified System Administrator (LFCS)',
    ],
    jobTitles: ['Site Reliability Engineer', 'Production Engineer', 'Infrastructure Engineer', 'DevOps Engineer'],
    interviewPrep: [
      'Practice the classic "walk me through debugging a slow API" scenario out loud',
      'Know your SLO/SLI/error-budget vocabulary cold — interviewers test this specifically',
      'Prepare one real story about an incident, using the situation-action-result format',
    ],
    resources: [
      '"Site Reliability Engineering" (the Google SRE book, free online)',
      '"The Site Reliability Workbook" for hands-on exercises',
      'r/sre and the SRE Weekly newsletter',
    ],
  },
  'data-engineer': {
    prerequisites: [
      'Strong SQL basics (you will get much stronger)',
      'Comfort with at least one scripting language',
      'Understanding of what a database and a data warehouse are',
    ],
    tools: ['dbt', 'Airflow or Dagster', 'Snowflake or BigQuery', 'Apache Kafka', 'Apache Spark', 'Fivetran/Airbyte'],
    projects: {
      beginner: 'Pull data from a public API on a schedule and load it into a Postgres or BigQuery table.',
      intermediate: 'Build a dbt project that transforms raw data into a clean star schema with tests and documentation.',
      advanced: 'Add a streaming component with Kafka that feeds near-real-time data into your warehouse alongside the batch pipeline.',
    },
    portfolioRequirements: [
      'A pipeline repo showing raw source to warehouse to transformed tables, end to end',
      'dbt documentation output (or equivalent) showing lineage',
      'At least one data-quality test suite that actually catches bad data',
    ],
    certifications: [
      'Google Professional Data Engineer',
      'Snowflake SnowPro Core',
      'dbt Fundamentals (dbt Labs)',
    ],
    jobTitles: ['Data Engineer', 'Analytics Engineer', 'ETL Developer', 'Data Platform Engineer'],
    interviewPrep: [
      'Expect a live SQL exercise — practice window functions and query optimization until automatic',
      'Be able to explain the difference between ETL and ELT and when you would choose each',
      'Prepare a story about a time a pipeline broke and how you found the root cause',
    ],
    resources: [
      '"Fundamentals of Data Engineering" by Joe Reis and Matt Housley',
      'dbt Learn (free courses at learn.getdbt.com)',
      'The Data Engineering Podcast',
    ],
  },
  'platform-engineer': {
    prerequisites: [
      'Working knowledge of containers and at least basic Kubernetes',
      'Experience writing infrastructure as code',
      'Empathy for developer experience — you are building for engineers, not end users',
    ],
    tools: ['Kubernetes', 'Terraform or Pulumi', 'Backstage', 'ArgoCD', 'Crossplane', 'Open Policy Agent'],
    projects: {
      beginner: 'Write a Terraform module that a teammate could reuse to spin up a standard service with one command.',
      intermediate: 'Stand up a minimal Backstage instance cataloging a few sample services with scaffolding templates.',
      advanced: 'Build a self-service portal (Backstage plugin or custom CLI) that provisions real cloud infrastructure with guardrails baked in.',
    },
    portfolioRequirements: [
      'A reusable infra module or template with clear documentation for other engineers',
      'A working internal-developer-platform demo, even a small one',
      'Evidence of "paved road" thinking: defaults that are secure and fast by design',
    ],
    certifications: [
      'Certified Kubernetes Administrator (CKA)',
      'HashiCorp Certified: Terraform Associate',
      'Certified Kubernetes Application Developer (CKAD)',
    ],
    jobTitles: ['Platform Engineer', 'Developer Experience Engineer', 'Infrastructure Platform Engineer', 'Cloud Platform Engineer'],
    interviewPrep: [
      'Be ready to discuss "golden paths" and how you would design one for a real org',
      'Know how to justify build-vs-buy decisions for internal tooling',
      'Prepare an example of reducing toil or ticket volume with self-service tooling',
    ],
    resources: [
      '"Team Topologies" by Matthew Skelton and Manuel Pais',
      'The Platform Engineering community (platformengineering.org)',
      'Backstage.io official documentation and demo catalog',
    ],
  },
  'ai-red-teaming-engineer': {
    prerequisites: [
      'Comfort using LLM APIs programmatically, not just via chat UIs',
      'Basic security or adversarial-thinking mindset',
      'Ability to write clearly about technical findings for a non-technical audience',
    ],
    tools: ['OpenAI/Anthropic APIs', 'Python', 'promptfoo or custom eval harnesses', 'Jupyter', 'LangChain or raw HTTP clients', 'Garak (LLM vulnerability scanner)'],
    projects: {
      beginner: 'Write a script that runs 20 adversarial prompts against a model and logs which ones succeed at breaking guidelines.',
      intermediate: 'Build an automated evaluation harness that scores model responses against a rubric (toxicity, refusal correctness, factuality).',
      advanced: 'Reproduce a published jailbreak technique end to end, document why it works, and propose a concrete mitigation.',
    },
    portfolioRequirements: [
      'A public write-up of a responsible, disclosed finding (never publish live exploits irresponsibly)',
      'An evaluation harness repo with a scoring rubric and sample results',
      'Evidence of following responsible-disclosure norms if you tested a real product',
    ],
    certifications: [
      'No single dominant certification yet — practical, published work matters far more',
      'OWASP Top 10 for LLM Applications (self-study, free)',
      'General security certs (e.g. Security+) help if you are coming from a security background',
    ],
    jobTitles: ['AI Red Teamer', 'AI Safety Evaluator', 'LLM Evaluation Engineer', 'Trust & Safety Engineer (AI)'],
    interviewPrep: [
      'Be ready to describe a specific attack class (e.g. prompt injection) and how you would test for it methodically',
      'Show you understand the difference between "found a bug" and "built a repeatable eval"',
      'Prepare a story about a finding you reported responsibly, including how you communicated risk',
    ],
    resources: [
      'OWASP Top 10 for Large Language Model Applications',
      'Anthropic and OpenAI published red-teaming and safety research papers',
      'The "Garak" and "promptfoo" open-source project documentation',
    ],
  },
}

const defaultExtras: RoleExtras = {
  prerequisites: [
    'Basic programming literacy in at least one language',
    'Comfort with the command line',
    'Genuine curiosity about how production systems work',
  ],
  tools: ['Git', 'Docker', 'A cloud provider (AWS, GCP, or Azure)', 'A CI/CD tool'],
  projects: {
    beginner: 'Build and deploy a small end-to-end project that touches every skill on this roadmap, even shallowly.',
    intermediate: 'Extend that project with automation, monitoring, or a second integrated system.',
    advanced: 'Rebuild the project to production standards: tested, documented, monitored, and resilient to failure.',
  },
  portfolioRequirements: [
    'A public repository with clear documentation',
    'A live or reproducible demo, not just source code',
    'Evidence you can explain your design decisions in writing',
  ],
  certifications: ['A relevant cloud provider associate-level certification'],
  jobTitles: ['Related engineering roles matching this skill set'],
  interviewPrep: [
    'Be ready to walk through a project you built end to end',
    'Prepare one concrete story about debugging something difficult',
  ],
  resources: ['Official documentation for the core tools in this roadmap', 'A well-reviewed book on the discipline'],
}

/** Combines stored role fields with authored, role-specific filler into the full 14-section roadmap deliverable. */
export function buildRoadmapDeliverable(role: Role): RoadmapDeliverable {
  const extras = extrasBySlug[role.slug] ?? defaultExtras
  return {
    roleOverview: `${role.title} — ${role.description}`,
    actualDuties: role.tasks,
    prerequisites: extras.prerequisites,
    skills: role.skills,
    learningSequence: role.roadmap,
    tools: extras.tools,
    projects: extras.projects,
    portfolioRequirements: extras.portfolioRequirements,
    certifications: extras.certifications,
    jobTitles: extras.jobTitles,
    interviewPrep: extras.interviewPrep,
    resources: extras.resources,
  }
}
