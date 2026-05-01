<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featured = Cache::remember('home:featured_products', now()->addMinutes(30), function () {
            return Product::featured()
                ->with(['images' => fn ($q) => $q->where('is_primary', true), 'category'])
                ->take(8)
                ->get()
                ->map(fn ($p) => $this->formatProduct($p));
        });

        $newArrivals = Cache::remember('home:new_arrivals', now()->addMinutes(30), function () {
            return Product::active()
                ->with(['images' => fn ($q) => $q->where('is_primary', true)])
                ->latest()
                ->take(8)
                ->get()
                ->map(fn ($p) => $this->formatProduct($p));
        });

        $onSale = Cache::remember('home:on_sale', now()->addMinutes(30), function () {
            return Product::onSale()
                ->with(['images' => fn ($q) => $q->where('is_primary', true)])
                ->take(4)
                ->get()
                ->map(fn ($p) => $this->formatProduct($p));
        });

        $categories = Cache::remember('category_tree', now()->addHour(), function () {
            return Category::root()->active()->with('children')->take(8)->get();
        });

        return Inertia::render('Home', [
            'featured'    => $featured,
            'newArrivals' => $newArrivals,
            'on_sale'     => $onSale,
            'categories'  => $categories,
        ]);
    }

    private function formatProduct(Product $p): array
    {
        return [
            'id'               => $p->id,
            'name'             => $p->name,
            'slug'             => $p->slug,
            'price'            => $p->price,
            'compare_price'    => $p->compare_price,
            'discount_percent' => $p->discount_percent,
            'is_on_sale'       => $p->is_on_sale,
            'primary_image_url' => $p->primary_image_url,
            'in_stock'         => $p->in_stock,
            'is_featured'      => $p->is_featured,
        ];
    }
}
