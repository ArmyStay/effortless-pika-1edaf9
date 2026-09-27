import type { NewRole } from '../../db/schema'

/**
 * Seed content for the five example "Hidden IT Careers" roles.
 * Content is intentionally specific (not generic filler) so the storyboard
 * preview and roadmap page have something real to render.
 */
export const seedRoles: NewRole[] = [
  {
    slug: 'mlops-engineer',
    title: 'MLOps Engineer',
    hook: "Nobody told you this job existed: you'll ship machine learning models without ever tuning a single hyperparameter.",
    description:
      'MLOps Engineers build the pipelines that take a data scientist\'s model from a Jupyter notebook to a system serving real predictions in production. You own training pipelines, model registries, deployment automation, and the monitoring that catches drift before customers notice.',
    tasks: [
      'Automate retraining pipelines so models refresh on new data without manual babysitting',
      'Containerize and deploy models behind versioned APIs with rollback built in',
      'Monitor live predictions for data drift, latency spikes, and silent accuracy decay',
    ],
    skills: [
      'Python (pipelines, not research)',
      'Docker & Kubernetes',
      'CI/CD (GitHub Actions, GitLab CI)',
      'Model registries (MLflow, Vertex AI, SageMaker)',
      'Monitoring & observability (Prometheus, Grafana, Evidently)',
      'Basic ML lifecycle literacy (train/val/test, drift, feature stores)',
    ],
    roadmap: [
      'Learn Python + Linux + Git fundamentals cold',
      'Get comfortable with Docker: build, tag, push, run',
      'Learn one cloud platform deeply (AWS or GCP) — compute, storage, IAM',
      'Build a CI/CD pipeline for a toy app end to end',
      'Take a model someone else trained and deploy it as an API',
      'Add monitoring + automatic retraining triggers to that deployment',
      'Contribute to or replicate an open-source MLOps stack (MLflow + Airflow + Docker)',
    ],
    brollTags: ['server-racks', 'terminal-typing', 'dashboard-graphs', 'docker-logo', 'city-night-datacenter'],
    cta: 'Comment MLOPS and I\'ll send you the complete roadmap.',
  },
  {
    slug: 'site-reliability-engineer',
    title: 'Site Reliability Engineer (SRE)',
    hook: "This job pays six figures to make sure nothing happens. If you notice an SRE's work, they had a bad day.",
    description:
      'Site Reliability Engineers apply software engineering to operations: they define uptime targets, build the automation that keeps services alive, and lead the response when something breaks at 3am. It is equal parts coding, systems thinking, and calm under pressure.',
    tasks: [
      'Define and track SLOs/SLIs so "reliable" has a number, not a vibe',
      'Build automation that eliminates repetitive manual ops work (toil)',
      'Lead incident response and write blameless postmortems that fix root causes',
    ],
    skills: [
      'Linux internals & networking',
      'A scripting language (Python or Go)',
      'Infrastructure as Code (Terraform)',
      'Observability (Prometheus, Grafana, OpenTelemetry)',
      'Incident management & on-call practices',
      'Distributed systems fundamentals',
    ],
    roadmap: [
      'Master Linux command line and networking basics (DNS, TCP, load balancing)',
      'Learn a scripting language well enough to automate real tasks',
      'Study distributed systems fundamentals (queues, caching, consistency)',
      'Learn Terraform and stand up real infrastructure with it',
      'Set up full observability (metrics, logs, traces) on a side project',
      'Simulate an on-call rotation: inject failures, write postmortems',
      'Study the Google SRE book and map its practices onto your own projects',
    ],
    brollTags: ['pager-alert', 'server-racks', 'terminal-typing', 'graph-spike', 'night-shift-desk'],
    cta: 'Comment SRE and I\'ll send you the complete roadmap.',
  },
  {
    slug: 'data-engineer',
    title: 'Data Engineer',
    hook: 'Every dashboard your company brags about exists because someone quietly moved terabytes of messy data without anyone knowing.',
    description:
      'Data Engineers design and maintain the pipelines that move data from scattered sources into warehouses where it becomes usable. They build the plumbing analysts and data scientists depend on — and get blamed the second a number looks wrong.',
    tasks: [
      'Build ETL/ELT pipelines that ingest data from APIs, databases, and events reliably',
      'Design warehouse schemas that stay sane as data volume and sources grow',
      'Enforce data quality checks so bad data gets caught before it reaches a dashboard',
    ],
    skills: [
      'SQL at an expert level',
      'Python for pipeline orchestration',
      'A workflow orchestrator (Airflow, Dagster, Prefect)',
      'Data warehousing (Snowflake, BigQuery, Redshift)',
      'Batch and streaming concepts (Kafka, Spark)',
      'Data modeling (star schema, dbt-style transformations)',
    ],
    roadmap: [
      'Get fluent in SQL — joins, window functions, query optimization',
      'Learn Python for scripting and pipeline logic',
      'Build a batch ETL pipeline from a public API into a warehouse',
      'Learn Airflow or Dagster and orchestrate that pipeline properly',
      'Add data quality tests and alerting to the pipeline',
      'Learn the basics of streaming with Kafka on a small project',
      'Model a real warehouse schema using dbt and document it',
    ],
    brollTags: ['flowing-data-lines', 'server-racks', 'terminal-typing', 'dashboard-graphs', 'pipeline-diagram'],
    cta: 'Comment DATA and I\'ll send you the complete roadmap.',
  },
  {
    slug: 'platform-engineer',
    title: 'Platform Engineer',
    hook: 'This role exists to make 50 other engineers feel like they each have their own DevOps team.',
    description:
      'Platform Engineers build the internal tools, golden paths, and self-service infrastructure that let product teams ship without needing to become Kubernetes experts themselves. You are effectively building a product — for other engineers.',
    tasks: [
      'Build self-service infrastructure so developers can provision resources without tickets',
      'Design golden-path templates that bake in security and best practices by default',
      'Maintain the internal developer platform (IDP) and its documentation',
    ],
    skills: [
      'Kubernetes & container orchestration',
      'Infrastructure as Code (Terraform, Pulumi)',
      'Internal developer platforms (Backstage, Crossplane)',
      'CI/CD pipeline design',
      'Cloud networking & security fundamentals',
      'API design (you\'re building tools for engineers)',
    ],
    roadmap: [
      'Learn Docker and then Kubernetes hands-on, not just theory',
      'Learn Terraform and provision multi-resource environments',
      'Build a CI/CD template that any new service in an org could reuse',
      'Stand up a minimal internal developer portal (try Backstage)',
      'Add self-service provisioning (a form or CLI that creates real infra)',
      'Bake security guardrails into your golden path (policy as code)',
      'Write documentation as if 50 engineers depended on it — because they will',
    ],
    brollTags: ['server-racks', 'kubernetes-logo', 'terminal-typing', 'network-diagram', 'city-night-datacenter'],
    cta: 'Comment PLATFORM and I\'ll send you the complete roadmap.',
  },
  {
    slug: 'ai-red-teaming-engineer',
    title: 'AI Red Teaming / Evaluation Engineer',
    hook: 'Companies now pay people full-time salaries to try to break their own AI before customers do it for them.',
    description:
      'AI Red Teaming and Evaluation Engineers probe language models and AI products for failure modes: jailbreaks, bias, hallucination, unsafe outputs, and prompt injection. They design evaluation suites and adversarial tests that keep AI products from embarrassing — or harming — their companies.',
    tasks: [
      'Design adversarial prompts and attack scenarios to surface model failure modes',
      'Build automated evaluation harnesses that score models on safety and quality dimensions',
      'Write clear findings reports that translate attacks into concrete product fixes',
    ],
    skills: [
      'Prompt engineering at an adversarial level',
      'Python for building eval pipelines',
      'Statistics for interpreting eval results',
      'Familiarity with LLM APIs (OpenAI, Anthropic, open-weight models)',
      'Security mindset (threat modeling, OWASP-style thinking applied to AI)',
      'Clear technical writing for findings and reports',
    ],
    roadmap: [
      'Get fluent with at least two major LLM APIs and their safety documentation',
      'Study known attack classes: jailbreaks, prompt injection, data extraction',
      'Learn Python well enough to script prompts against models in bulk',
      'Build a small evaluation harness that scores model outputs automatically',
      'Reproduce a handful of published jailbreak or red-teaming papers yourself',
      'Practice writing a findings report like a real security disclosure',
      'Contribute to an open-source AI safety eval project to build a public track record',
    ],
    brollTags: ['terminal-typing', 'network-diagram', 'lock-icon', 'dashboard-graphs', 'code-scrolling'],
    cta: 'Comment REDTEAM and I\'ll send you the complete roadmap.',
  },
]
