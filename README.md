# OpsDash

Painel operacional B2B para times de Customer Success e Ops. Interface densa e responsiva construída com Next.js 14, Tailwind CSS, shadcn/ui e Radix UI.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black?style=flat-square)

---

## Visão geral

O OpsDash centraliza a gestão de clientes SaaS em uma única interface compacta e responsiva. Times de CS conseguem monitorar saúde de contas, SLA em risco, tarefas abertas e NPS — tudo sem sair da mesma ferramenta.

### Páginas implementadas

| Rota | Descrição |
|---|---|
| `/` | Visão Geral — KPIs, tabela de clientes com filtros e ações rápidas |
| `/clientes` | Gestão de clientes — resumo por status + tabela completa |
| `/tarefas` | Tarefas — cards filtráveis com toggle de conclusão inline |
| `/relatorios` | Relatórios — gráficos de MRR, status, SLA e NPS |
| `/configuracoes` | Configurações — perfil, notificações, equipe e segurança |

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript 5 |
| Estilo | Tailwind CSS 3.4 |
| Componentes | shadcn/ui + Radix UI |
| Ícones | lucide-react |
| Fontes | Geist Sans (inclusa no Next.js 14) |
| Tema | next-themes (dark por padrão) |
| Toasts | Sonner |
| Date picker | react-day-picker + date-fns |
| Dados | Mock estático (sem API) |

---

## Pré-requisitos

- Node.js 18 ou superior
- npm, pnpm ou yarn

---

## Instalação

### 1. Clone o projeto

