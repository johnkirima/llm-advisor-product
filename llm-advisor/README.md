# LLM Advisor

> A decision-support web app for non-developer professionals to pick the right LLM for a specific work task — balanced across **quality**, **reliability**, and **affordability**. Built for BAIS:3300 — Emerging Digital Products (Sprint 1).

---

## Table of contents

1. [What it does](#what-it-does)
2. [Tech stack](#tech-stack)
3. [Local development](#local-development)
4. [Project structure](#project-structure)
5. [Recommendation algorithm](#recommendation-algorithm)
6. [Deploying to Azure App Service](#deploying-to-azure-app-service)
7. [Accessibility](#accessibility)

---

## What it does

LLM Advisor walks you through a five-step decision in under two minutes:

1. **Task** — describe the work in plain language (no jargon).
2. **Constraints** — how urgent and how cost-sensitive this is.
3. **Priorities** — rank quality, reliability, and affordability for *this* task.
4. **Recommendation** — a primary pick and an alternative, each with plain-language reasoning, strengths, trade-offs, and a rough cost note.
5. **Confirm** — a confidence rating, and your decision is saved.

The target persona is the *Cost-Conscious Operations Analyst* — a non-developer domain expert who is deadline-driven and wary of cost surprises.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **framer-motion** for screen transitions
- **Supabase** (PostgreSQL) for persistence
- **Node.js 20** runtime

## Local development

### Prerequisites

- Node.js 20 LTS
- Yarn 1.x (Classic) or npm 10+
- A Supabase project (free tier is fine)

### Setup

```bash
cd nextjs_space
cp .env.example .env.local
# fill in .env.local with your Supabase credentials
yarn install
yarn dev
```

App runs at http://localhost:3000. The decision workflow is at `/decision`.

### Database schema

The Supabase schema (`decision_sessions`, `tasks`, `constraints`, `priorities`, `recommendations`, `selections`, plus two post-use tables) is created by running the migration SQL that ships with this repo. See `docs/supabase_schema_migration.sql` (attached separately in the submission package).

## Project structure

```
llm-advisor/
├── nextjs_space/                  # Next.js app root
│   ├── app/
│   │   ├── page.tsx             # Landing page (hero, problem, how-it-works, persona, CTA)
│   │   ├── decision/page.tsx    # Decision workflow entry
│   │   └── api/sessions/        # 6 REST routes for the workflow
│   ├── components/
│   │   ├── landing/             # Marketing sections
│   │   ├── decision/            # Wizard screens + LLM card
│   │   └── ui/                  # shadcn/ui primitives
│   ├── lib/
│   │   ├── supabase.ts          # Server & browser clients
│   │   ├── llms.ts              # 8-model catalog + labels
│   │   ├── recommend.ts         # Weighted scoring engine
│   │   └── decision-types.ts    # Shared types
│   └── .env.example             # Copy to .env.local
├── AZURE_DEPLOY.md                # Step-by-step Azure deploy guide
└── README.md                      # This file
```

## Recommendation algorithm

For each LLM in the catalog (8 models):

1. **Weighted base score**
   - `rank_1` priority × 0.50
   - `rank_2` priority × 0.30
   - `rank_3` priority × 0.20
2. **Constraint adjustments**
   - Urgency = urgent → **+1.0** if model is `fast`, **−1.0** if `thorough`
   - Budget = major concern → **+1.5** if `budget` tier, **−1.5** if `premium`
   - Budget = prefer affordable → **+0.5** / **−0.5**
3. **Task-type bonus** — **+0.5** if the task type is in the model’s `strengthsFor[]`

The top two scores become the **Recommended** and **Alternative** picks. Rationale (why it fits, trade-offs, estimated cost) is generated server-side and persisted to the `recommendations` table as JSON.

## Deploying to Azure App Service

See [AZURE_DEPLOY.md](AZURE_DEPLOY.md) for the full walkthrough. The short version:

1. Create an Azure App Service (Linux, Node 20 LTS).
2. Set the **Startup Command** to `yarn start` (or `node node_modules/next/dist/bin/next start`).
3. Under **Configuration → Application settings**, add the three Supabase env vars plus `SCM_DO_BUILD_DURING_DEPLOYMENT=true`.
4. Deploy via GitHub Actions (recommended) or `az webapp up`.

## Accessibility

Built to meet **WCAG 2.1 AA**:

- Semantic landmarks (`main#main`, `header`, `footer`, `nav`)
- Skip-to-main-content link (focus visible)
- One `<h1>` per screen, no heading skips
- All form controls labelled; all buttons have accessible names
- `aria-current`, `aria-pressed`, `role="radiogroup"` on interactive widgets
- Decorative icons marked `aria-hidden="true"`
- Visible focus rings throughout
- Color contrast meets AA at body, headings, and buttons (tested against WebAIM contrast checker at `hsl(262 83% 58%)` on near-white / near-black backgrounds)

---

**Author**: John Kirima
**Course**: BAIS:3300 — Emerging Digital Products, University of Iowa
**Sprint**: 1 of 2 (MVP — decision workflow end to end)
