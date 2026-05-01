<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Busca IDs de categorias e marcas
        $categories = DB::table('categories')->pluck('id', 'slug');
        $brands     = DB::table('brands')->pluck('id', 'slug');

        // Insere atributos e valores
        $sizeAttrId  = DB::table('attributes')->insertGetId(['name' => 'Tamanho', 'slug' => 'tamanho', 'created_at' => now(), 'updated_at' => now()]);
        $colorAttrId = DB::table('attributes')->insertGetId(['name' => 'Cor',     'slug' => 'cor',     'created_at' => now(), 'updated_at' => now()]);

        $sizes = ['P', 'M', 'G', 'GG'];
        $sizeIds = [];
        foreach ($sizes as $size) {
            $sizeIds[$size] = DB::table('attribute_values')->insertGetId([
                'attribute_id' => $sizeAttrId,
                'value'        => $size,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }

        $colors = ['Preto', 'Branco', 'Cinza', 'Verde Militar', 'Azul Marinho'];
        $colorIds = [];
        foreach ($colors as $color) {
            $colorIds[$color] = DB::table('attribute_values')->insertGetId([
                'attribute_id' => $colorAttrId,
                'value'        => $color,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }

        $products = [
            // ── STREETWEAR ──────────────────────────────────────────────
            [
                'category_slug' => 'streetwear',
                'brand_slug'    => 'vertex',
                'name'          => 'Camiseta Oversized Vertex Logo',
                'slug'          => 'camiseta-oversized-vertex-logo',
                'sku'           => 'VTX-TSH-001',
                'price'         => 149.90,
                'compare_price' => 189.90,
                'cost_price'    => 45.00,
                'stock'         => 80,
                'description'   => '<p>Camiseta oversized com bordado tonal do logo Vertex. Confeccionada em algodão premium 100% ringspun com gramatura 220g/m². Fit relaxed com ombros caídos e barra reta.</p>',
                'short_desc'    => 'Oversized com bordado tonal. Algodão 220g premium.',
                'is_featured'   => true,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'alt' => 'Camiseta Oversized Vertex Logo — Frente'],
                    ['url' => 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 'alt' => 'Camiseta Oversized Vertex Logo — Costas'],
                ],
                'colors'        => ['Preto', 'Branco', 'Cinza'],
                'meta_title'    => 'Camiseta Oversized Vertex Logo | Streetwear',
                'meta_desc'     => 'Camiseta oversized com bordado tonal Vertex. Algodão premium 220g.',
            ],
            [
                'category_slug' => 'streetwear',
                'brand_slug'    => 'gradezero',
                'name'          => 'Moletom Cropped GradeZero Stamp',
                'slug'          => 'moletom-cropped-gradezero-stamp',
                'sku'           => 'GZ-SWT-001',
                'price'         => 289.90,
                'compare_price' => 349.90,
                'cost_price'    => 90.00,
                'stock'         => 45,
                'description'   => '<p>Moletom cropped com gola careca e estampa gráfica GradeZero. Fleece interno escovado, exterior liso. Construção com costura dupla reforçada nas mangas e bainha.</p>',
                'short_desc'    => 'Cropped com estampa gráfica. Fleece interno escovado.',
                'is_featured'   => true,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800', 'alt' => 'Moletom Cropped GradeZero'],
                ],
                'colors'        => ['Preto', 'Cinza'],
                'meta_title'    => 'Moletom Cropped GradeZero Stamp',
                'meta_desc'     => 'Moletom cropped streetwear com estampa gráfica exclusiva.',
            ],
            [
                'category_slug' => 'streetwear',
                'brand_slug'    => 'drip-lab',
                'name'          => 'Calça Cargo Drip Lab Wide',
                'slug'          => 'calca-cargo-drip-lab-wide',
                'sku'           => 'DL-PNT-001',
                'price'         => 329.90,
                'compare_price' => null,
                'cost_price'    => 110.00,
                'stock'         => 30,
                'description'   => '<p>Calça cargo wide-leg com 6 bolsos funcionais e cós elástico. Tecido ripstop resistente. Fio duplo na barra e nos bolsos laterais. Detalhe de webbing na cintura.</p>',
                'short_desc'    => 'Wide-leg cargo com 6 bolsos. Ripstop resistente.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800', 'alt' => 'Calça Cargo Drip Lab'],
                ],
                'colors'        => ['Preto', 'Verde Militar'],
                'meta_title'    => 'Calça Cargo Wide Drip Lab',
                'meta_desc'     => 'Calça cargo wide-leg com ripstop e 6 bolsos funcionais.',
            ],
            [
                'category_slug' => 'streetwear',
                'brand_slug'    => 'urbancore',
                'name'          => 'Regata Mesh UrbanCore Performance',
                'slug'          => 'regata-mesh-urbancore-performance',
                'sku'           => 'UC-TNK-001',
                'price'         => 119.90,
                'compare_price' => 149.90,
                'cost_price'    => 35.00,
                'stock'         => 60,
                'description'   => '<p>Regata em malha mesh respirável com recorte estrutural nas costas. Fit slim-athletic com costura flat-lock antifrição. Ideal para workouts e uso casual urbano.</p>',
                'short_desc'    => 'Mesh respirável com recortes estruturais.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800', 'alt' => 'Regata Mesh UrbanCore'],
                ],
                'colors'        => ['Preto', 'Branco', 'Cinza'],
                'meta_title'    => 'Regata Mesh Performance UrbanCore',
                'meta_desc'     => 'Regata mesh respirável para streetwear e performance.',
            ],
            [
                'category_slug' => 'streetwear',
                'brand_slug'    => 'vertex',
                'name'          => 'Shorts Cargo Vertex 5 Pocket',
                'slug'          => 'shorts-cargo-vertex-5-pocket',
                'sku'           => 'VTX-SRT-001',
                'price'         => 199.90,
                'compare_price' => null,
                'cost_price'    => 65.00,
                'stock'         => 50,
                'description'   => '<p>Shorts cargo 5 bolsos com cós ajustável e cordão. Tecido sarja 100% algodão stonewashed. Barra sem acabamento para estética raw. Disponível em múltiplas cores.</p>',
                'short_desc'    => 'Cargo 5 bolsos. Sarja stonewashed. Barra raw.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800', 'alt' => 'Shorts Cargo Vertex'],
                ],
                'colors'        => ['Preto', 'Verde Militar', 'Cinza'],
                'meta_title'    => 'Shorts Cargo 5 Pocket Vertex',
                'meta_desc'     => 'Shorts cargo streetwear com 5 bolsos em sarja stonewashed.',
            ],

            // ── TECHWEAR ─────────────────────────────────────────────────
            [
                'category_slug' => 'techwear',
                'brand_slug'    => 'novamesh',
                'name'          => 'Calça Techwear NovaMesh Modular',
                'slug'          => 'calca-techwear-novamesh-modular',
                'sku'           => 'NM-PNT-001',
                'price'         => 489.90,
                'compare_price' => 589.90,
                'cost_price'    => 160.00,
                'stock'         => 25,
                'description'   => '<p>Calça techwear com painel modular de D-rings e webbing. Tecido windbreaker impermeável. Bolsos com zíper YKK ocultos. Tornozelo ajustável com velcro. Design inspirado no militarismo futurista.</p>',
                'short_desc'    => 'Windbreaker impermeável. D-rings modulares. Zíper YKK.',
                'is_featured'   => true,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800', 'alt' => 'Calça Techwear NovaMesh'],
                ],
                'colors'        => ['Preto'],
                'meta_title'    => 'Calça Techwear Modular NovaMesh',
                'meta_desc'     => 'Calça techwear com painel modular e tecido windbreaker impermeável.',
            ],
            [
                'category_slug' => 'techwear',
                'brand_slug'    => 'novamesh',
                'name'          => 'Jaqueta Windbreaker NovaMesh Shell',
                'slug'          => 'jaqueta-windbreaker-novamesh-shell',
                'sku'           => 'NM-JKT-001',
                'price'         => 599.90,
                'compare_price' => 749.90,
                'cost_price'    => 200.00,
                'stock'         => 20,
                'description'   => '<p>Jaqueta shell leve com tecnologia de repelência DWR. Costuras termossoldadas. Capuz ajustável com estrutura embutida. Bolsos internos e externos com zíper impermeável. Packable — compacta no bolso.</p>',
                'short_desc'    => 'Shell DWR packable. Costuras termossoldadas.',
                'is_featured'   => true,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'alt' => 'Jaqueta Windbreaker NovaMesh'],
                ],
                'colors'        => ['Preto', 'Verde Militar'],
                'meta_title'    => 'Jaqueta Windbreaker Shell NovaMesh',
                'meta_desc'     => 'Jaqueta windbreaker techwear com repelência DWR e costuras termossoldadas.',
            ],
            [
                'category_slug' => 'techwear',
                'brand_slug'    => 'drip-lab',
                'name'          => 'Top Cropped Drip Lab Tech Bra',
                'slug'          => 'top-cropped-drip-lab-tech-bra',
                'sku'           => 'DL-TOP-001',
                'price'         => 169.90,
                'compare_price' => null,
                'cost_price'    => 55.00,
                'stock'         => 40,
                'description'   => '<p>Top cropped em lycra técnica com suporte médio e alças ajustáveis. Tecido com compressão leve e controle de umidade. Costura flat-lock plana. Ideal para treino e uso urbano.</p>',
                'short_desc'    => 'Lycra técnica com controle de umidade. Suporte médio.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800', 'alt' => 'Top Cropped Tech Bra'],
                ],
                'colors'        => ['Preto', 'Cinza'],
                'meta_title'    => 'Top Cropped Tech Bra Drip Lab',
                'meta_desc'     => 'Top cropped técnico com compressão leve e controle de umidade.',
            ],

            // ── OUTERWEAR ────────────────────────────────────────────────
            [
                'category_slug' => 'outerwear',
                'brand_slug'    => 'vertex',
                'name'          => 'Parka Oversized Vertex Arctic',
                'slug'          => 'parka-oversized-vertex-arctic',
                'sku'           => 'VTX-PRK-001',
                'price'         => 899.90,
                'compare_price' => 1099.90,
                'cost_price'    => 300.00,
                'stock'         => 15,
                'description'   => '<p>Parka oversized com forro em sherpa removível. Tecido outer DWR ripstop. Capuz com estrutura e forro de pelo sintético removível. 8 bolsos funcionais. Botões e zíper YKK duplos.</p>',
                'short_desc'    => 'Sherpa removível. DWR ripstop. 8 bolsos.',
                'is_featured'   => true,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800', 'alt' => 'Parka Oversized Vertex Arctic'],
                    ['url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', 'alt' => 'Parka Vertex Arctic — Detalhe'],
                ],
                'colors'        => ['Preto', 'Verde Militar'],
                'meta_title'    => 'Parka Oversized Arctic Vertex',
                'meta_desc'     => 'Parka streetwear com forro sherpa removível e tecnologia DWR.',
            ],
            [
                'category_slug' => 'outerwear',
                'brand_slug'    => 'gradezero',
                'name'          => 'Jaqueta Bomber GradeZero Varsity',
                'slug'          => 'jaqueta-bomber-gradezero-varsity',
                'sku'           => 'GZ-JKT-001',
                'price'         => 549.90,
                'compare_price' => 649.90,
                'cost_price'    => 180.00,
                'stock'         => 22,
                'description'   => '<p>Bomber varsity com corpo em nylon e mangas em malha canelada. Bordados no peito e costas. Forro em cetim com estampa exclusiva. Zíper YKK central com guarda-vento interno.</p>',
                'short_desc'    => 'Varsity nylon + canelado. Bordados exclusivos.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800', 'alt' => 'Bomber Varsity GradeZero'],
                ],
                'colors'        => ['Preto', 'Azul Marinho'],
                'meta_title'    => 'Bomber Varsity GradeZero',
                'meta_desc'     => 'Jaqueta bomber varsity streetwear com bordados exclusivos.',
            ],
            [
                'category_slug' => 'outerwear',
                'brand_slug'    => 'urbancore',
                'name'          => 'Corta-Vento UrbanCore Packable',
                'slug'          => 'corta-vento-urbancore-packable',
                'sku'           => 'UC-JKT-001',
                'price'         => 349.90,
                'compare_price' => null,
                'cost_price'    => 110.00,
                'stock'         => 35,
                'description'   => '<p>Corta-vento ultraleve que compacta no próprio bolso. Tecido taslan impermeável. Costuras seladas. Capuz com ajuste em cordão. Peso: 280g. Perfeito para viagens e uso urbano diário.</p>',
                'short_desc'    => 'Packable 280g. Taslan impermeável. Costuras seladas.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800', 'alt' => 'Corta-Vento Packable UrbanCore'],
                ],
                'colors'        => ['Preto', 'Verde Militar'],
                'meta_title'    => 'Corta-Vento Packable UrbanCore',
                'meta_desc'     => 'Corta-vento ultraleve e packable com tecido taslan impermeável.',
            ],

            // ── ACESSÓRIOS ───────────────────────────────────────────────
            [
                'category_slug' => 'acessorios',
                'brand_slug'    => 'vertex',
                'name'          => 'Boné Snapback Vertex 6-Panel',
                'slug'          => 'bone-snapback-vertex-6-panel',
                'sku'           => 'VTX-CAP-001',
                'price'         => 129.90,
                'compare_price' => null,
                'cost_price'    => 40.00,
                'stock'         => 70,
                'description'   => '<p>Boné snapback 6 painéis com estrutura em twill de algodão. Aba plana com bordado tonal do logo Vertex. Ajuste snapback em plástico acetal. Faixa de suor em terry interno.</p>',
                'short_desc'    => 'Snapback 6 painéis. Bordado tonal. Aba plana.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', 'alt' => 'Boné Snapback Vertex'],
                ],
                'colors'        => ['Preto', 'Branco', 'Cinza'],
                'meta_title'    => 'Boné Snapback 6-Panel Vertex',
                'meta_desc'     => 'Snapback streetwear com bordado tonal e estrutura em twill.',
            ],
            [
                'category_slug' => 'acessorios',
                'brand_slug'    => 'drip-lab',
                'name'          => 'Shoulder Bag Drip Lab Sling',
                'slug'          => 'shoulder-bag-drip-lab-sling',
                'sku'           => 'DL-BAG-001',
                'price'         => 199.90,
                'compare_price' => 249.90,
                'cost_price'    => 65.00,
                'stock'         => 28,
                'description'   => '<p>Shoulder bag sling em nylon balístico 1000D. Compartimento principal com zíper YKK. Bolso frontal com organizer interno. Alça ajustável com fivela de liberação rápida. Volume: 7L.</p>',
                'short_desc'    => 'Nylon balístico 1000D. 7L. Fivela quick-release.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'alt' => 'Shoulder Bag Sling Drip Lab'],
                ],
                'colors'        => ['Preto'],
                'meta_title'    => 'Shoulder Bag Sling Drip Lab',
                'meta_desc'     => 'Shoulder bag sling em nylon balístico para uso urbano.',
            ],
            [
                'category_slug' => 'acessorios',
                'brand_slug'    => 'novamesh',
                'name'          => 'Gorro Beanie NovaMesh Ribbed',
                'slug'          => 'gorro-beanie-novamesh-ribbed',
                'sku'           => 'NM-BNI-001',
                'price'         => 89.90,
                'compare_price' => null,
                'cost_price'    => 28.00,
                'stock'         => 90,
                'description'   => '<p>Gorro beanie em knit canelado 2x2 com mistura de lã e acrílico. Borda dobrada dupla para maior cobertura. Detalhe de etiqueta woven no cuff. Disponível em cores neutras.</p>',
                'short_desc'    => 'Knit canelado 2x2. Lã + acrílico. Borda dupla.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800', 'alt' => 'Gorro Beanie NovaMesh'],
                ],
                'colors'        => ['Preto', 'Cinza', 'Branco'],
                'meta_title'    => 'Gorro Beanie Ribbed NovaMesh',
                'meta_desc'     => 'Beanie em knit canelado com lã e acrílico para o frio urbano.',
            ],

            // ── SALE ─────────────────────────────────────────────────────
            [
                'category_slug' => 'sale',
                'brand_slug'    => 'gradezero',
                'name'          => 'Camiseta Longsleeve GradeZero Raw',
                'slug'          => 'camiseta-longsleeve-gradezero-raw',
                'sku'           => 'GZ-LSL-001',
                'price'         => 119.90,
                'compare_price' => 179.90,
                'cost_price'    => 38.00,
                'stock'         => 55,
                'description'   => '<p>Longsleeve com punho canelado e gola careca. Algodão pesado 240g com lavagem stone. Estampa em silk localizado. Fit oversized com manga extra longa.</p>',
                'short_desc'    => 'Algodão 240g stone. Silk localizado. Fit oversized.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', 'alt' => 'Longsleeve GradeZero Raw'],
                ],
                'colors'        => ['Preto', 'Cinza'],
                'meta_title'    => 'Longsleeve Raw GradeZero — Sale',
                'meta_desc'     => 'Longsleeve streetwear em promoção. Algodão 240g com lavagem stone.',
            ],
            [
                'category_slug' => 'sale',
                'brand_slug'    => 'urbancore',
                'name'          => 'Meias Pack UrbanCore Crew 3-Pack',
                'slug'          => 'meias-pack-urbancore-crew-3pack',
                'sku'           => 'UC-SOC-001',
                'price'         => 59.90,
                'compare_price' => 89.90,
                'cost_price'    => 18.00,
                'stock'         => 120,
                'description'   => '<p>Pack com 3 pares de meias crew em algodão egipcio com elastano. Cano médio. Reforço em talão e biqueira. Logo UrbanCore bordado na parte lateral.</p>',
                'short_desc'    => 'Pack 3 pares. Algodão egípcio. Cano médio.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800', 'alt' => 'Meias Crew Pack UrbanCore'],
                ],
                'colors'        => ['Preto', 'Branco'],
                'meta_title'    => 'Meias Crew 3-Pack UrbanCore — Sale',
                'meta_desc'     => 'Pack 3 pares de meias crew em algodão egípcio em promoção.',
            ],
            [
                'category_slug' => 'sale',
                'brand_slug'    => 'vertex',
                'name'          => 'Bucket Hat Vertex Washed',
                'slug'          => 'bucket-hat-vertex-washed',
                'sku'           => 'VTX-BKT-001',
                'price'         => 99.90,
                'compare_price' => 139.90,
                'cost_price'    => 32.00,
                'stock'         => 40,
                'description'   => '<p>Bucket hat em sarja stonewashed com borda larga. Teto em 6 painéis. Furo de ventilação metálico em cada painel. Etiqueta tecida interna. Lavagem stone para efeito envelhecido.</p>',
                'short_desc'    => 'Sarja stonewashed. 6 painéis. Borda larga.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800', 'alt' => 'Bucket Hat Vertex Washed'],
                ],
                'colors'        => ['Preto', 'Cinza', 'Verde Militar'],
                'meta_title'    => 'Bucket Hat Washed Vertex — Sale',
                'meta_desc'     => 'Bucket hat stonewashed Vertex em promoção.',
            ],
        ];

        foreach ($products as $productData) {
            $productColors  = $productData['colors'];
            $categoryId     = $categories[$productData['category_slug']];
            $brandId        = $brands[$productData['brand_slug']];

            // Insere o produto
            $productId = DB::table('products')->insertGetId([
                'category_id'       => $categoryId,
                'brand_id'          => $brandId,
                'name'              => $productData['name'],
                'slug'              => $productData['slug'],
                'description'       => $productData['description'],
                'short_description' => $productData['short_desc'],
                'sku'               => $productData['sku'],
                'price'             => $productData['price'],
                'compare_price'     => $productData['compare_price'],
                'cost_price'        => $productData['cost_price'],
                'stock_quantity'    => $productData['stock'],
                'stock_status'      => $productData['stock'] > 0 ? 'in_stock' : 'out_of_stock',
                'weight'            => round(rand(200, 800) / 1000, 3),
                'is_active'         => true,
                'is_featured'       => $productData['is_featured'],
                'is_digital'        => false,
                'meta_title'        => $productData['meta_title'],
                'meta_description'  => $productData['meta_desc'],
                'views'             => rand(50, 3000),
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);

            // Insere imagens
            $primaryImageId = null;
            foreach ($productData['images'] as $idx => $img) {
                $imageId = DB::table('product_images')->insertGetId([
                    'product_id' => $productId,
                    'url'        => $img['url'],
                    'alt'        => $img['alt'],
                    'sort_order' => $idx,
                    'is_primary' => $idx === 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                if ($idx === 0) {
                    $primaryImageId = $imageId;
                }
            }

            // Cria variantes: cada cor × cada tamanho
            foreach ($productColors as $colorName) {
                $colorId = $colorIds[$colorName];
                foreach ($sizes as $size) {
                    $sizeId = $sizeIds[$size];

                    $stock = rand(0, 20);
                    $variantId = DB::table('product_variants')->insertGetId([
                        'product_id'     => $productId,
                        'sku'            => $productData['sku'] . '-' . strtoupper(substr($colorName, 0, 3)) . '-' . $size,
                        'price'          => null, // herda do produto
                        'stock_quantity' => $stock,
                        'image_id'       => $primaryImageId,
                        'created_at'     => now(),
                        'updated_at'     => now(),
                    ]);

                    DB::table('product_variant_attribute_values')->insert([
                        ['variant_id' => $variantId, 'attribute_value_id' => $sizeId],
                        ['variant_id' => $variantId, 'attribute_value_id' => $colorId],
                    ]);
                }
            }
        }
    }
}
