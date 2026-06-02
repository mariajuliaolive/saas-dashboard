# OpsDash

Painel operacional B2B para times de Customer Success e Ops. Interface densa e funcional construída com Next.js 14, Tailwind CSS, shadcn/ui e Radix UI.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black?style=flat-square)

---

## Visão geral

O OpsDash centraliza a gestão de clientes SaaS em uma única interface compacta. Times de CS conseguem monitorar saúde de contas, SLA em risco, tarefas abertas e NPS — tudo sem sair da mesma tela.

### Telas implementadas

- **Visão Geral** — KPIs, tabela de clientes, filtros e ações rápidas
- **Sidebar** — navegação principal colapsável (Visão Geral, Clientes, Tarefas, Relatórios, Configurações)
- **Header** — breadcrumb, notificações, avatar com menu e toggle dark/light

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
| Tema | next-themes |
| Toasts | Sonner |
| Date picker | react-day-picker + date-fns |
| Dados | Mock estático (sem API) |

---

## Pré-requisitos

- Node.js 18 ou superior
- npm, pnpm ou yarn

---

## Instalação

### 1. Clone ou copie o projeto

```bash
# Se estiver clonando de um repositório
git clone <url-do-repo>
cd saas-dashboard

# Ou entre diretamente na pasta
cd saas-dashboard
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Instale os componentes shadcn/ui

O projeto usa o shadcn CLI para gerar os componentes base em `components/ui/`. Execute o comando abaixo na raiz do projeto:

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
│   ├── layout.tsx           # Root layout: ThemeProvider, Toaster, Geist font
│   ├── page.tsx             # Rota "/" — página Visão Geral
│   └── globals.css          # CSS variables (dark/light), reset, densidade
│
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx      # Sidebar colapsável com tooltips e overlay mobile
│   │   ├── header.tsx       # Breadcrumb, sino, avatar dropdown, theme switch
│   │   └── main-layout.tsx  # Shell responsivo que une sidebar + header + main
│   │
│   ├── dashboard/
│   │   ├── metric-cards.tsx   # 4 KPI cards: skeleton 1.5s → sparkline + variação %
│   │   ├── clients-table.tsx  # Tabela densa: sort, seleção múltipla, paginação
│   │   └── table-filters.tsx  # Busca, status, plano, date range picker
│   │
│   ├── sparkline.tsx        # Componente SVG puro — sem biblioteca de gráficos
│   └── ui/                  # Componentes gerados pelo shadcn CLI
│
├── lib/
│   ├── types.ts             # Interfaces e tipos TypeScript
│   ├── mock-data.ts         # 18 clientes + 4 métricas com séries de tendência
│   └── utils.ts             # cn(), slaColor(), formatMRR(), STATUS_COLORS…
│
├── providers/
│   └── theme-provider.tsx   # Wrapper do next-themes
│
├── components.json          # Configuração do shadcn/ui
├── tailwind.config.ts       # Tema Tailwind com CSS variables
├── tsconfig.json
├── next.config.mjs
└── package.json
```

---

## Funcionalidades

### Cards de métricas
- 4 KPIs: Clientes ativos, Tarefas abertas, SLA em risco, NPS médio
- **Skeleton loading** de 1.5s simulando chamada de API
- **Sparkline SVG** de 7 pontos com área preenchida — verde para tendência positiva, vermelho para negativa
- Variação percentual vs. período anterior com seta direcional
- Semântica de cor invertida para métricas onde aumento é negativo (ex: "SLA em risco")

### Tabela de clientes
- **18 clientes mock** com dados realistas
- **Ordenação** por todas as colunas — clique alterna asc/desc, `aria-sort` para screen readers
- **Seleção múltipla** com checkbox indeterminate e barra de ação em bulk
- **Filtros combinados:** busca por texto, dropdown de status, dropdown de plano, date range picker
- **SLA progress bar** com transição de cor: verde (< 60%) → âmbar (60–80%) → vermelho (> 80%)
- **Ações rápidas** por linha: atribuir tarefa, registrar contato, ver detalhes, remover
- **Toast de confirmação** (Sonner) ao executar qualquer ação rápida
- **Paginação** com ellipsis dinâmico e seletor de linhas por página (10 / 20 / 50)
- Scroll horizontal automático em telas pequenas

