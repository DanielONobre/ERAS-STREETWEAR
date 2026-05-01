<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderShipped extends Notification implements ShouldQueue
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
            ->subject('Seu pedido #' . $this->order->id . ' foi enviado! — ERAS Streetwear')
            ->view('emails.order-shipped', [
                'order'        => $this->order,
                'customer'     => $notifiable,
                'trackingCode' => $this->order->tracking_code,
                'subject'      => 'Pedido enviado!',
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'          => 'order_shipped',
            'order_id'      => $this->order->id,
            'message'       => 'Seu pedido #' . $this->order->id . ' foi enviado.',
            'tracking_code' => $this->order->tracking_code,
        ];
    }
}
