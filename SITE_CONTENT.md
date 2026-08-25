# Site Content Reference — Saif Alqdessi Portfolio

Extracted from the current Next.js codebase for reference (e.g. redesign, copy audit, content migration).
Content shown below is the **fallback copy hardcoded in each component** — the live site overrides it with rows from Supabase (`profile`, `titles`, `services`, `approach`, `skills`, `projects`, `stats`, `links`) when that data exists. If Supabase is empty/unreachable, these fallbacks are what renders.

Stack: Next.js (App Router) + TypeScript + Tailwind CSS + Supabase. Dark theme, cyan/purple neon-glass aesthetic.

Page order (`src/app/page.tsx`): Hero → Track Record → About → What I Do → Projects → Engineering Approach → Tech Stack → Inquiry (footer = Contact).

---

## Navbar (`src/components/layout/Navbar.tsx`)

- Logo: `SAIF.AI`
- Links: Track Record · About · What I Do · Projects · Approach · Stack · Contact
- Extra link: `ADMIN` → `/admin`

## Hero (`HeroSection.tsx`, `HeroRoles.tsx`)

- Heading: **"Hi, I'm Saif"**
- Animated typing role list (cycles): AI Systems Engineer · Agent Engineer · ML Engineer · RAG & LLM Apps · Automation & Workflows
- Bio: "Building autonomous AI solutions, intelligent agents, and scalable architectures that transform how businesses operate."
- CTAs: **Download CV** (`/cv.pdf`) · **Contact Me** (`#contact`)
- Scroll indicator label: "Scroll"

## Track Record (`TrackRecordSection.tsx`)

- Label: "By the Numbers" · Title: "Track Record"
- Subtitle: "Proven expertise in delivering AI solutions that create real impact."
- Stats:
  | Value | Label | Description |
  |---|---|---|
  | 4+ | Projects Delivered | Real-world AI deployments |
  | 10+ | Certifications | LLM apps, RAG & intelligent workflows |
  | 30+ | Volunteers Led | Industry-recognized credentials |
  | 300+ | Conference Participants | Large-scale tech events & workshops |

## About (`AboutSection.tsx`)

- Label: "Who I Am" · Title: "About Me"
- Subheading: "AI Engineer passionate about building **autonomous intelligent systems**"
- Summary: "AI Systems & Agent Engineer focused on transforming operational bottlenecks into autonomous end-to-end AI solutions. Expert in designing intelligent agents, real-time web integrations, and automated workflows that replace manual processes with scalable AI architectures."
- Bio paragraph: "Beyond engineering, I've led a 30-volunteer IEEE chapter, organized a 300-participant conference with Ministry sponsorship, and was recognised as IEEE Region 8 Best Ambassador 2023 — proof that I build people and communities, not just systems."
- Feature tags: AI Systems Architect · Agent Engineer · Community Leader
- Pull quote: "Turning data into decisions, and ideas into autonomous systems."
- Portrait: `/img/Saif.jpg`

## What I Do (`WhatIDoSection.tsx`)

- Label: "Capabilities" · Title: "What I Do"
- Subtitle: "Specialized expertise in cutting-edge AI & ML systems"
- Services:
  1. **Agentic AI Systems** — Design and build multi-agent systems with LangGraph and LangChain that handle complex autonomous tasks end-to-end.
  2. **AI Backend Engineering** — FastAPI-based async backends with real-time WebSocket support, RESTful API design, and middleware security.
  3. **ML Model Development** — Train, fine-tune, and evaluate deep learning models using PyTorch and TensorFlow for classification and prediction tasks.
  4. **RAG & Knowledge Systems** — Build retrieval-augmented generation pipelines optimised for accuracy, latency, and domain-specific grounding.
  5. **Workflow Automation** — Automate business processes with n8n and custom API integrations, replacing manual operations with scalable AI workflows.
  6. **Data Engineering** — Design pipelines to fetch, process, and visualise real-time data, turning raw inputs into actionable intelligence.

## Projects (`ProjectsSection.tsx`)

