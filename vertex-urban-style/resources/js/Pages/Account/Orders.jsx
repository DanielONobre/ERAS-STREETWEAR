import { Link } from '@inertiajs/react';
import StoreLayout from '@layouts/StoreLayout';
import AccountLayout from './AccountLayout';
import Pagination from '@components/UI/Pagination';
import { EmptyOrders } from '@components/UI/EmptyState';
import { ShoppingBagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const STATUS_BADGE = {
    pending:    'badge-warning',
    confirmed:  'badge-primary',
    processing: 'badge-neutral',
    shipped:    'badge-accent',
    delivered:  'badge-success',
    cancelled:  'badge-danger',
};

export default function AccountOrders({ orders }) {
    return (
        <StoreLayout title="Meus pedidos — ERAS">
            <AccountLayout active="orders">
                <h1 className="section-title mb-6">Meus pedidos</h1>

                {orders.data.length === 0 ? (
                    <EmptyOrders />
                ) : (
                    <>
                        <div className="card overflow-hidden mb-6">
                            <div className="divide-y divide-white/[0.04]">
                                {orders.data.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={route('account.orders.detail', order.id)}
                                        className="flex items-center justify-between px-6 py-5 hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-dark-200 flex items-center justify-center flex-shrink-0">
                                                <ShoppingBagIcon className="w-5 h-5 text-white/30" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Pedido #{order.id}</p>
                                                <p className="text-xs text-white/40 mt-0.5">
                                                    {order.created_at} · {order.items_count} {order.items_count === 1 ? 'item' : 'itens'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <p className="font-semibold text-sm">{order.formatted_total}</p>
                                                <p className="text-xs text-white/40">{order.payment_status}</p>
                                            </div>
                                            <span className={`badge text-xs ${STATUS_BADGE[order.status] ?? 'badge-neutral'}`}>
                                                {order.status_label}
                                            </span>
                                            <ArrowRightIcon className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Pagination meta={orders} />
                    </>
                )}
            </AccountLayout>
        </StoreLayout>
    );
}
