<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SettingsSeeder::class,  // 1. Configurações da loja
            CategorySeeder::class,  // 2. Categorias (Streetwear, Techwear, Outerwear, Acessórios, Sale)
            BrandSeeder::class,     // 3. Marcas (Vertex, NovaMesh, GradeZero, Drip Lab, UrbanCore)
            ProductSeeder::class,   // 4. 20 produtos + variantes (tamanho × cor) + imagens
            UserSeeder::class,      // 5. admin@vertex.com + cliente@teste.com + endereço
            CouponSeeder::class,    // 6. VERTEX10, FRETEGRATIS, BEMVINDO20
        ]);
    }
}
