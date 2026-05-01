import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useState } from 'react';
import StoreLayout from '@layouts/StoreLayout';
import AccountLayout from './AccountLayout';
import { useCart } from '@hooks/useCart';
import { EmptyWishlist } from '@components/UI/EmptyState';
import {
    HeartIcon, ShoppingBagIcon, TrashIcon, ArrowRightIcon,
} from '@heroicons/react/24/outline';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function AccountWishlist({ items: initialItems }) {
    const [items,    setItems]   = useState(initialItems);
    const [removing, setRemoving] = useState(null);
    const { addItem } = useCart();

    const handleRemove = async (itemId, productId) => {
        setRemoving(itemId);
        try {
            await axios.post(route('account.wishlist.toggle', productId));
            setItems((prev) => prev.filter((i) => i.id !== itemId));
        } finally {
            setRemoving(null);
        }
    };

    return (
        <StoreLayout title="Favoritos — VERTEX">
            <AccountLayout active="wishlist">
                <h1 className="section-title mb-6">
                    Favoritos
                    {items.length > 0 && (
                        <span className="text-white/30 text-lg font-normal ml-3">{items.length} {items.length === 1 ? 'produto' : 'produtos'}</span>
                    )}
                </h1>

                {items.length === 0 ? (
                    <EmptyWishlist />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {items.map(({ id, product }) => (
                                <motion.div
                                    key={id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                                    className="card group relative overflow-hidden"
                                >
                                    {/* Image */}
                                    <Link href={route('products.show', product.slug)} className="block aspect-square overflow-hidden bg-dark-200">
                                        {product.primary_image_url
                                            ? <img
                                                src={product.primary_image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                              />
                                            : <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBagIcon className="w-12 h-12 text-white/10" />
                                              </div>
                                        }
                                    </Link>

                                    {/* Remove button */}
                                    <button
                                        onClick={() => handleRemove(id, product.id)}
                                        disabled={removing === id}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-dark/60 backdrop-blur-sm
                                                   flex items-center justify-center text-white/50 hover:text-red-400
                                                   transition-colors disabled:opacity-40"
                                        aria-label="Remover dos favoritos"
                                    >
                                        {removing === id
                                            ? <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                                            : <TrashIcon className="w-3.5 h-3.5" />
                                        }
                                    </button>

                                    {/* Info */}
                                    <div className="p-4">
                                        <Link
                                            href={route('products.show', product.slug)}
                                            className="font-medium text-sm text-white/90 hover:text-white transition-colors line-clamp-2"
                                        >
                                            {product.name}
                                        </Link>

                                        <div className="flex items-baseline gap-2 mt-2">
                                            <span className="font-display font-semibold text-white">
                                                {fmt(product.compare_price && product.is_on_sale ? product.compare_price : product.price)}
                                            </span>
                                            {product.is_on_sale && product.compare_price && (
                                                <span className="text-xs text-white/30 line-through">{fmt(product.compare_price)}</span>
                                            )}
                                        </div>

                                        {!product.in_stock ? (
                                            <p className="text-xs text-red-400 mt-2">Fora de estoque</p>
                                        ) : (
                                            <button
                                                onClick={() => addItem(product.id, null, 1)}
                                                className="btn-outline btn-sm w-full justify-center mt-3 gap-2"
                                            >
                                                <ShoppingBagIcon className="w-3.5 h-3.5" />
                                                Adicionar ao carrinho
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </AccountLayout>
        </StoreLayout>
    );
}
