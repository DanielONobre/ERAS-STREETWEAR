# REBRAND AUDIT — Vertex Urban Style → ERAS STREETWEAR
> Gerado em: 2026-05-01 | Sub-fase 1.1 — Discovery
> Escopo: repositório inteiro excluindo `node_modules`, `vendor`, `.git`, `storage/logs`, `public/build`

---

## 1. OCORRÊNCIAS DE "vertex" / "Vertex" / "VERTEX"

### 1.1 Arquivos PHP — Services, Notifications, Middleware

| Arquivo | Linha | Trecho |
|---|---|---|
| `app/Http/Middleware/HandleInertiaRequests.php` | 66 | `'og_site_name' => 'Vertex Urban Style'` |
| `app/Http/Middleware/HandleInertiaRequests.php` | 69 | `'twitter_site' => '@vertexurban'` |
| `app/Notifications/OrderConfirmed.php` | 25 | `' confirmado — Vertex Urban Style'` |
| `app/Notifications/OrderShipped.php` | 25 | `' foi enviado! — Vertex Urban Style'` |
| `app/Notifications/OrderDelivered.php` | 25 | `'entregue! Deixe sua avaliação — Vertex'` |
| `app/Notifications/PasswordReset.php` | 29 | `'Redefinição de senha — Vertex Urban Style'` |
| `app/Services/PaymentService.php` | 90 | `$pixKey = '00020126580014BR.GOV.BCB.PIX0136vertex-'` |
| `app/Services/PaymentService.php` | 253 | `$merchantName = 'VERTEX URBAN STYLE'` |
| `app/Services/OrderService.php` | 252 | `"  VERTEX URBAN STYLE — PEDIDO #{$order->id}"` |
| `config/services.php` | 29 | `'from_name' => env('...', 'Vertex Urban Style')` |
| `config/services.php` | 30 | `'from_email' => env('...', 'logistica@vertexurbanstyle.com.br')` |
| `config/supervisor/vertex-worker.conf` | 1 | `[program:vertex-worker]` |
| `config/supervisor/vertex-worker.conf` | 3 | `command=php /var/www/vertex-urban-style/artisan...` |
| `config/supervisor/vertex-worker.conf` | 14 | `[program:vertex-scheduler]` |

### 1.2 Arquivos Blade (.blade.php)

| Arquivo | Linha | Trecho |
|---|---|---|
| `resources/views/app.blade.php` | 9 | `config('app.name', 'Vertex Urban Style')` |
| `resources/views/app.blade.php` | 24 | `content="Vertex Urban Style"` (og:site_name) |
| `resources/views/app.blade.php` | 33 | `content="@vertexurban"` (twitter:site) |
| `resources/views/emails/layout.blade.php` | 6 | `$subject ?? 'Vertex Urban Style'` |
| `resources/views/emails/layout.blade.php` | 232 | `<div class="logo">Vertex<span>.</span></div>` |
| `resources/views/emails/layout.blade.php` | 254 | `<div class="footer-brand">Vertex Urban Style</div>` |
| `resources/views/emails/layout.blade.php` | 256 | `© {{ date('Y') }} Vertex Urban Style.` |
| `resources/views/pdf/invoice.blade.php` | 66 | `<div class="logo">Vertex<span>.</span></div>` |
| `resources/views/pdf/invoice.blade.php` | 170 | `contato@vertexurbanstyle.com.br` |
| `resources/views/errors/503.blade.php` | 6 | `<title>Em Manutenção — Vertex Urban Style</title>` |
| `resources/views/errors/503.blade.php` | 69 | `<span class="logo">VERTEX<span>.</span></span>` |
| `resources/views/errors/503.blade.php` | 91 | `© {{ date('Y') }} Vertex Urban Style` |
| `resources/views/errors/500.blade.php` | 6 | `<title>500 — Erro interno — Vertex Urban Style</title>` |
| `resources/views/errors/500.blade.php` | 92 | `<a href="/" class="logo">VERTEX<span>.</span></a>` |
| `resources/views/errors/500.blade.php` | 104 | `© {{ date('Y') }} Vertex Urban Style` |

### 1.3 Componentes React/JSX/TSX

