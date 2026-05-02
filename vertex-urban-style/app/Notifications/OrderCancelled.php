<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderCancelled extends Notification implements ShouldQueue
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
            ->subject('Pedido #' . $this->order->id . ' cancelado — ERAS Streetwear')
            ->view('emails.order-cancelled', [
                'order'    => $this->order,
                'customer' => $notifiable,
                'subject'  => 'Pedido cancelado',
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'     => 'order_cancelled',
            'order_id' => $this->order->id,
            'message'  => 'Seu pedido #' . $this->order->id . ' foi cancelado.',
            'total'    => $this->order->formatted_total,
        ];
    }
}
