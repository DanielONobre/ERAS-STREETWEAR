<?php

use App\Http\Controllers\SearchController;
use App\Services\ShippingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ── Autenticação ───────────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ── Busca / Autocomplete ───────────────────────────────────────────────────────
// GET /api/search/suggestions?q=termo — rate limit: 60 req/min
Route::get('/search/suggestions', [SearchController::class, 'suggestions'])
    ->middleware('throttle:search')
    ->name('api.search.suggestions');

// ── Frete ─────────────────────────────────────────────────────────────────────
// GET /api/shipping/validate-cep?cep=01310100
Route::get('/shipping/validate-cep', function (Request $request, ShippingService $shipping) {
    $cep = preg_replace('/\D/', '', $request->get('cep', ''));
    return response()->json($shipping->validateCep($cep));
})->middleware('throttle:30,1')->name('api.shipping.validate-cep');
