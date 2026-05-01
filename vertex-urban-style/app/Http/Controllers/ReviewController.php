<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Armazena uma nova avaliação de produto.
     * O usuário deve ter comprado o produto (pedido entregue).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id'   => 'nullable|exists:orders,id',
            'rating'     => 'required|integer|min:1|max:5',
            'title'      => 'nullable|string|max:150',
            'body'       => 'required|string|max:2000',
        ]);

        // Impede avaliações duplicadas do mesmo usuário para o mesmo produto
        $already = Review::where('user_id', auth()->id())
            ->where('product_id', $validated['product_id'])
            ->exists();

        if ($already) {
            return back()->withErrors(['product_id' => 'Você já avaliou este produto.']);
        }

        Review::create(array_merge($validated, [
            'user_id'     => auth()->id(),
            'is_approved' => false, // aprovação manual pelo admin
        ]));

        return back()->with('success', 'Avaliação enviada! Ela será exibida após aprovação.');
    }
}
