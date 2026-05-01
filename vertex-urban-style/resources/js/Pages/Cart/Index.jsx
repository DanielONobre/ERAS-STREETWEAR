import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import StoreLayout from '@layouts/StoreLayout';
import { EmptyCart } from '@components/UI/EmptyState';
import {
    TrashIcon, MinusIcon, PlusIcon, TagIcon, TruckIcon,
    MapPinIcon, ShoppingBagIcon, XMarkIcon,
} from '@heroicons/react/24/outline';
import { fmt } from '@lib/utils';

/* ─── CEP mask ───────────────────────────────────────────────────────── */
const maskCep = (v) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

/* ═══════════════════════════════════════════════════════════════════════ */
export default function CartIndex({ cart }) {
    const couponForm = useForm({ code: '' });
    const [cep, setCep]     = useState('');
    const [freight, setFreight] = useState(null);
    const [freightLoading, setFreightLoading] = useState(false);
    const [freightError, setFreightError] = useState('');
    const [freightCity, setFreightCity]   = useState('');

    const updateQty = (itemId, quantity) => {
        if (quantity < 1) { removeItem(itemId); return; }
        router.patch(route('cart.update', itemId), { quantity }, { preserveScroll: true });
    };

    const removeItem = (itemId) => {
        router.delete(route('cart.remove', itemId), { preserveScroll: true });
    };

    const applyCoupon = (e) => {
        e.preventDefault();
        couponForm.post(route('cart.apply-coupon'), { preserveScroll: true });
    };

    const calcFreight = async () => {
        const raw = cep.replace(/\D/g, '');
        if (raw.length !== 8) {
            setFreightError('CEP inválido.');
            return;
        }
        setFreightLoading(true);
        setFreightError('');
        setFreight(null);
        try {
            const res = await axios.get(`https://viacep.com.br/ws/${raw}/json/`);
            if (res.data.erro) { setFreightError('CEP não encontrado.'); return; }
            setFreightCity(`${res.data.localidade}/${res.data.uf}`);
            // Mock de fretes
            setFreight([
                { id: 'pac',   label: 'PAC',   days: '5–8 dias úteis',  cost: cart.subtotal >= 299 ? 0 : 19.9  },
                { id: 'sedex', label: 'SEDEX', days: '1–3 dias úteis',  cost: cart.subtotal >= 299 ? 0 : 34.9  },
            ]);
        } catch {
            setFreightError('Erro ao consultar frete. Tente novamente.');
        } finally {
            setFreightLoading(false);
        }
    };

    /* Carrinho vazio */
    if (!cart || cart.item_count === 0) {
        return (
            <StoreLayout>
                <Head>
                    <title>Carrinho — Vertex Urban Style</title>
                    <meta name="description" content="Seu carrinho de compras na Vertex Urban Style." />
                </Head>
                <div className="container-page py-8">
                    <EmptyCart />
                </div>
            </StoreLayout>
        );
    }

    return (
        <StoreLayout>
            <Head>
                <title>Carrinho ({cart.item_count}) — Vertex Urban Style</title>
                <meta name="description" content="Finalize sua compra na Vertex Urban Style." />
            </Head>

            <div className="container-page py-8 lg:py-12">
                <h1 className="section-title mb-8">
                    Meu Carrinho
                    <span className="text-white/30 text-lg font-normal ml-3">
                        {cart.item_count} {cart.item_count === 1 ? 'item' : 'itens'}
                    </span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── Items ─────────────────────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-3">
                        <AnimatePresence mode="popLayout">
                            {cart.items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="card p-4 flex gap-4"
                                >
                                    {/* Image */}
                                    <Link
                                        href={route('products.show', item.product.slug)}
                                        className="flex-shrink-0 w-24 h-28 rounded-xl overflow-hidden bg-dark-100 block"
                                    >
                                        <img
                                            src={item.product.cover_image_url ?? item.product.primary_image_url}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </Link>

                                    <div className="flex-1 min-w-0">
                                        {/* Product info */}
                                        <div className="flex justify-between gap-2">
                                            <div className="min-w-0">
                                                <Link
                                                    href={route('products.show', item.product.slug)}
                                                    className="font-medium text-white/90 hover:text-white transition-colors line-clamp-2 text-sm leading-snug"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                {item.variant && (
                                                    <p className="text-xs text-white/40 mt-0.5">{item.variant.label}</p>
                                                )}
                                                {item.product.brand && (
                                                    <p className="text-xs text-white/30 mt-0.5">{item.product.brand?.name ?? item.product.brand}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="flex-shrink-0 text-white/20 hover:text-red-400 transition-colors p-1"
                                                aria-label="Remover item"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Qty */}
                                            <div className="flex items-center gap-1 bg-dark-100 border border-white/[0.08] rounded-xl px-1">
                                                <button
                                                    onClick={() => updateQty(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                                >
                                                    <MinusIcon className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                                >
                                                    <PlusIcon className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-semibold text-white">{fmt(item.line_total)}</span>
                                                {item.quantity > 1 && (
                                                    <p className="text-xs text-white/30">
                                                        {fmt(item.unit_price)} cada
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Continue shopping */}
                        <div className="pt-2">
                            <Link
                                href={route('products.index')}
                                className="text-sm text-white/40 hover:text-primary transition-colors flex items-center gap-1"
                            >
                                ← Continuar comprando
                            </Link>
                        </div>
                    </div>

                    {/* ── Summary ────────────────────────────────────────────────── */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 space-y-5 sticky top-24">
                            <h2 className="font-display font-semibold text-lg">Resumo do pedido</h2>

                            {/* Cupom */}
                            {!cart.coupon_code ? (
                                <form onSubmit={applyCoupon} className="flex gap-2">
                                    <div className="relative flex-1">
                                        <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            id="coupon-input"
                                            type="text"
                                            value={couponForm.data.code}
                                            onChange={e => couponForm.setData('code', e.target.value.toUpperCase())}
                                            placeholder="Cupom de desconto"
                                            className="input pl-9 text-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={couponForm.processing}
                                        className="btn-outline btn-sm px-4 flex-shrink-0"
                                    >
                                        Aplicar
                                    </button>
                                </form>
                            ) : (
                                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-green-400/10 border border-green-400/20">
                                    <span className="text-sm text-green-300">
                                        Cupom <strong>{cart.coupon_code}</strong> aplicado
                                    </span>
                                    <button
                                        onClick={() => router.post(route('cart.apply-coupon'), { code: '' })}
                                        className="text-green-400/60 hover:text-green-300 transition-colors"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Estimativa de frete */}
                            <div>
                                <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
                                    <TruckIcon className="w-3.5 h-3.5" />
                                    Calcular frete
                                </p>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            id="cep-input"
                                            type="text"
                                            value={cep}
                                            onChange={e => setCep(maskCep(e.target.value))}
                                            onKeyDown={e => e.key === 'Enter' && calcFreight()}
                                            placeholder="00000-000"
                                            maxLength={9}
                                            className="input pl-9 text-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={calcFreight}
                                        disabled={freightLoading}
                                        className="btn-outline btn-sm px-4 flex-shrink-0"
                                    >
                                        {freightLoading ? (
                                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : 'OK'}
                                    </button>
                                </div>
                                {freightError && (
                                    <p className="text-xs text-red-400 mt-1">{freightError}</p>
                                )}
                                {freightCity && freight && (
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs text-white/40">Entregando em: <span className="text-white/60">{freightCity}</span></p>
                                        {freight.map(f => (
                                            <div key={f.id} className="flex justify-between text-xs">
                                                <span className="text-white/50">{f.label} ({f.days})</span>
                                                <span className={f.cost === 0 ? 'text-primary font-medium' : 'text-white/70'}>
                                                    {f.cost === 0 ? 'Grátis' : fmt(f.cost)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="divider" />

                            {/* Valores */}
                            <div className="space-y-2.5 text-sm">
                                <div className="flex justify-between text-white/60">
                                    <span>Subtotal</span>
                                    <span>{fmt(cart.subtotal)}</span>
                                </div>
                                {cart.discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Desconto</span>
                                        <span>-{fmt(cart.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-white/60">
                                    <span className="flex items-center gap-1">
                                        <TruckIcon className="w-4 h-4" /> Frete
                                    </span>
                                    <span className={cart.subtotal >= 299 ? 'text-primary' : ''}>
                                        {cart.subtotal >= 299 ? 'Grátis' : 'Calcular no checkout'}
                                    </span>
                                </div>
                            </div>

                            <div className="divider" />

                            <div className="flex justify-between font-semibold text-xl">
                                <span>Total</span>
                                <span>{fmt(cart.total)}</span>
                            </div>
                            <p className="text-xs text-white/30">
                                ou 10× de {fmt(cart.total / 10)} sem juros
                            </p>

                            <Link
                                href="/checkout"
                                className="btn-primary btn-lg w-full justify-center"
                            >
                                Fechar Pedido
                            </Link>

                            {/* Selos */}
                            <div className="flex justify-center gap-4 pt-1">
                                {['Visa', 'MC', 'Amex', 'Pix', 'Boleto'].map(m => (
                                    <span key={m} className="text-[10px] text-white/25">{m}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