| Arquivo | Linha | Trecho |
|---|---|---|
| `resources/js/app.jsx` | 9 | `\|\| 'Vertex Urban Style'` (VITE_APP_NAME fallback) |
| `resources/js/Layouts/AdminLayout.jsx` | 116 | `VERTEX` (logo text) |
| `resources/js/Layouts/AdminLayout.jsx` | 179 | `admin@vertex.com` (hardcoded email no layout) |
| `resources/js/Layouts/AdminLayout.jsx` | 367 | `'Admin — Vertex Urban Style'` (title fallback) |
| `resources/js/Layouts/StoreLayout.jsx` | 26 | `\`${title} — VERTEX\`` |
| `resources/js/Components/Navbar.jsx` | 126 | `<strong>VERTEX299</strong>` (banner frete grátis) |
| `resources/js/Components/Navbar.jsx` | 399 | `VERTEX` (logo) |
| `resources/js/Components/Navbar.jsx` | 565 | `VERTEX` (logo mobile) |
| `resources/js/Components/Navbar.jsx` | 611 | `VERTEX` (logo outro estado) |
| `resources/js/Components/Layout/Footer.jsx` | 17 | `{ label: 'Sobre a Vertex', href: '#' }` |
| `resources/js/Components/Layout/Footer.jsx` | 35 | `VERTEX` (logo) |
| `resources/js/Components/Layout/Footer.jsx` | 87 | `© {year} Vertex Urban Style` |
| `resources/js/Components/UI/CookieConsent.jsx` | 6 | `const STORAGE_KEY = 'vertex_cookie_consent'` |
| `resources/js/Components/UI/WhatsAppButton.jsx` | 5 | `'...produtos da Vertex Urban Style...'` |
| `resources/js/Components/SEO/PageSEO.jsx` | 16 | `'Vertex Urban Style — Streetwear'` (title padrão) |
| `resources/js/Components/SEO/ProductSEO.jsx` | 12 | `\| Vertex Urban Style` (title) |
| `resources/js/Components/SEO/ProductSEO.jsx` | 39 | `name: 'Vertex Urban Style'` (schema.org seller) |
| `resources/js/Pages/Home.jsx` | 116 | `<title>Vertex Urban Style — Vista sua atitude</title>` |
| `resources/js/Pages/Home.jsx` | 118 | `og:title Vertex Urban Style — Vista sua atitude` |
| `resources/js/Pages/Home.jsx` | 341 | `@vertexurbanstyle` (Instagram handle) |
| `resources/js/Pages/Home.jsx` | 387 | `Seguir @vertexurbanstyle` |
| `resources/js/Pages/Products/Index.jsx` | 54-59 | SEO com Vertex Urban Style |
| `resources/js/Pages/Products/Show.jsx` | 179 | `Vertex Urban Style` (share text) |
| `resources/js/Pages/Products/Show.jsx` | 221-222 | SEO titles com Vertex |
| `resources/js/Pages/Cart/Index.jsx` | 69 | `Carrinho — Vertex Urban Style` |
| `resources/js/Pages/Cart/Index.jsx` | 82 | `Carrinho ({n}) — Vertex Urban Style` |
| `resources/js/Pages/Checkout/Index.jsx` | 64 | `const PIX_CODE = 'VERTEX00010126BRBR...'` |
| `resources/js/Pages/Checkout/Index.jsx` | 156 | `Checkout — Vertex Urban Style` |
| `resources/js/Pages/Checkout/Index.jsx` | 457 | `Vertex Card` (label no formulário) |
| `resources/js/Pages/Checkout/Success.jsx` | 91-92 | `Pedido confirmado — Vertex Urban Style` |
| `resources/js/Pages/Search/Index.jsx` | 30-31 | `Busca VERTEX` / `na VERTEX.` |
| `resources/js/Pages/Account/Dashboard.jsx` | 19 | `Minha conta — VERTEX` |
| `resources/js/Pages/Account/Dashboard.jsx` | 24 | `sua conta VERTEX.` |
| `resources/js/Pages/Admin/Products/Form.jsx` | 136 | `vertexurbanstyle.com.br/produtos/...` |
| `resources/js/Pages/Admin/Products/Form.jsx` | 211 | `— Vertex Urban Style` (meta_title default) |
| `resources/js/Pages/Admin/Settings.jsx` | 112 | `'Vertex Urban Style'` (store_name default) |
| `resources/js/Pages/Admin/Settings.jsx` | 272-275 | Placeholders `@vertex_urban`, `@vertexurban` |
| `resources/js/Pages/Admin/Settings.jsx` | 375 | `placeholder="Vertex Urban Style"` |
| `resources/js/Pages/Admin/Settings.jsx` | 379 | `placeholder="noreply@vertexurban.com.br"` |

### 1.4 Migrations

Nenhuma ocorrência de "Vertex" encontrada em migrations. As migrations são estruturais (tabelas, colunas) sem referência à marca.

### 1.5 Seeders e Factories

