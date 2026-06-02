# OpsDash — Setup

## Pré-requisitos
- Node.js 18+
- npm / pnpm / yarn

## Passo a passo

### 1. Instalar dependências
```bash
npm install
```

### 2. Adicionar componentes shadcn/ui
Execute o comando abaixo para instalar todos os componentes usados pelo projeto:

```bash
npx shadcn@latest add table badge button input select dropdown-menu avatar switch tooltip checkbox popover calendar label
```

> Os arquivos serão criados em `components/ui/`. O projeto já inclui `components.json`
> configurado com `baseColor: zinc` e CSS variables.

### 3. Rodar em desenvolvimento
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Estrutura de arquivos

```
saas-dashboard/
├── app/
│   ├── layout.tsx          # Root layout: ThemeProvider, Toaster, Geist font
│   ├── page.tsx            # Página Visão Geral
│   └── globals.css         # CSS vars (dark/light), reset
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx     # Sidebar colapsável com tooltips
│   │   ├── header.tsx      # Breadcrumb + notificações + avatar + theme toggle
│   │   └── main-layout.tsx # Shell responsivo (sidebar + header + main)
│   ├── dashboard/
│   │   ├── metric-cards.tsx  # 4 KPI cards com skeleton + sparkline
│   │   ├── clients-table.tsx # Tabela densa com filtros, sort, paginação
│   │   └── table-filters.tsx # Filtros: busca, status, plano, date range
│   ├── sparkline.tsx       # SVG sparkline puro (sem biblioteca)
│   └── ui/                 # Componentes shadcn (gerados pelo CLI)
├── lib/
│   ├── types.ts            # Interfaces TypeScript
│   ├── mock-data.ts        # 18 clientes mock + métricas
│   └── utils.ts            # cn(), formatMRR(), slaColor(), etc.
├── providers/
│   └── theme-provider.tsx  # Wrapper do next-themes
├── components.json         # Config shadcn/ui
├── tailwind.config.ts
└── tsconfig.json
```

## Features implementadas

| Feature | Onde |
|---|---|
| Sidebar colapsável + mobile overlay | `layout/sidebar.tsx` |
| Breadcrumb dinâmico | `layout/header.tsx` |
| Dark/light toggle (Switch) | `layout/header.tsx` |
| 4 KPI cards com sparkline SVG | `dashboard/metric-cards.tsx` |
| Skeleton loading 1.5s | `dashboard/metric-cards.tsx` |
| Tabela densa 18 linhas | `dashboard/clients-table.tsx` |
| SLA progress bar (verde→âmbar→vermelho) | `dashboard/clients-table.tsx` |
| Filtros: busca, status, plano, date range | `dashboard/table-filters.tsx` |
| Ordenação por coluna (todas) | `dashboard/clients-table.tsx` |
| Seleção múltipla + bulk action | `dashboard/clients-table.tsx` |
| Paginação com ellipsis | `dashboard/clients-table.tsx` |
| Toast de confirmação (Sonner) | `dashboard/clients-table.tsx` |
| Acessibilidade WCAG AA | Todos os componentes |
