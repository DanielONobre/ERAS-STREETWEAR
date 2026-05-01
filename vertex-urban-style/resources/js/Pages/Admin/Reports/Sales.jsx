import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    AreaChart, Area, BarChart, Bar,
    PieChart, Pie, Cell, Tooltip,
    XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import AdminLayout from '@layouts/AdminLayout';
import {
    ArrowDownTrayIcon, CalendarDaysIcon,
    CurrencyDollarIcon, ShoppingBagIcon,
    ReceiptPercentIcon, ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { fmt } from '@lib/utils';

/* ─── Periods ────────────────────────────────────────────────────────── */
const PERIODS = [
    { key: 'today',   label: 'Hoje'      },
    { key: 'week',    label: 'Semana'    },
    { key: 'month',   label: 'Este mês'  },
    { key: 'quarter', label: 'Trimestre' },
    { key: 'custom',  label: 'Período'   },
];

/* ─── Tooltip customizado ────────────────────────────────────────────── */
function ChartTip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-dark-100 border border-white/10 rounded-xl px-3 py-2 text-xs shadow-card">
            <p className="text-white/50 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color || p.fill }}>
                    {typeof p.value === 'number' && p.value > 100
                        ? fmt(p.value)
                        : p.value
                    }
                </p>
            ))}
        </div>
    );
}