- Label: "Portfolio" · Title: "Projects"
- Subtitle: "Selected work across AI systems, ML models, and data engineering."
- Projects:
  1. **Smart Event System** *(Featured)* — AI-based real-time face recognition and automated photo sorting for large-scale events, reducing manual processing time by 95%. — `Python, InsightFace, OpenCV`
  2. **Customer Churn Prediction** *(Featured)* — Classification models to predict customer churn and extract actionable insights for retention strategies. — `Python, SQL, XGBoost`
  3. **Leaf Disease Recognition CNN** — CNN-based system achieving high accuracy in classifying plant health conditions and suggesting treatments. — `Python, TensorFlow, Keras`
  4. **Weather Data Pipeline** — Automated pipeline to fetch, process, and visualise real-time data for local activity planning. — `Python, REST APIs, SQL`

## Engineering Approach (`EngineeringApproachSection.tsx`)

- Label: "Methodology" · Title: "Engineering Approach"
- Subtitle: "Systematic methodology for building production AI systems"
- Steps:
  1. **Data** — Identify, collect, and clean the data that drives the system.
  2. **Modeling** *(highlighted/active step)* — Select architecture, train models, and iterate with precision.
  3. **Evaluation** — Benchmark rigorously against real-world metrics and edge cases.
  4. **Deployment** — Ship to production with monitoring, logging, and failover in place.
  5. **Optimisation** — Continuously improve latency, accuracy, and cost through feedback loops.

## Tech Stack (`TechStackSection.tsx`)

- Label: "Technologies" · Title: "Tech Stack"
- Subtitle: "Tools and technologies I use to build intelligent systems"
- Categories:
  - **AI & Machine Learning**: Python, PyTorch, TensorFlow, LangChain, LangGraph, Hugging Face, OpenAI API, Anthropic Claude
  - **Backend & APIs**: FastAPI, Node.js, Express, PostgreSQL, Supabase, Redis, WebSockets, REST APIs
  - **Frontend & UI**: React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Vercel, Responsive Design
  - **Data & Analytics**: Pandas, NumPy, SQL, Data Pipelines, ETL, Jupyter, Matplotlib, Seaborn
  - **DevOps & Tools**: Git, Docker, Linux, AWS, CI/CD, Monitoring, Testing, Deployment
  - **Automation & Integration**: n8n, Zapier, Workflow Automation, API Integration, Webhooks, Cron Jobs, Event-Driven Architecture

## Inquiry / Contact Form (`InquirySection.tsx`)

- Label: "Get Started" · Title: "Let's Talk About Your Project"
- Subtitle: "Tell us what you're building and we'll show you how AI can accelerate it."
- "What to expect" list: Free 30-minute consultation · Response within 24 hours · No-obligation project scoping · Transparent pricing upfront
- Form fields: Full Name*, Business Email*, Phone Number, Website URL (optional), Job Title/Company Role* (Owner/Manager/Operations/Technical/Sales/Marketing), Services of Interest* (AI Agents, n8n Workflows, RAG Systems, AI Systems, Smart Websites, Automations — multi-select), Project Timeline (ASAP / 1-3 months / 3-6 months / Exploring), Primary Business Challenge* (textarea), Estimated Budget (Under $1K / $1K-$5K / $5K-$10K / $10K+)
- Submit CTA: "Book Your Free Consultation"
- Success message: "Inquiry received — Thanks, {FirstName}. We'll review your project details and respond within 24 hours."
- Submits to `POST /api/inquiry`

## Footer / Contact (`Footer.tsx`)

- Name: "Saif Alqdessi" · Tagline: "AI Engineer & Systems Architect"
- Social links: GitHub, LinkedIn, Email (platform-driven; also supports WhatsApp via `links` table)
- Footer nav: About · Projects · Stack
- Copyright: "© {year} Saif Alqdessi. Built with Next.js & Supabase."

## Metadata (`src/app/layout.tsx`)

- Title: "Saif Alqdessi – AI Engineer"
- Description: "AI Systems & Agent Engineer building autonomous AI solutions, intelligent agents, and scalable architectures."

---

## Content data model (Supabase-backed, `supabase/schema.sql`)

Tables driving live content: `profile`, `titles`, `services`, `approach`, `skills`, `projects` (+ `project_tech_tags`), `stats`, `links`. All are editable via the `/admin` dashboard (`src/app/admin/(protected)/*`).
