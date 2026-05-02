import { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import StoreLayout from '@layouts/StoreLayout';
import ProductGrid from '@components/Product/ProductGrid';
import FilterSidebar from '@components/Product/FilterSidebar';
import SortSelect from '@components/Product/SortSelect';
import Pagination from '@components/UI/Pagination';
import Breadcrumb from '@components/UI/Breadcrumb';
import {
    AdjustmentsHorizontalIcon,
    XMarkIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline';

/* ═══════════════════════════════════════════════════════════════════════ */
export default function ProductsIndex({
    products,
    filters = {},
    categories = [],
    brands = [],
    minPrice = 0,
    maxPrice = 9999,
    total,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const applyFilter = useCallback((key, value) => {
        const next = { ...filters };
        if (value === null || value === '' || value === false || value === undefined) {
            delete next[key];
        } else {
            next[key] = value;
        }
        // reset para página 1 ao mudar filtro
        delete next.page;
        router.get(route('products.index'), next, { preserveScroll: true, preserveState: true });
    }, [filters]);

    const clearAll = useCallback(() => {
        router.get(route('products.index'), {}, { preserveScroll: true });
    }, []);

    const activeFilterCount = Object.keys(filters).filter(
        k => !['sort', 'page'].includes(k) && filters[k]
    ).length;

    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Produtos' },
    ];

    const seoTitle = filters.search
        ? `"${filters.search}" — Produtos | ERAS Streetwear`
        : filters.category
            ? `${filters.category} — ERAS Streetwear`
            : 'Todos os Produtos — ERAS Streetwear';

    const seoDesc = `Encontre ${products?.total ?? ''} produtos de streetwear na ERAS Streetwear. Frete grátis acima de R$299.`;

    return (
        <StoreLayout>
            <Head>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:type" content="website" />
            </Head>

            <div className="container-page py-8 lg:py-12">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbs} className="mb-6" />

                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="section-title">
                            {filters.search
                                ? `Resultados para "${filters.search}"`
                                : filters.category
                                    ? filters.category
                                    : 'CATÁLOGO'}
                        </h1>
                        <p className="section-subtitle mt-1">
                            {products?.total ?? total ?? 0}{' '}
                            {(products?.total ?? total ?? 0) === 1 ? 'produto encontrado' : 'produtos encontrados'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <SortSelect
                            value={filters.sort ?? 'featured'}
                            onChange={(val) => applyFilter('sort', val)}
                        />
                        {/* Filter button (mobile-friendly) */}
                        <button
                            id="btn-toggle-filters"
                            onClick={() => setSidebarOpen(true)}
                            className="btn-outline btn-sm gap-2 relative"
                        >
                            <FunnelIcon className="w-4 h-4" />
                            Filtros
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Active filter chips */}
                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className="text-xs text-white/40">Filtros ativos:</span>
                        {filters.on_sale && (
                            <FilterChip label="Em promoção" onRemove={() => applyFilter('on_sale', null)} />
                        )}
                        {filters.is_new && (
                            <FilterChip label="Novidades" onRemove={() => applyFilter('is_new', null)} />
                        )}
                        {filters.category && (
                            <FilterChip label={filters.category} onRemove={() => applyFilter('category', null)} />
                        )}
                        {filters.brand && (
                            <FilterChip label={filters.brand} onRemove={() => applyFilter('brand', null)} />
                        )}
                        {(filters.min_price || filters.max_price) && (
                            <FilterChip
                                label={`R$${filters.min_price ?? minPrice} – R$${filters.max_price ?? maxPrice}`}
                                onRemove={() => { applyFilter('min_price', null); applyFilter('max_price', null); }}
                            />
                        )}
                        <button
                            onClick={clearAll}
                            className="text-xs text-white/40 hover:text-white underline underline-offset-2 ml-1 transition-colors"
                        >
                            Limpar todos
                        </button>
                    </div>
                )}

                {/* Main layout: sidebar + grid */}
                <div className="flex gap-8">
                    {/* Sidebar — hidden on mobile (drawer) */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <FilterSidebar
                                filters={filters}
                                categories={categories}
                                brands={brands}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                onFilter={applyFilter}
                            />
                        </div>
                    </aside>

                    {/* Products grid */}
                    <div className="flex-1 min-w-0">
                        {products?.data?.length === 0 ? (
                            <div className="card p-16 text-center">
                                <p className="font-display text-xl font-bold mb-2">
                                    {activeFilterCount > 0
                                        ? 'Sem resultado.'
                                        : 'Sem peças no momento.'}
                                </p>
                                <p className="text-white/40 mb-6">
                                    {activeFilterCount > 0
                                        ? 'Tenta limpar os filtros.'
                                        : 'O próximo drop tá vindo.'}
                                </p>
                                {activeFilterCount > 0 && (
                                    <button onClick={clearAll} className="btn-primary">
                                        Limpar filtros
                                    </button>
                                )}
                            </div>
                        ) : (
                            <ProductGrid products={products} />
                        )}

                        {/* Pagination */}
                        {products?.last_page > 1 && (
                            <div className="mt-12">
                                <Pagination
                                    links={products.links}
                                    currentPage={products.current_page}
                                    lastPage={products.last_page}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Mobile filter drawer ──────────────────────────────────────────── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 z-50 bg-dark/70 backdrop-blur-sm lg:hidden"
                        />
                        {/* Drawer */}
                        <motion.div
                            key="drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 z-[60] w-80 bg-dark-50 border-r border-white/[0.08] overflow-y-auto lg:hidden"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                                <span className="font-display font-semibold">Filtros</span>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="w-8 h-8 rounded-full bg-dark-100 flex items-center justify-center text-white/60 hover:text-white"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5">
                                <FilterSidebar
                                    filters={filters}
                                    categories={categories}
                                    brands={brands}
                                    minPrice={minPrice}
                                    maxPrice={maxPrice}
                                    onFilter={(key, val) => {
                                        applyFilter(key, val);
                                    }}
                                />
                            </div>
                            <div className="p-5 border-t border-white/[0.06]">
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="btn-primary w-full justify-center"
                                >
                                    Ver resultados ({products?.total ?? 0})
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </StoreLayout>
    );
}

/* ─── FilterChip ─────────────────────────────────────────────────────── */
function FilterChip({ label, onRemove }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium">
            {label}
            <button
                onClick={onRemove}
                className="text-primary/60 hover:text-primary transition-colors"
                aria-label={`Remover filtro ${label}`}
            >
                <XMarkIcon className="w-3 h-3" />
            </button>
        </span>
    );
}
