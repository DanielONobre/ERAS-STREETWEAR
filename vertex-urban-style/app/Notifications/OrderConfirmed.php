<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderConfirmed extends Notification implements ShouldQueue
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
            ->subject('Pedido #' . $this->order->id . ' confirmado — Vertex Urban Style')
            ->view('emails.order-confirmed', [
                'order'    => $this->order,
                'customer' => $notifiable,
                'subject'  => 'Pedido confirmado!',
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'     => 'order_confirmed',
            'order_id' => $this->order->id,
            'message'  => 'Seu pedido #' . $this->order->id . ' foi confirmado.',
            'total'    => $this->order->formatted_total,
        ];
    }
}
