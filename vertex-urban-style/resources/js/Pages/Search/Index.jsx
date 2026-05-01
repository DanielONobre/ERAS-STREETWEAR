import { useState } from 'react';
import { router } from '@inertiajs/react';
import StoreLayout from '@layouts/StoreLayout';
import ProductGrid from '@components/Product/ProductGrid';
import SortSelect from '@components/Product/SortSelect';
import Pagination from '@components/UI/Pagination';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevância' },
    { value: 'newest',    label: 'Mais recentes' },
    { value: 'price_asc', label: 'Menor preço' },
    { value: 'price_desc',label: 'Maior preço' },
];

export default function SearchIndex({ products, total, query, categories, filters }) {
    const [term, setTerm] = useState(query);

    const search = (e) => {
        e.preventDefault();
        if (term.trim()) {
            router.get(route('search'), { q: term.trim() }, { preserveState: true });
        }
    };

    const hasResults = products?.data?.length > 0;

    return (
        <StoreLayout
            title={query ? `"${query}" — Busca ERAS` : 'Busca — ERAS'}
            description={query ? `${total} resultados para "${query}" na ERAS.` : undefined}
        >
            <div className="container-page py-8 lg:py-12">

                {/* Search box */}
                <form onSubmit={search} className="max-w-2xl mx-auto mb-10">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
                        <input
                            type="search"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            placeholder="Buscar produtos..."
                            autoFocus
                            className="input pl-12 pr-12 py-4 text-base rounded-2xl w-full"
                        />
                        {term && (
                            <button
                                type="button"
                                onClick={() => { setTerm(''); router.get(route('search')); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </form>

                {/* Results header */}
                {query ? (
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="section-title">
                                {total} {total === 1 ? 'resultado' : 'resultados'} para{' '}
                                <span className="text-primary">"{query}"</span>
                            </h1>
                        </div>
                        {hasResults && (
                            <SortSelect
                                value={filters.sort || 'relevance'}
                                baseRoute={route('search')}
                                filters={filters}
                                options={SORT_OPTIONS}
                            />
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-white/40 text-lg">Digite algo para buscar produtos.</p>
                    </div>
                )}

                {/* Category chips */}
                {query && categories?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => router.get(route('search'), { q: query }, { preserveState: true })}
                            className={`badge transition-all ${!filters.category ? 'badge-primary' : 'badge-neutral hover:badge-primary'}`}
                        >
                            Todos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => router.get(route('search'), { q: query, category: cat.slug }, { preserveState: true })}
                                className={`badge transition-all ${filters.category === cat.slug ? 'badge-primary' : 'badge-neutral hover:badge-primary'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Grid */}
                {query && !hasResults && (
                    <div className="card p-16 text-center mt-4">
                        <MagnifyingGlassIcon className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40 text-lg">Nenhum produto encontrado.</p>
                        <p className="text-white/25 text-sm mt-2">Tente outros termos ou navegue por categorias.</p>
                    </div>
                )}

                {hasResults && (
                    <>
                        <ProductGrid products={products.data} />
                        <Pagination meta={products} className="mt-10" />
                    </>
                )}
            </div>
        </StoreLayout>
    );
}
