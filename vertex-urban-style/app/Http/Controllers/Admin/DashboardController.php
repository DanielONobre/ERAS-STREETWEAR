<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $month = now()->startOfMonth();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'revenue_month'  => Order::where('status', '!=', 'cancelled')
                    ->where('payment_status', 'paid')
                    ->where('created_at', '>=', $month)
                    ->sum('total'),

                'orders_month'   => Order::where('created_at', '>=', $month)->count(),
                'orders_pending' => Order::where('status', 'pending')->count(),

                'new_customers'  => User::where('is_admin', false)
                    ->where('created_at', '>=', $month)
                    ->count(),

                'total_products' => Product::active()->count(),

                'low_stock' => Product::where('stock_quantity', '<=', 5)
                    ->where('stock_status', 'in_stock')
                    ->count(),
            ],

            'recent_orders' => Order::with('user')
                ->latest()
                ->take(10)
                ->get()
                ->map(fn (Order $o) => [
                    'id'             => $o->id,
                    'customer'       => $o->user?->name ?? 'Visitante',
                    'total'          => $o->total,
                    'formatted_total' => $o->formatted_total,
                    'status'         => $o->status,
                    'status_label'   => $o->status_label,
                    'status_color'   => $o->status_color,
                    'payment_status' => $o->payment_status,
                    'created_at'     => $o->created_at->format('d/m H:i'),
                ]),

            'revenue_chart' => Order::select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('SUM(total) as revenue')
                )
                ->where('status', '!=', 'cancelled')
                ->where('payment_status', 'paid')
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
        ]);
    }
}
