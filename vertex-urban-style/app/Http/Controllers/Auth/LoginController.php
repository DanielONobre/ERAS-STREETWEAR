<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function __construct(private readonly CartService $cartService) {}

    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => true,
            'status'           => session('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Captura o session_id do carrinho guest ANTES de regenerar a sessão
        $guestSessionId = $request->session()->get('cart_session_id');

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => 'As credenciais informadas não conferem.',
            ]);
        }

        $request->session()->regenerate();

        // Mescla o carrinho de sessão (guest) no carrinho do usuário autenticado
        if ($guestSessionId) {
            $this->cartService->mergeGuestCart(auth()->id(), $guestSessionId);
            $request->session()->forget('cart_session_id');
        }

        return redirect()->intended(route('home'))
            ->with('success', 'Bem-vindo de volta, ' . auth()->user()->name . '!');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('success', 'Até logo!');
    }
}
