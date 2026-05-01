# Vertex Urban Style

E-commerce de moda streetwear construído com **Laravel 11 + React 18 + Inertia.js**.

---

## Requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| PHP | 8.2+ |
| Composer | 2.x |
| Node.js | 20+ |
| npm | 10+ |
| MySQL | 8.0+ (ou SQLite para dev) |
| Redis | 7+ (opcional, para cache/queue em produção) |
| PHP extensions | pdo_mysql, gd (ou imagick), zip, mbstring, openssl, curl |

> **Windows:** Use [Laragon](https://laragon.org) ou [Laravel Herd](https://herd.laravel.com) para ter PHP + MySQL + Composer prontos em minutos.

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/vertex-urban-style.git
cd vertex-urban-style
```

### 2. Instale as dependências PHP

```bash
composer install
```

### 3. Instale as dependências Node.js

```bash
npm install
```

### 4. Configure o ambiente

```bash
cp .env.example .env
php artisan key:generate
```

Edite o `.env` com seus valores (veja [Variáveis de Ambiente](#variáveis-de-ambiente)).

### 5. Execute as migrations e seeders

```bash
php artisan migrate
php artisan db:seed          # opcional: dados de demonstração
php artisan storage:link     # cria symlink public/storage → storage/app/public
```

### 6. Compile os assets frontend

```bash
npm run build      # produção
# ou
npm run dev        # modo watch (desenvolvimento)
```

---

## Como rodar em desenvolvimento

```bash
# Terminal 1 — servidor Laravel
php artisan serve

# Terminal 2 — Vite (HMR)
npm run dev

# Terminal 3 — Queue worker (emails, PDFs, estoque)
php artisan queue:work --queue=emails,default
```

Acesse: [http://localhost:8000](http://localhost:8000)

### Debugbar

O [Laravel Debugbar](https://github.com/barryvdh/laravel-debugbar) é ativado automaticamente em `APP_ENV=local`. Para desativar:

```
DEBUGBAR_ENABLED=false
```

---

## Variáveis de Ambiente

Copie `.env.example` e preencha os valores:

### Aplicação

```env
APP_NAME="Vertex Urban Style"
APP_ENV=local                    # local | production
APP_KEY=                         # gerado via php artisan key:generate
APP_DEBUG=true                   # false em produção
APP_URL=http://localhost:8000
APP_LOCALE=pt_BR
APP_TIMEZONE=America/Sao_Paulo
```

### Banco de dados

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vertex_urban_style
DB_USERNAME=root
DB_PASSWORD=
```

Para desenvolvimento com SQLite:
```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
```

### Cache e sessão

```env
CACHE_STORE=file          # file | redis | array (testes)
SESSION_DRIVER=file       # file | redis
QUEUE_CONNECTION=database # database | redis | sync (dev)
```

### Stripe (pagamentos)

```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_KEY=pk_test_...      # exposto ao frontend
```

### Email

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@vertexurbanstyle.com.br
MAIL_FROM_NAME="Vertex Urban Style"
```

### Melhor Envio (frete)

```env
MELHOR_ENVIO_TOKEN=
MELHOR_ENVIO_SANDBOX=true
```

### Redis (opcional)

```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=null
```

---

## Deploy em Produção

### 1. Configure o servidor

- PHP 8.2 + extensões (gd/imagick, pdo_mysql, zip, mbstring, etc.)
- Nginx ou Apache com document root apontando para `/public`
- MySQL 8.0+
- Redis (recomendado para cache e queues)
- Supervisor para queue workers

### 2. Configure o `.env` de produção

```env
APP_ENV=production
APP_DEBUG=false
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### 3. Deploy

```bash
git pull origin main
composer install --optimize-autoloader --no-dev
npm ci && npm run build

php artisan migrate --force
php artisan optimize:clear
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
```

### 4. Configure o Supervisor

Copie o arquivo de configuração:

```bash
sudo cp config/supervisor/vertex-worker.conf /etc/supervisor/conf.d/vertex-worker.conf
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start vertex-worker:*
```

### 5. Configure o Nginx

```nginx
server {
    listen 80;
    server_name vertexurbanstyle.com.br www.vertexurbanstyle.com.br;
    root /var/www/vertex-urban-style/public;
    index index.php;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 1024;
}
```

---

## Testes

```bash
# Rodar todos os testes
php artisan test

# Com relatório de cobertura (requer Xdebug ou PCOV)
php artisan test --coverage

# Apenas Feature Tests
php artisan test --testsuite=Feature

# Apenas Unit Tests
php artisan test --testsuite=Unit

# Com Pest (mais legível)
vendor/bin/pest

# Pest com cobertura mínima de 70%
vendor/bin/pest --coverage --min=70
```

---

## Estrutura do Projeto

```
app/
├── Http/
│   ├── Controllers/          # Storefront + Admin + Auth
│   ├── Middleware/           # AdminMiddleware, SecurityHeadersMiddleware, HandleInertiaRequests
│   └── Requests/             # Form Requests por domínio (Product/, Order/, Checkout/, Review/)
├── Models/                   # Eloquent models com factories e observers
├── Policies/                 # ProductPolicy, OrderPolicy, ReviewPolicy, AddressPolicy
├── Services/                 # CartService, OrderService, PaymentService, PriceCalculatorService,
│                             # ShippingService, SearchService, ImageProcessingService
├── Jobs/                     # SendOrderEmailsJob, GenerateInvoicePdfJob, UpdateProductStockJob
├── Notifications/            # OrderConfirmed, OrderShipped, OrderDelivered, etc.
└── Observers/                # ProductObserver (invalida cache)

resources/
├── js/
│   ├── Pages/                # Componentes de página Inertia (React)
│   │   ├── Admin/            # Painel administrativo
│   │   ├── Account/          # Área do cliente
│   │   ├── Checkout/         # Fluxo de compra
│   │   └── ...               # Home, Products, Category, Search
│   ├── Components/
│   │   ├── SEO/              # ProductSEO.jsx, PageSEO.jsx (Schema.org + OG)
│   │   ├── Product/          # ProductCard, ProductGrid, FilterSidebar
│   │   └── UI/               # Badge, Modal, Toast, Pagination, etc.
│   └── lib/                  # CartContext, utils
├── views/                    # Blade (app.blade.php, emails/, pdf/)
└── docs/
    └── api.md                # Documentação das rotas

database/
├── factories/                # UserFactory, ProductFactory, CategoryFactory, etc.
├── migrations/               # Todas as migrations numeradas
└── seeders/

config/
└── supervisor/
    └── vertex-worker.conf    # Configuração do Supervisor para queue workers
```

---

## Funcionalidades

- **Storefront:** Listagem, filtros, busca FULLTEXT, produto individual, carrinho, checkout
- **Pagamentos:** Stripe (cartão, Pix, Boleto) + webhook com verificação de assinatura
- **Frete:** ViaCEP + cálculo PAC/SEDEX por peso + frete grátis por threshold
- **Cupons:** Percentual, valor fixo, frete grátis; validação de limite e expiração
- **Conta:** Pedidos, endereços, wishlist, avaliações, perfil
- **Admin:** CRUD de produtos, pedidos, cupons, clientes, avaliações, relatórios
- **Emails:** Confirmação de pedido, envio, entrega, reset de senha (Notifications)
- **Queue:** Jobs assíncronos para emails, PDFs de nota fiscal, atualização de estoque
- **SEO:** Sitemap dinâmico, Schema.org JSON-LD (Product/Review/BreadcrumbList), OG, robots.txt
- **Segurança:** CSP, HSTS, X-Frame-Options, rate limiting, validação CPF, Policies

---

## Licença

MIT
