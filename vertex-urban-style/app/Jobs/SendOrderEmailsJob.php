<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\User;
use App\Notifications\NewOrderAdmin;
use App\Notifications\OrderConfirmed;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class SendOrderEmailsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $timeout = 60;

    public function __construct(public readonly Order $order) {}

    public function handle(): void
    {
        $this->order->loadMissing('user', 'items.product', 'address');

        // Email de confirmação ao cliente
        if ($customer = $this->order->user) {
            try {
                $customer->notify(new OrderConfirmed($this->order));
            } catch (\Exception $e) {
                Log::error('SendOrderEmailsJob — erro ao notificar cliente', [
                    'order_id'    => $this->order->id,
                    'customer_id' => $customer->id,
                    'error'       => $e->getMessage(),
                ]);
            }
        }

        // Email de novo pedido para todos os admins
        $admins = User::where('role', 'admin')->get();
        if ($admins->isNotEmpty()) {
            try {
                Notification::send($admins, new NewOrderAdmin($this->order));
            } catch (\Exception $e) {
                Log::error('SendOrderEmailsJob — erro ao notificar admins', [
                    'order_id' => $this->order->id,
                    'error'    => $e->getMessage(),
                ]);
            }
        }
    }

    public function failed(\Throwable $e): void
    {
        Log::error('SendOrderEmailsJob::failed — ' . $e->getMessage(), [
            'order_id' => $this->order->id,
        ]);
    }
}
