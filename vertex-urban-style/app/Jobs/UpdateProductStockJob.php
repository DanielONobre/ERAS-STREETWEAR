<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateProductStockJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $timeout = 60;

    public function __construct(public readonly Order $order) {}

    public function handle(): void
    {
        $this->order->loadMissing('items.product', 'items.variant');

        DB::transaction(function () {
            foreach ($this->order->items as $item) {
                $qty = $item->quantity;

                // Decrementa variante (se houver)
                if ($item->variant_id && $item->variant) {
                    $variant = $item->variant;
                    $variant->decrement('stock_quantity', $qty);

                    $variant->update([
                        'stock_status' => $variant->stock_quantity <= 0 ? 'out_of_stock' : 'in_stock',
                    ]);
                }

                // Decrementa produto principal
                if ($item->product) {
                    $product = $item->product;
                    $product->decrement('stock_quantity', $qty);

                    $newStatus = $this->resolveStockStatus($product->fresh());
                    $product->update(['stock_status' => $newStatus]);

                    Log::info('UpdateProductStockJob — estoque atualizado', [
                        'product_id'  => $product->id,
                        'decremented' => $qty,
                        'remaining'   => $product->stock_quantity,
                        'new_status'  => $newStatus,
                    ]);
                }
            }
        });
    }

    private function resolveStockStatus(Product $product): string
    {
        if ($product->stock_quantity <= 0) {
            return 'out_of_stock';
        }

        if ($product->stock_quantity <= 5) {
            return 'low_stock';
        }

        return 'in_stock';
    }

    public function failed(\Throwable $e): void
    {
        Log::error('UpdateProductStockJob::failed — ' . $e->getMessage(), [
            'order_id' => $this->order->id,
        ]);
    }
}
