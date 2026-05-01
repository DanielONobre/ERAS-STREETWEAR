import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBagIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon, CheckIcon } from '@heroicons/react/24/solid';
import { useCart } from '@lib/CartContext';
import { fmt } from '@lib/utils';
import axios from 'axios';

/**
 * Card de produto — exibição em grid.
 *
 * @param {object}  props
 * @param {object}  props.product
 * @param {number}  [props.index]      - Índice no grid (stagger 0.05s × index)
 * @param {boolean} [props.wishlisted]
 */
export default function ProductCard({ product, index = 0, wishlisted: initialWishlisted = false }) {
    const { addItem } = useCart();

    // 'idle' | 'loading' | 'success'
    const [addState, setAddState]     = useState('idle');
    const [wished, setWished]         = useState(initialWishlisted);
    const [wishLoading, setWishLoad]  = useState(false);
    const [hoverImg, setHoverImg]     = useState(false);

    const img1 = product.primary_image ?? product.primary_image_url ?? product.cover_image_url;
    const img2 = product.images?.[1]?.url ?? null;

    // ── Add to cart: idle → loading → success → idle ──────────────────────────
    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (addState !== 'idle' || !product.in_stock) return;
        setAddState('loading');
        await addItem(product.id, null, 1);
        setAddState('success');
        setTimeout(() => setAddState('idle'), 1800);
    };

    // ── Wishlist com "pulse" ──────────────────────────────────────────────────
    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (wishLoading) return;
        setWished(!wished);
        setWishLoad(true);
        try {
            await axios.post(`/minha-conta/favoritos/${product.id}`);
        } catch {
            setWished(wished);
        } finally {
            setWishLoad(false);
        }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group relative"
        >
            <Link href={`/produtos/${product.slug}`} className="block">

                {/* ── Imagem ───────────────────────────────────────────────── */}
                <div
                    className="relative overflow-hidden rounded-2xl bg-dark-100 aspect-[3/4]"
                    onMouseEnter={() => img2 && setHoverImg(true)}
                    onMouseLeave={() => setHoverImg(false)}
                >
                    <img
                        src={img1}
                        alt={product.name}
                        loading="lazy"
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500
                                    ${img2 ? (hoverImg ? 'opacity-0 scale-105' : 'opacity-100 scale-100') : 'group-hover:scale-105'}`}
                    />
                    {img2 && (
                        <img
                            src={img2}
                            alt={`${product.name} — visual alternativo`}
                            loading="lazy"
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500
                                        ${hoverImg ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {product.is_new && (
                            <span className="inline-flex items-center rounded-full bg-primary/20 border border-primary/30
                                             text-primary text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
                                Novo
                            </span>
                        )}
                        {product.is_on_sale && (
                            <span className="inline-flex items-center rounded-full bg-red-500/20 border border-red-500/30
                                             text-red-400 text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
                                -{Math.round(product.discount_percent ?? product.discount_percentage ?? 0)}%
                            </span>
                        )}
                        {!product.in_stock && (
                            <span className="inline-flex items-center rounded-full bg-dark/80 border border-white/10
                                             text-white/50 text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
                                Esgotado
                            </span>
                        )}
                    </div>

                    {/* Wishlist — heart pulse ao ativar */}
                    <motion.button
                        onClick={handleWishlist}
                        whileTap={{ scale: 0.85 }}
                        animate={wished ? { scale: [1, 1.35, 1] } : {}}
                        transition={{ duration: 0.3, times: [0, 0.5, 1] }}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full
                                   bg-dark/60 backdrop-blur-sm border border-white/10
                                   flex items-center justify-center
                                   opacity-0 group-hover:opacity-100
                                   transition-opacity duration-200"
                        aria-label={wished ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {wished ? (
                                <motion.span
                                    key="solid"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <HeartSolid className="w-4 h-4 text-red-400" />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="outline"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <HeartIcon className="w-4 h-4 text-white/80" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {/* Botão adicionar — estados: idle / loading / success */}
                    {product.in_stock ? (
                        <motion.button
                            onClick={handleAddToCart}
                            disabled={addState !== 'idle'}
                            whileHover={addState === 'idle' ? { scale: 1.02 } : {}}
                            whileTap={addState === 'idle' ? { scale: 0.97 } : {}}
                            className={`absolute bottom-3 left-3 right-3 z-10
                                       flex items-center justify-center gap-2
                                       text-white text-sm font-semibold rounded-xl py-2.5
                                       opacity-0 group-hover:opacity-100
                                       translate-y-2 group-hover:translate-y-0
                                       transition-all duration-300
                                       ${addState === 'success'
                                           ? 'bg-green-500 cursor-default'
                                           : 'bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:opacity-70 disabled:cursor-not-allowed'
                                       }`}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {addState === 'loading' && (
                                    <motion.span
                                        key="spin"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Adicionando…
                                    </motion.span>
                                )}
                                {addState === 'success' && (
                                    <motion.span
                                        key="check"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckIcon className="w-4 h-4" />
                                        Adicionado!
                                    </motion.span>
                                )}
                                {addState === 'idle' && (
                                    <motion.span
                                        key="idle"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex items-center gap-2"
                                    >
                                        <ShoppingBagIcon className="w-4 h-4" />
                                        Adicionar
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    ) : (
                        <div className="absolute bottom-3 left-3 right-3 z-10 text-center py-2 rounded-xl
                                        bg-dark/80 backdrop-blur-sm text-white/40 text-xs font-medium
                                        opacity-0 group-hover:opacity-100 transition-opacity">
                            Fora de estoque
                        </div>
                    )}
                </div>

                {/* ── Info ─────────────────────────────────────────────────── */}
                <div className="mt-3 px-0.5 space-y-1.5">
                    {product.brand && (
                        <p className="text-xs text-white/35 uppercase tracking-wider">
                            {product.brand?.name ?? product.brand}
                        </p>
                    )}
                    <h3 className="text-sm font-medium text-white/90 leading-snug line-clamp-2
                                   group-hover:text-white transition-colors">
                        {product.name}
                    </h3>
                    {(product.average_rating > 0 || product.rating_avg > 0) && (
                        <div className="flex items-center gap-1">
                            <div className="flex">
                                {[1,2,3,4,5].map((s) => (
                                    <StarIcon
                                        key={s}
                                        className={`w-3 h-3 ${s <= Math.round(product.average_rating ?? product.rating_avg ?? 0)
                                            ? 'text-yellow-400' : 'text-white/20'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-white/40">
                                ({product.reviews_count ?? product.rating_count ?? 0})
                            </span>
                        </div>
                    )}
                    <div className="flex items-baseline gap-2">
                        <span className="text-base font-semibold text-white">
                            {fmt(product.price)}
                        </span>
                        {product.is_on_sale && product.compare_price && (
                            <span className="text-sm text-white/30 line-through">
                                {fmt(product.compare_price)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
