<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::active()
            ->with(['images' => fn ($q) => $q->where('is_primary', true)->orderBy('sort_order'), 'category', 'brand']);

        if ($search = $request->get('search')) {
            $query->fullTextSearch($search);
        }

        if ($category = $request->get('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

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

        return Inertia::render('Products/Index', [
            'products'   => $products,
            'categories' => Category::root()->active()->with('children')->get(),
            'filters'    => $request->only(['search', 'category', 'on_sale', 'min_price', 'max_price', 'sort']),
        ]);
    }

    public function show(string $slug): Response
    {
        // Cache individual de produto por 15 minutos (invalidado pelo ProductObserver)
        $product = Cache::remember("product:{$slug}", now()->addMinutes(15), function () use ($slug) {
            return Product::active()
                ->where('slug', $slug)
                ->with(['category', 'brand', 'images', 'variants.attributeValues.attribute', 'reviews.user'])
                ->firstOrFail();
        });

        $product->increment('views');

        $related = Product::active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(['images' => fn ($q) => $q->where('is_primary', true)])
            ->take(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => array_merge($product->toArray(), [
                'primary_image_url' => $product->primary_image_url,
                'is_on_sale'        => $product->is_on_sale,
                'discount_percent'  => $product->discount_percent,
                'in_stock'          => $product->in_stock,
            ]),
            'related' => $related->map(fn ($p) => [
                'id'                => $p->id,
                'name'              => $p->name,
                'slug'              => $p->slug,
                'price'             => $p->price,
                'compare_price'     => $p->compare_price,
                'is_on_sale'        => $p->is_on_sale,
                'primary_image_url' => $p->primary_image_url,
            ]),
        ]);
    }

    public function newArrivals(Request $request): Response
    {
        $products = Product::active()
            ->with(['images' => fn ($q) => $q->where('is_primary', true), 'category'])
            ->latest()
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('Products/NewArrivals', [
            'products' => $products,
        ]);
    }

    public function onSale(Request $request): Response
    {
        $products = Product::active()
            ->onSale()
            ->with(['images' => fn ($q) => $q->where('is_primary', true), 'category'])
            ->orderByDesc('views')
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('Products/OnSale', [
            'products' => $products,
        ]);
    }
}
