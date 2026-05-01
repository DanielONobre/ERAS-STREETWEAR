<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function __construct(private readonly SearchService $searchService) {}

    /**
     * Página de resultados de busca.
     */
    public function index(Request $request): Response
    {
        $term    = trim($request->get('q', ''));
        $filters = $request->only(['category', 'min_price', 'max_price', 'on_sale', 'sort']);

        $products = $term !== ''
            ? $this->searchService->search($term, $filters)
            : collect()->paginate(24);

        return Inertia::render('Search/Index', [
            'products'   => $products,
            'total'      => $products->total(),
            'query'      => $term,
            'categories' => Category::root()->active()->get(),
            'filters'    => array_merge(['q' => $term], $filters),
        ]);
    }

    /**
     * Autocomplete — retorna até 5 sugestões em JSON.
     *
     * GET /api/search/suggestions?q=termo
     * Rate limit: 60 req/min (definido nas rotas).
     */
    public function suggestions(Request $request): JsonResponse
    {
        $term = trim($request->get('q', ''));

        if (strlen($term) < 2) {
            return response()->json([]);
        }

        $results = $this->searchService->suggestions($term);

        return response()->json($results);
    }
}
