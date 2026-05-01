<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $customers = User::where('is_admin', false)
            ->withCount('orders')
            ->when($request->search, fn ($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
            )
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers->through(fn (User $u) => [
                'id'           => $u->id,
                'name'         => $u->name,
                'email'        => $u->email,
                'phone'        => $u->phone,
                'orders_count' => $u->orders_count,
                'is_active'    => $u->is_active,
                'created_at'   => $u->created_at->format('d/m/Y'),
            ]),
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(User $cliente): Response
    {
        abort_if($cliente->is_admin, 404);

        $cliente->load([
            'orders' => fn ($q) => $q->with('items')->latest()->take(10),
            'addresses',
        ]);

        return Inertia::render('Admin/Customers/Show', [
            'customer' => [
                'id'           => $cliente->id,
                'name'         => $cliente->name,
                'email'        => $cliente->email,
                'phone'        => $cliente->phone,
                'cpf'          => $cliente->cpf,
                'is_active'    => $cliente->is_active,
                'created_at'   => $cliente->created_at->format('d/m/Y'),
                'orders_count' => $cliente->orders()->count(),
                'total_spent'  => $cliente->orders()
                    ->where('payment_status', 'paid')
                    ->sum('total'),
            ],
            'orders'    => $cliente->orders->map(fn ($o) => [
                'id'              => $o->id,
                'status_label'    => $o->status_label,
                'status_color'    => $o->status_color,
                'formatted_total' => $o->formatted_total,
                'items_count'     => $o->items->count(),
                'created_at'      => $o->created_at->format('d/m/Y'),
            ]),
            'addresses' => $cliente->addresses,
        ]);
    }
}
