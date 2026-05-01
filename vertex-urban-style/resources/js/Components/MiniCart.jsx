import { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XMarkIcon, ShoppingBagIcon, TrashIcon,
    TagIcon, TruckIcon, CheckIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '@lib/CartContext';
import { fmt } from '@lib/utils';
import QuantityInput from '@components/UI/QuantityInput';

// ─── Item individual ──────────────────────────────────────────────────────────

function CartItemRow({ item }) {
    const { updateItem, removeItem } = useCart();
    const [removing, setRemoving] = useState(false);

    const handleRemove = async () => {
        setRemoving(true);
        await removeItem(item.id);
    };

    const handleQtyChange = async (qty) => {
        if (qty === 0) {
            setRemoving(true);
            await removeItem(item.id);
        } else {
            await updateItem(item.id, qty);
        }
    };

    return (
        <AnimatePresence>
            {!removing && (
                <motion.li
                    layout
                    initial={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3 overflow-hidden"
                >
                    {/* Imagem */}
                    <Link
                        href={`/produtos/${item.product.slug}`}
                        className="flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden bg-dark-200"
                    >
                        {item.product.primary_image ? (
                            <img
                                src={item.product.primary_image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-dark-300 flex items-center justify-center">
                                <ShoppingBagIcon className="w-6 h-6 text-white/20" />
                            </div>
                        )}
                    </Link>

                    {/* Detalhes */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                            <Link
                                href={`/produtos/${item.product.slug}`}
                                className="text-sm font-medium text-white/90 leading-snug line-clamp-2 hover:text-white"
                            >
                                {item.product.name}
                            </Link>
                            <button
                                onClick={handleRemove}
                                className="flex-shrink-0 text-white/30 hover:text-red-400 transition-colors"
                                aria-label="Remover item"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {item.variant && (
                            <span className="text-xs text-white/40">{item.variant.display_name}</span>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-1">
                            <QuantityInput
                                value={item.quantity}
                                min={0}
                                max={99}
                                onChange={handleQtyChange}
                                size="sm"
                            />
                            <span className="text-sm font-semibold text-white">
                                {fmt(item.line_total)}
                            </span>
                        </div>
                    </div>
                </motion.li>
            )}
        </AnimatePresence>
    );
}

// ─── Cupom ────────────────────────────────────────────────────────────────────

function CouponField({ shippingCost }) {
    const { couponCode, setCouponCode, applyCoupon, removeCoupon, pricing, loading } = useCart();
    const [feedback, setFeedback] = useState(null); // { type: 'ok'|'err', msg }
    const [applied, setApplied]   = useState(false);

    const handleApply = async () => {
        if (!couponCode.trim()) return;
        const res = await applyCoupon(couponCode, shippingCost);
        setFeedback({ type: res.success ? 'ok' : 'err', msg: res.message });
        if (res.success) setApplied(true);
    };

    const handleRemove = async () => {
        await removeCoupon(shippingCost);
        setApplied(false);
        setFeedback(null);
    };

    if (applied) {
        return (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30
                            rounded-xl px-3 py-2">
                <CheckIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-green-300 flex-1">
                    Cupom <strong>{couponCode}</strong> aplicado!
                </span>
                {pricing?.discount > 0 && (
                    <span className="text-sm font-semibold text-green-400">
                        -{fmt(pricing.discount)}
                    </span>
                )}
                <button
                    onClick={handleRemove}
                    className="text-green-400/60 hover:text-red-400 transition-colors"
                    aria-label="Remover cupom"
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setFeedback(null); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                        placeholder="CÓDIGO DO CUPOM"
                        className="w-full bg-dark-200 border border-white/10 rounded-xl pl-9 pr-3 py-2
                                   text-sm text-white placeholder-white/25 focus:outline-none
                                   focus:ring-1 focus:ring-primary/50 uppercase tracking-wider"
                    />
                </div>
                <button
                    onClick={handleApply}
                    disabled={loading || !couponCode.trim()}
                    className="btn-primary btn-sm px-4 disabled:opacity-50"
                >
                    Aplicar
                </button>
            </div>
            <AnimatePresence>
                {feedback && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-xs ${feedback.type === 'ok' ? 'text-green-400' : 'text-red-400'}`}
                    >
                        {feedback.msg}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Frete estimado ───────────────────────────────────────────────────────────

function ShippingEstimator({ onSelect }) {
    const { calculateShipping, loading } = useCart();
    const [cep, setCep]         = useState('');
    const [options, setOptions] = useState(null);
    const [address, setAddress] = useState(null);
    const [selected, setSelected] = useState(null);
    const [error, setError]     = useState('');

    const handle = async () => {
        setError('');
        const res = await calculateShipping(cep);
        if (res.success && res.data?.options) {
            setOptions(res.data.options);
            setAddress(res.data.address);
        } else {
            setError(res.message ?? 'CEP inválido.');
        }
    };

    const formatCep = (v) => {
        const d = v.replace(/\D/g, '').slice(0, 8);
        return d.length > 5 ? `${d.slice(0,5)}-${d.slice(5)}` : d;
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <TruckIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <input
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(formatCep(e.target.value))}
                        onKeyDown={(e) => e.key === 'Enter' && handle()}
                        placeholder="00000-000"
                        maxLength={9}
                        className="w-full bg-dark-200 border border-white/10 rounded-xl pl-9 pr-3 py-2
                                   text-sm text-white placeholder-white/25 focus:outline-none
                                   focus:ring-1 focus:ring-primary/50"
                    />
                </div>
                <button
                    onClick={handle}
                    disabled={loading || cep.replace(/\D/,'').length < 8}
                    className="btn-outline btn-sm px-4 disabled:opacity-50"
                >
                    Calcular
                </button>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            {address && (
                <p className="text-xs text-white/40">
                    {address.neighborhood && `${address.neighborhood}, `}
                    {address.city}/{address.state}
                </p>
            )}

            {options && (
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-1.5"
                >
                    {options.map((opt) => (
                        <li key={opt.method}>
                            <button
                                onClick={() => { setSelected(opt.method); onSelect?.(opt); }}
                                className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm
                                            border transition-all
                                            ${selected === opt.method
                                                ? 'border-primary/50 bg-primary/10 text-white'
                                                : 'border-white/[0.08] bg-dark-200 text-white/70 hover:border-white/20'
                                            }`}
                            >
                                <span className="font-medium">{opt.label ?? opt.name}</span>
                                <span className="flex items-center gap-3">
                                    <span className="text-white/40 text-xs">
                                        {opt.days} {opt.days === 1 ? 'dia útil' : 'dias úteis'}
                                    </span>
                                    <span className={opt.free ? 'text-green-400 font-semibold' : 'font-semibold'}>
                                        {opt.free || opt.price === 0 ? 'Grátis' : fmt(opt.price)}
                                    </span>
                                </span>
                            </button>
                        </li>
                    ))}
                </motion.ul>
            )}
        </div>
    );
}

// ─── MiniCart Drawer ──────────────────────────────────────────────────────────

export default function MiniCart() {
    const { isOpen, closeCart, cart, pricing, loading } = useCart();
    const [selectedShipping, setSelectedShipping] = useState(null);

    const shippingCost = selectedShipping?.price ?? 0;
    const total = (cart.subtotal ?? 0) - (pricing?.discount ?? 0) + shippingCost;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[60] bg-dark/70 backdrop-blur-sm"
                        onClick={closeCart}
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <motion.aside
                        key="drawer"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Carrinho de compras"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-[61] flex flex-col w-full max-w-md
                                   bg-dark-100 border-l border-white/[0.06] shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <ShoppingBagIcon className="w-5 h-5 text-primary" />
                                <h2 className="font-display font-semibold text-lg">Carrinho</h2>
                                {cart.item_count > 0 && (
                                    <span className="badge-primary">{cart.item_count}</span>
                                )}
                            </div>
                            <button
                                onClick={closeCart}
                                className="btn-icon text-white/50 hover:text-white"
                                aria-label="Fechar carrinho"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                            {/* Loading skeleton */}
                            {loading && cart.items.length === 0 ? (
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex gap-3 animate-pulse">
                                            <div className="w-16 h-20 rounded-xl bg-dark-200" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-dark-200 rounded w-3/4" />
                                                <div className="h-3 bg-dark-200 rounded w-1/2" />
                                                <div className="h-8 bg-dark-200 rounded w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : cart.items.length === 0 ? (
                                /* Empty state */
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex flex-col items-center justify-center py-12 gap-5 text-center"
                                >
                                    {/* SVG sacola vazia */}
                                    <svg viewBox="0 0 120 120" className="w-28 h-28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="60" cy="60" r="56" fill="#1a1f2e" />
                                        <path d="M40 48h40l-5 32H45L40 48z" stroke="#0d9488" strokeWidth="2.5" strokeLinejoin="round" />
                                        <path d="M50 48c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
                                        <circle cx="53" cy="62" r="2" fill="#f97316" />
                                        <circle cx="67" cy="62" r="2" fill="#f97316" />
                                        <path d="M54 72c1.5 2 10.5 2 12 0" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <div>
                                        <p className="font-display font-semibold text-white/80 text-lg">Sua sacola está vazia</p>
                                        <p className="text-sm text-white/35 mt-1.5 max-w-[200px] mx-auto leading-relaxed">
                                            Explore nossa coleção e adicione peças incríveis
                                        </p>
                                    </div>
                                    <Link
                                        href="/produtos"
                                        onClick={closeCart}
                                        className="btn-primary px-6"
                                    >
                                        Explorar produtos
                                    </Link>
                                    <Link
                                        href="/sale"
                                        onClick={closeCart}
                                        className="text-sm text-primary/70 hover:text-primary transition-colors"
                                    >
                                        Ver promoções →
                                    </Link>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Items */}
                                    <ul className="space-y-4">
                                        <AnimatePresence>
                                            {cart.items.map((item) => (
                                                <CartItemRow key={item.id} item={item} />
                                            ))}
                                        </AnimatePresence>
                                    </ul>

                                    {/* Cupom */}
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
                                            Cupom de desconto
                                        </p>
                                        <CouponField shippingCost={shippingCost} />
                                    </div>

                                    {/* Frete */}
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
                                            Calcular frete
                                        </p>
                                        <ShippingEstimator onSelect={setSelectedShipping} />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.items.length > 0 && (
                            <div className="border-t border-white/[0.06] px-5 py-4 space-y-3">
                                {/* Totals */}
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between text-white/50">
                                        <span>Subtotal</span>
                                        <span>{fmt(cart.subtotal)}</span>
                                    </div>
                                    {pricing?.discount > 0 && (
                                        <div className="flex justify-between text-green-400">
                                            <span>Desconto</span>
                                            <span>-{fmt(pricing.discount)}</span>
                                        </div>
                                    )}
                                    {selectedShipping && (
                                        <div className="flex justify-between text-white/50">
                                            <span>Frete ({selectedShipping.label ?? selectedShipping.name})</span>
                                            <span className={selectedShipping.price === 0 ? 'text-green-400' : ''}>
                                                {selectedShipping.price === 0 ? 'Grátis' : fmt(selectedShipping.price)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-base font-semibold text-white pt-1 border-t border-white/[0.06]">
                                        <span>Total</span>
                                        <span>{fmt(total)}</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="btn-primary w-full justify-center"
                                >
                                    Finalizar Compra
                                </Link>
                                <Link
                                    href="/carrinho"
                                    onClick={closeCart}
                                    className="btn-ghost w-full justify-center text-sm"
                                >
                                    Ver carrinho completo
                                </Link>
                            </div>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
