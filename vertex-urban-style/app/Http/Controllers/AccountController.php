<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    // ─── Dashboard ────────────────────────────────────────────────────────────

    public function dashboard(Request $request): Response
    {
        $user = $request->user()->load([
            'orders' => fn ($q) => $q->latest()->take(5)->with('items'),
            'addresses',
        ]);

        return Inertia::render('Account/Dashboard', [
            'user' => [
                'id'           => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'avatar'       => $user->avatar_url,
                'orders_count' => $user->orders()->count(),
            ],
            'recent_orders' => $user->orders->map(fn (Order $order) => [
                'id'              => $order->id,
                'status'          => $order->status,
                'status_label'    => $order->status_label,
                'status_color'    => $order->status_color,
                'formatted_total' => $order->formatted_total,
                'items_count'     => $order->items->count(),
                'created_at'      => $order->created_at->format('d/m/Y'),
            ]),
        ]);
    }

    // ─── Orders ───────────────────────────────────────────────────────────────

    public function orders(Request $request): Response
    {
        $orders = $request->user()
            ->orders()
            ->with('items')
            ->latest()
            ->paginate(10);

        return Inertia::render('Account/Orders', [
            'orders' => $orders->through(fn (Order $order) => [
                'id'              => $order->id,
                'status'          => $order->status,
                'status_label'    => $order->status_label,
                'status_color'    => $order->status_color,
                'payment_status'  => $order->payment_status,
                'formatted_total' => $order->formatted_total,
                'items_count'     => $order->items->count(),
                'created_at'      => $order->created_at->format('d/m/Y'),
            ]),
        ]);
    }

    public function orderDetail(Order $order): Response
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $order->load('items', 'address', 'coupon');

        return Inertia::render('Account/OrderDetail', [
            'order' => array_merge($order->toArray(), [
                'status_label'         => $order->status_label,
                'status_color'         => $order->status_color,
                'payment_status_label' => $order->payment_status_label,
                'formatted_total'      => $order->formatted_total,
                'can_be_cancelled'     => $order->canBeCancelled(),
                'address_full'         => $order->address?->full_address,
            ]),
        ]);
    }

    // ─── Addresses ───────────────────────────────────────────────────────────

    public function addresses(Request $request): Response
    {
        return Inertia::render('Account/Addresses', [
            'addresses' => $request->user()->addresses()->get(),
        ]);
    }

    public function storeAddress(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'phone'        => 'nullable|string|max:20',
            'zip_code'     => 'required|string|max:10',
            'street'       => 'required|string|max:255',
            'number'       => 'required|string|max:20',
            'complement'   => 'nullable|string|max:100',
            'neighborhood' => 'required|string|max:100',
            'city'         => 'required|string|max:100',
            'state'        => 'required|string|size:2',
            'is_default'   => 'boolean',
        ]);

        if (! empty($validated['is_default'])) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $request->user()->addresses()->create($validated);

        return back()->with('success', 'Endereço adicionado com sucesso!');
    }

    public function updateAddress(Request $request, Address $address): RedirectResponse
    {
        abort_if($address->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'phone'        => 'nullable|string|max:20',
            'zip_code'     => 'required|string|max:10',
            'street'       => 'required|string|max:255',
            'number'       => 'required|string|max:20',
            'complement'   => 'nullable|string|max:100',
            'neighborhood' => 'required|string|max:100',
            'city'         => 'required|string|max:100',
            'state'        => 'required|string|size:2',
            'is_default'   => 'boolean',
        ]);

        if (! empty($validated['is_default'])) {
            $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($validated);

        return back()->with('success', 'Endereço atualizado!');
    }

    public function destroyAddress(Address $address): RedirectResponse
    {
        abort_if($address->user_id !== auth()->id(), 403);
        $address->delete();

        return back()->with('success', 'Endereço removido.');
    }

    // ─── Profile ──────────────────────────────────────────────────────────────

    public function profile(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Account/Profile', [
            'user' => [
                'id'     => $user->id,
                'name'   => $user->name,
                'email'  => $user->email,
                'phone'  => $user->phone,
                'cpf'    => $user->cpf,
                'avatar' => $user->avatar_url,
            ],
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone'            => ['nullable', 'string', 'max:20'],
            'current_password' => ['nullable', 'current_password'],
            'password'         => ['nullable', 'confirmed', Password::defaults()],
        ]);

        $user->fill([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? $user->phone,
        ]);

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return back()->with('success', 'Perfil atualizado com sucesso!');
    }
}
