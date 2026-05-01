# Vertex Urban Style — Documentação das Rotas da API

Base URL: `https://vertexurbanstyle.com.br`

Todas as respostas são JSON (`Content-Type: application/json`).
Autenticação via Laravel Sanctum (`Authorization: Bearer {token}`).

---

## Índice

- [Autenticação](#autenticação)
- [Busca](#busca)
- [Frete / CEP](#frete--cep)
- [Carrinho](#carrinho)
- [Checkout](#checkout)
- [Conta do Usuário](#conta-do-usuário)
- [Admin — Produtos](#admin--produtos)
- [Admin — Pedidos](#admin--pedidos)
- [Admin — Cupons](#admin--cupons)
- [Webhook](#webhook)

---

## Autenticação

### POST /entrar
Login com email e senha.

**Rate Limit:** 5 tentativas/minuto por IP + email.

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Resposta 200** — redireciona para `/` (Inertia)

**Resposta 422** — credenciais inválidas
```json
{ "errors": { "email": ["Credenciais inválidas."] } }
```

---

### POST /cadastro
Registro de novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "Password@123",
  "password_confirmation": "Password@123"
}
```

**Resposta 200** — redireciona para `/`

---

### POST /sair
Logout. Requer autenticação.

**Resposta 302** — redireciona para `/`

---

## Busca

### GET /api/search/suggestions
Sugestões de autocomplete para busca.

**Rate Limit:** 60 req/min por IP.

**Query Params:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `q` | string | sim | Termo de busca (mín. 2 chars) |

**Resposta 200:**
```json
{
  "suggestions": [
    {
      "id": 1,
      "name": "Camiseta Skull Preta",
      "slug": "camiseta-skull-preta",
      "price": "R$ 89,90",
      "image": "https://..."
    }
  ]
}
```

---

## Frete / CEP

### GET /api/shipping/validate-cep
Valida um CEP e retorna opções de frete.

**Rate Limit:** 30 req/min por IP.

**Query Params:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cep` | string | sim | CEP com 8 dígitos (com ou sem máscara) |

**Resposta 200:**
```json
{
  "valid": true,
  "address": {
    "city": "São Paulo",
    "state": "SP",
    "neighborhood": "Bela Vista"
  },
  "options": [
    { "method": "pac",   "label": "PAC (Correios)",   "price": 12.90, "days": 5,  "free": false },
    { "method": "sedex", "label": "SEDEX (Correios)", "price": 25.90, "days": 1,  "free": false }
  ]
}
```

**Resposta 422:**
```json
{ "error": "CEP não encontrado." }
```

---

## Carrinho

Todas as rotas do carrinho funcionam para usuários autenticados e guests (via session).

### GET /carrinho
Página do carrinho (Inertia).

---

### GET /carrinho/mini
Mini-cart para o navbar.

**Resposta 200:**
```json
{
  "items": [...],
  "count": 3,
  "subtotal": 299.70,
  "formatted_subtotal": "R$ 299,70"
}
```

---

### POST /carrinho/adicionar
Adiciona produto ao carrinho.

**Body:**
```json
{
  "product_id": 1,
  "variant_id": null,
  "quantity": 1
}
```

**Resposta 200:**
```json
{ "message": "Produto adicionado ao carrinho.", "cart": { "count": 1 } }
```

**Resposta 422:**
```json
{ "message": "Estoque insuficiente para esta variante." }
```

---

### PUT /carrinho/item/{id}
Atualiza quantidade de um item.

**Body:**
```json
{ "quantity": 2 }
```

**Resposta 200:**
```json
{ "item": { "id": 5, "quantity": 2, "line_total": 179.80 } }
```

---

### DELETE /carrinho/item/{id}
Remove item do carrinho.

**Resposta 200:**
```json
{ "message": "Item removido." }
```

---

### POST /carrinho/cupom
Aplica cupom ao carrinho.

**Rate Limit:** 10 tentativas/hora por IP (anti brute-force).

**Body:**
```json
{ "coupon_code": "VERTEX10" }
```

**Resposta 200:**
```json
{
  "success": true,
  "discount": 29.97,
  "message": "Cupom aplicado! Desconto de R$ 29,97."
}
```

---

### DELETE /carrinho/cupom
Remove cupom aplicado.

---

### POST /carrinho/frete
Calcula opções de frete para um CEP.

**Body:**
```json
{ "cep": "01310100" }
```

**Resposta 200:** mesmo formato de `/api/shipping/validate-cep`

---

## Checkout

Todas as rotas requerem autenticação.
**Rate Limit:** 10 req/min por usuário.

### GET /checkout
Página de checkout (Inertia).

---

### POST /checkout/endereco
Salva ou seleciona endereço de entrega.

**Body (novo endereço):**
```json
{
  "name": "João Silva",
  "phone": "(11) 99999-9999",
  "zip_code": "01310100",
  "street": "Av. Paulista",
  "number": "1000",
  "complement": "Apto 42",
  "neighborhood": "Bela Vista",
  "city": "São Paulo",
  "state": "SP"
}
```

**Body (endereço existente):**
```json
{ "address_id": 3 }
```

**Resposta 200:**
```json
{ "message": "Endereço salvo.", "address": { "id": 3, ... } }
```

---

### POST /checkout/pagamento
Processa pagamento e cria pedido.

Valida CPF brasileiro (dígitos verificadores).

**Body:**
```json
{
  "address_id": 3,
  "payment_method": "credit_card",
  "payment_data": { "token": "tok_visa_xxxxx" },
  "shipping_method": "sedex",
  "shipping_cost": 25.90,
  "coupon_code": "VERTEX10",
  "cpf": "123.456.789-09",
  "notes": "Deixar com porteiro"
}
```

**Métodos de pagamento:** `credit_card` | `pix` | `boleto`

**Resposta 200:**
```json
{
  "success": true,
  "message": "Pedido criado com sucesso.",
  "order_id": 42,
  "redirect": "https://.../checkout/sucesso/42"
}
```

**Resposta 422:**
```json
{
  "success": false,
  "message": "Pagamento recusado.",
  "errors": { "cpf": ["CPF inválido."] }
}
```

---

### GET /checkout/sucesso/{order}
Página de confirmação do pedido (Inertia). Somente o dono do pedido.

---

## Conta do Usuário

Todas as rotas requerem autenticação.

### GET /minha-conta
Dashboard do usuário.

### GET /minha-conta/pedidos
Lista de pedidos do usuário.

### GET /minha-conta/pedidos/{order}
Detalhe de um pedido.

### GET /minha-conta/enderecos
Lista de endereços.

### POST /minha-conta/enderecos
Cria novo endereço.

### PUT /minha-conta/enderecos/{address}
Atualiza endereço (somente do próprio usuário — `AddressPolicy`).

### DELETE /minha-conta/enderecos/{address}
Remove endereço.

### GET /minha-conta/perfil
Página de perfil.

### PUT /minha-conta/perfil
Atualiza dados do perfil.

### POST /minha-conta/avaliacoes
Cria avaliação de produto.

**Body:**
```json
{
  "product_id": 5,
  "order_id": 42,
  "rating": 5,
  "title": "Produto excelente",
  "body": "Qualidade ótima, entrega rápida. Recomendo!"
}
```

---

## Admin — Produtos

Todas as rotas requerem `is_admin = true`.

### GET /admin/produtos
Lista paginada de produtos.

### POST /admin/produtos
Cria produto (`StoreProductRequest`).

### GET /admin/produtos/{product}
Exibe produto.

### PUT /admin/produtos/{product}
Atualiza produto (`StoreProductRequest`).

### DELETE /admin/produtos/{product}
Soft delete do produto.

### POST /admin/produtos/{product}/imagens
Upload de imagens (máx. 10 × 5MB, converte para WebP).

### DELETE /admin/produtos/imagens/{image}
Remove imagem.

---

## Admin — Pedidos

### GET /admin/pedidos
Lista paginada de pedidos com filtros.

### GET /admin/pedidos/{order}
Detalhe de pedido.

### PUT /admin/pedidos/{order}
Atualiza status/notas (`UpdateOrderRequest`).

**Body:**
```json
{
  "status": "shipped",
  "payment_status": "paid",
  "notes": "Enviado via Sedex."
}
```

### POST /admin/pedidos/{order}/rastreio
Registra código de rastreio.

**Body:**
```json
{ "tracking_code": "BR123456789BR" }
```

---

## Admin — Cupons

### GET /admin/cupons
Lista de cupons.

### POST /admin/cupons
Cria cupom.

**Body:**
```json
{
  "code": "VERTEX15",
  "type": "percentage",
  "value": 15,
  "min_order_value": 150,
  "max_uses": 100,
  "expires_at": "2026-12-31"
}
```

**Tipos:** `percentage` | `fixed` | `free_shipping`

### PUT /admin/cupons/{coupon}
Atualiza cupom.

### DELETE /admin/cupons/{coupon}
Remove cupom.

---

## Webhook

### POST /checkout/webhook/stripe
Recebe eventos do Stripe. **Não requer autenticação** (verificação por assinatura HMAC).

Header obrigatório: `Stripe-Signature: t=...,v1=...`

**Eventos tratados:**
- `payment_intent.succeeded` → confirma pedido
- `payment_intent.payment_failed` → marca pagamento como falhou
- `charge.refunded` → processa reembolso

**Resposta 200:** `OK`
**Resposta 400:** assinatura inválida

---

## Códigos de Status

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 302 | Redirect (Inertia/web) |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 422 | Validação falhou |
| 429 | Rate limit atingido |
| 500 | Erro interno |
