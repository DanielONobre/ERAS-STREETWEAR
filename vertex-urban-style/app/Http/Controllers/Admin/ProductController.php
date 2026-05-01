<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttributeValue;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::withTrashed()
            ->with(['category', 'brand'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'categories' => Category::active()->orderBy('name')->get(),
            'brands'     => Brand::active()->orderBy('name')->get(),
            'product'    => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateProduct($request);
        Product::create($validated);

        return redirect()->route('admin.produtos.index')
            ->with('success', 'Produto criado com sucesso!');
    }

    public function edit(Product $produto): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'categories' => Category::active()->orderBy('name')->get(),
            'brands'     => Brand::active()->orderBy('name')->get(),
            'product'    => $produto->load(['images', 'variants.attributeValues']),
        ]);
    }

    public function update(Request $request, Product $produto): RedirectResponse
    {
        $validated = $this->validateProduct($request, $produto->id);
        $produto->update($validated);

        return back()->with('success', 'Produto atualizado!');
    }

    public function destroy(Product $produto): RedirectResponse
    {
        $produto->delete();

        return back()->with('success', 'Produto removido.');
    }

    /**
     * Faz upload de imagens para um produto.
     */
    public function uploadImages(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'images'    => 'required|array|min:1',
            'images.*'  => 'required|image|mimes:jpeg,png,jpg,webp|max:4096',
        ]);

        $uploaded = [];

        foreach ($request->file('images') as $file) {
            $path = $file->store("products/{$product->id}", 'public');

            $isPrimary = $product->images()->count() === 0 && count($uploaded) === 0;

            $image = ProductImage::create([
                'product_id' => $product->id,
                'url'        => Storage::url($path),
                'alt'        => $product->name,
                'sort_order' => $product->images()->max('sort_order') + 1 + count($uploaded),
                'is_primary' => $isPrimary,
            ]);

            $uploaded[] = $image;
        }

        return response()->json([
            'message' => count($uploaded) . ' imagem(ns) enviada(s) com sucesso!',
            'images'  => $uploaded,
        ]);
    }

    /**
     * Remove uma imagem de produto.
     */
    public function deleteImage(ProductImage $image): JsonResponse
    {
        // Remove o arquivo do disco
        $relativePath = str_replace('/storage/', 'public/', $image->url);
        Storage::delete($relativePath);

        $productId = $image->product_id;
        $wasPrimary = $image->is_primary;

        $image->delete();

        // Se era a imagem primária, promove a próxima
        if ($wasPrimary) {
            ProductImage::where('product_id', $productId)
                ->orderBy('sort_order')
                ->first()
                ?->update(['is_primary' => true]);
        }

        return response()->json(['message' => 'Imagem removida.']);
    }

    /**
     * Cria uma variante para um produto.
     */
    public function storeVariant(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'sku'              => 'nullable|string|unique:product_variants,sku',
            'price'            => 'nullable|numeric|min:0',
            'stock_quantity'   => 'required|integer|min:0',
            'attribute_values' => 'required|array|min:1',
            'attribute_values.*' => 'exists:attribute_values,id',
        ]);

        $variant = ProductVariant::create([
            'product_id'     => $product->id,
            'sku'            => $validated['sku'] ?? null,
            'price'          => $validated['price'] ?? null,
            'stock_quantity' => $validated['stock_quantity'],
        ]);

        $variant->attributeValues()->sync($validated['attribute_values']);

        return response()->json([
            'message' => 'Variante criada com sucesso!',
            'variant' => $variant->load('attributeValues.attribute'),
        ], 201);
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function validateProduct(Request $request, ?int $productId = null): array
    {
        return $request->validate([
            'category_id'       => 'required|exists:categories,id',
            'brand_id'          => 'nullable|exists:brands,id',
            'name'              => 'required|string|max:255',
            'slug'              => 'nullable|string|unique:products,slug,' . $productId,
            'sku'               => 'nullable|string|unique:products,sku,' . $productId,
            'short_description' => 'nullable|string|max:500',
            'description'       => 'nullable|string',
            'price'             => 'required|numeric|min:0',
            'compare_price'     => 'nullable|numeric|gt:price',
            'cost_price'        => 'nullable|numeric|min:0',
            'stock_quantity'    => 'required|integer|min:0',
            'stock_status'      => 'in:in_stock,out_of_stock,on_backorder',
            'weight'            => 'nullable|numeric|min:0',
            'is_active'         => 'boolean',
            'is_featured'       => 'boolean',
            'is_digital'        => 'boolean',
            'meta_title'        => 'nullable|string|max:255',
            'meta_description'  => 'nullable|string|max:500',
        ]);
    }
}
