<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderAdmin extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('[ADMIN] Novo pedido #' . $this->order->id . ' — R$ ' . number_format($this->order->total, 2, ',', '.'))
            ->view('emails.new-order-admin', [
                'order'   => $this->order,
                'subject' => '[Admin] Novo pedido recebido',
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'          => 'new_order',
            'order_id'      => $this->order->id,
            'customer_name' => $this->order->user?->name,
            'total'         => $this->order->formatted_total,
            'message'       => 'Novo pedido #' . $this->order->id . ' de ' . $this->order->user?->name,
        ];
    }
}
