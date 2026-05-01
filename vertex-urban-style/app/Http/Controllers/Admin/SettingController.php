<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Exibe todas as configurações da loja.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => Setting::allCached(),
        ]);
    }

    /**
     * Atualiza as configurações da loja em massa.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'store_name'              => 'nullable|string|max:255',
            'store_email'             => 'nullable|email|max:255',
            'store_phone'             => 'nullable|string|max:20',
            'store_cnpj'              => 'nullable|string|max:20',
            'free_shipping_threshold' => 'nullable|numeric|min:0',
            'currency'                => 'nullable|string|size:3',
            'meta_title'              => 'nullable|string|max:255',
            'meta_description'        => 'nullable|string|max:500',
            'maintenance_mode'        => 'boolean',
            'allow_reviews'           => 'boolean',
            'reviews_need_purchase'   => 'boolean',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        return back()->with('success', 'Configurações salvas com sucesso!');
    }
}
