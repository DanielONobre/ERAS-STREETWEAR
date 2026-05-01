<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::withCount('products')
                ->with('parent')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Form', [
            'category' => null,
            'parents'  => Category::whereNull('parent_id')->active()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateCategory($request);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        Category::create($validated);

        return redirect()->route('admin.categorias.index')
            ->with('success', 'Categoria criada com sucesso!');
    }

    public function edit(Category $categoria): Response
    {
        return Inertia::render('Admin/Categories/Form', [
            'category' => $categoria,
            'parents'  => Category::whereNull('parent_id')
                ->where('id', '!=', $categoria->id)
                ->active()
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(Request $request, Category $categoria): RedirectResponse
    {
        $validated = $this->validateCategory($request, $categoria->id);

        if ($request->hasFile('image')) {
            if ($categoria->image) {
                Storage::disk('public')->delete($categoria->image);
            }
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $categoria->update($validated);

        return back()->with('success', 'Categoria atualizada!');
    }

    public function destroy(Category $categoria): RedirectResponse
    {
        if ($categoria->products()->exists()) {
            return back()->withErrors(['category' => 'Não é possível excluir uma categoria com produtos.']);
        }

        if ($categoria->image) {
            Storage::disk('public')->delete($categoria->image);
        }

        $categoria->delete();

        return back()->with('success', 'Categoria removida.');
    }

    private function validateCategory(Request $request, ?int $categoryId = null): array
    {
        return $request->validate([
            'parent_id'        => 'nullable|exists:categories,id',
            'name'             => 'required|string|max:255',
            'slug'             => 'nullable|string|unique:categories,slug,' . $categoryId,
            'description'      => 'nullable|string|max:1000',
            'is_active'        => 'boolean',
            'sort_order'       => 'integer|min:0',
            'meta_title'       => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'image'            => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);
    }
}