### Sidebar
- Colapsável em desktop (ícones + tooltips no modo recolhido)
- Overlay com backdrop em mobile (aberta via hamburger no header)
- Estado ativo por rota com `aria-current="page"`

### Header
- Breadcrumb com `aria-label="Localização atual"`
- Sino de notificações com badge de contagem
- Toggle dark/light usando `Switch` do Radix — label dinâmico para screen readers
- Dropdown do usuário com avatar, nome, e-mail e ações

### Tema
- **Dark mode como padrão**
- Toggle no header troca instantaneamente para light mode
- Paleta: zinc/slate como base, indigo como cor primária de ação, emerald para positivo, amber para alerta, red para crítico

---

## Acessibilidade

O projeto foi construído com WCAG AA como requisito:

| Recurso | Implementação |
|---|---|
| Labels em inputs | `aria-label` em todos os controles sem `<label>` visível |
| Navegação por teclado | Todos os elementos interativos alcançáveis via Tab, com `focus-visible` visível |
| Ordenação | `aria-sort="ascending/descending/none"` nos cabeçalhos da tabela |
| Loading | `aria-live="polite"` + `aria-busy` nos cards durante skeleton |
| Progresso | `role="progressbar"` com `aria-valuenow/min/max` nas barras de SLA |
| Paginação | `aria-current="page"` no botão de página ativa, `aria-label` em cada botão |
| Sparklines | `aria-hidden="true"` — decorativas, valor numérico já presente no card |
| Breadcrumb | `<nav aria-label="Localização atual">` com `aria-current="page"` no último item |
| Sidebar | `<aside aria-label="Navegação principal">` |
| Theme toggle | `aria-label` descritivo no Switch explicando a ação |
| Ícones | `aria-hidden="true"` em todos os ícones decorativos |

---

## Personalização

### Adicionar novos clientes mock

Edite [`lib/mock-data.ts`](lib/mock-data.ts) e adicione objetos ao array `MOCK_CLIENTS` seguindo a interface `Client` definida em [`lib/types.ts`](lib/types.ts).

### Alterar thresholds do SLA

Em [`lib/utils.ts`](lib/utils.ts), ajuste a função `slaColor`:

```ts
export function slaColor(consumed: number): string {
  if (consumed >= 80) return "bg-red-500"   // crítico
  if (consumed >= 60) return "bg-amber-500" // alerta
  return "bg-emerald-500"                   // seguro
}
```

### Adicionar novas rotas à sidebar

Em [`components/layout/sidebar.tsx`](components/layout/sidebar.tsx), adicione um item ao array `NAV_ITEMS`:

```ts
{ href: "/nova-rota", label: "Nova Seção", icon: IconName }
```

### Trocar a paleta de cores primária

Em [`app/globals.css`](app/globals.css), altere o valor de `--primary` (e `--ring`) nas seções `:root` e `.dark`. O valor é em formato HSL.

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
O shadcn toast usa `useToast` + `<Toaster>` baseado em estado global, o que exige um provider adicional. O Sonner expõe uma API imperativa (`toast.success(...)`) mais ergonômica para ações rápidas em tabela.

**Por que sparkline SVG puro?**
Evita a inclusão de Recharts ou Victory (pacotes pesados) para um elemento puramente decorativo. O componente tem < 50 linhas e produz resultado visual equivalente.

**Por que `react-day-picker` e não um date picker customizado?**
É a dependência do componente `Calendar` do próprio shadcn/ui — zero dependência extra, comportamento acessível (navegação por teclado, ARIA) já testado.

**Densidade compacta**
O `--radius` global foi definido como `0.375rem` (rounded-md) para manter cantos sutis. Alturas de linha e padding foram reduzidos em relação ao padrão shadcn para caber mais informação na viewport sem scroll.

---

## Licença

MIT
