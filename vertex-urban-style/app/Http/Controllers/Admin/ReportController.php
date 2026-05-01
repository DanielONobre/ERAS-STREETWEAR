<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Relatório de vendas com gráfico diário e totais por período.
     */
    public function sales(Request $request): Response
    {
        $from = $request->date('from', now()->startOfMonth());
        $to   = $request->date('to', now()->endOfDay());

        $baseQuery = Order::whereBetween('created_at', [$from, $to])
            ->where('payment_status', 'paid')
            ->where('status', '!=', 'cancelled');

        $summary = [
            'total_revenue' => $baseQuery->clone()->sum('total'),
            'total_orders'  => $baseQuery->clone()->count(),
            'avg_ticket'    => $baseQuery->clone()->avg('total') ?? 0,
            'total_items'   => $baseQuery->clone()->withCount('items')->get()->sum('items_count'),
        ];

        $daily = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as orders'),
                DB::raw('SUM(total) as revenue')
            )
            ->whereBetween('created_at', [$from, $to])
            ->where('payment_status', 'paid')
            ->where('status', '!=', 'cancelled')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $byMethod = Order::select('payment_method', DB::raw('COUNT(*) as count'), DB::raw('SUM(total) as total'))
            ->whereBetween('created_at', [$from, $to])
            ->where('payment_status', 'paid')
            ->groupBy('payment_method')
            ->get();

        return Inertia::render('Admin/Reports/Sales', [
            'summary'   => $summary,
            'daily'     => $daily,
            'by_method' => $byMethod,
            'filters'   => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
        ]);
    }

    /**
     * Relatório de produtos: mais vendidos, sem estoque, mais visualizados.
     */
    public function products(Request $request): Response
    {
        $from = $request->date('from', now()->startOfMonth());
        $to   = $request->date('to', now()->endOfDay());

        $topSelling = DB::table('order_items')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->select(
                'products.id',
                'products.name',
                'products.sku',
                DB::raw('SUM(order_items.quantity) as units_sold'),
                DB::raw('SUM(order_items.line_total) as revenue')
            )
            ->whereBetween('orders.created_at', [$from, $to])
            ->where('orders.payment_status', 'paid')
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->orderByDesc('units_sold')
            ->limit(20)
            ->get();

        $lowStock = Product::active()
            ->where('stock_quantity', '<=', 5)
            ->orderBy('stock_quantity')
            ->get(['id', 'name', 'sku', 'stock_quantity', 'stock_status']);

        $mostViewed = Product::active()
            ->orderByDesc('views')
            ->take(10)
            ->get(['id', 'name', 'slug', 'views', 'price']);

        return Inertia::render('Admin/Reports/Products', [
            'top_selling' => $topSelling,
            'low_stock'   => $lowStock,
            'most_viewed' => $mostViewed,
            'filters'     => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
        ]);
    }

    /**
     * Relatório de clientes: novos, mais gastadores, recorrentes.
     */
    public function customers(Request $request): Response
    {
        $from = $request->date('from', now()->startOfMonth());
        $to   = $request->date('to', now()->endOfDay());

        $newCustomers = User::where('is_admin', false)
            ->whereBetween('created_at', [$from, $to])
            ->count();

        $topSpenders = User::where('is_admin', false)
            ->withSum(['orders as total_spent' => fn ($q) =>
                $q->where('payment_status', 'paid')
                  ->whereBetween('created_at', [$from, $to])
            ], 'total')
            ->withCount(['orders as orders_count' => fn ($q) =>
                $q->whereBetween('created_at', [$from, $to])
            ])
            ->orderByDesc('total_spent')
            ->take(15)
            ->get(['id', 'name', 'email', 'created_at']);

        return Inertia::render('Admin/Reports/Customers', [
            'new_customers' => $newCustomers,
            'top_spenders'  => $topSpenders->map(fn (User $u) => [
                'id'           => $u->id,
                'name'         => $u->name,
                'email'        => $u->email,
                'total_spent'  => $u->total_spent ?? 0,
                'orders_count' => $u->orders_count,
                'member_since' => $u->created_at->format('d/m/Y'),
            ]),
            'filters' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
        ]);
    }
}
