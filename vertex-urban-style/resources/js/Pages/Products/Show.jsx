import { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import StoreLayout from '@layouts/StoreLayout';
import ProductGrid from '@components/Product/ProductGrid';
import Breadcrumb from '@components/UI/Breadcrumb';
import StarRating from '@components/UI/StarRating';
import QuantityInput from '@components/UI/QuantityInput';
import Modal from '@components/UI/Modal';
import Badge from '@components/UI/Badge';
import { useCart } from '@lib/CartContext';
import { fmt } from '@lib/utils';
import {
    ShoppingBagIcon,
    HeartIcon,
    BoltIcon,
    ShareIcon,
    ChevronDownIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
    StarIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

/* ─── Accordion item ─────────────────────────────────────────────────── */
function Accordion({ title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-white/[0.06]">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-4 text-left group"
                aria-expanded={open}
            >
                <span className="font-medium text-white/80 group-hover:text-white transition-colors text-sm">
                    {title}
                </span>
                <ChevronDownIcon
                    className={`w-4 h-4 text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-5 text-sm text-white/60 leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─── Stars display ──────────────────────────────────────────────────── */
function Stars({ rating, size = 'sm' }) {
    const s = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
                <StarIcon
                    key={star}
                    className={`${s} ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                />
            ))}
        </div>
    );
}

