<?php

namespace App\Jobs;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GenerateInvoicePdfJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 2;
    public int $timeout = 120;

    public function __construct(public readonly Order $order) {}

    public function handle(): void
    {
        $this->order->loadMissing('user', 'items.product', 'address', 'coupon');

        $pdf = Pdf::loadView('pdf.invoice', [
            'order' => $this->order,
        ])->setPaper('a4', 'portrait');

        $path = "invoices/pedido-{$this->order->id}.pdf";

        Storage::disk('local')->put($path, $pdf->output());

        // Salva o caminho no pedido para download posterior
        $this->order->update(['invoice_path' => $path]);

        Log::info('GenerateInvoicePdfJob — PDF gerado', [
            'order_id' => $this->order->id,
            'path'     => $path,
        ]);
    }

    public function failed(\Throwable $e): void
    {
        Log::error('GenerateInvoicePdfJob::failed — ' . $e->getMessage(), [
            'order_id' => $this->order->id,
        ]);
    }
}
