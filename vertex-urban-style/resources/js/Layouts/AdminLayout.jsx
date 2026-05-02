import { useState, createContext, useContext } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon, ShoppingBagIcon, CubeIcon, UserGroupIcon,
    ChartBarIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon,
    BellIcon, Bars3Icon, XMarkIcon, ChevronRightIcon,
    ExclamationTriangleIcon, TagIcon,
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeSolid, ShoppingBagIcon as BagSolid,
    CubeIcon as CubeSolid, UserGroupIcon as UserSolid,
    ChartBarIcon as ChartSolid, Cog6ToothIcon as CogSolid,
} from '@heroicons/react/24/solid';

/* ─── Context para sidebar collapse ─────────────────────────────────── */
const SidebarCtx = createContext(null);
export const useSidebar = () => useContext(SidebarCtx);

/* ─── Nav items ──────────────────────────────────────────────────────── */
const NAV = [
    {
        label: 'Visão geral',
        href: '/admin',
        routeName: 'admin.dashboard',
        icon: HomeIcon,
        iconActive: HomeSolid,
    },
    {
        label: 'Pedidos',
        href: '/admin/pedidos',
        routeName: 'admin.orders.index',
        icon: ShoppingBagIcon,
        iconActive: BagSolid,
        badge: 'orders_pending',
    },
    {
        label: 'Produtos',
        href: '/admin/produtos',
        routeName: 'admin.products.index',
        icon: CubeIcon,
        iconActive: CubeSolid,
    },
    {
        label: 'Clientes',
        href: '/admin/clientes',
        routeName: 'admin.customers.index',
        icon: UserGroupIcon,
        iconActive: UserSolid,
    },
    {
        label: 'Cupons',
        href: '/admin/cupons',
        routeName: 'admin.coupons.index',
        icon: TagIcon,
        iconActive: TagIcon,
    },
    {
        label: 'Relatórios',
        href: '/admin/relatorios',
        routeName: 'admin.reports.sales',
        icon: ChartBarIcon,
        iconActive: ChartSolid,
    },
    {
        label: 'Configurações',
        href: '/admin/configuracoes',
        routeName: 'admin.settings',
        icon: Cog6ToothIcon,
        iconActive: CogSolid,
    },
];