const PIE_COLORS = ['#0d9488', '#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

/* ─── KPI mini ───────────────────────────────────────────────────────── */
function ReportKpi({ label, value, sub, icon: Icon, color }) {
    return (
        <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl ${color.bg} flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${color.text}`} />
                </div>
                <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>{sub}</div>
            </div>
            <div className="font-display text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-white/40 mt-1">{label}</div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function ReportsSales({
    kpis = {},
    salesByDay = [],
    salesByCategory = [],
    topProducts = [],
    orders = [],
    stats = {},
}) {
    const [period, setPeriod] = useState('month');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const applyPeriod = (p) => {
        setPeriod(p);
        if (p !== 'custom') {
            const params = new URLSearchParams({ period: p });
            window.location.href = `/admin/relatorios?${params}`;
        }
    };

    const applyCustom = () => {
        if (!dateFrom || !dateTo) return;
        window.location.href = `/admin/relatorios?date_from=${dateFrom}&date_to=${dateTo}`;
    };

    const exportCsv = () => {
        const params = new URLSearchParams({ period, date_from: dateFrom, date_to: dateTo });
        window.open(`/admin/relatorios/export?${params}`, '_blank');
    };

    /* Fallback mock data */
    const chartData = salesByDay.length ? salesByDay : Array.from({ length: 30 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (29 - i));
        return { date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), revenue: Math.floor(Math.random() * 6000) + 800, orders: Math.floor(Math.random() * 20) + 2 };
    });

    const pieData = salesByCategory.length ? salesByCategory : [
        { name: 'Camisetas',   value: 38 },
        { name: 'Calças',      value: 22 },
        { name: 'Acessórios',  value: 15 },
        { name: 'Moletons',    value: 13 },
        { name: 'Tênis',       value: 12 },
    ];

    const barData = topProducts.length ? topProducts : Array.from({ length: 10 }, (_, i) => ({
        name: `Produto ${i + 1}`,
        sold: Math.floor(Math.random() * 120) + 10,
    }));

    const reportKpis = [
        { label: 'Receita Total', value: fmt(kpis.revenue ?? 42850), sub: '+12.4%', icon: CurrencyDollarIcon, color: { bg: 'bg-primary/10', text: 'text-primary' } },
        { label: 'Pedidos',       value: kpis.orders ?? 318,         sub: '+8.1%',  icon: ShoppingBagIcon,    color: { bg: 'bg-accent/10',   text: 'text-accent'  } },
        { label: 'Ticket Médio',  value: fmt(kpis.avg_ticket ?? 134.75), sub: '+4.2%', icon: ReceiptPercentIcon, color: { bg: 'bg-blue-400/10', text: 'text-blue-400' } },
        { label: 'Conversão',     value: `${kpis.conversion_rate ?? 3.8}%`, sub: '+0.6pp', icon: ArrowTrendingUpIcon, color: { bg: 'bg-purple-400/10', text: 'text-purple-400' } },
    ];

    return (
        <AdminLayout
            title="Relatórios de Vendas"
            breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Relatórios' }]}
            stats={stats}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="font-display text-xl font-bold text-white">Relatório de Vendas</h1>
                <button onClick={exportCsv} className="btn-outline btn-sm gap-2">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Exportar CSV
                </button>
            </div>

            {/* Period filter */}
            <div className="card p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <CalendarDaysIcon className="w-4 h-4 text-white/40 flex-shrink-0" />
                    {PERIODS.map(p => (
                        <button
                            key={p.key}
                            onClick={() => applyPeriod(p.key)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                period === p.key ? 'bg-primary text-white' : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                    {period === 'custom' && (
                        <div className="flex items-center gap-2 ml-2">
                            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input h-8 text-xs" />
                            <span className="text-white/30 text-xs">até</span>
                            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input h-8 text-xs" />
                            <button onClick={applyCustom} className="btn-primary btn-sm h-8 px-3 text-xs">Aplicar</button>
                        </div>
                    )}
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {reportKpis.map((kpi, i) => (
                    <ReportKpi key={kpi.label} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
                {/* ── Linha de vendas ──────────────────────────────────── */}
                <div className="xl:col-span-3 card p-5">
                    <h2 className="font-semibold mb-4">Vendas por dia</h2>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradR" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#0d9488" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                            <Tooltip content={<ChartTip />} />
                            <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2} fill="url(#gradR)" dot={false} activeDot={{ r: 4, fill: '#0d9488' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* ── Pizza por categoria ──────────────────────────────── */}
                <div className="xl:col-span-2 card p-5">
                    <h2 className="font-semibold mb-4">Vendas por categoria</h2>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%" cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                dataKey="value"
                                paddingAngle={3}
                            >
                                {pieData.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<ChartTip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-1.5 mt-2">
                        {pieData.slice(0, 5).map((d, i) => (
                            <div key={d.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                    <span className="text-white/60">{d.name}</span>
                                </div>
                                <span className="text-white/40">{d.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Top 10 bar ────────────────────────────────────────────── */}
            <div className="card p-5 mb-6">
                <h2 className="font-semibold mb-4">Top 10 Produtos</h2>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={barData.slice(0, 10)} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                        <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} width={75} />
                        <Tooltip content={<ChartTip />} />
                        <Bar dataKey="sold" fill="#0d9488" radius={[0, 6, 6, 0]} maxBarSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ── Tabela de pedidos ─────────────────────────────────────── */}
            <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <h2 className="font-semibold">Pedidos do Período</h2>
                    <span className="text-xs text-white/40">{orders.length} registros</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.04]">
                                {['#', 'Cliente', 'Data', 'Status', 'Total'].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-[11px] text-white/35 font-medium uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {orders.slice(0, 25).map(order => (
                                <tr key={order.id} className="hover:bg-white/[0.02]">
                                    <td className="px-5 py-3">
                                        <Link href={`/admin/pedidos/${order.id}`} className="font-mono text-primary-400 hover:text-primary text-xs">
                                            #{order.number ?? order.id}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-3 text-white/70">{order.customer_name ?? order.customer}</td>
                                    <td className="px-5 py-3 text-white/40 text-xs">{order.created_at}</td>
                                    <td className="px-5 py-3">
                                        <span className={`badge text-[10px] ${
                                            order.status === 'delivered' ? 'badge-success'
                                            : order.status === 'cancelled' ? 'badge-danger'
                                            : 'badge-primary'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 font-semibold text-white">{fmt(order.total)}</td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-white/30 text-sm">
                                        Nenhum pedido no período selecionado
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