/* ─── Review bar ─────────────────────────────────────────────────────── */
function RatingBar({ star, count, total }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 w-3">{star}</span>
            <StarIcon className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
            <div className="flex-1 h-1.5 bg-dark-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs text-white/30 w-5 text-right">{count}</span>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function ProductShow({ product, relatedProducts = [] }) {
    const { addItem } = useCart();

    /* Imagens */
    const images = [
        product.cover_image_url ?? product.primary_image_url,
        ...(product.images?.map(i => i.url ?? `/storage/${i.path}`) ?? []),
    ].filter(Boolean);

    /* Variantes */
    const variants   = product.variants ?? [];
    const sizes      = [...new Set(variants.filter(v => v.size).map(v => v.size))];
    const colorVariants = variants.filter(v => v.color_hex || v.color_name);
    const colors     = [
        ...new Map(colorVariants.map(v => [v.color_hex ?? v.color_name, v])).values()
    ];

    /* Estado */
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize,  setSize]      = useState(null);
    const [selectedColor, setColor]     = useState(null);
    const [quantity, setQuantity]        = useState(1);
    const [adding,   setAdding]          = useState(false);
    const [wished,   setWished]          = useState(false);
    const [wishLoad, setWishLoad]        = useState(false);
    const [sizeGuideOpen, setSizeGuide]  = useState(false);
    const [reviewForm, setReviewForm]    = useState({ rating: 5, title: '', body: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [copied, setCopied]            = useState(false);

    /* Variante selecionada */
    const selectedVariant = variants.find(v => {
        const sizeMatch  = !selectedSize  || v.size === selectedSize;
        const colorMatch = !selectedColor || v.color_hex === selectedColor || v.color_name === selectedColor;
        return sizeMatch && colorMatch;
    }) ?? null;

    /* Stock */
    const stock = selectedVariant?.stock ?? product.stock ?? 0;
    const inStock = stock > 0;

    /* Ao selecionar cor, troca imagem principal */
    const handleColorSelect = (color) => {
        setColor(color.color_hex ?? color.color_name);
        // tenta encontrar imagem associada à cor
        const imgIdx = images.findIndex(img => img?.includes(color.color_name?.toLowerCase()));
        if (imgIdx >= 0) setActiveImage(imgIdx);
    };

    /* Add to cart */
    const handleAddToCart = async () => {
        if (adding || !inStock) return;
        setAdding(true);
        await addItem(product.id, selectedVariant?.id ?? null, quantity);
        setAdding(false);
    };

    /* Buy now */
    const handleBuyNow = async () => {
        if (!inStock) return;
        await handleAddToCart();
        router.visit('/checkout');
    };

    /* Wishlist */
    const handleWishlist = async () => {
        if (wishLoad) return;
        setWished(!wished);
        setWishLoad(true);
        try {
            await axios.post(`/minha-conta/favoritos/${product.id}`);
        } catch {
            setWished(w => !w);
        } finally {
            setWishLoad(false);
        }
    };

    /* Share */
    const handleShare = async (network) => {
        const url = window.location.href;
        const text = encodeURIComponent(`${product.name} — Vertex Urban Style`);
        const links = {
            whatsapp: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
        };
        if (network === 'copy') {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } else {
            window.open(links[network], '_blank', 'width=600,height=400');
        }
    };

    /* Reviews distribuição */
    const totalReviews = product.reviews?.length ?? 0;
    const ratingDist = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: product.reviews?.filter(r => Math.round(r.rating) === star).length ?? 0,
    }));

    /* Submit review */
    const submitReview = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            await axios.post(`/produtos/${product.slug}/reviews`, reviewForm);
            router.reload({ only: ['product'] });
        } catch { /* handle */ } finally {
            setSubmittingReview(false);
        }
    };

    /* Breadcrumbs */
    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Produtos', href: '/produtos' },
        ...(product.category ? [{ label: product.category.name, href: `/categoria/${product.category.slug}` }] : []),
        { label: product.name },
    ];

    const seoTitle = `${product.name} — ${product.brand?.name ?? 'Vertex Urban Style'}`;
    const seoDesc  = product.short_description ?? `Compre ${product.name} na Vertex Urban Style. ${inStock ? 'Em estoque' : 'Fora de estoque'}.`;

    return (
        <StoreLayout>
            <Head>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDesc} />
                <meta property="og:image" content={images[0]} />
                <meta property="og:type" content="product" />
                {product.price && <meta property="product:price:amount" content={product.current_price ?? product.price} />}
                <meta property="product:price:currency" content="BRL" />
            </Head>

            <div className="container-page py-8 lg:py-12">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbs} className="mb-8" />

                {/* ── 2-col layout ───────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                    {/* ══ COLUNA ESQUERDA — Galeria ══════════════════════════════════ */}
                    <div className="flex gap-4">
                        {/* Thumbnails verticais (desktop) */}
                        {images.length > 1 && (
                            <div className="hidden md:flex flex-col gap-2 flex-shrink-0">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                                            activeImage === i
                                                ? 'border-primary shadow-glow-primary'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Imagem principal + zoom */}
                        <div className="flex-1">
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-dark-100 group"
                            >
                                <img
                                    src={images[activeImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {product.is_new && (
                                        <span className="badge-accent">Novo</span>
                                    )}
                                    {product.is_on_sale && (
                                        <span className="badge-danger">
                                            -{Math.round(product.discount_percent ?? product.discount_percentage ?? 0)}%
                                        </span>
                                    )}
                                </div>
                            </motion.div>

                            {/* Dots mobile */}
                            {images.length > 1 && (
                                <div className="flex justify-center gap-1.5 mt-4 md:hidden">
                                    {images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(i)}
                                            className={`rounded-full transition-all ${
                                                activeImage === i
                                                    ? 'w-5 h-1.5 bg-primary'
                                                    : 'w-1.5 h-1.5 bg-white/20'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ══ COLUNA DIREITA — Info ═══════════════════════════════════════ */}
                    <div className="space-y-5">
                        {/* Category + status badges */}
                        <div className="flex flex-wrap gap-2">
                            {product.category && (
                                <Link
                                    href={`/categoria/${product.category.slug}`}
                                    className="badge-primary text-xs"
                                >
                                    {product.category.name}
                                </Link>
                            )}
                            {product.brand && (
                                <span className="badge text-xs bg-white/5 text-white/50">
                                    {product.brand.name}
                                </span>
                            )}
                            {product.is_new && <span className="badge-accent text-xs">Novo</span>}
                            {product.is_on_sale && <span className="badge-danger text-xs">Sale</span>}
                        </div>

                        {/* Name */}
                        <h1 className="font-display text-3xl lg:text-4xl font-bold leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        {product.rating_count > 0 && (
                            <div className="flex items-center gap-2">
                                <Stars rating={product.rating_avg} />
                                <span className="text-sm text-white/50">
                                    {Number(product.rating_avg).toFixed(1)} ({product.rating_count} avaliações)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div>
                            <div className="flex items-baseline gap-3">
                                <span className="font-display text-4xl font-bold text-white">
                                    {fmt(product.current_price ?? product.price)}
                                </span>
                                {product.is_on_sale && product.price && (
                                    <>
                                        <span className="text-xl text-white/30 line-through">
                                            {fmt(product.price)}
                                        </span>
                                        <span className="badge-danger text-sm">
                                            -{Math.round(product.discount_percent ?? 0)}%
                                        </span>
                                    </>
                                )}
                            </div>
                            {product.is_on_sale && product.price && (
                                <p className="text-sm text-green-400 mt-1">
                                    Você economiza {fmt(product.price - (product.current_price ?? product.price))}
                                </p>
                            )}
                            <p className="text-sm text-white/40 mt-1">
                                ou 10× de {fmt((product.current_price ?? product.price) / 10)} sem juros
                            </p>
                        </div>

                        <div className="divider" />

                        {/* Cor */}
                        {colors.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="label">
                                        Cor{selectedColor && (
                                            <span className="text-white/40 font-normal ml-2">
                                                {colors.find(c => (c.color_hex ?? c.color_name) === selectedColor)?.color_name}
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color) => {
                                        const key = color.color_hex ?? color.color_name;
                                        const isSelected = selectedColor === key;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => handleColorSelect(color)}
                                                title={color.color_name}
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${
                                                    isSelected ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                                                }`}
                                                style={{ backgroundColor: color.color_hex ?? '#ccc' }}
                                            >
                                                {isSelected && (
                                                    <CheckIcon className="w-4 h-4 text-white mx-auto drop-shadow" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Tamanho */}
                        {sizes.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="label">Tamanho</label>
                                    <button
                                        onClick={() => setSizeGuide(true)}
                                        className="text-xs text-primary hover:text-primary-400 underline underline-offset-2 transition-colors"
                                    >
                                        Guia de tamanhos
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size) => {
                                        const variant = variants.find(v => v.size === size);
                                        const outOfStock = variant?.stock === 0;
                                        const isSelected = selectedSize === size;
                                        return (
                                            <button
                                                key={size}
                                                disabled={outOfStock}
                                                onClick={() => setSize(isSelected ? null : size)}
                                                className={`min-w-[3rem] h-10 px-3 rounded-xl text-sm font-medium border transition-all ${
                                                    isSelected
                                                        ? 'bg-primary border-primary text-white shadow-glow-primary'
                                                        : outOfStock
                                                            ? 'border-white/10 text-white/20 cursor-not-allowed line-through'
                                                            : 'border-white/20 text-white/70 hover:border-primary/50 hover:text-white'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Stock indicator */}
                        <div>
                            {inStock ? (
                                stock <= 5 ? (
                                    <div className="flex items-center gap-2 text-sm">
                                        <ExclamationTriangleIcon className="w-4 h-4 text-amber-400" />
                                        <span className="text-amber-400">Apenas {stock} restantes!</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckIcon className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400">Em estoque</span>
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center gap-2 text-sm">
                                    <XMarkIcon className="w-4 h-4 text-red-400" />
                                    <span className="text-red-400">Esgotado</span>
                                </div>
                            )}
                        </div>

                        {/* Qty */}
                        <div>
                            <label className="label mb-2">Quantidade</label>
                            <QuantityInput
                                value={quantity}
                                onChange={setQuantity}
                                min={1}
                                max={Math.min(stock, 99)}
                                disabled={!inStock}
                            />
                        </div>

                        {/* CTAs */}
                        <div className="flex gap-3">
                            <button
                                id="btn-add-to-cart"
                                onClick={handleAddToCart}
                                disabled={adding || !inStock}
                                className="btn-primary btn-lg flex-1 relative overflow-hidden"
                            >
                                {adding ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <ShoppingBagIcon className="w-5 h-5" />
                                )}
                                {!inStock ? 'Esgotado' : adding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                            </button>

                            <button
                                onClick={handleWishlist}
                                className={`btn-outline w-12 h-12 flex-shrink-0 flex items-center justify-center transition-all ${wished ? 'border-red-500/50 text-red-400' : ''}`}
                                aria-label="Favoritar"
                            >
                                {wished
                                    ? <HeartSolid className="w-5 h-5 text-red-400" />
                                    : <HeartIcon className="w-5 h-5" />
                                }
                            </button>
                        </div>

                        {inStock && (
                            <button
                                id="btn-buy-now"
                                onClick={handleBuyNow}
                                disabled={adding}
                                className="btn-accent btn-lg w-full"
                            >
                                <BoltIcon className="w-5 h-5" />
                                Comprar Agora
                            </button>
                        )}

                        {/* Accordions */}
                        <div className="border-t border-white/[0.06]">
                            <Accordion title="Descrição completa" defaultOpen>
                                <div
                                    className="prose prose-invert prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: product.description ?? product.short_description ?? 'Sem descrição disponível.',
                                    }}
                                />
                            </Accordion>

                            <Accordion title="Composição & Cuidados">
                                <div className="prose prose-invert prose-sm max-w-none">
                                    {product.composition ? (
                                        <div dangerouslySetInnerHTML={{ __html: product.composition }} />
                                    ) : (
                                        <>
                                            <p>• 100% Algodão premium</p>
                                            <p>• Lavar à mão ou máquina em ciclo delicado</p>
                                            <p>• Não usar alvejante</p>
                                            <p>• Secar à sombra</p>
                                        </>
                                    )}
                                </div>
                            </Accordion>

                            <Accordion title="Guia de Tamanhos">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-center">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="py-2 text-white/50">Tamanho</th>
                                                <th className="py-2 text-white/50">Busto (cm)</th>
                                                <th className="py-2 text-white/50">Cintura (cm)</th>
                                                <th className="py-2 text-white/50">Quadril (cm)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-white/60">
                                            {[['P', '84–88', '66–70', '90–94'], ['M', '88–92', '70–74', '94–98'], ['G', '92–96', '74–78', '98–102'], ['GG', '96–102', '78–84', '102–108']].map(([sz, ...rest]) => (
                                                <tr key={sz} className="border-b border-white/[0.06]">
                                                    <td className="py-2 font-semibold text-white">{sz}</td>
                                                    {rest.map((v, i) => <td key={i} className="py-2">{v}</td>)}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Accordion>

                            <Accordion title="Entrega & Trocas">
                                <div className="space-y-3 text-white/60">
                                    <p>🚚 <strong className="text-white">Frete grátis</strong> para compras acima de R$299</p>
                                    <p>📦 Prazo de entrega: PAC 5–8 dias úteis, SEDEX 1–3 dias úteis</p>
                                    <p>🔄 <strong className="text-white">Primeira troca grátis</strong> em até 30 dias</p>
                                    <p>✉️ Você receberá o código de rastreio por e-mail assim que o pedido for despachado</p>
                                </div>
                            </Accordion>
                        </div>

                        {/* SKU + Share */}
                        <div className="flex items-center justify-between pt-2">
                            {product.sku && (
                                <span className="text-xs text-white/30">SKU: {product.sku}</span>
                            )}
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-xs text-white/40">Compartilhar:</span>
                                {[
                                    { key: 'whatsapp', label: 'WhatsApp', color: 'hover:text-green-400' },
                                    { key: 'facebook', label: 'Facebook', color: 'hover:text-blue-400' },
                                    { key: 'twitter',  label: 'X',        color: 'hover:text-sky-400'  },
                                    { key: 'copy',     label: copied ? '✓' : 'Copiar', color: 'hover:text-primary' },
                                ].map(({ key, label, color }) => (
                                    <button
                                        key={key}
                                        onClick={() => handleShare(key)}
                                        className={`text-xs text-white/40 transition-colors px-1 ${color}`}
                                        title={label}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══ REVIEWS ══════════════════════════════════════════════════════ */}
                <div className="mt-20 pt-12 border-t border-white/[0.06]">
                    <h2 className="section-title mb-8">Avaliações</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                        {/* Média */}
                        <div className="card p-6 text-center flex flex-col items-center gap-3">
                            <div className="font-display text-6xl font-bold text-white">
                                {Number(product.rating_avg ?? 0).toFixed(1)}
                            </div>
                            <Stars rating={product.rating_avg ?? 0} size="lg" />
                            <p className="text-white/40 text-sm">{product.rating_count ?? 0} avaliações</p>
                        </div>

                        {/* Barras de distribuição */}
                        <div className="card p-6 col-span-1 md:col-span-2">
                            <div className="space-y-2">
                                {ratingDist.map(({ star, count }) => (
                                    <RatingBar key={star} star={star} count={count} total={totalReviews} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lista de reviews */}
                    {product.reviews?.length > 0 ? (
                        <div className="space-y-4 mb-10">
                            {product.reviews.map((review) => (
                                <div key={review.id} className="card p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center font-semibold text-primary text-sm">
                                                {review.user?.name?.[0] ?? '?'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{review.user?.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Stars rating={review.rating} />
                                                    {review.is_verified_purchase && (
                                                        <span className="badge-success text-[10px]">Compra verificada</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-white/30 flex-shrink-0">
                                            {new Date(review.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    {review.title && (
                                        <p className="font-semibold mt-3">{review.title}</p>
                                    )}
                                    {review.body && (
                                        <p className="text-white/60 text-sm mt-1 leading-relaxed">{review.body}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white/40 mb-10">Nenhuma avaliação ainda. Seja o primeiro!</p>
                    )}

                    {/* Formulário de avaliação (apenas se pode avaliar) */}
                    {product.can_review && (
                        <div className="card p-6">
                            <h3 className="font-display font-semibold mb-5">Avaliar este produto</h3>
                            <form onSubmit={submitReview} className="space-y-4">
                                {/* Estrelas interativas */}
                                <div>
                                    <label className="label mb-2">Sua nota</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                                                className="transition-transform hover:scale-110"
                                            >
                                                <StarIcon
                                                    className={`w-7 h-7 ${star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="label mb-1" htmlFor="review-title">Título</label>
                                    <input
                                        id="review-title"
                                        type="text"
                                        value={reviewForm.title}
                                        onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                                        placeholder="Ex: Muito bom!"
                                        className="input w-full"
                                    />
                                </div>
                                <div>
                                    <label className="label mb-1" htmlFor="review-body">Comentário</label>
                                    <textarea
                                        id="review-body"
                                        rows={4}
                                        value={reviewForm.body}
                                        onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))}
                                        placeholder="Conte sua experiência com o produto..."
                                        className="input w-full resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="btn-primary"
                                >
                                    {submittingReview ? 'Enviando...' : 'Enviar avaliação'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* ══ RELACIONADOS ════════════════════════════════════════════════ */}
                {relatedProducts?.length > 0 && (
                    <div className="mt-20">
                        <h2 className="section-title mb-8">Você também pode gostar</h2>
                        <ProductGrid products={relatedProducts.slice(0, 4)} />
                    </div>
                )}
            </div>

            {/* ── Modal Guia de Tamanhos ──────────────────────────────────────── */}
            <Modal
                isOpen={sizeGuideOpen}
                onClose={() => setSizeGuide(false)}
                title="Guia de Tamanhos"
            >
                <div className="space-y-4 text-sm">
                    <p className="text-white/60">
                        Meça o seu corpo e compare com nossa tabela para encontrar o tamanho ideal.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-center">
                            <thead>
                                <tr className="border-b border-white/10 text-white/50">
                                    <th className="py-2 px-3">Tam.</th>
                                    <th className="py-2 px-3">Busto</th>
                                    <th className="py-2 px-3">Cintura</th>
                                    <th className="py-2 px-3">Quadril</th>
                                    <th className="py-2 px-3">Altura ref.</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/60">
                                {[
                                    ['PP', '80–84', '62–66', '86–90', '155–160'],
                                    ['P',  '84–88', '66–70', '90–94', '160–165'],
                                    ['M',  '88–92', '70–74', '94–98', '165–170'],
                                    ['G',  '92–96', '74–78', '98–102', '170–175'],
                                    ['GG', '96–102', '78–84', '102–108', '175–180'],
                                    ['XG', '102–110', '84–92', '108–116', '180+'],
                                ].map(([sz, ...rest]) => (
                                    <tr key={sz} className="border-b border-white/[0.06]">
                                        <td className="py-2 px-3 font-bold text-white">{sz}</td>
                                        {rest.map((v, i) => <td key={i} className="py-2 px-3">{v} cm</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-white/40 text-xs">
                        * Medidas em centímetros. Em caso de dúvida, prefira o tamanho maior.
                    </p>
                </div>
            </Modal>
        </StoreLayout>
    );
}
