<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderDelivered extends Notification implements ShouldQueue
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
            ->subject('Pedido #' . $this->order->id . ' entregue! Deixe sua avaliação — Vertex')
            ->view('emails.order-delivered', [
                'order'    => $this->order,
                'customer' => $notifiable,
                'subject'  => 'Pedido entregue!',
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'     => 'order_delivered',
            'order_id' => $this->order->id,
            'message'  => 'Seu pedido #' . $this->order->id . ' foi entregue. Avalie sua compra!',
        ];
    }
}
