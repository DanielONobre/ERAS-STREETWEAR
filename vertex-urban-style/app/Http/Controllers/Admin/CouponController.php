<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => Coupon::withCount('orders')
                ->latest()
                ->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Coupons/Form', [
            'coupon' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateCoupon($request);
        Coupon::create($validated);

        return redirect()->route('admin.cupons.index')
            ->with('success', 'Cupom criado com sucesso!');
    }

    public function edit(Coupon $cupom): Response
    {
        return Inertia::render('Admin/Coupons/Form', [
            'coupon' => $cupom,
        ]);
    }

    public function update(Request $request, Coupon $cupom): RedirectResponse
    {
        $validated = $this->validateCoupon($request, $cupom->id);
        $cupom->update($validated);

        return back()->with('success', 'Cupom atualizado!');
    }

    public function destroy(Coupon $cupom): RedirectResponse
    {
        $cupom->delete();

        return back()->with('success', 'Cupom removido.');
    }

    private function validateCoupon(Request $request, ?int $couponId = null): array
    {
        return $request->validate([
            'code'            => 'required|string|max:50|unique:coupons,code,' . $couponId,
            'type'            => 'required|in:percentage,fixed,free_shipping',
            'value'           => 'required|numeric|min:0',
            'min_order_value' => 'nullable|numeric|min:0',
            'max_uses'        => 'nullable|integer|min:1',
            'starts_at'       => 'nullable|date',
            'expires_at'      => 'nullable|date|after_or_equal:starts_at',
            'is_active'       => 'boolean',
        ]);
    }
}
