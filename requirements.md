# AI Engineer Portfolio – Creative Requirements

---

## 1. Vision

Create a premium, modern AI Engineer portfolio website.

This project merges inspiration from multiple reference portfolios,
but must result in a unified, original design system.

The final result should feel:

- Intelligent
- Minimal
- Cinematic
- High-end
- Technically confident

Do NOT copy references literally.
Reconstruct them into a cohesive design language.

---

## 2. Design Philosophy

Theme: Dark / Futuristic / AI  
Mood: Clean, precise, engineered  
Style Direction: Glass UI + Subtle Neon Accents  

The design should feel like:
- A production AI lab website
- A premium SaaS dashboard
- A technical personal brand

Visual priorities:
- Strong hierarchy
- Generous spacing
- Controlled glow effects
- Subtle motion
- Elegant typography

---

## 3. Global Design System (Define & Apply Consistently)

You must define and consistently apply:

### Color System
- Primary accent (Cyan/Blue tone)
- Secondary accent (Purple/Indigo tone)
- Neutral dark scale
- Border opacity standard
- Hover glow intensity system

### Typography
- Clear scale for:
  - Section Titles
  - Headings
  - Subheadings
  - Body text
  - Labels
- Professional modern font (Inter-style)

### Spacing System
- Section padding rhythm
- Card padding standard
- Grid gap consistency
- Vertical flow logic

### Motion System
- Staggered section reveal
- Subtle hover lift
- Controlled glow enhancement
- No aggressive animation

---

## 4. Sections to Build

Each section should be reinterpreted creatively from references.

---

### 4.1 Hero

Reference:
https://preview_1750672779811_9qtmf63vg3dn.trickle.host/

Screenshot: `img\Hero1.png`

Direction:
- Split layout (text + portrait)
- Rotating role/title every 2 seconds
- Elegant CTA group
- Cinematic background depth
- Sophisticated entrance animations

Extract dynamic titles from CV:
AI Engineer, ML Engineer, Data Analyst, etc.


---

### 4.2 Track Record

Reference:
https://fable-alike-58991148.figma.site/
Screenshot: `/img/TrackRecord.png`

Direction:
- Centered section
- Stat cards with accent differentiation
- Count-up animations
- Premium glass panels
- Reflect actual CV data:
  - Experience: 0–1 years
  - Certifications: 10+

Reframe metrics creatively to suit early-career profile.

---

### 4.3 About

Reference:
https://coffee-doge-66115487.figma.site
Screenshot: `/img/About.png`

Direction:
- Two-column layout
- Strong personal positioning statement
- Extract and rewrite bio from CV
- Add 2–3 intelligent feature highlights
- Visual depth behind profile image
Profile image path:
`/img/Saif.jpg`

Creative freedom encouraged.

---

### 4.4 Projects

Reference:
https://adam-carter.dgtportfolio.com/
Screenshot: `/img/Project.png`

Direction:
- Featured project card layout
- Clean tech stack display
- Elegant GitHub CTA
- Glass container style
- Subtle interaction polish

All projects should be dynamically rendered from database.

---

### 4.5 What I Do

Reference:
https://fable-alike-58991148.figma.site/
Screenshot: `/img/WhatIDo.png`

Direction:
- Service-style grid
- 6 capability cards
- Extract capabilities from CV
- Add creative positioning titles
- Maintain structured visual rhythm

---

### 4.6 Engineering Approach

Reference:
https://fable-alike-58991148.figma.site/
Screenshot: `/img/EngineeringApproach.png`

Direction:
- 5-step methodology row
- System-building mindset
- Highlight one step as “active”
- Connect visually through subtle line

Steps should reflect real AI workflow:
Data → Modeling → Evaluation → Deployment → Optimization

---

### 4.7 Skills (Tech Stack)

Reference:
https://fable-alike-58991148.figma.site/
Screenshot: `/img/TechStack.png`

Direction:
- Dashboard-style skill matrix
- Categorized skill groups
- Clean text layout (no heavy badges)
- Accent-based column grouping

Extract from CV and expand intelligently if needed.

---

## 5. Content Source

Use `cv.txt` as primary content source.
`cv.pdf` is secondary reference only.
Extract:
- Bio
- Experience
- Projects
- Skills
- Certifications
- Achievements

Rephrase content professionally if needed.

---

## 6. Admin Dashboard

Create secure admin panel at `/admin`.

Dashboard must allow:

Projects:
- Create
- Edit
- Delete
- Upload images
- Toggle featured

Skills:
- Edit categories
- Add/remove items

About:
- Edit bio
- Edit highlights

Experience:
- Add/edit entries

Social Links:
- Update URLs

No manual code edits required.

---

## 7. Data Model

Define scalable data structures for:

Project:
- id
- title
- description
- tech[]
- image
- github_link
- featured

Experience:
- company
- role
- duration
- description

SkillCategory:
- name
- items[]

Bio:
- summary
- highlights[]

---

## 8. Technical Stack

- Next.js (App Router preferred)
- Component-based architecture
- Database-backed content
- Image upload support
- SEO-friendly
- Fast loading
- Clean folder structure

---

## 9. Creative Authority

You are acting as:

Senior Product Designer  
Senior Frontend Engineer  
AI Systems Engineer  

You have authority to:

- Improve visual balance
- Harmonize spacing
- Upgrade interaction quality
- Simplify where necessary
- Elevate aesthetic level

Goal:
Build a cohesive, intelligent, premium AI portfolio.