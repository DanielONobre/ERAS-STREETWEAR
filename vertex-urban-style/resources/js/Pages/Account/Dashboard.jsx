import { Link } from '@inertiajs/react';
import StoreLayout from '@layouts/StoreLayout';
import AccountLayout from './AccountLayout';
import {
    ShoppingBagIcon, MapPinIcon, HeartIcon, UserIcon, ArrowRightIcon,
} from '@heroicons/react/24/outline';

const STATUS_BADGE = {
    pending:    'badge-warning',
    confirmed:  'badge-primary',
    processing: 'badge-neutral',
    shipped:    'badge-accent',
    delivered:  'badge-success',
    cancelled:  'badge-danger',
};

export default function AccountDashboard({ user, recent_orders }) {
    return (
        <StoreLayout title="Minha conta — VERTEX">
            <AccountLayout active="dashboard">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="section-title">Olá, {user.name.split(' ')[0]}!</h1>
                    <p className="section-subtitle">Bem-vindo de volta à sua conta VERTEX.</p>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: ShoppingBagIcon, label: 'Pedidos',    value: user.orders_count, href: route('account.orders') },
                        { icon: MapPinIcon,       label: 'Endereços',  value: '–',               href: route('account.addresses') },
                        { icon: HeartIcon,        label: 'Favoritos',  value: '–',               href: route('account.wishlist') },
                        { icon: UserIcon,         label: 'Perfil',     value: '–',               href: route('account.profile') },
                    ].map(({ icon: Icon, label, value, href }) => (
                        <Link key={label} href={href} className="card-hover p-5 flex flex-col items-center gap-2 text-center">
                            <Icon className="w-6 h-6 text-primary" />
                            <span className="font-display text-2xl font-bold">{value}</span>
                            <span className="text-xs text-white/40">{label}</span>
                        </Link>
                    ))}
                </div>

                {/* Recent orders */}
                <div className="card overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <h2 className="font-display font-semibold">Últimos pedidos</h2>
                        <Link href={route('account.orders')} className="text-sm text-primary hover:text-primary-400 flex items-center gap-1 transition-colors">
                            Ver todos <ArrowRightIcon className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {recent_orders.length === 0 ? (
                        <div className="p-12 text-center">
                            <ShoppingBagIcon className="w-10 h-10 text-white/10 mx-auto mb-3" />
                            <p className="text-white/40">Você ainda não fez nenhum pedido.</p>
                            <Link href={route('products.index')} className="btn-primary btn-sm mt-4 inline-flex">
                                Explorar produtos
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/[0.04]">
                            {recent_orders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
                                    <div>
                                        <p className="font-medium text-sm">Pedido #{order.id}</p>
                                        <p className="text-xs text-white/40">{order.created_at} · {order.items_count} {order.items_count === 1 ? 'item' : 'itens'}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`badge text-xs ${STATUS_BADGE[order.status] ?? 'badge-neutral'}`}>
                                            {order.status_label}
                                        </span>
                                        <span className="font-semibold text-sm">{order.formatted_total}</span>
                                        <Link
                                            href={route('account.orders.detail', order.id)}
                                            className="text-white/30 hover:text-white transition-colors"
                                        >
                                            <ArrowRightIcon className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AccountLayout>
        </StoreLayout>
    );
}
