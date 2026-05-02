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

        $colors = ['Concreto', 'Brasa', 'Preto', 'Areia'];
        $colorIds = [];
        foreach ($colors as $color) {
            $colorIds[$color] = DB::table('attribute_values')->insertGetId([
                'attribute_id' => $colorAttrId,
                'value'        => $color,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }

        // DROP 01 — CONCRETO E BRASA — 12 peças, todas da marca ERAS
        $products = [
            [
                'category_slug' => 'streetwear',
                'name'          => 'Camiseta Asfalto 02',
                'slug'          => 'camiseta-asfalto-02',
                'sku'           => 'ERAS-D01-001',
                'price'         => 149.90,
                'compare_price' => null,
                'cost_price'    => 45.00,
                'stock'         => 60,
                'description'   => '<p>A Asfalto 02 começa onde a cidade termina. Algodão ringspun 220g, corte oversized com ombros caídos e barra reta. Impressão em silk base aquosa — não racha, não desbota. Numerada individualmente na etiqueta interna.</p>',
                'short_desc'    => 'Oversized 220g. Silk aquoso. Numerada. DROP 01.',
                'is_featured'   => true,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'alt' => 'Camiseta Asfalto 02 — Frente'],
                    ['url' => 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 'alt' => 'Camiseta Asfalto 02 — Costas'],
                ],
                'colors'        => ['Concreto', 'Preto'],
                'meta_title'    => 'Camiseta Asfalto 02 — DROP 01 ERAS Streetwear',
                'meta_desc'     => 'Camiseta oversized DROP 01. Algodão 220g, silk aquoso, numerada.',
            ],
            [
                'category_slug' => 'streetwear',
                'name'          => 'Moletom Brasa Capuz',
                'slug'          => 'moletom-brasa-capuz',
                'sku'           => 'ERAS-D01-002',
                'price'         => 289.90,
                'compare_price' => null,
                'cost_price'    => 90.00,
                'stock'         => 35,
                'description'   => '<p>Fleece 380g escovado por dentro, liso por fora. Capuz duplo com cordão encerado. Estampa gráfica em silk descentralizado — intencionalmente fora do eixo. Costuras duplas nas ombreiras e bainha.</p>',
                'short_desc'    => 'Fleece 380g. Capuz duplo. Silk descentralizado.',
                'is_featured'   => true,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800', 'alt' => 'Moletom Brasa Capuz'],
                ],
                'colors'        => ['Preto', 'Concreto'],
                'meta_title'    => 'Moletom Brasa Capuz — DROP 01 ERAS',
                'meta_desc'     => 'Moletom DROP 01 com fleece 380g e capuz duplo.',
            ],
            [
                'category_slug' => 'streetwear',
                'name'          => 'Calça Cargo Viaduto',
                'slug'          => 'calca-cargo-viaduto',
                'sku'           => 'ERAS-D01-003',
                'price'         => 329.90,
                'compare_price' => null,
                'cost_price'    => 105.00,
                'stock'         => 28,
                'description'   => '<p>Ripstop 200g com seis bolsos funcionais. Wide-leg com cós elástico interno e cordão externo. Detalhe de webbing lateral em contraste. Barra sem acabamento — raw e intencional. A peça âncora do DROP 01.</p>',
                'short_desc'    => 'Ripstop wide-leg. 6 bolsos. Webbing lateral. Barra raw.',
                'is_featured'   => true,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800', 'alt' => 'Calça Cargo Viaduto'],
                ],
                'colors'        => ['Concreto', 'Preto'],
                'meta_title'    => 'Calça Cargo Viaduto — DROP 01 ERAS',
                'meta_desc'     => 'Calça cargo wide-leg ripstop DROP 01. Peça âncora da coleção.',
            ],
            [
                'category_slug' => 'streetwear',
                'name'          => 'Camiseta Linha de Trem',
                'slug'          => 'camiseta-linha-de-trem',
                'sku'           => 'ERAS-D01-004',
                'price'         => 149.90,
                'compare_price' => null,
                'cost_price'    => 44.00,
                'stock'         => 55,
                'description'   => '<p>Malha 200g com gráfico de linhas de metrô estilizado em silk localizado no peito. Corte regular com manga curta. A simplicidade é a intenção. Algodão penteado, toque macio, durabilidade de uniforme.</p>',
                'short_desc'    => 'Malha 200g. Gráfico metrô. Algodão penteado.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800', 'alt' => 'Camiseta Linha de Trem'],
                ],
                'colors'        => ['Preto', 'Areia'],
                'meta_title'    => 'Camiseta Linha de Trem — DROP 01 ERAS',
                'meta_desc'     => 'Camiseta DROP 01 com gráfico de metrô. Algodão penteado 200g.',
            ],
            [
                'category_slug' => 'outerwear',
                'name'          => 'Jaqueta Blocão',
                'slug'          => 'jaqueta-blocao',
                'sku'           => 'ERAS-D01-005',
                'price'         => 599.90,
                'compare_price' => null,
                'cost_price'    => 195.00,
                'stock'         => 18,
                'description'   => '<p>Outer em nylon taslan com DWR. Forro em fleece leve removível via zíper interno. Capuz ajustável embutido no colarinho. Costuras termossoldadas. Bolsos internos com zíper YKK. Bordado no peito esquerdo, patch no ombro direito.</p>',
                'short_desc'    => 'Nylon DWR. Fleece removível. Costuras termossoldadas.',
                'is_featured'   => true,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'alt' => 'Jaqueta Blocão'],
                ],
                'colors'        => ['Preto', 'Concreto'],
                'meta_title'    => 'Jaqueta Blocão — DROP 01 ERAS',
                'meta_desc'     => 'Jaqueta DROP 01 com nylon DWR e forro fleece removível.',
            ],
            [
                'category_slug' => 'acessorios',
                'name'          => 'Boné Trucker Esquina',
                'slug'          => 'bone-trucker-esquina',
                'sku'           => 'ERAS-D01-006',
                'price'         => 129.90,
                'compare_price' => null,
                'cost_price'    => 38.00,
                'stock'         => 70,
                'description'   => '<p>5 painéis em twill. Aba pré-curvada. Tela traseira em mesh respirável. Fecho snapback em acetal. Bordado frontal com o logotipo ERAS em fio tonal. Faixa de suor em terry — detalhe que importa.</p>',
                'short_desc'    => 'Trucker 5 painéis. Bordado tonal. Snapback.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', 'alt' => 'Boné Trucker Esquina'],
                ],
                'colors'        => ['Preto', 'Areia'],
                'meta_title'    => 'Boné Trucker Esquina — DROP 01 ERAS',
                'meta_desc'     => 'Boné trucker DROP 01 com bordado tonal e fecho snapback.',
            ],
            [
                'category_slug' => 'streetwear',
                'name'          => 'Camisa Manga Curta Quintal',
                'slug'          => 'camisa-manga-curta-quintal',
                'sku'           => 'ERAS-D01-007',
                'price'         => 199.90,
                'compare_price' => null,
                'cost_price'    => 62.00,
                'stock'         => 40,
                'description'   => '<p>Camisa de botão em viscolinho com leve caimento. Manga curta com dobra. Corte levemente oversized. Estampa all-over em sublimação — padrão geométrico inspirado no azulejo paulistano. Dois bolsos frontais.</p>',
                'short_desc'    => 'Viscolinho all-over sublimação. Corte oversized.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800', 'alt' => 'Camisa Manga Curta Quintal'],
                ],
                'colors'        => ['Concreto', 'Brasa'],
                'meta_title'    => 'Camisa Quintal — DROP 01 ERAS',
                'meta_desc'     => 'Camisa manga curta DROP 01 em viscolinho com estampa all-over.',
            ],
            [
                'category_slug' => 'streetwear',
                'name'          => 'Bermuda Lajota',
                'slug'          => 'bermuda-lajota',
                'sku'           => 'ERAS-D01-008',
                'price'         => 199.90,
                'compare_price' => null,
                'cost_price'    => 60.00,
                'stock'         => 45,
                'description'   => '<p>Sarja 100% algodão com lavagem stone. Corte abaixo do joelho. Quatro bolsos: dois frontais e dois traseiros. Cós com cós interno elástico e cordão frontal. Barra revirada — sem acabamento aparente. Estética de quem não precisa se explicar.</p>',
                'short_desc'    => 'Sarja stonewashed. Abaixo do joelho. Barra revirada.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800', 'alt' => 'Bermuda Lajota'],
                ],
                'colors'        => ['Concreto', 'Preto'],
                'meta_title'    => 'Bermuda Lajota — DROP 01 ERAS',
                'meta_desc'     => 'Bermuda sarja stonewashed DROP 01. Corte abaixo do joelho.',
            ],
            [
                'category_slug' => 'streetwear',
                'name'          => 'Camiseta Brasa Logo',
                'slug'          => 'camiseta-brasa-logo',
                'sku'           => 'ERAS-D01-009',
                'price'         => 149.90,
                'compare_price' => null,
                'cost_price'    => 44.00,
                'stock'         => 65,
                'description'   => '<p>O logo ERAS em silk de alta densidade — relevo tátil, sem brilho. Malha pesada 240g ringspun, gola estruturada. Corte oversized com costuras laterais reforçadas. A peça mais direta do DROP 01.</p>',
                'short_desc'    => 'Malha 240g. Silk alto-relevo. Logo ERAS.',
                'is_featured'   => true,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', 'alt' => 'Camiseta Brasa Logo'],
                ],
                'colors'        => ['Preto', 'Brasa'],
                'meta_title'    => 'Camiseta Brasa Logo — DROP 01 ERAS',
                'meta_desc'     => 'Camiseta logo ERAS em malha 240g com silk alto-relevo. DROP 01.',
            ],
            [
                'category_slug' => 'streetwear',
                'name'          => 'Moletom Crewneck Esquina',
                'slug'          => 'moletom-crewneck-esquina',
                'sku'           => 'ERAS-D01-010',
                'price'         => 289.90,
                'compare_price' => null,
                'cost_price'    => 88.00,
                'stock'         => 32,
                'description'   => '<p>Gola careca clássica com nervura 2x2. Fleece 350g com tecido francês interno. Bordado em linha de alto contraste no peito. Punho e barra com elástico duplo. Sem capuz — intencionalmente limpo.</p>',
                'short_desc'    => 'Fleece 350g francês. Bordado contraste. Crewneck limpo.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800', 'alt' => 'Moletom Crewneck Esquina'],
                ],
                'colors'        => ['Concreto', 'Preto'],
                'meta_title'    => 'Moletom Crewneck Esquina — DROP 01 ERAS',
                'meta_desc'     => 'Moletom crewneck DROP 01 em fleece 350g com bordado em contraste.',
            ],
            [
                'category_slug' => 'streetwear',
                'name'          => 'Calça Wide Leg Avenida',
                'slug'          => 'calca-wide-leg-avenida',
                'sku'           => 'ERAS-D01-011',
                'price'         => 299.90,
                'compare_price' => null,
                'cost_price'    => 95.00,
                'stock'         => 25,
                'description'   => '<p>Sarja mista com elastano (98/2) para mobilidade. Wide-leg com prega frontal. Cós médio com passantes e fivela lateral. Bolsos laterais fundos e bolso faca. Barra com acabamento em viés — a exceção intencional do DROP.</p>',
                'short_desc'    => 'Sarja elástica wide-leg. Prega frontal. Fivela lateral.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800', 'alt' => 'Calça Wide Leg Avenida'],
                ],
                'colors'        => ['Concreto', 'Preto'],
                'meta_title'    => 'Calça Wide Leg Avenida — DROP 01 ERAS',
                'meta_desc'     => 'Calça wide-leg DROP 01 em sarja com elastano e prega frontal.',
            ],
            [
                'category_slug' => 'acessorios',
                'name'          => 'Meia Pacote Drop 01',
                'slug'          => 'meia-pacote-drop-01',
                'sku'           => 'ERAS-D01-012',
                'price'         => 59.90,
                'compare_price' => null,
                'cost_price'    => 18.00,
                'stock'         => 120,
                'description'   => '<p>Pack com 3 pares de meias cano médio. Algodão egípcio com elastano. Reforço em talão e biqueira. Logo ERAS bordado na cana. Embalagem numerada do DROP 01 — objeto de coleção.</p>',
                'short_desc'    => 'Pack 3 pares. Algodão egípcio. Embalagem numerada.',
                'is_featured'   => false,
                'images'        => [
                    ['url' => 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800', 'alt' => 'Meia Pacote Drop 01'],
                ],
                'colors'        => ['Preto', 'Concreto'],
                'meta_title'    => 'Meia Pacote Drop 01 — ERAS',
                'meta_desc'     => 'Pack 3 meias DROP 01 em algodão egípcio. Embalagem numerada.',
            ],
        ];

        foreach ($products as $productData) {
            $productColors  = $productData['colors'];
            $categoryId     = $categories[$productData['category_slug']];
            $brandId        = $brands['eras'];

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
                        'price'          => null,
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
