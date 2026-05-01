<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'store_name',              'value' => 'Vertex Urban Style'],
            ['key' => 'store_email',             'value' => 'contato@vertexurban.com.br'],
            ['key' => 'store_phone',             'value' => '(11) 99999-0000'],
            ['key' => 'store_cnpj',              'value' => '12.345.678/0001-99'],
            ['key' => 'store_logo',              'value' => 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'],
            ['key' => 'store_description',       'value' => 'Moda streetwear e techwear com identidade urbana.'],
            ['key' => 'store_address',           'value' => 'Rua Augusta, 2000 — Consolação, São Paulo/SP — 01305-100'],
            ['key' => 'currency',                'value' => 'BRL'],
            ['key' => 'currency_symbol',         'value' => 'R$'],
            ['key' => 'free_shipping_threshold', 'value' => '299.00'],
            ['key' => 'default_shipping_cost',   'value' => '19.90'],
            ['key' => 'instagram',               'value' => '@vertexurbanstyle'],
            ['key' => 'tiktok',                  'value' => '@vertexurban'],
            ['key' => 'whatsapp',                'value' => '5511999990000'],
            ['key' => 'facebook',                'value' => 'vertexurbanstyle'],
            ['key' => 'meta_title',              'value' => 'Vertex Urban Style — Streetwear & Techwear'],
            ['key' => 'meta_description',        'value' => 'Descubra a nova era do streetwear brasileiro. Peças exclusivas com identidade urbana e atitude.'],
            ['key' => 'google_analytics',        'value' => ''],
            ['key' => 'maintenance_mode',        'value' => 'false'],
            ['key' => 'orders_email',            'value' => 'pedidos@vertexurban.com.br'],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                array_merge($setting, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