| Arquivo | Linha | Trecho |
|---|---|---|
| `database/seeders/DatabaseSeeder.php` | 14 | `// Marcas (Vertex, NovaMesh, GradeZero...)` |
| `database/seeders/DatabaseSeeder.php` | 16 | `// admin@vertex.com + cliente@teste.com` |
| `database/seeders/DatabaseSeeder.php` | 17 | `// VERTEX10, FRETEGRATIS, BEMVINDO20` |
| `database/seeders/BrandSeeder.php` | 14 | `'name' => 'Vertex'` |
| `database/seeders/BrandSeeder.php` | 15 | `'slug' => 'vertex'` |
| `database/seeders/BrandSeeder.php` | 17 | `'description' => '...Vertex Urban Style...'` |
| `database/seeders/UserSeeder.php` | 15 | `'name' => 'Admin Vertex'` |
| `database/seeders/UserSeeder.php` | 16 | `'email' => 'admin@vertex.com'` |
| `database/seeders/CouponSeeder.php` | 14 | `'code' => 'VERTEX10'` |
| `database/seeders/SettingsSeeder.php` | 13 | `'store_name' => 'Vertex Urban Style'` |
| `database/seeders/SettingsSeeder.php` | 14 | `'store_email' => 'contato@vertexurban.com.br'` |
| `database/seeders/SettingsSeeder.php` | 24-28 | Social handles `@vertexurbanstyle`, `@vertexurban` |
| `database/seeders/SettingsSeeder.php` | 28 | `'meta_title' => 'Vertex Urban Style — Streetwear...'` |
| `database/seeders/SettingsSeeder.php` | 32 | `'orders_email' => 'pedidos@vertexurban.com.br'` |
| `database/seeders/ProductSeeder.php` | 46-48 | `brand_slug: 'vertex'`, `Camiseta Oversized Vertex Logo` |
| `database/seeders/ProductSeeder.php` | 54 | `bordado tonal do logo Vertex` (description) |
| `database/seeders/ProductSeeder.php` | 62 | `meta_title: 'Camiseta Oversized Vertex Logo \| Streetwear'` |
| `database/seeders/ProductSeeder.php` | 127-392 | ~8 produtos adicionais com "Vertex" no nome/slug |

### 1.6 Arquivos de Configuração

| Arquivo | Linha | Trecho |
|---|---|---|
| `composer.json` | 2 | `"name": "vertex/urban-style"` |
| `composer.json` | 4 | `"description": "Vertex Urban Style - E-commerce..."` |
| `.env.example` | 1 | `APP_NAME="Vertex Urban Style"` |
| `.env.example` | 25 | `DB_DATABASE=vertex_urban_style` |
| `.env.example` | 40 | `CACHE_PREFIX=vertex_` |
| `.env.example` | 55 | `MAIL_FROM_ADDRESS="noreply@vertexurban.com.br"` |

### 1.7 CSS / Tailwind Config

Nenhuma ocorrência de "vertex" encontrada em `tailwind.config.js` ou `resources/css/app.css`.
As cores atuais usam as chaves `primary`, `accent`, `dark` — **não há nenhum token `vertex-*`** neste projeto.

> **NOTA:** O pedido de "manter as cores antigas (vertex-*)" não se aplica aqui, pois essas chaves simplesmente não existem. Os tokens atuais são `primary` (teal) e `accent` (laranja). A coexistência temporária pedida está sendo feita adicionando os novos tokens `eras-*` ao lado dos existentes sem remover nada.

### 1.8 Comentários e Docblocks

| Arquivo | Linha | Trecho |
|---|---|---|
| `app/Services/PaymentService.php` | 90 | `// pixKey com 'vertex-' prefixo` |
| `app/Services/PaymentService.php` | 253 | `$merchantName = 'VERTEX URBAN STYLE'` |
| `resources/docs/api.md` | 1 | `# Vertex Urban Style — Documentação...` |
| `resources/docs/api.md` | 3 | `Base URL: https://vertexurbanstyle.com.br` |
| `README.md` | 1 | `# Vertex Urban Style` |
| `README.md` | 103+ | Referências de setup com branding Vertex |
| `public/site.webmanifest` | 2-3 | `"name": "Vertex Urban Style"`, `"short_name": "Vertex"` |
| `public/robots.txt` | 20 | `Sitemap: https://vertexurbanstyle.com.br/sitemap.xml` |

---

## 2. CUPONS HARDCODED

| Código | Arquivo | Linha | Regras |
|---|---|---|---|
| `VERTEX10` | `database/seeders/CouponSeeder.php` | 14 | 10% desconto, mínimo R$150, usos ilimitados |
| `FRETEGRATIS` | `database/seeders/CouponSeeder.php` | 27 | Frete grátis, sem valor mínimo, usos ilimitados |
| `BEMVINDO20` | `database/seeders/CouponSeeder.php` | 40 | 20% desconto, 1 uso por cliente, expira em 30 dias |
| `VERTEX10` | `resources/docs/api.md` | 217, 301 | Mencionado em exemplos da documentação da API |
| `VERTEX15` | `resources/docs/api.md` | 450 | Mencionado em exemplos da documentação da API |

