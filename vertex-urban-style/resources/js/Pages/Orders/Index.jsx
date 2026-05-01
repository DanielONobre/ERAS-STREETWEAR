import { Link, router } from '@inertiajs/react';
import AppLayout from '@layouts/AppLayout';
import { CubeIcon } from '@heroicons/react/24/outline';

const statusColors = {
    primary: 'badge-primary',
    accent:  'badge-accent',
    success: 'badge-success',
    warning: 'badge-warning',
    danger:  'badge-danger',
    neutral: 'badge-neutral',
};

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function OrdersIndex({ orders }) {
    return (
        <AppLayout title="Meus Pedidos — ERAS Streetwear">
            <div className="container-page py-8 lg:py-12 max-w-3xl">
                <h1 className="section-title mb-8">Meus Pedidos</h1>

                {orders.data.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-dark flex items-center justify-center mx-auto mb-4">
                            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white/20" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <p className="text-white/40 font-medium">Nenhum pedido ainda</p>
                        <Link href={route('products.index')} className="btn-primary mt-4">
                            Começar a comprar
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.data.map((order) => (
                            <Link
                                key={order.id}
                                href={route('orders.show', order.id)}
                                className="card-hover p-5 flex items-center justify-between gap-4 block"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="font-mono text-sm font-medium text-white">{order.number}</span>
                                        <span className={statusColors[order.status_color] || 'badge-neutral'}>
                                            {order.status_label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/40 mt-1">
                                        {order.item_count} {order.item_count === 1 ? 'item' : 'itens'} • {order.created_at}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="font-semibold text-white">{fmt(order.total)}</div>
                                </div>
                            </Link>
                        ))}

                        {/* Pagination */}
                        {orders.last_page > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {orders.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all
                                            ${link.active ? 'bg-primary text-white' : link.url
                                                ? 'bg-dark-100 text-white/60 hover:bg-white/10' : 'bg-dark-100 text-white/20 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
