import { Link } from '@inertiajs/react';
import StoreLayout from '@layouts/StoreLayout';
import ProductGrid from '@components/Product/ProductGrid';
import FilterSidebar from '@components/Product/FilterSidebar';
import SortSelect from '@components/Product/SortSelect';
import Breadcrumb from '@components/UI/Breadcrumb';
import Pagination from '@components/UI/Pagination';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function CategoryShow({ category, products, filters }) {
    const crumbs = [
        ...(category.parent
            ? [{ label: category.parent.name, href: route('categories.show', category.parent.slug) }]
            : []),
        { label: category.name },
    ];

    return (
        <StoreLayout
            title={`${category.name} — VERTEX`}
            description={category.description}
        >
            <div className="container-page py-8 lg:py-12">
                {/* Breadcrumb */}
                <Breadcrumb items={crumbs} className="mb-6" />

                {/* Header */}
                <div className="mb-8">
                    <h1 className="section-title">{category.name}</h1>
                    {category.description && (
                        <p className="section-subtitle mt-1">{category.description}</p>
                    )}

                    {/* Sub-categorias */}
                    {category.children?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {category.children.map((child) => (
                                <Link
                                    key={child.id}
                                    href={route('categories.show', child.slug)}
                                    className="badge-neutral hover:badge-primary transition-all px-3 py-1.5 rounded-full text-sm"
                                >
                                    {child.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-8 items-start">
                    {/* Sidebar */}
                    <FilterSidebar
                        filters={filters}
                        baseRoute={route('categories.show', category.slug)}
                        className="hidden lg:block"
                    />

                    {/* Main */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-sm text-white/40">
                                <span className="text-white/70 font-medium">{products.total}</span>{' '}
                                {products.total === 1 ? 'produto' : 'produtos'}
                            </p>
                            <SortSelect value={filters.sort} baseRoute={route('categories.show', category.slug)} filters={filters} />
                        </div>

                        <ProductGrid products={products.data} />

                        <Pagination meta={products} className="mt-10" />
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
