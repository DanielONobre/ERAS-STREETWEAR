<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ── SEO ────────────────────────────────────────────────────────────────────────
Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap');

// ── NEWSLETTER ────────────────────────────────────────────────────────────────
Route::post('/newsletter/subscribe',   [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

// ── STOREFRONT (público) ───────────────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/manifesto', fn () => Inertia::render('Manifesto'))->name('manifesto');
Route::get('/produtos', [ProductController::class, 'index'])->name('products.index');
Route::get('/produtos/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/categoria/{slug}', [CategoryController::class, 'show'])->name('categories.show');
Route::get('/busca', [SearchController::class, 'index'])->name('search')->middleware('throttle:search');
Route::get('/api/search/suggestions', [SearchController::class, 'suggestions'])
    ->name('search.suggestions')
    ->middleware('throttle:search');
Route::get('/lancamentos', [ProductController::class, 'newArrivals'])->name('new-arrivals');
Route::get('/sale', [ProductController::class, 'onSale'])->name('sale');

// ── AUTENTICAÇÃO ───────────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/entrar', [LoginController::class, 'create'])->name('login');
    Route::post('/entrar', [LoginController::class, 'store'])->middleware('throttle:login');
    Route::get('/cadastro', [RegisterController::class, 'create'])->name('register');
    Route::post('/cadastro', [RegisterController::class, 'store']);
});

Route::post('/sair', [LoginController::class, 'destroy'])->middleware('auth')->name('logout');

// ── CARRINHO (AJAX + Inertia) ──────────────────────────────────────────────────
Route::prefix('carrinho')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/adicionar', [CartController::class, 'add'])->name('add');
    Route::put('/item/{item}', [CartController::class, 'update'])->name('update');
    Route::delete('/item/{item}', [CartController::class, 'remove'])->name('remove');
    Route::post('/cupom', [CartController::class, 'applyCoupon'])->name('coupon')->middleware('throttle:coupon');
    Route::delete('/cupom', [CartController::class, 'removeCoupon'])->name('remove-coupon');
    Route::post('/frete', [CartController::class, 'calculateShipping'])->name('shipping');
    Route::get('/mini', [CartController::class, 'mini'])->name('mini');
});

// ── CHECKOUT ──────────────────────────────────────────────────────────────────
Route::middleware(['auth', 'throttle:checkout'])->prefix('checkout')->name('checkout.')->group(function () {
    Route::get('/', [CheckoutController::class, 'index'])->name('index');
    Route::post('/endereco', [CheckoutController::class, 'saveAddress'])->name('address');
    Route::post('/pagamento', [CheckoutController::class, 'processPayment'])->name('payment');
    Route::get('/sucesso/{order}', [CheckoutController::class, 'success'])->name('success');
});

// Webhook do Stripe — fora do middleware auth (autenticado por assinatura)
Route::post('/checkout/webhook/stripe', [CheckoutController::class, 'stripeWebhook'])
    ->name('checkout.webhook')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

// ── ÁREA DO CLIENTE ───────────────────────────────────────────────────────────
Route::middleware('auth')->prefix('minha-conta')->name('account.')->group(function () {
    Route::get('/', [AccountController::class, 'dashboard'])->name('dashboard');

    // Pedidos
    Route::get('/pedidos', [AccountController::class, 'orders'])->name('orders');
    Route::get('/pedidos/{order}', [AccountController::class, 'orderDetail'])->name('orders.detail');

    // Favoritos
    Route::get('/favoritos', [WishlistController::class, 'index'])->name('wishlist');
    Route::post('/favoritos/{product}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

    // Endereços
    Route::get('/enderecos', [AccountController::class, 'addresses'])->name('addresses');
    Route::post('/enderecos', [AccountController::class, 'storeAddress'])->name('addresses.store');
    Route::put('/enderecos/{address}', [AccountController::class, 'updateAddress'])->name('addresses.update');
    Route::delete('/enderecos/{address}', [AccountController::class, 'destroyAddress'])->name('addresses.destroy');

    // Perfil
    Route::get('/perfil', [AccountController::class, 'profile'])->name('profile');
    Route::put('/perfil', [AccountController::class, 'updateProfile'])->name('profile.update');

    // Avaliações
    Route::post('/avaliacoes', [ReviewController::class, 'store'])->name('reviews.store');
});

// ── ADMIN PANEL ───────────────────────────────────────────────────────────────
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    // Produtos
    Route::resource('produtos', \App\Http\Controllers\Admin\ProductController::class);
    Route::post('produtos/{product}/imagens', [\App\Http\Controllers\Admin\ProductController::class, 'uploadImages'])
        ->name('products.images');
    Route::delete('produtos/imagens/{image}', [\App\Http\Controllers\Admin\ProductController::class, 'deleteImage'])
        ->name('products.images.delete');
    Route::post('produtos/{product}/variantes', [\App\Http\Controllers\Admin\ProductController::class, 'storeVariant'])
        ->name('products.variants.store');

    // Categorias
    Route::resource('categorias', \App\Http\Controllers\Admin\CategoryController::class);

    // Pedidos
    Route::resource('pedidos', \App\Http\Controllers\Admin\OrderController::class)
        ->only(['index', 'show', 'update']);
    Route::post('pedidos/{order}/rastreio', [\App\Http\Controllers\Admin\OrderController::class, 'updateTracking'])
        ->name('orders.tracking');

    // Cupons
    Route::resource('cupons', \App\Http\Controllers\Admin\CouponController::class);

    // Clientes
    Route::resource('clientes', \App\Http\Controllers\Admin\CustomerController::class)
        ->only(['index', 'show']);

    // Avaliações
    Route::resource('avaliacoes', \App\Http\Controllers\Admin\ReviewController::class)
        ->only(['index', 'update', 'destroy']);

    // Relatórios
    Route::get('relatorios/vendas', [\App\Http\Controllers\Admin\ReportController::class, 'sales'])
        ->name('reports.sales');
    Route::get('relatorios/produtos', [\App\Http\Controllers\Admin\ReportController::class, 'products'])
        ->name('reports.products');
    Route::get('relatorios/clientes', [\App\Http\Controllers\Admin\ReportController::class, 'customers'])
        ->name('reports.customers');

    // Configurações
    Route::get('configuracoes', [\App\Http\Controllers\Admin\SettingController::class, 'index'])
        ->name('settings');
    Route::put('configuracoes', [\App\Http\Controllers\Admin\SettingController::class, 'update'])
        ->name('settings.update');
});
