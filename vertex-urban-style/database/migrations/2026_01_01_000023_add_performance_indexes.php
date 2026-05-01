<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── products ──────────────────────────────────────────────────────────
        Schema::table('products', function (Blueprint $table) {
            $table->index('slug');
            $table->index('is_active');
            $table->index('is_featured');
            $table->index('price');
            $table->index('stock_status');
            $table->index(['is_active', 'is_featured']);
            $table->index(['is_active', 'stock_status']);
            $table->index(['category_id', 'is_active']);
            $table->index(['brand_id', 'is_active']);
            $table->index('created_at');
            $table->index('views');
        });

        // ── orders ────────────────────────────────────────────────────────────
        Schema::table('orders', function (Blueprint $table) {
            $table->index('status');
            $table->index('payment_status');
            $table->index(['user_id', 'status']);
            $table->index('created_at');
        });

        // ── categories ────────────────────────────────────────────────────────
        Schema::table('categories', function (Blueprint $table) {
            $table->index('slug');
            $table->index('is_active');
            $table->index(['parent_id', 'is_active']);
        });

        // ── reviews ───────────────────────────────────────────────────────────
        Schema::table('reviews', function (Blueprint $table) {
            $table->index(['product_id', 'is_approved']);
            $table->index('created_at');
        });

        // ── cart_items ────────────────────────────────────────────────────────
        Schema::table('cart_items', function (Blueprint $table) {
            $table->index(['cart_id', 'product_id']);
        });

        // ── wishlists ─────────────────────────────────────────────────────────
        Schema::table('wishlists', function (Blueprint $table) {
            $table->index(['user_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['price']);
            $table->dropIndex(['stock_status']);
            $table->dropIndex(['is_active', 'is_featured']);
            $table->dropIndex(['is_active', 'stock_status']);
            $table->dropIndex(['category_id', 'is_active']);
            $table->dropIndex(['brand_id', 'is_active']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['views']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['payment_status']);
            $table->dropIndex(['user_id', 'status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['parent_id', 'is_active']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['product_id', 'is_approved']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropIndex(['cart_id', 'product_id']);
        });

        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'product_id']);
        });
    }
};
