# RESPONSIVE AUDIT — ERAS STREETWEAR
Data: 2026-05-02 | Stack: React 18 + Tailwind CSS + Inertia.js | Viewports auditados: 375px (iPhone 13 mini) e 768px (iPad)

---

## METODOLOGIA

Auditoria estática por leitura direta de código JSX. Cada arquivo foi lido integralmente e as classes Tailwind foram
analisadas contra os breakpoints do projeto (xs:480, sm:640, md:768, lg:1024, xl:1280). Nenhuma ferramenta de browser
foi usada. Problemas são inferidos a partir de classes e tamanhos fixos presentes no código.

---

## VIEWPORT 375px (Mobile — iPhone)

### 🔴 CRÍTICO — Bloqueia uso

- **ProductCard: wishlist e "Adicionar" invisíveis em touch** (`ProductCard.jsx:120,159`) — botões têm `opacity-0 group-hover:opacity-100`. Em dispositivos touch não há hover. O usuário em 375px não consegue adicionar produto ao carrinho nem salvar nos favoritos a partir do grid. O fluxo de compra exige navegar à página do produto.
- **Home newsletter form: input esmagado** (`Home.jsx:354–367`) — `flex gap-3` com botão `flex-shrink-0` e texto "QUERO SER AVISADO" (~17 chars). Em 375px, o botão ocupa ~160px, o input fica com ~175px — digitável mas extremamente apertado.
- **`w-38` inválido no Tailwind** (`Admin/Orders/Index.jsx:128,134`) — classe `w-38` não existe no Tailwind default nem na extensão de `spacing` do projeto. O compilador ignora. Inputs de data renderizam com largura nativa do browser (imprevisível, pode causar overflow no flex container de filtros no admin).

### 🟡 IMPORTANTE — Compromete experiência

- **Qty controls 32×32px** (`Cart/Index.jsx:150,160`) — botões de quantidade `w-8 h-8` = 32×32px. WCAG requer 44×44px mínimo para touch target. Em 375px há risco de toque acidental entre `−` e `+`.
- **Hero heading overflow** (`Home.jsx:164`) — `text-5xl` = 48px. Em 375px com `max-w-2xl`, título como "ATITUDE NÃO É TENDÊNCIA." quebra para ~2 palavras por linha, empurrando botões CTA para baixo. A altura `min(90vh, 720px)` absorve, mas em iPhone SE (375×667) o viewport é curto — os botões podem ficar cortados acima do scroll.
- **Instagram grid muito denso** (`Home.jsx:370`) — `grid-cols-3 gap-2`. Em 375px: (375 - 32px container-page padding - 2×8px gap) ÷ 3 ≈ **103px** por célula. Imagens quadradas de 103px são muito pequenas para identificar conteúdo visual. `gap-2 sm:gap-3` é correto mas a base deveria ser `grid-cols-2 sm:grid-cols-3`.
- **Admin bottom nav touch target pequeno** (`AdminLayout.jsx:331`) — `py-2` em cada item = 8px top+bottom. Com ícone `w-5 h-5` (20px) + label `text-[10px]` (~12px) + paddings: total ≈ **40px** de altura. Abaixo dos 44px WCAG.
- **Checkout Manifesto.jsx scroll body** (`Checkout/Index.jsx`) — não foi possível auditar completamente (arquivo > 150 linhas lidas). Reportado como não auditado — ver nota na seção de impossibilidades.

### 🟢 POLISH — Melhoria estética

- **Navbar logo font** (`Navbar.jsx:51`) — `text-xl` no logo ERAS. Em 375px com 4 ícones à direita (busca, usuário, carrinho, hamburger), o logo fica pequeno. Considerar `text-2xl`.
- **Footer newsletter form** (`Footer.jsx:107–123`) — botão "ENTRAR" é curto o suficiente para não quebrar, mas o input fica com ~200px. OK funcional, mas poderia ser `flex-col xs:flex-row` para empilhar em 375px e alinhar lado a lado em 480px+.
- **SectionHeader "Ver todos" link** (`Home.jsx:428`) — no header de seção, texto + ícone alinha com `flex items-end justify-between`. Em 375px, se o título de seção for longo, o link pode ficar muito próximo ou sobrepor. Não crítico mas vale verificar com conteúdo real.
- **ProductCard: nome truncado em 2 linhas** (`ProductCard.jsx:229`) — `line-clamp-2` funciona bem, mas em 375px com grid de 2 cols (~168px de largura por card), nomes longos como "Camisa Manga Curta Quintal" ficam cortados após 2 linhas sem elipse visível em alguns browsers.

---

## VIEWPORT 768px (Tablet — iPad)

### 🔴 CRÍTICO — Bloqueia uso