/* ─── Sidebar ────────────────────────────────────────────────────────── */
function Sidebar({ open, onClose, stats }) {
    const { url } = usePage();
    const currentRoute = usePage().component;

    const isActive = (item) => {
        try { return route().current(item.routeName); } catch { return url.startsWith(item.href); }
    };

    return (
        <>
            {/* Mobile backdrop */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-dark/70 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar panel */}
            <motion.aside
                initial={false}
                animate={{ x: open ? 0 : '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 z-50 w-60 flex flex-col
                           bg-dark-50 border-r border-white/[0.06]
                           lg:translate-x-0 lg:relative lg:z-auto lg:flex"
                style={{ minHeight: '100vh' }}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.06] flex-shrink-0">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                            <span className="font-display font-bold text-xs text-eras-mustard">E</span>
                        </div>
                        <div className="leading-tight">
                            <div className="font-display font-bold text-white tracking-[0.2em] text-sm uppercase">
                                ERAS<span className="text-eras-mustard">.</span>
                            </div>
                            <div className="text-[9px] tracking-[0.25em] text-white/25 uppercase">PAINEL ADMIN</div>
                        </div>
                    </Link>
                    <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-0.5">
                    <p className="px-2 mb-2 text-[10px] font-semibold text-white/25 uppercase tracking-widest">
                        Menu
                    </p>
                    {NAV.map((item) => {
                        const active = isActive(item);
                        const Icon = active ? item.iconActive : item.icon;
                        const pending = stats?.[item.badge];
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={onClose}
                                className={`
                                    group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                    transition-all duration-150 relative
                                    ${active
                                        ? 'bg-primary/15 text-primary'
                                        : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                                    }
                                `}
                            >
                                <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-primary' : 'text-white/40 group-hover:text-white/80'}`} />
                                <span className="flex-1">{item.label}</span>
                                {pending > 0 && (
                                    <span className="flex-shrink-0 min-w-[1.25rem] h-5 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                                        {pending > 99 ? '99+' : pending}
                                    </span>
                                )}
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer: user + visit store */}
                <div className="px-3 py-4 border-t border-white/[0.06] space-y-1 flex-shrink-0">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
                    >
                        <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                        Ver loja
                    </Link>
                    {/* Admin avatar */}
                    <div className="flex items-center gap-3 px-3 py-2 mt-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-primary-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">A</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-white/80 truncate">Administrador</p>
                            <p className="text-[10px] text-white/30 truncate">admin@eras.com.br</p>
                        </div>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}

/* ─── Topbar ─────────────────────────────────────────────────────────── */
function Topbar({ title, breadcrumbs, onMenuOpen, stats }) {
    const [notifOpen, setNotifOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 h-16 bg-dark-50/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-4 lg:px-6 gap-4">
            {/* Mobile hamburger */}
            <button
                onClick={onMenuOpen}
                className="lg:hidden w-8 h-8 flex items-center justify-center text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-all"
            >
                <Bars3Icon className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex-1 min-w-0">
                {breadcrumbs?.length > 1 ? (
                    <nav className="flex items-center gap-1.5 text-sm">
                        {breadcrumbs.map((crumb, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                                {crumb.href ? (
                                    <Link href={crumb.href} className="text-white/40 hover:text-white transition-colors">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-white font-medium">{crumb.label}</span>
                                )}
                                {i < breadcrumbs.length - 1 && (
                                    <ChevronRightIcon className="w-3 h-3 text-white/20" />
                                )}
                            </span>
                        ))}
                    </nav>
                ) : (
                    <h1 className="font-display font-semibold text-white text-lg truncate">{title}</h1>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="relative w-9 h-9 flex items-center justify-center text-white/50 hover:text-white rounded-xl hover:bg-white/[0.06] transition-all"
                    >
                        <BellIcon className="w-5 h-5" />
                        {(stats?.orders_pending > 0) && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
                        )}
                    </button>

                    <AnimatePresence>
                        {notifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 w-72 card shadow-card-hover overflow-hidden"
                            >
                                <div className="px-4 py-3 border-b border-white/[0.06]">
                                    <p className="font-semibold text-sm">Notificações</p>
                                </div>
                                <div className="divide-y divide-white/[0.04]">
                                    {stats?.orders_pending > 0 ? (
                                        <Link
                                            href="/admin/pedidos?status=pending"
                                            onClick={() => setNotifOpen(false)}
                                            className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <ShoppingBagIcon className="w-4 h-4 text-accent" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {stats.orders_pending} pedido{stats.orders_pending > 1 ? 's' : ''} aguardando
                                                </p>
                                                <p className="text-xs text-white/40 mt-0.5">Precisam de atenção</p>
                                            </div>
                                        </Link>
                                    ) : null}
                                    {stats?.low_stock > 0 ? (
                                        <Link
                                            href="/admin/produtos?stock=low"
                                            onClick={() => setNotifOpen(false)}
                                            className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-red-400/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {stats.low_stock} produto{stats.low_stock > 1 ? 's' : ''} com estoque baixo
                                                </p>
                                                <p className="text-xs text-white/40 mt-0.5">Menos de 5 unidades</p>
                                            </div>
                                        </Link>
                                    ) : null}
                                    {!stats?.orders_pending && !stats?.low_stock && (
                                        <p className="px-4 py-6 text-sm text-white/40 text-center">
                                            Nenhuma notificação
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}

/* ─── Bottom Navigation (mobile only) ───────────────────────────────────── */

const BOTTOM_NAV = [
    { label: 'Visão geral', href: '/admin',       icon: HomeIcon,        iconActive: HomeSolid },
    { label: 'Pedidos',   href: '/admin/pedidos',  icon: ShoppingBagIcon, iconActive: BagSolid, badge: 'orders_pending' },
    { label: 'Produtos',  href: '/admin/produtos', icon: CubeIcon,        iconActive: CubeSolid },
    { label: 'Clientes',  href: '/admin/clientes', icon: UserGroupIcon,   iconActive: UserSolid },
    { label: 'Config.',   href: '/admin/configuracoes', icon: Cog6ToothIcon, iconActive: CogSolid },
];

function AdminBottomNav({ stats }) {
    const { url } = usePage();
    const isActive = (item) => url.startsWith(item.href) && (item.href !== '/admin' || url === '/admin');

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-dark-50/90 backdrop-blur-xl
                        border-t border-white/[0.06] flex items-stretch safe-area-bottom"
             aria-label="Navegação admin mobile"
        >
            {BOTTOM_NAV.map((item) => {
                const active = isActive(item);
                const Icon = active ? item.iconActive : item.icon;
                const pending = stats?.[item.badge];
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative
                                    text-[10px] font-medium transition-colors
                                    ${active ? 'text-primary' : 'text-white/40'}`}
                    >
                        <div className="relative">
                            <Icon className="w-5 h-5" />
                            {pending > 0 && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent text-white
                                                 text-[8px] rounded-full flex items-center justify-center font-bold">
                                    {pending > 9 ? '9+' : pending}
                                </span>
                            )}
                        </div>
                        {item.label}
                        {active && (
                            <motion.div
                                layoutId="admin-bottom-indicator"
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/**
 * AdminLayout — Layout principal do painel administrativo.
 */
export default function AdminLayout({ children, title, breadcrumbs, stats }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { flash } = usePage().props;

    return (
        <SidebarCtx.Provider value={{ open: sidebarOpen, setOpen: setSidebarOpen }}>
            <Head>
                <title>{title ? `${title} — Admin | ERAS` : 'Admin — ERAS Streetwear'}</title>
            </Head>

            <div className="flex h-screen bg-dark overflow-hidden">
                {/* Sidebar — desktop only */}
                <div className="hidden lg:flex flex-shrink-0">
                    <Sidebar open={true} onClose={() => {}} stats={stats} />
                </div>

                {/* Mobile slide-out sidebar */}
                <div className="lg:hidden">
                    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} stats={stats} />
                </div>

                {/* Main */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Topbar
                        title={title}
                        breadcrumbs={breadcrumbs}
                        onMenuOpen={() => setSidebarOpen(true)}
                        stats={stats}
                    />

                    <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
                        <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
                            <AnimatePresence>
                                {flash?.success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mb-4 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/25 text-green-300 text-sm"
                                    >
                                        {flash.success}
                                    </motion.div>
                                )}
                                {flash?.error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mb-4 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/25 text-red-300 text-sm"
                                    >
                                        {flash.error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* Bottom navigation — mobile only */}
            <AdminBottomNav stats={stats} />
        </SidebarCtx.Provider>
    );
}
