<?php

namespace App\Observers;

use App\Models\Order;
use App\Notifications\OrderCancelled;
use App\Notifications\OrderDelivered;
use App\Notifications\OrderShipped;
use Illuminate\Support\Facades\Log;

class OrderObserver
{
    public function updated(Order $order): void
    {
        if (! $order->wasChanged('status')) {
            return;
        }

        $customer = $order->user;

        if (! $customer) {
            return;
        }

        $notification = match ($order->status) {
            'shipped'   => new OrderShipped($order),
            'delivered' => new OrderDelivered($order),
            'cancelled' => new OrderCancelled($order),
            default     => null,
        };

        if ($notification === null) {
            return;
        }

        try {
            $customer->notify($notification);
        } catch (\Exception $e) {
            Log::error('OrderObserver — erro ao notificar cliente', [
                'order_id'    => $order->id,
                'status'      => $order->status,
                'customer_id' => $customer->id,
                'error'       => $e->getMessage(),
            ]);
        }
    }
}
