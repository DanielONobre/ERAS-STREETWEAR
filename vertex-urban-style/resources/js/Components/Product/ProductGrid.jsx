import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '@components/UI/Skeleton';
import { cn } from '@lib/utils';

/**
 * Grid responsivo de produtos com skeleton loading e empty state.
 *
 * @param {object}   props
 * @param {Array}    props.products        - Array de produtos ou paginação do Laravel
 * @param {boolean}  [props.loading]       - Exibe skeletons
 * @param {number}   [props.skeletonCount] - Número de skeletons (default 8)
 * @param {string}   [props.className]
 * @param {object}   [props.wishlist]      - Map product_id → boolean
 * @param {string}   [props.emptyMessage]  - Mensagem quando vazio
 */
export default function ProductGrid({
    products,
    loading = false,
    skeletonCount = 8,
    className,
    wishlist = {},
    emptyMessage,
}) {
    const items = Array.isArray(products) ? products : (products?.data ?? []);

    const gridClasses = cn(
        'grid gap-4 sm:gap-6',
        'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        className
    );

    if (loading) {
        return <ProductGridSkeleton count={skeletonCount} className={className} />;
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-30" fill="none">
                    <rect width="80" height="80" rx="20" fill="#1a1f2e" />
                    <path d="M20 40h40M40 20v40" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.3" />
                </svg>
                <p className="font-medium text-white/50">
                    {emptyMessage ?? 'Nenhum produto encontrado.'}
                </p>
                <p className="text-sm text-white/30">Tente ajustar os filtros.</p>
            </div>
        );
    }

    return (
        <div className={gridClasses}>
            {items.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    wishlisted={wishlist[product.id] ?? false}
                />
            ))}
        </div>
    );
}
