import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AdminLayout from '@layouts/AdminLayout';
import {
    PrinterIcon, TruckIcon, CheckCircleIcon,
    ClockIcon, XCircleIcon, MapPinIcon,
    CreditCardIcon, EnvelopeIcon, UserIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { fmt } from '@lib/utils';

/* ─── Status config ──────────────────────────────────────────────────── */
const STATUSES = [
    { key: 'pending',    label: 'Aguardando',  icon: ClockIcon,       color: 'text-amber-400',  bg: 'bg-amber-400/15',  border: 'border-amber-400/30'  },
    { key: 'confirmed',  label: 'Confirmado',  icon: CheckCircleIcon, color: 'text-primary',     bg: 'bg-primary/15',    border: 'border-primary/30'    },
    { key: 'processing', label: 'Separando',   icon: ClockIcon,       color: 'text-accent',      bg: 'bg-accent/15',     border: 'border-accent/30'     },
    { key: 'shipped',    label: 'Enviado',     icon: TruckIcon,       color: 'text-blue-400',   bg: 'bg-blue-400/15',   border: 'border-blue-400/30'   },
    { key: 'delivered',  label: 'Entregue',    icon: CheckCircleIcon, color: 'text-green-400',  bg: 'bg-green-400/15',  border: 'border-green-400/30'  },
    { key: 'cancelled',  label: 'Cancelado',   icon: XCircleIcon,     color: 'text-red-400',    bg: 'bg-red-400/15',    border: 'border-red-400/30'    },
];

/* ─── Status timeline ────────────────────────────────────────────────── */
function StatusTimeline({ currentStatus, history = [] }) {
    const progressSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIdx = progressSteps.indexOf(currentStatus);
    if (currentStatus === 'cancelled') {
        return (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <XCircleIcon className="w-5 h-5 text-red-400" />
                <span className="text-sm text-red-300">Pedido cancelado</span>
            </div>
        );
    }
    return (
        <div>
            {/* Progress bar */}
            <div className="relative">
                <div className="flex items-center justify-between">
                    {progressSteps.map((step, i) => {
                        const st = STATUSES.find(s => s.key === step);
                        const done = i <= currentIdx;
                        const Icon = st?.icon ?? ClockIcon;
                        return (
                            <div key={step} className="flex flex-col items-center flex-1">
                                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                    done
                                        ? 'bg-primary border-primary'
                                        : 'bg-dark-200 border-white/15'
                                }`}>
                                    <Icon className={`w-3.5 h-3.5 ${done ? 'text-white' : 'text-white/30'}`} />
                                </div>
                                <p className={`text-[10px] mt-1.5 text-center ${done ? 'text-white/70' : 'text-white/25'}`}>
                                    {st?.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
                {/* Connector line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-dark-200 -z-0">
                    <div
                        className="h-full bg-primary transition-all duration-700"
                        style={{ width: `${Math.max(0, currentIdx / (progressSteps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* History */}
            {history.length > 0 && (
                <div className="mt-6 space-y-3">
                    {history.map((entry, i) => (
                        <div key={i} className="flex gap-3 text-sm">
                            <div className="w-px bg-white/[0.06] ml-2.5 mt-5 flex-shrink-0" />
                            <div className="flex gap-2 items-start">
                                <div className="w-5 h-5 rounded-full bg-dark-200 border border-white/10 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white/70">{entry.description}</p>
                                    <p className="text-white/35 text-xs mt-0.5">{entry.created_at}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function AdminOrderShow({ order, stats = {} }) {
    const [updating,    setUpdating]   = useState(false);
    const [trackingCode, setTracking]  = useState(order.tracking_code ?? '');
    const [notifyEmail, setNotify]     = useState(true);
    const [error, setError]            = useState(null);

    const currentStatus = STATUSES.find(s => s.key === order.status) ?? STATUSES[0];

    const updateStatus = async (newStatus) => {
        setUpdating(true);
        setError(null);
        try {
            await axios.patch(`/admin/pedidos/${order.id}/status`, {
                status:         newStatus,
                tracking_code:  newStatus === 'shipped' ? trackingCode : undefined,
                notify_customer: notifyEmail,
            });
            router.reload({ only: ['order'] });
        } catch (e) {
            setError(e.response?.data?.message ?? 'Erro ao atualizar status.');
        } finally {
            setUpdating(false);
        }
    };

    const handlePrint = () => window.print();

    const breadcrumbs = [
        { label: 'Admin', href: '/admin' },
        { label: 'Pedidos', href: '/admin/pedidos' },
        { label: `Pedido #${order.number ?? order.id}` },
    ];

    /* Next status options */
    const nextStatuses = {
        pending:    ['confirmed', 'cancelled'],
        confirmed:  ['processing', 'cancelled'],
        processing: ['shipped', 'cancelled'],
        shipped:    ['delivered'],
        delivered:  [],
        cancelled:  [],
    }[order.status] ?? [];

    return (
        <AdminLayout
            title={`Pedido #${order.number ?? order.id}`}
            breadcrumbs={breadcrumbs}
            stats={stats}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="font-display text-xl font-bold text-white">
                            Pedido #{order.number ?? order.id}
                        </h1>
                        <span className={`badge ${currentStatus.bg} ${currentStatus.color} border ${currentStatus.border}`}>
                            {currentStatus.label}
                        </span>
                    </div>
                    <p className="text-sm text-white/40 mt-0.5">{order.created_at}</p>
                </div>
                <button onClick={handlePrint} className="btn-outline btn-sm gap-2">
                    <PrinterIcon className="w-4 h-4" />
                    Imprimir nota
                </button>
            </div>

            {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* ── Main (itens + timeline + ações) ──────────────────── */}
                <div className="xl:col-span-2 space-y-5">

                    {/* Status timeline */}
                    <div className="card p-5">
                        <h2 className="font-semibold mb-4">Histórico do Pedido</h2>
                        <StatusTimeline currentStatus={order.status} history={order.status_history ?? []} />
                    </div>

                    {/* Ações */}
                    {nextStatuses.length > 0 && (
                        <div className="card p-5 print:hidden">
                            <h2 className="font-semibold mb-4">Atualizar Status</h2>

                            {/* Tracking field for shipped */}
                            {(order.status === 'processing' || nextStatuses.includes('shipped')) && (
                                <div className="mb-4">
                                    <label className="label">Código de rastreio</label>
                                    <input
                                        type="text"
                                        value={trackingCode}
                                        onChange={e => setTracking(e.target.value)}
                                        placeholder="Ex: BR123456789BR"
                                        className="input font-mono"
                                    />
                                </div>
                            )}

                            <label className="flex items-center gap-2 mb-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifyEmail}
                                    onChange={e => setNotify(e.target.checked)}
                                    className="form-checkbox rounded bg-dark-200 border-white/20 text-primary"
                                />
                                <span className="text-sm text-white/70 flex items-center gap-1.5">
                                    <EnvelopeIcon className="w-4 h-4 text-primary" />
                                    Notificar cliente por email
                                </span>
                            </label>

                            <div className="flex flex-wrap gap-2">
                                {nextStatuses.map(statusKey => {
                                    const st = STATUSES.find(s => s.key === statusKey);
                                    const Icon = st?.icon ?? ClockIcon;
                                    return (
                                        <button
                                            key={statusKey}
                                            onClick={() => updateStatus(statusKey)}
                                            disabled={updating}
                                            className={`btn-sm flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                                                statusKey === 'cancelled'
                                                    ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                                    : `${st?.border} ${st?.color} hover:${st?.bg}`
                                            }`}
                                        >
                                            {updating
                                                ? <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                                : <Icon className="w-3.5 h-3.5" />
                                            }
                                            {st?.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    <div className="card overflow-hidden">
                        <div className="px-5 py-4 border-b border-white/[0.06]">
                            <h2 className="font-semibold">Itens do Pedido</h2>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.04]">
                                    {['Produto', 'Variante', 'Qtd.', 'Preço unit.', 'Total'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-[11px] text-white/35 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {(order.items ?? []).map((item, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02]">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                {item.product?.cover_image_url && (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-200 flex-shrink-0">
                                                        <img src={item.product.cover_image_url} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <Link
                                                    href={`/admin/produtos/${item.product?.id}/edit`}
                                                    className="text-white/80 hover:text-white transition-colors text-sm"
                                                >
                                                    {item.product?.name ?? item.name}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-white/40 text-xs">
                                            {item.variant_label ?? '—'}
                                        </td>
                                        <td className="px-5 py-3 text-white/70">{item.quantity}</td>
                                        <td className="px-5 py-3 text-white/70">{fmt(item.unit_price)}</td>
                                        <td className="px-5 py-3 font-semibold text-white">{fmt(item.line_total ?? item.unit_price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Sidebar direita ───────────────────────────────────── */}
                <div className="space-y-5">
                    {/* Resumo financeiro */}
                    <div className="card p-5">
                        <h2 className="font-semibold mb-4">Resumo</h2>
                        <div className="space-y-2.5 text-sm">
                            <div className="flex justify-between text-white/50">
                                <span>Subtotal</span><span>{fmt(order.subtotal)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span>Desconto</span><span>-{fmt(order.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-white/50">
                                <span>Frete</span>
                                <span className={order.shipping_cost === 0 ? 'text-primary' : ''}>
                                    {order.shipping_cost === 0 ? 'Grátis' : fmt(order.shipping_cost)}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-white/[0.06] flex justify-between font-semibold text-lg">
                                <span>Total</span><span>{fmt(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pagamento */}
                    <div className="card p-5">
                        <h2 className="font-semibold mb-3 flex items-center gap-2">
                            <CreditCardIcon className="w-4 h-4 text-primary" />
                            Pagamento
                        </h2>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/50">Método</span>
                                <span className="text-white/80">{order.payment_method_label ?? '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">Status</span>
                                <span className={order.payment_status === 'paid' ? 'text-green-400' : 'text-amber-400'}>
                                    {order.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                                </span>
                            </div>
                            {order.paid_at && (
                                <div className="flex justify-between">
                                    <span className="text-white/50">Pago em</span>
                                    <span className="text-white/60 text-xs">{order.paid_at}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cliente */}
                    <div className="card p-5">
                        <h2 className="font-semibold mb-3 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-primary" />
                            Cliente
                        </h2>
                        <div className="space-y-1 text-sm">
                            <p className="text-white/80 font-medium">{order.customer_name}</p>
                            <p className="text-white/50">{order.customer_email}</p>
                            {order.customer_phone && <p className="text-white/50">{order.customer_phone}</p>}
                            {order.customer_id && (
                                <Link
                                    href={`/admin/clientes/${order.customer_id}`}
                                    className="text-xs text-primary hover:text-primary-400 transition-colors mt-1 inline-block"
                                >
                                    Ver perfil do cliente →
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="card p-5">
                        <h2 className="font-semibold mb-3 flex items-center gap-2">
                            <MapPinIcon className="w-4 h-4 text-primary" />
                            Endereço de entrega
                        </h2>
                        {order.address ? (
                            <address className="not-italic text-sm text-white/60 space-y-0.5">
                                <p className="text-white/80">{order.address.name ?? order.customer_name}</p>
                                <p>{order.address.street}, {order.address.number}</p>
                                {order.address.complement && <p>{order.address.complement}</p>}
                                <p>{order.address.neighborhood}</p>
                                <p>{order.address.city}/{order.address.state}</p>
                                <p>CEP {order.address.zip_code}</p>
                            </address>
                        ) : (
                            <p className="text-sm text-white/40">Endereço não disponível</p>
                        )}
                    </div>

                    {/* Rastreio */}
                    {order.tracking_code && (
                        <div className="card p-5">
                            <h2 className="font-semibold mb-2 flex items-center gap-2">
                                <TruckIcon className="w-4 h-4 text-primary" />
                                Rastreamento
                            </h2>
                            <p className="font-mono text-sm text-primary-400">{order.tracking_code}</p>
                            {order.shipping_carrier && (
                                <p className="text-xs text-white/40 mt-1">{order.shipping_carrier}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
