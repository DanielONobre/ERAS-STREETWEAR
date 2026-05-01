import { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@layouts/AdminLayout';
import {
    MagnifyingGlassIcon, FunnelIcon, XMarkIcon,
    ArrowDownTrayIcon, EyeIcon, ChevronUpDownIcon,
} from '@heroicons/react/24/outline';
import { fmt } from '@lib/utils';

/* ─── Status config ──────────────────────────────────────────────────── */
const STATUSES = {
    pending:    { label: 'Aguardando',  cls: 'badge-warning' },
    confirmed:  { label: 'Confirmado',  cls: 'badge-primary' },
    processing: { label: 'Separando',   cls: 'badge-accent'  },
    shipped:    { label: 'Enviado',     cls: 'badge-success' },
    delivered:  { label: 'Entregue',    cls: 'badge-success' },
    cancelled:  { label: 'Cancelado',   cls: 'badge-danger'  },
    refunded:   { label: 'Reembolsado', cls: 'badge-neutral' },
};

const PAYMENT_STATUSES = {
    pending:  { label: 'Pendente',   cls: 'badge-warning' },
    paid:     { label: 'Pago',       cls: 'badge-success' },
    failed:   { label: 'Falhou',     cls: 'badge-danger'  },
    refunded: { label: 'Reembolsado',cls: 'badge-neutral' },
};

/* ═══════════════════════════════════════════════════════════════════════ */
export default function AdminOrdersIndex({
    orders,
    filters = {},
    stats = {},
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');

    const applyFilter = useCallback((key, value) => {
        const next = { ...filters };
        if (!value) delete next[key]; else next[key] = value;
        delete next.page;
        router.get('/admin/pedidos', next, { preserveScroll: true, preserveState: true });
    }, [filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        const next = { ...filters, search };
        if (dateFrom) next.date_from = dateFrom;
        if (dateTo)   next.date_to   = dateTo;
        delete next.page;
        router.get('/admin/pedidos', next, { preserveScroll: true });
    };

    const clearFilters = () => {
        setSearch('');
        setDateFrom('');
        setDateTo('');
        router.get('/admin/pedidos', {});
    };

    const exportCsv = () => {
        const params = new URLSearchParams(filters);
        window.open(`/admin/pedidos/export?${params.toString()}`, '_blank');
    };

    const items = orders?.data ?? [];

    return (
        <AdminLayout
            title="Pedidos"
            breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Pedidos' }]}
            stats={stats}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-display text-xl font-bold text-white">Gestão de Pedidos</h1>
                    <p className="text-sm text-white/40 mt-0.5">{orders?.total ?? 0} pedidos</p>
                </div>
                <button onClick={exportCsv} className="btn-outline btn-sm gap-2">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Exportar CSV
                </button>
            </div>

            {/* Status quick filters */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={() => applyFilter('status', '')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        !filters.status ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/[0.06]'
                    }`}
                >
                    Todos ({orders?.total ?? 0})
                </button>
                {Object.entries(STATUSES).map(([key, { label, cls }]) => (
                    <button
                        key={key}
                        onClick={() => applyFilter('status', key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            filters.status === key ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/[0.06]'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Search + date filters */}
            <div className="card p-4 mb-4">
                <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar por nº do pedido, cliente, email..."
                            className="input pl-9 text-sm h-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            className="input h-9 text-sm w-38"
                        />
                        <span className="text-white/30 text-sm">até</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            className="input h-9 text-sm w-38"
                        />
                    </div>
                    <select
                        value={filters.payment_status ?? ''}
                        onChange={e => applyFilter('payment_status', e.target.value)}
                        className="input h-9 text-sm w-auto"
                    >
                        <option value="">Pagamento: Todos</option>
                        {Object.entries(PAYMENT_STATUSES).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                        ))}
                    </select>
                    <button type="submit" className="btn-primary btn-sm h-9 px-4">Buscar</button>
                    {Object.values(filters).some(Boolean) && (
                        <button type="button" onClick={clearFilters} className="btn-ghost btn-sm h-9">
                            <XMarkIcon className="w-3.5 h-3.5" />
                            Limpar
                        </button>
                    )}
                </form>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {['#', 'Cliente', 'Data', 'Status', 'Pagamento', 'Total', 'Itens', ''].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-[11px] text-white/35 font-medium uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {items.map((order) => {
                                const st = STATUSES[order.status] ?? STATUSES.pending;
                                const pt = PAYMENT_STATUSES[order.payment_status] ?? PAYMENT_STATUSES.pending;
                                return (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-5 py-3.5">
                                            <Link
                                                href={`/admin/pedidos/${order.id}`}
                                                className="font-mono text-primary-400 hover:text-primary text-xs font-semibold"
                                            >
                                                #{order.number ?? order.id}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div>
                                                <p className="text-white/80 text-sm">{order.customer_name ?? order.customer}</p>
                                                {order.customer_email && (
                                                    <p className="text-white/35 text-xs mt-0.5">{order.customer_email}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-white/40 text-xs whitespace-nowrap">
                                            {order.created_at}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={st.cls}>{st.label}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={pt.cls}>{pt.label}</span>
                                        </td>
                                        <td className="px-5 py-3.5 font-semibold text-white">
                                            {fmt(order.total)}
                                        </td>
                                        <td className="px-5 py-3.5 text-white/40 text-xs">
                                            {order.items_count ?? '—'} it.
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Link
                                                href={`/admin/pedidos/${order.id}`}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-primary hover:bg-primary/10 transition-all"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-16 text-center">
                                        <p className="text-4xl mb-3">📦</p>
                                        <p className="text-white/40 text-sm">Nenhum pedido encontrado</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders?.last_page > 1 && (
                    <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between">
                        <p className="text-xs text-white/40">
                            Mostrando {orders.from}–{orders.to} de {orders.total}
                        </p>
                        <div className="flex gap-1">
                            {orders.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                                        link.active ? 'bg-primary text-white'
                                        : link.url ? 'text-white/50 hover:bg-white/10 hover:text-white'
                                        : 'text-white/20 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
