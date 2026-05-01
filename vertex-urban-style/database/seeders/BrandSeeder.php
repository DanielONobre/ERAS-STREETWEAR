<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            [
                'name'        => 'Eras',
                'slug'        => 'eras',
                'logo'        => 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200',
                'description' => 'Marca principal da ERAS Streetwear. DNA 100% streetwear brasileiro.',
                'is_active'   => true,
            ],
            [
                'name'        => 'NovaMesh',
                'slug'        => 'novamesh',
                'logo'        => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
                'description' => 'Especializada em tecidos técnicos e funcionais para o dia a dia urbano.',
                'is_active'   => true,
            ],
            [
                'name'        => 'GradeZero',
                'slug'        => 'gradezero',
                'logo'        => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
                'description' => 'Streetwear raw com influência do skate e do underground brasileiro.',
                'is_active'   => true,
            ],
            [
                'name'        => 'Drip Lab',
                'slug'        => 'drip-lab',
                'logo'        => 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200',
                'description' => 'Laboratório de moda experimental com estampas únicas e drops limitados.',
                'is_active'   => true,
            ],
            [
                'name'        => 'UrbanCore',
                'slug'        => 'urbancore',
                'logo'        => 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200',
                'description' => 'Basics de alta qualidade com fit moderno para o cotidiano urbano.',
                'is_active'   => true,
            ],
        ];

        foreach ($brands as $brand) {
            DB::table('brands')->insertOrIgnore(array_merge($brand, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
