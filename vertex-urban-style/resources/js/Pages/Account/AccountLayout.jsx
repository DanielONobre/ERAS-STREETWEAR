import { Link } from '@inertiajs/react';
import {
    Squares2X2Icon, ShoppingBagIcon, MapPinIcon,
    HeartIcon, UserIcon,
} from '@heroicons/react/24/outline';

const NAV = [
    { id: 'dashboard',  label: 'Visão geral',  href: 'account.dashboard',  icon: Squares2X2Icon },
    { id: 'orders',     label: 'Meus pedidos', href: 'account.orders',     icon: ShoppingBagIcon },
    { id: 'addresses',  label: 'Endereços',    href: 'account.addresses',  icon: MapPinIcon      },
    { id: 'wishlist',   label: 'Favoritos',    href: 'account.wishlist',   icon: HeartIcon       },
    { id: 'profile',    label: 'Perfil',       href: 'account.profile',    icon: UserIcon        },
];

/**
 * Sidebar + main layout compartilhado pelas páginas de conta.
 *
 * @param {{ active: string, children: React.ReactNode }} props
 */
export default function AccountLayout({ active, children }) {
    return (
        <div className="container-page py-8 lg:py-12">
            <div className="flex gap-8 items-start">

                {/* Sidebar */}
                <aside className="hidden lg:block w-56 flex-shrink-0">
                    <nav className="card p-2 space-y-0.5">
                        {NAV.map(({ id, label, href, icon: Icon }) => (
                            <Link
                                key={id}
                                href={route(href)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    active === id
                                        ? 'bg-primary/15 text-primary'
                                        : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                                }`}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Mobile nav */}
                <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-2 w-full mb-2 -mt-2 pb-2">
                    {NAV.map(({ id, label, href, icon: Icon }) => (
                        <Link
                            key={id}
                            href={route(href)}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                active === id
                                    ? 'bg-primary/15 border-primary/30 text-primary'
                                    : 'border-white/[0.08] text-white/60 hover:text-white'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">{children}</div>
            </div>
        </div>
    );
}
