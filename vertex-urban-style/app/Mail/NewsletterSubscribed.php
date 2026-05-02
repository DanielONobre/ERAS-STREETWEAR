<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterSubscribed extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public readonly string $email) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Você tá na lista — ERAS Streetwear',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter-subscribed',
            with: ['email' => $this->email],
        );
    }
}
