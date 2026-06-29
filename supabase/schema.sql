-- ============================================================
-- Portfolio Schema — paste into Supabase SQL Editor and Run
-- ============================================================

-- 1. Tables

create table if not exists profile (
  id         uuid primary key default gen_random_uuid(),
  summary    text not null default '',
  highlights jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

create table if not exists titles (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  sort_order int  not null default 0
);

create table if not exists stats (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  value      int  not null default 0,
  prefix     text not null default '',
  suffix     text not null default '',
  sort_order int  not null default 0
);

create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  title       text    not null,
  description text    not null default '',
  tech        text[]  not null default '{}',
  image_url   text,
  github_url  text,
  live_url    text,
  featured    boolean not null default false,
  sort_order  int     not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists skills (
  id         uuid primary key default gen_random_uuid(),
  category   text   not null,
  items      text[] not null default '{}',
  sort_order int    not null default 0
);

create table if not exists services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  icon        text not null default 'Zap',
  sort_order  int  not null default 0
);

create table if not exists approach (
  id          uuid primary key default gen_random_uuid(),
  step_number int     not null,
  title       text    not null,
  description text    not null default '',
  is_active   boolean not null default false,
  sort_order  int     not null default 0
);

create table if not exists links (
  id       uuid primary key default gen_random_uuid(),
  platform text not null,
  url      text not null,
  icon     text not null default 'Link'
);

-- ============================================================
-- 2. Enable Row Level Security
-- ============================================================

alter table profile  enable row level security;
alter table titles   enable row level security;
alter table stats    enable row level security;
alter table projects enable row level security;
alter table skills   enable row level security;
alter table services enable row level security;
alter table approach enable row level security;
alter table links    enable row level security;

-- ============================================================
-- 3. RLS Policies — public read, authenticated write
-- ============================================================

create policy "public_read_profile"  on profile  for select using (true);
create policy "public_read_titles"   on titles   for select using (true);
create policy "public_read_stats"    on stats    for select using (true);
create policy "public_read_projects" on projects for select using (true);
create policy "public_read_skills"   on skills   for select using (true);
create policy "public_read_services" on services for select using (true);
create policy "public_read_approach" on approach for select using (true);
create policy "public_read_links"    on links    for select using (true);

create policy "auth_write_profile"  on profile  for all using (auth.role() = 'authenticated');
create policy "auth_write_titles"   on titles   for all using (auth.role() = 'authenticated');
create policy "auth_write_stats"    on stats    for all using (auth.role() = 'authenticated');
create policy "auth_write_projects" on projects for all using (auth.role() = 'authenticated');
create policy "auth_write_skills"   on skills   for all using (auth.role() = 'authenticated');
create policy "auth_write_services" on services for all using (auth.role() = 'authenticated');
create policy "auth_write_approach" on approach for all using (auth.role() = 'authenticated');
create policy "auth_write_links"    on links    for all using (auth.role() = 'authenticated');

-- ============================================================
-- 4. Seed — initial content from CV
-- ============================================================

insert into profile (summary, highlights) values (
  'AI Systems & Agent Engineer focused on transforming operational bottlenecks into autonomous end-to-end AI solutions. Expert in designing intelligent agents, real-time web integrations, and automated workflows that replace manual processes with scalable AI architectures.',
  '["Founder & Chairman, IEEE Computer Society – TTU (30+ volunteers)", "Chairman, IMPACT Conference – 300+ participants, Ministry partnership", "IEEE Region 8 Best Ambassador 2023"]'
);

insert into titles (title, sort_order) values
  ('AI Systems Engineer', 0),
  ('Agent Engineer',      1),
  ('ML Engineer',         2),
  ('Data Analyst',        3);

insert into stats (label, value, prefix, suffix, sort_order) values
  ('Projects Delivered',      4,  '',  '+', 0),
  ('Certifications',          10, '',  '+', 1),
  ('Volunteers Led',          30, '',  '+', 2),
  ('Conference Participants', 300,'',  '+', 3);

insert into services (title, description, icon, sort_order) values
  ('Agentic AI Systems',     'Design and build multi-agent systems with LangGraph and LangChain that handle complex autonomous tasks end-to-end.',          'Bot',        0),
  ('AI Backend Engineering', 'FastAPI-based async backends with real-time WebSocket support, RESTful API design, and middleware security.',                  'Server',     1),
  ('ML Model Development',   'Train, fine-tune, and evaluate deep learning models using PyTorch and TensorFlow for classification and prediction tasks.',    'BrainCircuit',2),
  ('RAG & Knowledge Systems','Build retrieval-augmented generation pipelines optimised for accuracy, latency, and domain-specific grounding.',               'Database',   3),
  ('Workflow Automation',    'Automate business processes with n8n and custom API integrations, replacing manual operations with scalable AI workflows.',    'Workflow',   4),
  ('Data Engineering',       'Design pipelines to fetch, process, and visualise real-time data, turning raw inputs into actionable intelligence.',          'BarChart2',  5);

insert into approach (step_number, title, description, is_active, sort_order) values
  (1, 'Data',       'Identify, collect, and clean the data that drives the system.',                         false, 0),
  (2, 'Modeling',   'Select architecture, train models, and iterate with precision.',                        false, 1),
  (3, 'Evaluation', 'Benchmark rigorously against real-world metrics and edge cases.',                       true,  2),
  (4, 'Deployment', 'Ship to production with monitoring, logging, and failover in place.',                   false, 3),
  (5, 'Optimisation','Continuously improve latency, accuracy, and cost through feedback loops.',             false, 4);

insert into skills (category, items, sort_order) values
  ('Agentic AI',        array['LangGraph','LangChain','Multi-Agent Systems','Tool Use / Function Calling','Autonomous Task Planning'], 0),
  ('AI & ML',           array['PyTorch','TensorFlow','Scikit-learn','Model Fine-tuning','Deep Learning','RAG Optimisation'], 1),
  ('Backend',           array['FastAPI','Python (Advanced Async)','Real-time WebSockets','RESTful API Design','CORS & Middleware'], 2),
  ('Data & Databases',  array['SQL','Supabase','OpenCV','Data Pipelines','XGBoost'], 3),
  ('Tools & Platforms', array['n8n Automation','Git & GitHub','Cursor','API Integration','InsightFace'], 4);

insert into projects (title, description, tech, github_url, featured, sort_order) values
  ('Smart Event System',           'AI-based real-time face recognition and automated photo sorting for large-scale events, reducing manual processing time by 95%.', array['Python','InsightFace','OpenCV'], null, true,  0),
  ('Customer Churn Prediction',    'Classification models to predict customer churn and extract actionable insights for retention strategies.',                         array['Python','SQL','XGBoost'],       null, true,  1),
  ('Leaf Disease Recognition CNN', 'CNN-based system achieving high accuracy in classifying plant health conditions and suggesting treatments.',                        array['Python','TensorFlow','Keras'],   null, false, 2),
  ('Weather Data Pipeline',        'Automated pipeline to fetch, process, and visualise real-time weather data for local activity planning.',                          array['Python','REST APIs','SQL'],      null, false, 3);

insert into links (platform, url, icon) values
  ('LinkedIn', 'https://linkedin.com/in/saif-alqdessi', 'Linkedin'),
  ('GitHub',   'https://github.com/saif-alqdessi',      'Github'),
  ('Email',    'mailto:alqdessi.qp@gmail.com',          'Mail');