```bash
git clone <url-do-repo>
cd saas-dashboard
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Instale os componentes shadcn/ui

O projeto usa o shadcn CLI para gerar os componentes base em `components/ui/`:

```bash
npx shadcn@latest add table badge button input select dropdown-menu avatar switch tooltip checkbox popover calendar label
```

> Isso criará os arquivos em `components/ui/` respeitando o `components.json` já configurado com `baseColor: zinc` e CSS variables.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Estrutura de arquivos

```
saas-dashboard/
│
├── app/
│   ├── layout.tsx              # Root layout: ThemeProvider, Toaster, Geist font
│   ├── page.tsx                # "/" — Visão Geral
│   ├── clientes/page.tsx       # "/clientes" — Gestão de clientes
│   ├── tarefas/page.tsx        # "/tarefas" — Lista de tarefas
│   ├── relatorios/page.tsx     # "/relatorios" — Análises e gráficos
│   ├── configuracoes/page.tsx  # "/configuracoes" — Configurações do sistema
│   └── globals.css             # CSS variables (dark/light), reset, densidade
│
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx         # Sidebar colapsável com tooltips e overlay mobile
│   │   ├── header.tsx          # Breadcrumb, notificações, avatar, theme switch
│   │   └── main-layout.tsx     # Shell responsivo: sidebar + header + main
│   │
│   ├── dashboard/
│   │   ├── metric-cards.tsx    # 4 KPI cards com skeleton 1.5s e sparkline
│   │   ├── clients-table.tsx   # Tabela (desktop) + cards (mobile), sort e paginação
│   │   ├── table-filters.tsx   # Busca, status, plano, date range picker
│   │   └── task-list.tsx       # Grid de cards de tarefas com filtros interativos
│   │
│   ├── sparkline.tsx           # Sparkline SVG puro — sem biblioteca de gráficos
│   └── ui/                     # Componentes gerados pelo shadcn CLI
│
├── lib/
│   ├── types.ts                # Client, Task, MetricData e tipos auxiliares
│   ├── mock-data.ts            # 18 clientes + 15 tarefas + 4 métricas
│   └── utils.ts                # cn(), formatMRR(), slaColor(), labels e cores
│
├── providers/
│   └── theme-provider.tsx      # Wrapper do next-themes
│
├── components.json             # Configuração do shadcn/ui
├── tailwind.config.ts          # Tema Tailwind com CSS variables
├── tsconfig.json
├── next.config.mjs
└── package.json
```

---

## Funcionalidades

### Visão Geral (`/`)
- 4 KPIs: Clientes ativos, Tarefas abertas, SLA em risco, NPS médio
- **Skeleton loading** de 1.5s simulando chamada de API
- **Sparkline SVG** de 7 pontos — verde para tendência positiva, vermelho para negativa
- Tabela de clientes com filtros, ordenação e ações rápidas

### Clientes (`/clientes`)
- Barra de resumo rápido: total, ativos, em risco, trial e churned
- Tabela completa reaproveitando todos os filtros e funcionalidades da Visão Geral
- **Mobile:** cards individuais por cliente substituem a tabela abaixo de 768px

### Tarefas (`/tarefas`)
- **15 tarefas mock** distribuídas entre clientes reais do sistema
- Filtros: busca por texto, status, prioridade e responsável
- Contadores de tarefas por status no topo (pendentes, em andamento, atrasadas, concluídas)
- **Toggle inline** de conclusão — clique no ícone da tarefa para marcar/desmarcar
- Grid responsivo: 1 coluna (mobile) → 2 colunas (tablet) → 3 colunas (desktop)

### Relatórios (`/relatorios`)
- Todos os dados calculados dinamicamente a partir dos clientes mock
- **MRR por plano** — barra horizontal com percentual de participação
- **Clientes por status** — barra comparativa entre ativo, em risco, trial e churned
- **Saúde do SLA** — distribuição em zonas verde / âmbar / vermelho com barra empilhada
- **NPS** — média, breakdown promotores/passivos/detratores e barra segmentada
- Layout em 2 colunas no desktop, 1 coluna no mobile

### Configurações (`/configuracoes`)
- **Perfil:** nome e cargo editáveis, e-mail somente leitura, troca de foto (placeholder)
- **Notificações:** 5 switches configuráveis (SLA, tarefas, churn, digest semanal, NPS)
- **Equipe:** lista de membros com nome, e-mail e cargo
- **Segurança:** alteração de senha e toggle de autenticação em dois fatores

### Tabela de clientes (componente compartilhado)
- **Ordenação** por todas as colunas — clique alterna asc/desc, `aria-sort` para screen readers
- **Seleção múltipla** com checkbox indeterminate e barra de ação em bulk
- **Filtros combinados:** busca por texto, dropdown de status, dropdown de plano, date range picker
- **SLA progress bar** — verde (< 60%) → âmbar (60–80%) → vermelho (≥ 80%)
- **Ações por linha:** atribuir tarefa, registrar contato, ver detalhes, remover
- **Paginação** com ellipsis dinâmico e seletor de linhas (10 / 20 / 50)
- **Mobile:** exibe cards em vez de tabela abaixo de 768px

### Layout e navegação
- Sidebar colapsável em desktop (tooltips no modo recolhido)
- Overlay com backdrop em mobile (aberta via hamburger no header)
- Breadcrumb dinâmico por página
- Toggle dark/light no header

---

## Responsividade mobile

A interface adapta o layout em três breakpoints principais:

| Elemento | Mobile (< 768px) | Desktop (≥ 768px) |
|---|---|---|
| Sidebar | Overlay deslizante via hamburger | Fixa à esquerda, colapsável |
| Tabela de clientes | Cards empilhados verticalmente | Tabela completa com todas as colunas |
| KPI cards | Grid 2×2 | Grid 4×1 |
| Tarefas | 1 coluna | 2–3 colunas |
| Relatórios | 1 coluna | 2 colunas |
| Configurações | Coluna única | Coluna única (max-w-2xl) |

---

## Acessibilidade

O projeto foi construído com WCAG AA como requisito:

| Recurso | Implementação |
|---|---|
| Labels em inputs | `aria-label` em todos os controles sem `<label>` visível |
| Navegação por teclado | Todos os elementos interativos alcançáveis via Tab com `focus-visible` |
| Ordenação | `aria-sort="ascending/descending/none"` nos cabeçalhos da tabela |
| Loading | `aria-live="polite"` + `aria-busy` nos cards durante skeleton |
| Progresso | `role="progressbar"` com `aria-valuenow/min/max` nas barras de SLA e relatórios |
| Paginação | `aria-current="page"` na página ativa, `aria-label` em cada botão |
| Sparklines | `aria-hidden="true"` — decorativas, valor numérico presente no card |
| Breadcrumb | `<nav aria-label="Localização atual">` com `aria-current="page"` |
| Sidebar | `<aside aria-label="Navegação principal">` |
| Theme toggle | `aria-label` descritivo no Switch |
| Ícones | `aria-hidden="true"` em todos os ícones decorativos |

---

## Personalização

### Adicionar clientes mock

Edite [`lib/mock-data.ts`](saas-dashboard/lib/mock-data.ts) e adicione objetos ao array `MOCK_CLIENTS` seguindo a interface `Client` em [`lib/types.ts`](saas-dashboard/lib/types.ts).

### Adicionar tarefas mock

Edite `MOCK_TASKS` no mesmo arquivo, seguindo a interface `Task`.

### Alterar thresholds do SLA

Em [`lib/utils.ts`](saas-dashboard/lib/utils.ts), ajuste a função `slaColor`:

```ts
export function slaColor(consumed: number): string {
  if (consumed >= 80) return "bg-red-500"   // crítico
  if (consumed >= 60) return "bg-amber-500" // alerta
  return "bg-emerald-500"                   // seguro
}
```

### Trocar a paleta de cores primária

Em [`app/globals.css`](saas-dashboard/app/globals.css), altere o valor de `--primary` (e `--ring`) nas seções `:root` e `.dark`. O valor é em formato HSL.

---

## Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento em localhost:3000
npm run build    # Build de produção
npm run start    # Inicia o servidor de produção (requer build)
npm run lint     # Lint com ESLint
```

---

## Decisões de design

**Por que Sonner e não o toast nativo do shadcn?**
O Sonner expõe uma API imperativa (`toast.success(...)`) mais ergonômica para ações rápidas em tabela, sem exigir provider adicional de estado global.

**Por que sparkline SVG puro?**
Evita dependências pesadas como Recharts ou Victory para um elemento puramente decorativo. O componente tem < 60 linhas e produz resultado visual equivalente.

**Por que cards em vez de tabela no mobile?**
Tabelas com 8+ colunas em tela estreita exigem scroll horizontal, o que prejudica a usabilidade. Cards expõem as informações mais relevantes de forma natural e tátil em dispositivos touch.

**Por que gráficos sem biblioteca?**
Os relatórios usam barras SVG calculadas com percentuais simples. Para dados analíticos mais complexos (séries temporais, scatter plots), adicionar Recharts seria a próxima evolução natural.

**Densidade compacta**
O `--radius` global foi definido como `0.375rem` (rounded-md) para manter cantos sutis. Alturas de linha e padding foram reduzidos em relação ao padrão shadcn para caber mais informação na viewport sem scroll desnecessário.

---

## Licença

MIT