---

## 3. CREDENCIAIS ADMIN HARDCODED

| Dado | Arquivo | Linha | Valor |
|---|---|---|---|
| Email admin | `database/seeders/UserSeeder.php` | 16 | `admin@vertex.com` |
| Senha admin | `database/seeders/UserSeeder.php` | 18 | `'password'` (hash de "password") — ⚠️ fraca |
| Email cliente teste | `database/seeders/UserSeeder.php` | ~30 | `cliente@teste.com` |
| Email admin (layout) | `resources/js/Layouts/AdminLayout.jsx` | 179 | `admin@vertex.com` hardcoded no JSX |

---

## 4. STACK ATUAL CONFIRMADA

### composer.json
- **PHP:** `^8.2`
- **Laravel:** `^11.0`
- **Inertia (servidor):** `inertiajs/inertia-laravel ^2.0`

### package.json
- **Node:** não especificado no package.json (recomendado: 20 LTS)
- **React:** `^18.3.1`
- **Inertia (cliente):** `@inertiajs/react ^2.0.0`
- **Vite:** `^6.2.4`
- **Tailwind CSS:** `^3.4.1`
- **TypeScript:** não utilizado (stack é `.js` / `.jsx`)

### Dependências frontend relevantes
- `framer-motion ^12.6.5` — animações
- `@headlessui/react ^2.2.0` — componentes acessíveis
- `@heroicons/react ^2.2.0` — ícones
- `lucide-react ^0.487.0` — ícones adicionais
- `axios ^1.8.4` — HTTP client
- `swiper ^11.2.6` — carrossel
- `react-hot-toast ^2.5.2` — notificações

---

## 5. DÉBITOS TÉCNICOS VISÍVEIS DURANTE O SCAN

| Arquivo | Linha | Tipo | Descrição |
|---|---|---|---|
| `app/Services/PaymentService.php` | 86 | `TODO` | Integrar Pix real (Gerencianet, Asaas ou PagSeguro) — atualmente mock |
| `app/Services/PaymentService.php` | 114 | `TODO` | Integrar boleto real (Stripe Boleto, Asaas ou PagSeguro) — atualmente mock |
| `app/Services/ShippingService.php` | 114 | `TODO` | Descomentar integração Melhor Envio quando tiver credenciais |
| `resources/js/Layouts/AdminLayout.jsx` | 179 | HARDCODE | Email `admin@vertex.com` hardcoded no JSX do layout (deveria vir de props/auth) |
| `resources/js/Pages/Checkout/Index.jsx` | 64 | HARDCODE | `PIX_CODE` com prefixo "VERTEX" hardcoded no frontend |

---

## SUMÁRIO QUANTITATIVO

| Categoria | Arquivos afetados | Ocorrências aprox. |
|---|---|---|
| PHP (services, middleware, notifications, config) | 9 | ~20 |
| Blade templates | 5 | ~18 |
| React/JSX componentes e páginas | ~25 | ~60 |
| Seeders e factories | 6 | ~35 |
| Migrations | 0 | 0 |
| Config (composer.json, .env.example) | 2 | 5 |
| CSS / Tailwind | 0 | 0 |
| Docs, README, manifests | 4 | ~15 |
| **TOTAL** | **~51 arquivos** | **~153 ocorrências** |

---

## OBSERVAÇÕES PARA SUB-FASE 1.2

1. **Não existem tokens `vertex-*`** no Tailwind — a instrução de coexistência se aplica aos tokens `primary`/`accent` atuais, que serão substituídos gradualmente pelos `eras-*`.
2. **Font families já têm `display` e `body`** definidos (Syne/DM Sans). Na Sub-fase 1.1 os valores foram atualizados para Space Grotesk/Inter, mantendo as chaves. Confirmar se as fontes antigas devem permanecer como fallback nomeado (ex: `font-syne`) ou podem ser descartadas.
3. **`admin@vertex.com` aparece hardcoded no JSX** (`AdminLayout.jsx:179`) além do seeder — precisa de atenção extra na Sub-fase de substituição.
4. **Supervisor config** (`config/supervisor/vertex-worker.conf`) tem paths absolutos com `/var/www/vertex-urban-style/` — trocar junto com o rename do diretório de deploy.
5. **`vertex_cookie_consent`** é uma chave de localStorage — usuários que já acessaram o site precisarão aceitar cookies novamente após o rename (ou migrar a chave via JS).
