<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            [
                'code'            => 'VERTEX10',
                'type'            => 'percentage',
                'value'           => 10.00,
                'min_order_value' => 150.00,
                'max_uses'        => null,       // uso ilimitado
                'used_count'      => 0,
                'starts_at'       => now(),
                'expires_at'      => null,        // sem expiração
                'is_active'       => true,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'code'            => 'FRETEGRATIS',
                'type'            => 'free_shipping',
                'value'           => 0.00,        // frete grátis — desconto é no shipping
                'min_order_value' => 0.00,
                'max_uses'        => null,
                'used_count'      => 0,
                'starts_at'       => now(),
                'expires_at'      => null,
                'is_active'       => true,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'code'            => 'BEMVINDO20',
                'type'            => 'percentage',
                'value'           => 20.00,
                'min_order_value' => 0.00,
                'max_uses'        => 1,           // 1 uso por cliente (lógica na app)
                'used_count'      => 0,
                'starts_at'       => now(),
                'expires_at'      => now()->addDays(30),
                'is_active'       => true,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
        ];

        foreach ($coupons as $coupon) {
            DB::table('coupons')->updateOrInsert(
                ['code' => $coupon['code']],
                $coupon
            );
        }
    }
}
