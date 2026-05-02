import { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import AdminLayout from '@layouts/AdminLayout';
import {
    CurrencyDollarIcon, ShoppingBagIcon, UserGroupIcon,
    ReceiptPercentIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon,
    ArrowTrendingDownIcon, PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { fmt } from '@lib/utils';

/* ─── Status map ─────────────────────────────────────────────────────── */
const STATUS = {
    pending:    { label: 'Aguardando',  cls: 'badge-warning' },
    confirmed:  { label: 'Confirmado',  cls: 'badge-primary' },
    processing: { label: 'Separando',   cls: 'badge-accent'  },
    shipped:    { label: 'Enviado',     cls: 'badge-success' },
    delivered:  { label: 'Entregue',    cls: 'badge-success' },
    cancelled:  { label: 'Cancelado',   cls: 'badge-danger'  },
    refunded:   { label: 'Reembolsado', cls: 'badge-neutral' },
};

/* ─── Custom tooltip ─────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-dark-100 border border-white/10 rounded-xl px-3 py-2 shadow-card text-xs">
            <p className="text-white/50 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="font-semibold" style={{ color: p.color }}>
                    {p.name === 'revenue' ? fmt(p.value) : p.value}
                </p>
            ))}
        </div>
    );
}

/* ─── KPI Card ───────────────────────────────────────────────────────── */
function KpiCard({ label, value, change, icon: Icon, color, bg, prefix = '', index = 0 }) {
    const isPositive = change >= 0;
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className="card p-5"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        isPositive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                        {isPositive
                            ? <ArrowTrendingUpIcon className="w-3 h-3" />
                            : <ArrowTrendingDownIcon className="w-3 h-3" />
                        }
                        {Math.abs(change).toFixed(1)}%
                    </div>
                )}
            </div>
            <div className="font-display text-2xl font-bold text-white">
                {prefix}{typeof value === 'number' && prefix === 'R$' ? fmt(value).replace('R$\u00a0', '') : value}
            </div>
            <div className="text-xs text-white/40 mt-1">{label}</div>
            {change !== undefined && (
                <div className="text-[11px] text-white/25 mt-0.5">vs. ontem</div>
            )}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard({
    stats = {},
    recentOrders = [],
    topProducts = [],
    salesChart = [],
    lowStockProducts = [],
}) {
    /* Normalise chart data */
    const chartData = useMemo(() => {
        if (salesChart.length) return salesChart;
        // fallback: generate 30 days mock
        return Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return {
                date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                revenue: Math.floor(Math.random() * 8000) + 1500,
                orders:  Math.floor(Math.random() * 30) + 5,
            };
        });
    }, [salesChart]);

    const maxRevenue = Math.max(...chartData.map(d => d.revenue));

    const kpis = [
        {
            label: 'Receita Hoje',
            value: stats.revenue_today ?? 0,
            change: stats.revenue_today_change,
            icon: CurrencyDollarIcon,
            color: 'text-primary',
            bg: 'bg-primary/10',
            prefix: 'R$',
        },
        {
            label: 'Pedidos Hoje',
            value: stats.orders_today ?? 0,
            change: stats.orders_today_change,
            icon: ShoppingBagIcon,
            color: 'text-accent',
            bg: 'bg-accent/10',
        },
        {
            label: 'Clientes Novos',
            value: stats.new_customers ?? 0,
            change: stats.customers_change,
            icon: UserGroupIcon,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
        },
        {
            label: 'Ticket Médio',
            value: stats.avg_ticket ?? 0,
            change: stats.ticket_change,
            icon: ReceiptPercentIcon,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            prefix: 'R$',
        },
    ];

    return (
        <AdminLayout
            title="Visão geral"
            breadcrumbs={[{ label: 'Visão geral' }]}
            stats={stats}
        >
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {kpis.map((kpi, i) => (
                    <KpiCard key={kpi.label} {...kpi} index={i} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* ── Gráfico de vendas 30 dias ────────────────────────── */}
                <div className="xl:col-span-2 card p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="font-semibold text-white">Vendas — 30 dias</h2>
                            <p className="text-xs text-white/40 mt-0.5">Receita diária</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/40">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-0.5 bg-primary rounded-full inline-block" />
                                Receita
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-0.5 bg-accent rounded-full inline-block" />
                                Pedidos
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#0d9488" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#f97316" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                                interval={4}
                            />
                            <YAxis
                                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={v => `R$${(v/1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<ChartTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#0d9488"
                                strokeWidth={2}
                                fill="url(#gradRevenue)"
                                dot={false}
                                activeDot={{ r: 4, fill: '#0d9488' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* ── Top 5 produtos ──────────────────────────────────── */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-white">MAIS VENDIDOS</h2>
                        <Link href="/admin/relatorios" className="text-xs text-primary hover:text-primary-400 transition-colors">
                            Ver relatório
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {(topProducts.length ? topProducts : Array.from({ length: 5 }, (_, i) => ({
                            id: i, name: `Produto ${i + 1}`, sold: 120 - i * 18, revenue: (120 - i * 18) * 89,
                        }))).slice(0, 5).map((product, i) => {
                            const maxSold = topProducts[0]?.sold ?? 120;
                            const pct = Math.round((product.sold / maxSold) * 100);
                            return (
                                <div key={product.id}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-xs text-white/25 w-4 text-right flex-shrink-0">{i + 1}</span>
                                            <span className="text-sm text-white/80 truncate">{product.name}</span>
                                        </div>
                                        <span className="text-xs text-white/50 flex-shrink-0 ml-2">{product.sold} un.</span>
                                    </div>
                                    <div className="h-1.5 bg-dark-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                                            className="h-full rounded-full"
                                            style={{
                                                background: `linear-gradient(90deg, #0d9488, ${i === 0 ? '#f97316' : '#0d9488'})`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* ── Últimos pedidos ─────────────────────────────────── */}
                <div className="xl:col-span-2 card overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                        <h2 className="font-semibold text-white">Últimos Pedidos</h2>
                        <Link href="/admin/pedidos" className="text-xs text-primary hover:text-primary-400 transition-colors">
                            Ver todos
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.04]">
                                    {['#', 'Cliente', 'Status', 'Total', 'Data', ''].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-[11px] text-white/35 font-medium uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {(recentOrders.length ? recentOrders : []).slice(0, 10).map((order) => {
                                    const st = STATUS[order.status] ?? STATUS.pending;
                                    return (
                                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-5 py-3">
                                                <Link
                                                    href={`/admin/pedidos/${order.id}`}
                                                    className="font-mono text-primary-400 hover:text-primary text-xs"
                                                >
                                                    #{order.number ?? order.id}
                                                </Link>
                                            </td>
                                            <td className="px-5 py-3 text-white/70 max-w-[140px] truncate">
                                                {order.customer_name ?? order.customer}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={st.cls}>{st.label}</span>
                                            </td>
                                            <td className="px-5 py-3 font-medium text-white">
                                                {fmt(order.total)}
                                            </td>
                                            <td className="px-5 py-3 text-white/35 text-xs whitespace-nowrap">
                                                {order.created_at}
                                            </td>
                                            <td className="px-5 py-3">
                                                <Link
                                                    href={`/admin/pedidos/${order.id}`}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white"
                                                >
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-10 text-center text-white/30 text-sm">
                                            Nenhum pedido encontrado
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Estoque baixo ────────────────────────────────────── */}
                <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                        <h2 className="font-semibold text-white flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                            Estoque Baixo
                        </h2>
                        <span className="badge-danger text-[10px]">
                            {lowStockProducts.length} produto{lowStockProducts.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                        {(lowStockProducts.length ? lowStockProducts : Array.from({ length: 4 }, (_, i) => ({
                            id: i + 1, name: `Produto Exemplo ${i + 1}`, stock: i + 1, slug: `produto-${i + 1}`,
                        }))).slice(0, 8).map((product) => (
                            <div key={product.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                                <Link
                                    href={`/admin/produtos/${product.id}/edit`}
                                    className="text-sm text-white/70 hover:text-white transition-colors truncate max-w-[160px]"
                                >
                                    {product.name}
                                </Link>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                                    product.stock === 0
                                        ? 'bg-red-500/20 text-red-400'
                                        : product.stock <= 2
                                            ? 'bg-orange-500/20 text-orange-400'
                                            : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                    {product.stock === 0 ? 'Esgotado' : `${product.stock} un.`}
                                </span>
                            </div>
                        ))}
                        {lowStockProducts.length === 0 && (
                            <p className="px-5 py-8 text-center text-sm text-white/30">
                                Todos os produtos com estoque OK ✓
                            </p>
                        )}
                    </div>
                    {lowStockProducts.length > 0 && (
                        <div className="px-5 py-3 border-t border-white/[0.06]">
                            <Link href="/admin/produtos?stock=low" className="text-xs text-primary hover:text-primary-400 transition-colors">
                                Ver todos com estoque baixo →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
