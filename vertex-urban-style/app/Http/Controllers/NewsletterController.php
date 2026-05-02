<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterSubscribed;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class NewsletterController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255', Rule::unique('newsletter_subscribers')->whereNull('unsubscribed_at')],
        ]);

        $subscriber = NewsletterSubscriber::firstOrCreate(
            ['email' => $validated['email']],
            ['subscribed_at' => now()],
        );

        // Re-subscribe if previously unsubscribed
        if ($subscriber->unsubscribed_at) {
            $subscriber->update(['unsubscribed_at' => null, 'subscribed_at' => now()]);
        }

        Mail::to($validated['email'])->queue(new NewsletterSubscribed($validated['email']));

        return response()->json(['message' => 'Tudo certo! Você tá na lista.']);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        NewsletterSubscriber::where('email', $validated['email'])
            ->whereNull('unsubscribed_at')
            ->update(['unsubscribed_at' => now()]);

        return response()->json(['message' => 'Removido da lista com sucesso.']);
    }
}
