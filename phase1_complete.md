# Phase 1 Complete — Project Foundation & Database Schema

## ✅ Deliverables

### Folder Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py               ✅ FastAPI app (lifespan, CORS, health check)
│   ├── config.py             ✅ Pydantic BaseSettings (Google-unified stack)
│   ├── database.py           ✅ SQLAlchemy 2.0 async engine + session
│   ├── models/
│   │   ├── __init__.py       ✅ Registers all models with Base.metadata
│   │   ├── campaign.py       ✅ ORM model + CampaignStatus enum
│   │   ├── lead.py           ✅ ORM model + LeadStatus enum (7 states)
│   │   ├── ai_output.py      ✅ ORM model + JSONB agent outputs
│   │   └── page_payload.py   ✅ ORM model + JSONB EN/AR twin payloads
│   ├── schemas/              ✅ Stub (Phase 3)
│   ├── api/v1/
│   │   ├── campaigns.py      ✅ Stub router
│   │   ├── leads.py          ✅ Stub router
│   │   ├── jobs.py           ✅ Stub router
│   │   └── preview.py        ✅ Stub router
│   ├── services/
│   │   ├── scraper/          ✅ Package (Phase 2)
│   │   └── agents/           ✅ Package (Phase 5)
│   └── workers/
│       ├── celery_app.py     ✅ Celery factory (Redis broker)
│       └── tasks.py          ✅ Task stubs (Phase 4/5)
├── alembic/
│   ├── env.py                ✅ Async-compatible, autogenerate ready
│   └── versions/             ✅ Empty (run alembic revision to populate)
├── alembic.ini               ✅ Config
├── tests/                    ✅ Package stub
├── .env.template             ✅ All variables documented
├── .gitignore                ✅ Python/Docker/IDE exclusions
├── docker-compose.yml        ✅ API + Worker + PostgreSQL 16 + Redis 7
├── Dockerfile                ✅ Python 3.12 slim + Playwright Chromium
└── requirements.txt          ✅ Google-unified stack (no Anthropic/Groq)
```

---

## 🔑 Architectural Decisions Applied

### Google AI Unified Stack
| Agent | Model | Reason |
|---|---|---|
| Copywriter EN | `gemini-1.5-pro` | Max reasoning, premium EN copywriting |
| Copywriter AR | `gemini-1.5-pro` | Max reasoning, high-quality Arabic |
| Analyst | `gemini-1.5-flash` | Speed + token efficiency |
| Validator | `gemini-1.5-flash` | Rapid JSON validation |

Constants live in `config.py`:
```python
GEMINI_COPY_MODEL     = "gemini-1.5-pro"
GEMINI_ANALYST_MODEL  = "gemini-1.5-flash"
GEMINI_VALIDATOR_MODEL = "gemini-1.5-flash"
```

### Database Schema Design
- **`campaigns`** → one-to-many → **`leads`** → one-to-one → **`ai_outputs`** + **`page_payloads`**
- `google_place_id` is the dedup key on leads (unique constraint)
- `slug` is the routing key for preview URLs (unique, indexed)
- All JSONB columns use PostgreSQL native JSONB for queryability
- `AIOutput` and `PagePayload` are intentionally separate tables — supports re-running the assembler without re-invoking LLMs

### Key Improvements vs Roadmap
| Item | Roadmap | Implementation |
|---|---|---|
| Startup hook | `@app.on_event("startup")` (deprecated) | `lifespan` context manager |
| Campaign status | 4 states | Added `AI_RUNNING` state for granularity |
| Docker healthcheck | Missing | Added `pg_isready` healthcheck so API waits for DB |
| `get_async_session` | Not in roadmap | Added for Celery task usage outside FastAPI DI |
| `AIOutput.validation_result` | Not in roadmap | Added for full validator observability |

---

## 🚀 Next Steps (Phase 2)

When you're ready, Phase 2 will implement:
- `app/services/scraper/google_places.py` — Google Places API integration
- `app/services/scraper/filter_engine.py` — The Golden Filter (rating ≥ 4.0, reviews ≥ 15)
- `app/services/scraper/playwright_scraper.py` — Headless fallback
- `app/schemas/lead.py` — `RawLeadData` Pydantic schema

> [!IMPORTANT]
> Before running `docker-compose up`, copy `.env.template` to `.env` and fill in:
> - `POSTGRES_PASSWORD`
> - `GOOGLE_PLACES_API_KEY`
> - `GOOGLE_AI_API_KEY`
