<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name'             => 'Streetwear',
                'slug'             => 'streetwear',
                'description'      => 'Coleção principal de roupas streetwear com identidade urbana.',
                'image'            => 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600',
                'parent_id'        => null,
                'is_active'        => true,
                'meta_title'       => 'Streetwear — Vertex Urban Style',
                'meta_description' => 'Explore nossa coleção de streetwear urbano.',
                'sort_order'       => 1,
            ],
            [
                'name'             => 'Techwear',
                'slug'             => 'techwear',
                'description'      => 'Roupas funcionais com estética futurista e tecnologia têxtil.',
                'image'            => 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600',
                'parent_id'        => null,
                'is_active'        => true,
                'meta_title'       => 'Techwear — Vertex Urban Style',
                'meta_description' => 'Techwear com funcionalidade e estilo futurista.',
                'sort_order'       => 2,
            ],
            [
                'name'             => 'Outerwear',
                'slug'             => 'outerwear',
                'description'      => 'Jaquetas, parkas e casacos para todos os climas urbanos.',
                'image'            => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
                'parent_id'        => null,
                'is_active'        => true,
                'meta_title'       => 'Outerwear — Vertex Urban Style',
                'meta_description' => 'Jaquetas e casacos streetwear de alta qualidade.',
                'sort_order'       => 3,
            ],
            [
                'name'             => 'Acessórios',
                'slug'             => 'acessorios',
                'description'      => 'Bonés, bolsas, cintos e acessórios para completar o look.',
                'image'            => 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600',
                'parent_id'        => null,
                'is_active'        => true,
                'meta_title'       => 'Acessórios — Vertex Urban Style',
                'meta_description' => 'Acessórios streetwear para completar o seu look.',
                'sort_order'       => 4,
            ],
            [
                'name'             => 'Sale',
                'slug'             => 'sale',
                'description'      => 'Peças com desconto especial. Aproveite enquanto dura o estoque!',
                'image'            => 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600',
                'parent_id'        => null,
                'is_active'        => true,
                'meta_title'       => 'Sale — Vertex Urban Style',
                'meta_description' => 'Produtos em promoção com descontos exclusivos.',
                'sort_order'       => 5,
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insertOrIgnore(array_merge($category, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
