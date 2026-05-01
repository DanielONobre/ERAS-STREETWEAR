<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Props compartilhadas em todas as páginas React via usePage().props
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [

            // ── Autenticação ─────────────────────────────────────────────────
            'auth' => [
                'user' => $user ? [
                    'id'       => $user->id,
                    'name'     => $user->name,
                    'email'    => $user->email,
                    'avatar'   => $user->avatar_url,
                    'is_admin' => $user->is_admin ?? false,
                ] : null,
            ],

            // ── Carrinho ─────────────────────────────────────────────────────
            'cart' => [
                'count' => $this->getCartCount($request),
            ],

            // ── Flash messages ───────────────────────────────────────────────
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info'    => fn () => $request->session()->get('info'),
            ],

            // ── Configurações globais da loja ────────────────────────────────
            'settings' => fn () => Setting::allCached(),

            // ── Rotas (Ziggy) ────────────────────────────────────────────────
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            // ── SEO defaults (sobrescrito em cada página via Inertia::render Head) ──
            'seo' => fn () => [
                'canonical'    => $request->url(),
                'og_url'       => $request->url(),
                'og_site_name' => 'ERAS Streetwear',
                'og_type'      => 'website',
                'twitter_card' => 'summary_large_image',
                'twitter_site' => '@erasstreetwear',
            ],
        ]);
    }

    private function getCartCount(Request $request): int
    {
        if ($request->user()) {
            return (int) Cart::where('user_id', $request->user()->id)
                ->join('cart_items', 'carts.id', '=', 'cart_items.cart_id')
                ->sum('cart_items.quantity');
        }

        // Carrinho por sessão
        $cart = Cart::where('session_id', $request->session()->getId())->first();
        return $cart ? (int) $cart->items()->sum('quantity') : 0;
    }
}
