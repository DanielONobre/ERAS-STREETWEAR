<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

class SearchService
{
    /**
     * Busca produtos por termo com suporte a FULLTEXT MySQL e filtros opcionais.
     *
     * Filtros suportados:
     *   - category (string) — slug da categoria
     *   - min_price (float)
     *   - max_price (float)
     *   - on_sale (bool)
     *   - sort (relevance|price_asc|price_desc|newest)
     *   - per_page (int, padrão 24)
     */
    public function search(string $term, array $filters = []): LengthAwarePaginator
    {
        $term = trim($term);

        $query = Product::active()
            ->with(['images' => fn ($q) => $q->where('is_primary', true), 'category']);

        if ($term !== '') {
            $query->fullTextSearch($term);
        }

        if ($category = ($filters['category'] ?? null)) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        if ($onSale = ($filters['on_sale'] ?? null)) {
            $query->onSale();
        }

        if ($min = ($filters['min_price'] ?? null)) {
            $query->where('price', '>=', (float) $min);
        }

        if ($max = ($filters['max_price'] ?? null)) {
            $query->where('price', '<=', (float) $max);
        }

        match ($filters['sort'] ?? 'relevance') {
            'price_asc'  => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'newest'     => $query->latest(),
            default      => $term !== ''
                                ? $query->orderByRaw('MATCH(name, description, sku) AGAINST(? IN BOOLEAN MODE) DESC', [$term])
                                : $query->orderByDesc('views'),
        };

        $perPage = (int) ($filters['per_page'] ?? 24);

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Retorna até 5 sugestões de produtos para autocomplete.
     *
     * @return array<int, array{id: int, name: string, slug: string, image: string|null, price: string}>
     */
    public function suggestions(string $term): array
    {
        $term = trim($term);

        if (strlen($term) < 2) {
            return [];
        }

        return Product::active()
            ->fullTextSearch($term)
            ->with(['images' => fn ($q) => $q->where('is_primary', true)->limit(1)])
            ->orderByRaw('MATCH(name, description, sku) AGAINST(? IN BOOLEAN MODE) DESC', [$term])
            ->limit(5)
            ->get()
            ->map(fn (Product $p) => [
                'id'    => $p->id,
                'name'  => $p->name,
                'slug'  => $p->slug,
                'image' => $p->primary_image,
                'price' => $p->formatted_price,
            ])
            ->all();
    }
}
