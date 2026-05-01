import { cn } from '@lib/utils';

/** Base shimmer skeleton */
export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                'animate-pulse rounded bg-dark-200',
                className
            )}
            {...props}
        />
    );
}

/** Skeleton completo de ProductCard */
export function ProductCardSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="aspect-[3/4] rounded-2xl w-full" />
            <div className="px-0.5 space-y-2">
                <Skeleton className="h-2.5 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    );
}

/** Grid de 8 skeletons de produto */
export function ProductGridSkeleton({ count = 8, className }) {
    return (
        <div className={cn(
            'grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
            className
        )}>
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

/** Skeleton de linha de carrinho */
export function CartItemSkeleton() {
    return (
        <div className="flex gap-3 animate-pulse">
            <Skeleton className="w-16 h-20 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full rounded-xl" />
            </div>
        </div>
    );
}

/** Skeleton de KPI card (admin dashboard) */
export function KpiCardSkeleton() {
    return (
        <div className="card p-5 space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="w-9 h-9 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
        </div>
    );
}

/** Skeleton de tabela */
export function TableRowSkeleton({ cols = 5 }) {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

/** Skeleton para cálculo de frete */
export function ShippingSkeleton() {
    return (
        <div className="space-y-2 animate-pulse">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
        </div>
    );
}

/** Skeleton de sugestão de busca */
export function SearchSuggestionSkeleton({ count = 5 }) {
    return (
        <div className="p-2 space-y-1">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 animate-pulse">
                    <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-3/4" />
                        <Skeleton className="h-3 w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}
