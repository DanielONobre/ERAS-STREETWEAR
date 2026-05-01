<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Response;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $sitemap = Sitemap::create();

        // ── Páginas estáticas ───────────────────────────────────────────────
        $sitemap->add(Url::create('/')->setPriority(1.0)->setChangeFrequency('daily'));
        $sitemap->add(Url::create('/produtos')->setPriority(0.9)->setChangeFrequency('daily'));
        $sitemap->add(Url::create('/lancamentos')->setPriority(0.8)->setChangeFrequency('daily'));
        $sitemap->add(Url::create('/sale')->setPriority(0.8)->setChangeFrequency('daily'));

        // ── Categorias ───────────────────────────────────────────────────────
        Category::active()->orderBy('id')->each(function (Category $category) use ($sitemap) {
            $sitemap->add(
                Url::create("/categoria/{$category->slug}")
                    ->setPriority(0.8)
                    ->setChangeFrequency('weekly')
                    ->setLastModificationDate($category->updated_at)
            );
        });

        // ── Produtos ativos ──────────────────────────────────────────────────
        Product::active()->orderBy('id')->each(function (Product $product) use ($sitemap) {
            $sitemap->add(
                Url::create("/produtos/{$product->slug}")
                    ->setPriority(0.7)
                    ->setChangeFrequency('weekly')
                    ->setLastModificationDate($product->updated_at)
            );
        });

        return response($sitemap->render(), 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
