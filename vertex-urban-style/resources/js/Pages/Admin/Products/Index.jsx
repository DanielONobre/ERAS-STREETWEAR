import { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@layouts/AdminLayout';
import {
    PlusIcon, MagnifyingGlassIcon, PencilSquareIcon,
    TrashIcon, EyeIcon, EyeSlashIcon, FunnelIcon,
    XMarkIcon, CheckIcon, ChevronUpDownIcon,
    ArrowUpIcon, ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { fmt } from '@lib/utils';

/* ─── Status badge ───────────────────────────────────────────────────── */
function StatusBadge({ active }) {
    return active
        ? <span className="badge-success text-[10px]">Ativo</span>
        : <span className="badge-neutral text-[10px]">Inativo</span>;
}

/* ─── Stock badge ────────────────────────────────────────────────────── */
function StockBadge({ stock }) {
    if (stock === 0) return <span className="badge-danger text-[10px]">Esgotado</span>;
    if (stock <= 5)  return <span className="badge-warning text-[10px]">{stock} un.</span>;
    return <span className="text-sm text-white/60">{stock}</span>;
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function AdminProductsIndex({
    products,
    filters = {},
    categories = [],
    stats = {},
}) {
    const [selected,    setSelected]    = useState(new Set());
    const [search,      setSearch]      = useState(filters.search ?? '');
    const [deleting,    setDeleting]    = useState(null);
    const [sortField,   setSort]        = useState(filters.sort ?? 'name');
    const [sortDir,     setSortDir]     = useState(filters.direction ?? 'asc');

    const items = products?.data ?? [];
    const allIds = items.map(p => p.id);
    const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id));

    /* Filter navigation */
    const applyFilter = useCallback((key, value) => {
        const next = { ...filters };
        if (!value) delete next[key]; else next[key] = value;
        delete next.page;
        router.get('/admin/produtos', next, { preserveScroll: true, preserveState: true });
    }, [filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilter('search', search);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            const dir = sortDir === 'asc' ? 'desc' : 'asc';
            setSortDir(dir);
            router.get('/admin/produtos', { ...filters, sort: field, direction: dir }, { preserveScroll: true });
        } else {
            setSort(field);
            setSortDir('asc');
            router.get('/admin/produtos', { ...filters, sort: field, direction: 'asc' }, { preserveScroll: true });
        }
    };

    /* Bulk actions */
    const bulkAction = (action) => {
        if (!selected.size) return;
        router.post('/admin/produtos/bulk', {
            ids: [...selected],
            action,
        }, {
            preserveScroll: true,
            onSuccess: () => setSelected(new Set()),
        });
    };

    /* Toggle selection */
    const toggleSelect = (id) => {
        const next = new Set(selected);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelected(next);
    };

    const toggleAll = () => {
        setSelected(allSelected ? new Set() : new Set(allIds));
    };

    /* Delete confirm */
    const confirmDelete = (id) => {
        router.delete(`/admin/produtos/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleting(null),
        });
    };

    /* Sort icon */
    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ChevronUpDownIcon className="w-3.5 h-3.5 text-white/20" />;
        return sortDir === 'asc'
            ? <ArrowUpIcon className="w-3.5 h-3.5 text-primary" />
            : <ArrowDownIcon className="w-3.5 h-3.5 text-primary" />;
    };

    return (
        <AdminLayout
            title="Produtos"
            breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Produtos' }]}
            stats={stats}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-display text-xl font-bold text-white">Gestão de Produtos</h1>
                    <p className="text-sm text-white/40 mt-0.5">
                        {products?.total ?? 0} produtos no catálogo
                    </p>
                </div>
                <Link href="/admin/produtos/criar" className="btn-primary">
                    <PlusIcon className="w-4 h-4" />
                    Novo Produto
                </Link>
            </div>

            {/* Filters bar */}
            <div className="card p-4 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar por nome, SKU..."
                                className="input pl-9 text-sm h-9"
                            />
                        </div>
                        <button type="submit" className="btn-primary btn-sm h-9 px-4">
                            Buscar
                        </button>
                    </form>

                    {/* Category filter */}
                    <select
                        value={filters.category ?? ''}
                        onChange={e => applyFilter('category', e.target.value)}
                        className="input h-9 text-sm w-auto min-w-[140px]"
                    >
                        <option value="">Todas categorias</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    {/* Status filter */}
                    <select
                        value={filters.status ?? ''}
                        onChange={e => applyFilter('status', e.target.value)}
                        className="input h-9 text-sm w-auto"
                    >
                        <option value="">Todos status</option>
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                    </select>

                    {/* Stock filter */}
                    <select
                        value={filters.stock ?? ''}
                        onChange={e => applyFilter('stock', e.target.value)}
                        className="input h-9 text-sm w-auto"
                    >
                        <option value="">Todo estoque</option>
                        <option value="low">Estoque baixo ({'<'} 5)</option>
                        <option value="out">Esgotado</option>
                        <option value="in">Em estoque</option>
                    </select>

                    {/* Clear */}
                    {Object.values(filters).some(Boolean) && (
                        <button
                            onClick={() => router.get('/admin/produtos', {})}
                            className="btn-ghost btn-sm h-9 flex items-center gap-1"
                        >
                            <XMarkIcon className="w-3.5 h-3.5" />
                            Limpar
                        </button>
                    )}
                </div>
            </div>

            {/* Bulk actions bar */}
            <AnimatePresence>
                {selected.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mb-4 px-4 py-3 rounded-xl bg-primary/10 border border-primary/25 flex items-center gap-4"
                    >
                        <span className="text-sm text-primary font-medium">
                            {selected.size} selecionado{selected.size > 1 ? 's' : ''}
                        </span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => bulkAction('activate')} className="btn-sm btn-outline h-7 text-green-400 border-green-400/30 hover:border-green-400">
                                Ativar
                            </button>
                            <button onClick={() => bulkAction('deactivate')} className="btn-sm btn-outline h-7 text-yellow-400 border-yellow-400/30 hover:border-yellow-400">
                                Desativar
                            </button>
                            <button onClick={() => bulkAction('delete')} className="btn-sm btn-outline h-7 text-red-400 border-red-400/30 hover:border-red-400">
                                <TrashIcon className="w-3.5 h-3.5" />
                                Excluir
                            </button>
                        </div>
                        <button onClick={() => setSelected(new Set())} className="ml-auto text-white/40 hover:text-white">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                <th className="px-5 py-3 w-10">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        className="form-checkbox rounded bg-dark-200 border-white/20 text-primary"
                                    />
                                </th>
                                <th className="px-5 py-3 text-left w-12"></th>
                                {[
                                    { label: 'Nome', field: 'name' },
                                    { label: 'SKU', field: 'sku' },
                                    { label: 'Categoria', field: 'category' },
                                    { label: 'Preço', field: 'price' },
                                    { label: 'Estoque', field: 'stock' },
                                    { label: 'Status', field: 'is_active' },
                                ].map(({ label, field }) => (
                                    <th
                                        key={field}
                                        onClick={() => handleSort(field)}
                                        className="px-5 py-3 text-left text-[11px] text-white/40 font-medium uppercase tracking-wider cursor-pointer hover:text-white/60 transition-colors"
                                    >
                                        <span className="flex items-center gap-1">
                                            {label}
                                            <SortIcon field={field} />
                                        </span>
                                    </th>
                                ))}
                                <th className="px-5 py-3 text-right text-[11px] text-white/40 font-medium uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {items.map((product) => (
                                <tr key={product.id} className={`hover:bg-white/[0.02] transition-colors group ${selected.has(product.id) ? 'bg-primary/5' : ''}`}>
                                    <td className="px-5 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selected.has(product.id)}
                                            onChange={() => toggleSelect(product.id)}
                                            className="form-checkbox rounded bg-dark-200 border-white/20 text-primary"
                                        />
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-200 flex-shrink-0">
                                            {product.cover_image_url && (
                                                <img src={product.cover_image_url} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <Link
                                            href={`/admin/produtos/${product.id}/edit`}
                                            className="font-medium text-white/90 hover:text-white transition-colors"
                                        >
                                            {product.name}
                                        </Link>
                                        {product.is_featured && (
                                            <span className="ml-2 badge-accent text-[9px]">Destaque</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 font-mono text-white/40 text-xs">
                                        {product.sku ?? '—'}
                                    </td>
                                    <td className="px-5 py-3 text-white/60 text-xs">
                                        {product.category?.name ?? '—'}
                                    </td>
                                    <td className="px-5 py-3 font-medium text-white">
                                        {fmt(product.price)}
                                        {product.compare_price > product.price && (
                                            <span className="ml-1 text-xs text-white/30 line-through">
                                                {fmt(product.compare_price)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <StockBadge stock={product.stock ?? 0} />
                                    </td>
                                    <td className="px-5 py-3">
                                        <StatusBadge active={product.is_active} />
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Toggle active */}
                                            <button
                                                onClick={() => router.patch(`/admin/produtos/${product.id}/toggle`, {}, { preserveScroll: true })}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                                title={product.is_active ? 'Desativar' : 'Ativar'}
                                            >
                                                {product.is_active
                                                    ? <EyeSlashIcon className="w-4 h-4" />
                                                    : <EyeIcon className="w-4 h-4" />
                                                }
                                            </button>
                                            {/* Edit */}
                                            <Link
                                                href={`/admin/produtos/${product.id}/edit`}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-primary hover:bg-primary/10 transition-all"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </Link>
                                            {/* Delete */}
                                            <button
                                                onClick={() => setDeleting(product.id)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-5 py-16 text-center">
                                        <p className="font-display font-semibold text-white/50 mb-1">Nada por aqui ainda.</p>
                                        <p className="text-white/30 text-sm mb-4">Crie o primeiro produto do catálogo.</p>
                                        <Link href="/admin/produtos/criar" className="btn-primary btn-sm inline-flex">
                                            <PlusIcon className="w-3.5 h-3.5" />
                                            NOVO PRODUTO
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {products?.last_page > 1 && (
                    <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between">
                        <p className="text-xs text-white/40">
                            Mostrando {products.from}–{products.to} de {products.total}
                        </p>
                        <div className="flex gap-1">
                            {products.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                                        link.active
                                            ? 'bg-primary text-white'
                                            : link.url
                                                ? 'text-white/50 hover:bg-white/10 hover:text-white'
                                                : 'text-white/20 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete confirm modal */}
            <AnimatePresence>
                {deleting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-sm"
                        onClick={() => setDeleting(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="card p-6 max-w-sm w-full"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                                <TrashIcon className="w-6 h-6 text-red-400" />
                            </div>
                            <h3 className="font-display font-semibold text-center mb-2">Excluir produto?</h3>
                            <p className="text-sm text-white/50 text-center mb-6">
                                Esta ação não pode ser desfeita.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleting(null)} className="btn-ghost flex-1">Cancelar</button>
                                <button onClick={() => confirmDelete(deleting)} className="btn-danger flex-1 justify-center">
                                    Excluir
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
