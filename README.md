# Kanban & Agenda App

Sistema de gestão pessoal/profissional com board Kanban e agenda integrada. MVP desenvolvido como projeto de portfólio simulando um produto SaaS real.

## Stack

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM v7
- TanStack Query v5
- React Hook Form + Zod
- dnd-kit (drag and drop)
- date-fns
- Lucide React

**Backend / BaaS**
- Supabase (PostgreSQL + Auth + RLS)

## Funcionalidades

- Autenticação (email/senha via Supabase Auth)
- Board Kanban com colunas Todo / In Progress / Done
- Drag and drop de cards (mobile-friendly)
- Agenda mensal e semanal estilo Google Calendar
- Vínculo entre tarefas e eventos
- Dados isolados por usuário via Row Level Security

## Setup

### 1. Clone e instale dependências

```bash
git clone <repo-url>
cd kanban-agenda-app
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env
```

Preencha `.env` com as credenciais do seu projeto Supabase:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Execute as migrations no Supabase

No painel do Supabase, acesse **SQL Editor** e execute os arquivos na ordem:

1. `supabase/migrations/20240101000000_create_tasks.sql`
2. `supabase/migrations/20240101000001_create_events.sql`

### 4. Rode o projeto

```bash
npm run dev
```

## Estrutura de Pastas

```
src/
├── assets/
├── components/
│   ├── ui/          # Componentes base reutilizáveis
│   ├── auth/        # Login, Register, RequireAuth
│   ├── kanban/      # Board, Column, Card
│   ├── calendar/    # CalendarView, EventCard
│   └── layout/      # Sidebar, Header, Shell
├── hooks/           # Hooks de dados (useTask, useEvents, etc.)
├── lib/             # supabase.ts, queryClient.ts, utils.ts
├── pages/           # Páginas roteadas
├── services/        # Funções de acesso ao Supabase
├── types/           # Interfaces e tipos TypeScript
└── utils/           # Funções auxiliares

supabase/
└── migrations/      # SQL de criação de tabelas, RLS e triggers
```

## Banco de Dados

### `tasks`
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| title | text | Obrigatório |
| description | text | Opcional |
| status | text | `todo` \| `in_progress` \| `done` |
| priority | text | `low` \| `medium` \| `high` |
| position | integer | Ordem no board |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto (trigger) |

### `events`
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| task_id | uuid | FK → tasks (nullable) |
| title | text | Obrigatório |
| description | text | Opcional |
| start_time | timestamptz | UTC |
| end_time | timestamptz | UTC, deve ser > start_time |
| color | text | Opcional (hex ou nome) |
| type | text | `meeting` \| `focus` \| `reminder` \| `personal` |
| status | text | `confirmed` \| `cancelled` |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto (trigger) |

## Roadmap

- [x] Fase 1 — Setup e infraestrutura base
- [ ] Fase 2 — Autenticação e layout
- [ ] Fase 3 — Kanban (UI + CRUD + drag and drop)
- [ ] Fase 4 — Agenda (UI mensal/semanal)
- [ ] Fase 5 — CRUD eventos + integração tarefas-eventos
- [ ] Fase 6 — Responsividade, UX e deploy (Vercel)
