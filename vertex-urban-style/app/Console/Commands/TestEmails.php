<?php

namespace App\Console\Commands;

use App\Mail\NewsletterSubscribed;
use App\Models\Order;
use App\Models\User;
use App\Notifications\NewOrderAdmin;
use App\Notifications\OrderCancelled;
use App\Notifications\OrderConfirmed;
use App\Notifications\OrderDelivered;
use App\Notifications\OrderShipped;
use App\Notifications\PasswordReset;
use App\Notifications\WelcomeEmail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class TestEmails extends Command
{
    protected $signature = 'eras:test-emails
                            {--to= : Destinatário (padrão: email do primeiro User do banco)}
                            {--type= : Tipo específico (welcome,order-confirmed,order-shipped,order-delivered,order-cancelled,admin,password-reset,newsletter)}';

    protected $description = 'Envia todos os emails transacionais para teste visual';

    public function handle(): int
    {
        $to   = $this->option('to');
        $type = $this->option('type');

        // Resolve user real do banco
        $user = $this->resolveUser($to);

        if (! $user) {
            $this->error('Nenhum User encontrado no banco. Rode php artisan migrate:fresh --seed primeiro.');
            return self::FAILURE;
        }

        // Se --to foi passado mas não bate com o email do user encontrado, só ajusta o destinatário
        $recipient = $to ?? $user->email;

        if (! $user->email) {
            $this->error('O User encontrado não possui email definido.');
            return self::FAILURE;
        }

        $this->info("User:        {$user->name} <{$user->email}>");
        $this->info("Destinatário: {$recipient}");
        $this->newLine();

        // Resolve order real do banco (qualquer um com items carregados)
        $order = Order::with('items', 'address')->first();

        if (! $order) {
            $this->warn('Nenhum Order encontrado — emails de pedido serão pulados.');
        }

        $token = 'fake-token-' . Str::random(40);

        $templates = [
            'welcome'         => fn () => $user->notify(new WelcomeEmail()),
            'order-confirmed' => $order ? fn () => $user->notify(new OrderConfirmed($order)) : null,
            'order-shipped'   => $order ? fn () => $user->notify(new OrderShipped($order))   : null,
            'order-delivered' => $order ? fn () => $user->notify(new OrderDelivered($order)) : null,
            'order-cancelled' => $order ? fn () => $user->notify(new OrderCancelled($order)) : null,
            'admin'           => $order ? fn () => $user->notify(new NewOrderAdmin($order))  : null,
            'password-reset'  => fn () => $user->notify(new PasswordReset($token)),
            'newsletter'      => fn () => Mail::to($recipient)->send(new NewsletterSubscribed($recipient)),
        ];

        $toSend = $type ? [$type => $templates[$type] ?? null] : $templates;

        foreach ($toSend as $name => $send) {
            if ($send === null) {
                $this->line("  <comment>–</comment> {$name} <fg=gray>(pulado — sem dados no banco)</>");
                continue;
            }

            $this->line("  Enviando <comment>{$name}</comment>...");

            try {
                $send();
                $this->line("  <info>✓</info> {$name}");
            } catch (\Throwable $e) {
                $this->error("  ✗ {$name}: " . $e->getMessage());
            }
        }

        $this->newLine();
        $this->info('Pronto. Verifique storage/logs/laravel.log (driver=log) ou sua caixa de entrada.');

        return self::SUCCESS;
    }

    private function resolveUser(?string $email): ?User
    {
        if ($email) {
            return User::where('email', $email)->first()
                ?? User::where('email', 'admin@eras.com.br')->first()
                ?? User::first();
        }

        return User::where('email', 'admin@eras.com.br')->first()
            ?? User::first();
    }
}
