import { Link, router } from '@inertiajs/react';
import AppLayout from '@layouts/AppLayout';
import { TruckIcon, ClockIcon } from '@heroicons/react/24/outline';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const statusColors = {
    primary: 'badge-primary', accent: 'badge-accent', success: 'badge-success',
    warning: 'badge-warning', danger: 'badge-danger', neutral: 'badge-neutral',
};

export default function OrderShow({ order }) {
    const cancelOrder = () => {
        if (!confirm('Deseja cancelar este pedido?')) return;
        router.post(`/meus-pedidos/${order.id}/cancelar`);
    };

    return (
        <AppLayout title={`Pedido ${order.number} — ERAS Streetwear`}>
            <div className="container-page py-8 lg:py-12 max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link href={route('orders.index')} className="text-white/40 hover:text-white text-sm">
                        ← Meus Pedidos
                    </Link>
                </div>

                {/* Header */}
                <div className="card p-6 mb-6">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="font-display text-2xl font-bold">{order.number}</h1>
                            <p className="text-white/40 text-sm mt-1">
                                Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={statusColors[order.status_color] || 'badge-neutral'}>
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
                            Rastreio: <strong>{order.tracking_code}</strong>
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="card overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-white/[0.06]">
                        <h2 className="font-semibold">Itens do pedido</h2>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                        {order.items?.map((item) => (
                            <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                                {item.product_image && (
                                    <img src={`/storage/${item.product_image}`} alt={item.product_name}
                                        className="w-14 h-14 rounded-xl object-cover bg-dark" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">{item.product_name}</div>
                                    {item.variant_info && <div className="text-xs text-white/40">{item.variant_info}</div>}
                                    <div className="text-xs text-white/40 mt-0.5">Qtd: {item.quantity}</div>
                                </div>
                                <div className="text-sm font-semibold">{fmt(item.total)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary + Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h3 className="font-semibold mb-4">Resumo financeiro</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-white/60">
                                <span>Subtotal</span><span>{fmt(order.subtotal)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span>Desconto</span><span>-{fmt(order.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-white/60">
                                <span>Frete</span><span>{fmt(order.shipping_cost)}</span>
                            </div>
                            <div className="divider" />
                            <div className="flex justify-between font-semibold text-base">
                                <span>Total</span><span>{fmt(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {order.shipping_address && (
                        <div className="card p-6">
                            <h3 className="font-semibold mb-4">Endereço de entrega</h3>
                            <div className="text-sm text-white/60 space-y-1">
                                <p className="font-medium text-white">{order.shipping_address.recipient_name}</p>
                                <p>{order.shipping_address.street}, {order.shipping_address.number}</p>
                                {order.shipping_address.complement && <p>{order.shipping_address.complement}</p>}
                                <p>{order.shipping_address.neighborhood}</p>
                                <p>{order.shipping_address.city}/{order.shipping_address.state} — CEP {order.shipping_address.zip_code}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status history */}
                {order.status_history?.length > 0 && (
                    <div className="card p-6 mt-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-white/40" /> Histórico
                        </h3>
                        <div className="space-y-3">
                            {order.status_history.map((h) => (
                                <div key={h.id} className="flex items-start gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-medium text-white">{h.status}</span>
                                        {h.comment && <p className="text-white/40">{h.comment}</p>}
                                        <p className="text-white/30 text-xs">{new Date(h.created_at).toLocaleString('pt-BR')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