- **Products/Show: layout mono-coluna no tablet** (`Products/Show.jsx:242`) — `grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16`. Em 768px o produto mostra imagem full-width em cima, depois toda a info abaixo — layout de 1 coluna. Isso força scroll excessivo para chegar nos botões de CTA ("LEVAR PRA MIM", "Comprar Agora") que ficam abaixo de uma imagem 768px de altura. Corrigir para `md:grid-cols-2`.
- **Cart: resumo empilhado no tablet** (`Cart/Index.jsx:94`) — `grid-cols-1 lg:grid-cols-3 gap-8`. Em 768px, o resumo do pedido ("FECHAR PEDIDO") aparece somente após todos os itens do carrinho. Em tablet há espaço de sobra para side-by-side. Corrigir para `md:grid-cols-3` ou `md:grid-cols-[1fr_auto]`.

### 🟡 IMPORTANTE — Compromete experiência

- **Admin Dashboard KPI: 2 cols em 768px** (`Admin/Dashboard.jsx:148`) — `grid-cols-2 lg:grid-cols-4`. Em 768px continua em 2 cols quando cabem 4 KPI cards lado a lado. Corrigir para `sm:grid-cols-4` ou `md:grid-cols-4`.
- **Admin Dashboard charts: mono-coluna até 1280px** (`Admin/Dashboard.jsx:154`) — `xl:grid-cols-3`. Gráfico de vendas e "MAIS VENDIDOS" ficam empilhados em 768px. Em tablet o gráfico ocupa 100% de largura com muita área vazia — corrigir para `lg:grid-cols-3`.
- **ProductCard: sem touch alternativo em 768px** (`ProductCard.jsx:120`) — mesmo problema do 375px. Tablet iPad é dispositivo touch; os botões de adicionar e wishlist só aparecem no hover CSS, que não existe em touch.
- **Admin Products: tabela com 7 colunas em 768px** (`Admin/Products/Index.jsx`) — tabela com `overflow-x-auto` é funcional mas requer scroll horizontal em 768px. Nenhuma coluna está marcada para esconder em telas menores (`hidden md:table-cell`, etc).
- **Filter drawer em 768px tem 320px** (`Products/Index.jsx:217`) — `w-80` = 320px. Em 768px isso ocupa 42% do viewport com backdrop, aceitável mas heavy. Considerar `md:w-72`.

### 🟢 POLISH — Melhoria estética

- **Footer: 4 colunas com `gap-8` em 768px** (`Footer.jsx:12`) — `md:grid-cols-4 gap-8 lg:gap-12`. Em 768px, 4 colunas com apenas 32px de gap ficam espremidas. Gap só aumenta em lg (1024px). Considerar `md:gap-6 lg:gap-12`.
- **Manifesto: `max-w-2xl` sem md: ajuste** (`Manifesto.jsx:15`) — em 768px o texto ocupa `max-w-2xl` (672px) de 768px. OK, mas `container-page` adiciona padding lateral, resultando em ~608px de texto — boa legibilidade, sem problema real.
- **Admin topbar breadcrumb overflow** (`AdminLayout.jsx:205`) — breadcrumbs com `flex-1 min-w-0` e texto com `truncate`. Em 768px com muitos segmentos de breadcrumb, podem truncar cedo. Cosmético.

---

## RESUMO POR PÁGINA

| Página | 375px | 768px | Prioridade |
|---|---|---|---|
| Home | 2 críticos, 3 importantes | 1 importante | ALTA |
| Catálogo (Products/Index) | 0 críticos, 1 importante | 1 importante | MÉDIA |
| Produto (Products/Show) | 0 críticos, 1 importante | 1 crítico | ALTA |
| Carrinho (Cart/Index) | 0 críticos, 2 importantes | 1 crítico | ALTA |
| Checkout (Checkout/Index) | não auditado completamente | não auditado completamente | — |
| Login / Cadastro | 0 críticos, 0 importantes | 0 críticos | BAIXA |
| Manifesto | 0 críticos, 0 importantes | 0 críticos | BAIXA |
| Painel Admin (Dashboard) | 0 críticos, 1 importante | 2 importantes | MÉDIA |
| Admin Produtos (Index) | 0 críticos, 1 importante | 1 importante | MÉDIA |
| Admin Pedidos (Index) | 1 crítico (`w-38`), 0 importantes | 1 importante | ALTA |
| Navbar | 0 críticos, 0 importantes | — | BAIXA |
| Footer | 0 críticos, 0 importantes | 1 polish | BAIXA |
| ProductCard | 1 crítico (hover-only) | 1 crítico (idem) | ALTA |

---

## QUEBRAS COMUNS IDENTIFICADAS

