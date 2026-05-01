<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ProductObserver
{
    /**
     * Invalida todos os caches relacionados ao produto ao salvar.
     */
    public function saved(Product $product): void
    {
        $this->clearProductCaches($product);
    }

    /**
     * Invalida caches ao deletar (incluindo soft-delete).
     */
    public function deleted(Product $product): void
    {
        $this->clearProductCaches($product);
    }

    /**
     * Invalida caches ao restaurar (soft-delete).
     */
    public function restored(Product $product): void
    {
        $this->clearProductCaches($product);
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function clearProductCaches(Product $product): void
    {
        // Cache individual do produto
        Cache::forget("product:{$product->slug}");
        Cache::forget("product:{$product->id}");

        // Caches da home page
        Cache::forget('home:featured_products');
        Cache::forget('home:new_arrivals');

        // Cache da categoria do produto
        if ($product->category_id) {
            Cache::forget("category:{$product->category_id}:products");
            Cache::forget("category_tree");
        }

        // Cache tags (quando disponível o driver que suporta tags — Redis/Memcached)
        try {
            Cache::tags(['products'])->flush();
            Cache::tags(['home'])->flush();
            if ($product->category_id) {
                Cache::tags(['categories'])->flush();
            }
        } catch (\BadMethodCallException) {
            // Driver de cache (file/array) não suporta tags — silencia
        }
    }
}
