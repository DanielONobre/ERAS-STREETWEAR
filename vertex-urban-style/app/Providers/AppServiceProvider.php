<?php

namespace App\Providers;

use App\Models\Address;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Observers\ProductObserver;
use App\Policies\AddressPolicy;
use App\Policies\OrderPolicy;
use App\Policies\ProductPolicy;
use App\Policies\ReviewPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // ── Observers ────────────────────────────────────────────────────────
        Product::observe(ProductObserver::class);

        // ── Policies ─────────────────────────────────────────────────────────
        Gate::policy(Product::class, ProductPolicy::class);
        Gate::policy(Order::class, OrderPolicy::class);
        Gate::policy(Review::class, ReviewPolicy::class);
        Gate::policy(Address::class, AddressPolicy::class);

        // ── Rate Limiters ─────────────────────────────────────────────────────
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)
                ->by($request->input('email') . '|' . $request->ip())
                ->response(fn () => response()->json([
                    'message' => 'Muitas tentativas de login. Aguarde 1 minuto.',
                ], 429));
        });

        RateLimiter::for('search', function (Request $request) {
            return Limit::perMinute(60)
                ->by($request->ip());
        });

        RateLimiter::for('checkout', function (Request $request) {
            return Limit::perMinute(10)
                ->by($request->user()?->id ?: $request->ip())
                ->response(fn () => response()->json([
                    'message' => 'Muitas tentativas de checkout. Aguarde um momento.',
                ], 429));
        });

        RateLimiter::for('coupon', function (Request $request) {
            return Limit::perHour(10)
                ->by($request->ip())
                ->response(fn () => response()->json([
                    'message' => 'Muitas tentativas de cupom. Tente novamente em 1 hora.',
                ], 429));
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(100)
                ->by($request->user()?->id ?: $request->ip());
        });
    }
}
