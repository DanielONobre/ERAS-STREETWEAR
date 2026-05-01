<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $reviews = Review::with(['product', 'user'])
            ->when(
                $request->approved !== null,
                fn ($q) => $q->where('is_approved', (bool) $request->approved)
            )
            ->when($request->search, fn ($q) =>
                $q->whereHas('product', fn ($pq) => $pq->where('name', 'like', "%{$request->search}%"))
                  ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$request->search}%"))
            )
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews->through(fn (Review $r) => [
                'id'          => $r->id,
                'rating'      => $r->rating,
                'title'       => $r->title,
                'body'        => $r->body,
                'is_approved' => $r->is_approved,
                'product'     => ['id' => $r->product->id, 'name' => $r->product->name],
                'user'        => ['id' => $r->user->id, 'name' => $r->user->name],
                'created_at'  => $r->created_at->format('d/m/Y'),
            ]),
            'filters' => $request->only(['approved', 'search']),
        ]);
    }

    /**
     * Aprova ou rejeita uma avaliação.
     */
    public function update(Request $request, Review $avaliacao): RedirectResponse
    {
        $request->validate(['is_approved' => 'required|boolean']);

        $avaliacao->update(['is_approved' => $request->boolean('is_approved')]);

        $label = $avaliacao->is_approved ? 'aprovada' : 'rejeitada';

        return back()->with('success', "Avaliação {$label}.");
    }

    public function destroy(Review $avaliacao): RedirectResponse
    {
        $avaliacao->delete();

        return back()->with('success', 'Avaliação removida.');
    }
}