1. **`opacity-0 group-hover:opacity-100` em ações críticas** — ProductCard usa hover CSS para exibir "Adicionar ao carrinho" e wishlist. Touch devices não disparam hover. Afeta todos os grids de produto (home featured, catálogo, related, new arrivals). Solução padrão: exibir sempre em mobile (`group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100`), ou substituir por tap/long-press.

2. **Ausência do breakpoint `md:` (768px) em grids de layout** — Padrão recorrente: `grid-cols-1 lg:grid-cols-N`. Salto direto de mobile para desktop ignora tablet. Afeta: `Products/Show` (galeria + info), `Cart/Index` (items + summary), `Admin/Dashboard` (charts), `Admin/Dashboard` (KPIs). Custo de correção baixo: trocar `lg:` por `md:` na maioria dos casos.

3. **Touch targets abaixo de 44px** — `w-8 h-8` (32px) em qty controls do Cart, botões de paginação do admin, e admin bottom nav (~40px). WCAG 2.1 SC 2.5.5 exige 44×44px. Correção: `w-11 h-11` ou padding aumentado.

4. **Tabelas sem estratégia mobile além de `overflow-x-auto`** — Admin Dashboard (pedidos recentes), Admin Orders (8 colunas), Admin Products. O `overflow-x-auto` evita quebra mas força scroll horizontal em 375–768px. Padrão de mercado: ocultar colunas secundárias (`hidden md:table-cell`) ou transformar em cards em mobile.

5. **Formulários flex com botões de texto longo** — Newsletter home ("QUERO SER AVISADO"), coupon Cart ("APLICAR CUPOM"), CEP Cart ("OK"). Botões com `flex-shrink-0` em containers `flex` comprimem o input adjacente. Correção: encurtar labels mobile (`hidden xs:inline`) ou empilhar em column abaixo de breakpoint.

---

## DÉBITOS TÉCNICOS DESCOBERTOS

- **`w-38` não é classe Tailwind válida** (`Admin/Orders/Index.jsx:128,134`) — Não está no spacing padrão (36→9rem, 40→10rem) nem na extensão do projeto. O compilador produz CSS sem essa regra. Usar `w-36` ou `w-40`, ou criar extensão `'38': '9.5rem'` no tailwind.config.js.
- **Cores hardcoded no `AreaChart`** (`Admin/Dashboard.jsx:176,180,204`) — gradientes usam `#0d9488` (teal Vertex) no lugar de `#C8932E` (mustard ERAS). Remanescente do rebranding que não chegou nos gráficos Recharts.
- **`hero-pattern` URL hardcoded** (`tailwind.config.js:115`) — `backgroundImage: { 'hero-pattern': "url('/images/hero-bg.webp')" }`. Arquivo `hero-bg.webp` não existe. Qualquer uso de `bg-hero-pattern` renderiza sem imagem.
- **`xs: 480px` breakpoint definido mas não utilizado** — Nenhum dos arquivos auditados usa prefixo `xs:`. O breakpoint está configurado mas morto. Oportunidade: usar em formulários de newsletter e footer que precisam de estado intermediário entre 375px e 640px.

---

## RECOMENDAÇÕES DE TAILWIND CONFIG

**O que está bom:**
- Breakpoints padrão (sm/md/lg/xl) presentes e corretos.
- `xs: 480px` custom é uma boa adição — mas precisa ser usada.
- Paleta ERAS corretamente definida.
- Plugin `@tailwindcss/forms` com `strategy: 'class'` — correto para não contaminar styles globais.

**O que precisa ajuste:**

1. **Adicionar `'38': '9.5rem'` no spacing** para validar `w-38` que já está em uso no código:
   ```js
   spacing: {
     '18': '4.5rem',
     '38': '9.5rem',  // ← adicionar
     '88': '22rem',
     '128': '32rem',
   }
   ```

2. **Corrigir ou remover `hero-pattern`** — arquivo não existe. Ou remover da config, ou criar o arquivo.

3. **Documentar `xs:`** — adicionar comentário no config indicando que `xs: 480px` existe para formulários em linha e newsletter.

---

## PÁGINAS NÃO AUDITADAS

- **`Checkout/Index.jsx`** — arquivo longo (~500+ linhas). Leitura parcial (150 linhas). Estrutura de steps identificada (Entrega → Pagamento → Confirmação), mas formulário de cartão, endereço e confirmação não foram auditados. **Recomendação:** auditar separadamente na sub-fase 2.2 antes de corrigir.
- **`Account/*` (Dashboard, Orders, Addresses, Wishlist, Profile)** — não lidos nesta fase por limitação de volume de leitura. Auditar na 2.2.
- **`CartDrawer.jsx` / `MiniCart.jsx`** — drawer lateral do carrinho. Não lido. Provavelmente usa `fixed right-0 top-0 bottom-0 w-80` ou similar — padrão com risco de overflow em 375px.
