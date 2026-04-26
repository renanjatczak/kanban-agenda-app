# Kanban & Agenda

Sistema de gestão pessoal/profissional com board Kanban e agenda integrada, desenvolvido como projeto de portfólio simulando um produto SaaS real.

> **Deploy:** _link disponível após publicação_

---

## Funcionalidades

### Autenticação
- Cadastro e login com email/senha via Supabase Auth
- Proteção de rotas — redirecionamento automático para login
- Persistência de sessão (onAuthStateChange)
- Logout com limpeza de sessão

### Kanban
- Board com 3 colunas: **A Fazer**, **Em Progresso**, **Concluído**
- Criar, editar e excluir tarefas (CRUD real no Supabase)
- Prioridade visual: Baixa, Média e Alta
- Drag and drop entre colunas (dnd-kit — funcional em desktop e mobile)
- Atualização otimista ao arrastar
- Confirmação antes de excluir

### Agenda
- Visualização mensal, semanal e diária
- Navegação entre períodos (anterior, próximo, hoje)
- Highlight do dia atual e do dia selecionado
- Criar, editar e excluir eventos (CRUD real no Supabase)
- Vínculo opcional de eventos com tarefas
- Opção "Dia inteiro" ao criar/editar eventos
- Modal de detalhes ao clicar em um evento
- Color picker com 8 cores predefinidas
- 4 tipos de evento: Reunião, Foco, Lembrete, Pessoal

### Dashboard
- Contadores de tarefas por status (A Fazer, Em Progresso, Concluídas)
- Seção "Próximos eventos" com dados reais dos próximos 30 dias
- Clique em evento abre modal de detalhes
- Link para criar eventos diretamente quando não há eventos

### Dark Mode
- Alternância light/dark via botão no header e em Configurações
- Preferência salva em localStorage
- Respeita prefers-color-scheme no primeiro acesso

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript |
| Build | Vite |
| Estilo | Tailwind CSS v4 |
| Roteamento | React Router DOM v7 |
| Estado servidor | TanStack Query v5 |
| Formulários | React Hook Form v7 + Zod v4 |
| Drag and drop | dnd-kit v6 |
| Datas | date-fns v4 |
| Ícones | Lucide React |
| Backend/BaaS | Supabase (PostgreSQL + Auth + RLS) |
| Deploy | Vercel (planejado) |

---

## Pré-requisitos

- Node.js 18+
- npm 9+
- Conta no [Supabase](https://supabase.com) (gratuita)

---

## Configuração

### 1. Clone e instale dependências

```bash
git clone <url-do-repositório>
cd kanban-agenda-app
npm install
```

### 2. Crie o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Aguarde o banco de dados ficar disponível
3. Vá em **Project Settings → API** e copie:
   - **Project URL**
   - **anon/public key**

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 4. Execute as migrations no Supabase

No painel do Supabase, acesse **SQL Editor** e execute os arquivos na ordem:

**Migration 1 — Tabela de tarefas:**

```sql
-- Cole o conteúdo de: supabase/migrations/20240101000000_create_tasks.sql
```

**Migration 2 — Tabela de eventos:**

```sql
-- Cole o conteúdo de: supabase/migrations/20240101000001_create_events.sql
```

> Os arquivos SQL estão na pasta `supabase/migrations/`. Cada um cria a tabela, ativa RLS, define as policies e cria o trigger `updated_at`.

### 5. (Opcional) Desative confirmação de email para testes locais

No Supabase: **Authentication → Providers → Email** → desative **Confirm email**.

Reative antes do deploy em produção.

### 6. Rode localmente

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção (TypeScript + Vite) |
| `npm run lint` | Lint com ESLint |
| `npm run preview` | Pré-visualizar o build de produção |

---

## Estrutura de pastas

```
src/
├── components/
│   ├── auth/        # RequireAuth, RequireGuest
│   ├── calendar/    # CalendarShell, MonthView, WeekView, DayView, modais de evento
│   ├── kanban/      # KanbanBoard, KanbanColumn, TaskCard, modais de tarefa
│   ├── layout/      # AppLayout, AuthLayout, Sidebar, Header
│   └── ui/          # Button, Input, Modal, FormField, PageLoader
├── contexts/        # AuthContext, AuthProvider, ThemeContext, ThemeProvider
├── hooks/           # useAuth, useAuthContext, useTheme, useTasks, useEvents
├── lib/             # supabase.ts, queryClient.ts, utils.ts
├── pages/           # DashboardPage, KanbanPage, CalendarPage, SettingsPage, Login, Register
├── router.tsx       # createBrowserRouter com rotas protegidas e públicas
├── services/        # auth.service.ts, task.service.ts, event.service.ts
├── types/           # index.ts (Task, Event, inputs), calendar.ts (CalendarEvent, CalendarView)
└── utils/           # eventColors.ts (cores, labels, presets)

supabase/
└── migrations/      # SQL: tasks, events, RLS, constraints, triggers
```

---

## Banco de dados

### Tabela `tasks`

| Campo | Tipo | Constraint |
|-------|------|-----------|
| `id` | uuid PK | auto |
| `user_id` | uuid FK | `auth.users` |
| `title` | text | not null |
| `description` | text | — |
| `status` | text | `todo` \| `in_progress` \| `done` |
| `priority` | text | `low` \| `medium` \| `high` |
| `position` | integer | default 0 |
| `created_at` | timestamptz | default now() |
| `updated_at` | timestamptz | trigger auto-update |

### Tabela `events`

| Campo | Tipo | Constraint |
|-------|------|-----------|
| `id` | uuid PK | auto |
| `user_id` | uuid FK | `auth.users` |
| `task_id` | uuid FK nullable | `tasks` (on delete set null) |
| `title` | text | not null |
| `description` | text | — |
| `start_time` | timestamptz | not null, UTC |
| `end_time` | timestamptz | not null, `end > start` |
| `color` | text | hex string |
| `type` | text | `meeting` \| `focus` \| `reminder` \| `personal` |
| `status` | text | `confirmed` \| `cancelled` |
| `created_at` | timestamptz | default now() |
| `updated_at` | timestamptz | trigger auto-update |

Todas as tabelas têm **Row Level Security** ativada: cada usuário acessa apenas os próprios dados.

---

## Roadmap

- [x] Fase 1 — Setup, Supabase, migrations, types, README
- [x] Fase 2 — Autenticação (login, cadastro, proteção de rotas, layout base)
- [x] Fase 3 — Kanban com CRUD real e drag and drop
- [x] Fase 4 — Agenda visual (visualização mensal, navegação, eventos mock)
- [x] Fase 5 — Eventos reais no Supabase, CRUD de eventos, dark mode
- [x] Fase 6 — Dashboard com próximos eventos, opção "dia inteiro", documentação
- [ ] Deploy na Vercel
- [ ] Responsividade mobile avançada (calendar week/day em mobile)
- [ ] Code splitting para reduzir bundle size
- [ ] Notificações de eventos (push/email)
- [ ] Filtros e busca no Kanban

---

## Licença

MIT
