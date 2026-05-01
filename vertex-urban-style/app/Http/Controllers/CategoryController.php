<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function show(string $slug, Request $request): Response
    {
        // Categoria com cache de 1 hora (invalidado pelo ProductObserver)
        $category = Cache::remember("category:slug:{$slug}", now()->addHour(), function () use ($slug) {
            return Category::active()
                ->where('slug', $slug)
                ->with('children', 'parent')
                ->firstOrFail();
        });

        $query = Product::active()
            ->where('category_id', $category->id)
            ->with(['images' => fn ($q) => $q->where('is_primary', true), 'brand']);

        if ($request->get('on_sale')) {
            $query->onSale();
        }
        if ($minPrice = $request->get('min_price')) {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice = $request->get('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        match ($request->get('sort', 'featured')) {
            'price_asc'  => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'newest'     => $query->latest(),
            default      => $query->orderByDesc('is_featured')->orderByDesc('views'),
        };

        $products = $query->paginate(24)->withQueryString();

        return Inertia::render('Category/Show', [
            'category' => $category,
            'products' => $products,
            'filters'  => $request->only(['on_sale', 'min_price', 'max_price', 'sort']),
        ]);
    }
}
