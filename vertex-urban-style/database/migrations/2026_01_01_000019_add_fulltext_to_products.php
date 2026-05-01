<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Adiciona índice FULLTEXT nas colunas de busca dos produtos
        // Requer MySQL — em SQLite este índice é ignorado silenciosamente
        if (DB::getDriverName() === 'mysql') {
            DB::statement(
                'ALTER TABLE products ADD FULLTEXT INDEX ft_products_search (name, description, sku)'
            );
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE products DROP INDEX ft_products_search');
        }
    }
};
