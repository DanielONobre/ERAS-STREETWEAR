import { Link, router } from '@inertiajs/react';
import StoreLayout from '@layouts/StoreLayout';
import AccountLayout from './AccountLayout';
import { TruckIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);

const STATUS_BADGE = {
    pending:    'badge-warning',
    confirmed:  'badge-primary',
    processing: 'badge-neutral',
    shipped:    'badge-accent',
    delivered:  'badge-success',
    cancelled:  'badge-danger',
};

export default function AccountOrderDetail({ order }) {
    const cancelOrder = () => {
        if (!confirm('Tem certeza que deseja cancelar este pedido?')) return;
        router.post(`/minha-conta/pedidos/${order.id}/cancelar`);
    };

    return (
        <StoreLayout title={`Pedido #${order.id} — VERTEX`}>
            <AccountLayout active="orders">
                {/* Back */}
                <Link href={route('account.orders')} className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors mb-6">
                    <ArrowLeftIcon className="w-4 h-4" /> Meus pedidos
                </Link>

                {/* Header */}
                <div className="card p-6 mb-5">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="font-display text-2xl font-bold">Pedido #{order.id}</h1>
                            <p className="text-sm text-white/40 mt-1">
                                Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className={`badge ${STATUS_BADGE[order.status] ?? 'badge-neutral'}`}>
                                {order.status_label}
                            </span>
                            {order.can_be_cancelled && (
                                <button onClick={cancelOrder} className="btn-danger btn-sm">
                                    Cancelar pedido
                                </button>
                            )}
                        </div>
                    </div>

                    {order.tracking_code && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                            <TruckIcon className="w-4 h-4" />
                            Código de rastreio: <strong className="font-mono">{order.tracking_code}</strong>
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="card overflow-hidden mb-5">
                    <div className="px-6 py-4 border-b border-white/[0.06]">
                        <h2 className="font-semibold">Itens</h2>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                        {order.items?.map((item) => (
                            <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                                {item.product_image && (
                                    <img
                                        src={`/storage/${item.product_image}`}
                                        alt={item.product_name}
                                        className="w-14 h-14 rounded-xl object-cover bg-dark flex-shrink-0"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{item.product_name}</p>
                                    {item.variant_info && <p className="text-xs text-white/40 mt-0.5">{item.variant_info}</p>}
                                    <p className="text-xs text-white/30 mt-0.5">Qtd: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-sm flex-shrink-0">{fmt(item.total)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Financial + Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="card p-6">
                        <h3 className="font-semibold mb-4">Resumo financeiro</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-white/50">
                                <span>Subtotal</span><span>{fmt(order.subtotal)}</span>
                            </div>
                            {(order.discount_amount ?? 0) > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span>Desconto</span><span>-{fmt(order.discount_amount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-white/50">
                                <span>Frete</span><span>{fmt(order.shipping_cost)}</span>
                            </div>
                            <div className="divider my-1" />
                            <div className="flex justify-between font-semibold text-base">
                                <span>Total</span><span>{order.formatted_total}</span>
                            </div>
                        </div>
                    </div>

                    {order.address_full && (
                        <div className="card p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <TruckIcon className="w-4 h-4 text-white/40" /> Endereço de entrega
                            </h3>
                            <p className="text-sm text-white/60 leading-relaxed">{order.address_full}</p>
                        </div>
                    )}
                </div>

                {/* Status history */}
                {order.status_history?.length > 0 && (
                    <div className="card p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-white/40" /> Histórico do pedido
                        </h3>
                        <div className="relative pl-4">
                            <div className="absolute left-0 top-2 bottom-2 w-px bg-white/[0.06]" />
                            <div className="space-y-4">
                                {order.status_history.map((h) => (
                                    <div key={h.id} className="relative flex items-start gap-4 text-sm">
                                        <div className="absolute -left-[19px] w-2.5 h-2.5 rounded-full bg-primary border-2 border-dark mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-white">{h.status}</p>
                                            {h.comment && <p className="text-white/40 text-xs mt-0.5">{h.comment}</p>}
                                            <p className="text-white/25 text-xs mt-0.5">
                                                {new Date(h.created_at).toLocaleString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </AccountLayout>
        </StoreLayout>
    );
}
