<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orderService,
    ) {}

    public function index(Request $request): Response
    {
        $orders = Order::with('user')
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->when($request->payment_status, fn ($q) => $q->where('payment_status', $request->payment_status))
            ->when($request->search, fn ($q) =>
                $q->where('id', 'like', "%{$request->search}%")
                  ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$request->search}%"))
            )
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders'  => $orders->through(fn (Order $o) => [
                'id'              => $o->id,
                'customer'        => $o->user?->name ?? 'Visitante',
                'formatted_total' => $o->formatted_total,
                'status'          => $o->status,
                'status_label'    => $o->status_label,
                'status_color'    => $o->status_color,
                'payment_status'  => $o->payment_status,
                'payment_method'  => $o->payment_method,
                'created_at'      => $o->created_at->format('d/m/Y H:i'),
            ]),
            'filters' => $request->only(['status', 'payment_status', 'search']),
        ]);
    }

    public function show(Order $pedido): Response
    {
        $pedido->load('items', 'user', 'address', 'coupon');

        return Inertia::render('Admin/Orders/Show', [
            'order' => array_merge($pedido->toArray(), [
                'status_label'         => $pedido->status_label,
                'status_color'         => $pedido->status_color,
                'payment_status_label' => $pedido->payment_status_label,
                'formatted_total'      => $pedido->formatted_total,
                'can_be_cancelled'     => $pedido->canBeCancelled(),
            ]),
        ]);
    }

    public function update(Request $request, Order $pedido): RedirectResponse
    {
        $request->validate([
            'status'        => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled,refunded',
            'tracking_code' => 'nullable|string|max:100',
        ]);

        if ($request->tracking_code) {
            $pedido->update(['tracking_code' => $request->tracking_code]);
        }

        $this->orderService->updateStatus($pedido, $request->status);

        return back()->with('success', 'Pedido atualizado para: ' . $pedido->fresh()->status_label);
    }

    /**
     * Atualiza apenas o código de rastreio sem alterar o status.
     */
    public function updateTracking(Request $request, Order $pedido): RedirectResponse
    {
        $request->validate([
            'tracking_code'   => 'required|string|max:100',
            'shipping_method' => 'nullable|string|max:50',
        ]);

        $pedido->update([
            'tracking_code'   => $request->tracking_code,
            'shipping_method' => $request->shipping_method ?? $pedido->shipping_method,
        ]);

        // Muda para "enviado" caso ainda não esteja
        if ($pedido->status === 'processing') {
            $pedido->markAsShipped($request->tracking_code);
        }

        return back()->with('success', 'Código de rastreio atualizado: ' . $request->tracking_code);
    }

    public function invoice(Order $pedido): HttpResponse
    {
        $path = $this->orderService->generateInvoice($pedido);

        return response()->download($path, "pedido-{$pedido->id}.txt");
    }
}
