<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    /**
     * Lista de favoritos do usuário.
     */
    public function index(Request $request): Response
    {
        $wishlists = $request->user()
            ->wishlists()
            ->with(['product' => fn ($q) => $q->with(['images' => fn ($q) => $q->where('is_primary', true)])])
            ->latest()
            ->get();

        return Inertia::render('Account/Wishlist', [
            'items' => $wishlists->map(fn ($w) => [
                'id'      => $w->id,
                'product' => [
                    'id'                => $w->product->id,
                    'name'              => $w->product->name,
                    'slug'              => $w->product->slug,
                    'price'             => $w->product->price,
                    'compare_price'     => $w->product->compare_price,
                    'is_on_sale'        => $w->product->is_on_sale,
                    'primary_image_url' => $w->product->primary_image_url,
                    'in_stock'          => $w->product->in_stock,
                ],
            ]),
        ]);
    }

    /**
     * Adiciona ou remove produto dos favoritos (toggle).
     * Retorna JSON com o novo estado.
     */
    public function toggle(Request $request, Product $product): JsonResponse
    {
        $user = $request->user();

        $wishlist = Wishlist::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            $wishlisted = false;
            $message    = 'Produto removido dos favoritos.';
        } else {
            Wishlist::create([
                'user_id'    => $user->id,
                'product_id' => $product->id,
            ]);
            $wishlisted = true;
            $message    = 'Produto adicionado aos favoritos!';
        }

        return response()->json([
            'wishlisted' => $wishlisted,
            'message'    => $message,
        ]);
    }
}
