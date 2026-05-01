import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBagIcon, MagnifyingGlassIcon, UserIcon,
    Bars3Icon, XMarkIcon, ChevronDownIcon,
} from '@heroicons/react/24/outline';

export default function Navbar({ onCartClick }) {
    const { auth, cart, settings } = usePage().props;
    const [scrolled, setScrolled]   = useState(false);
    const [mobileOpen, setMobile]   = useState(false);
    const [searchOpen, setSearch]   = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.get(route('products.index'), { search: searchTerm });
            setSearch(false);
            setSearchTerm('');
        }
    };

    const navLinks = [
        { label: 'Novidades',   href: route('products.index', { is_new: 1 }) },
        { label: 'Coleções',    href: route('products.index') },
        { label: 'Promoções',   href: route('products.index', { on_sale: 1 }) },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                    ${scrolled
                        ? 'bg-dark/95 backdrop-blur-xl border-b border-white/[0.06] shadow-lg'
                        : 'bg-transparent'
                    }`}
                style={{ height: 'var(--navbar-height)' }}
            >
                <nav className="container-page h-full flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link href={route('home')} className="flex-shrink-0">
                        <span className="font-display text-xl font-bold text-gradient-brand">
                            ERAS
                        </span>
                    </Link>

                    {/* Nav links — desktop */}
                    <ul className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/70
                                               hover:text-white hover:bg-white/10 transition-all duration-150"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        {/* Search */}
                        <button
                            onClick={() => setSearch(true)}
                            className="btn-icon text-white/60 hover:text-white"
                            aria-label="Buscar"
                        >
                            <MagnifyingGlassIcon className="w-5 h-5" />
                        </button>

                        {/* User */}
                        {auth.user ? (
                            <Link
                                href={route('profile.show')}
                                className="btn-icon text-white/60 hover:text-white"
                                aria-label="Minha conta"
                            >
                                {auth.user.avatar ? (
                                    <img
                                        src={auth.user.avatar}
                                        alt={auth.user.name}
                                        className="w-6 h-6 rounded-full object-cover ring-1 ring-primary/50"
                                    />
                                ) : (
                                    <UserIcon className="w-5 h-5" />
                                )}
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="btn-icon text-white/60 hover:text-white"
                                aria-label="Entrar"
                            >
                                <UserIcon className="w-5 h-5" />
                            </Link>
                        )}

                        {/* Cart */}
                        <button
                            onClick={onCartClick}
                            className="btn-icon text-white/60 hover:text-white relative"
                            aria-label={`Carrinho (${cart.count} itens)`}
                        >
                            <ShoppingBagIcon className="w-5 h-5" />
                            {cart.count > 0 && (
                                <motion.span
                                    key={cart.count}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-0.5 -right-0.5 w-4 h-4
                                               bg-accent text-white text-[10px] font-bold
                                               rounded-full flex items-center justify-center leading-none"
                                >
                                    {cart.count > 9 ? '9+' : cart.count}
                                </motion.span>
                            )}
                        </button>

                        {/* Mobile menu toggle */}
                        <button
                            className="btn-icon md:hidden text-white/60 hover:text-white"
                            onClick={() => setMobile(!mobileOpen)}
                            aria-label="Menu"
                        >
                            {mobileOpen
                                ? <XMarkIcon className="w-5 h-5" />
                                : <Bars3Icon className="w-5 h-5" />
                            }
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="fixed top-[var(--navbar-height)] inset-x-0 z-40 glass-dark border-b border-white/[0.06] md:hidden"
                    >
                        <nav className="container-page py-4 flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobile(false)}
                                    className="px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="divider my-1" />
                            {auth.user ? (
                                <>
                                    <Link href={route('profile.show')} onClick={() => setMobile(false)} className="px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10">Minha Conta</Link>
                                    <Link href={route('orders.index')} onClick={() => setMobile(false)} className="px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10">Meus Pedidos</Link>
                                    <Link href={route('logout')} method="post" as="button" className="px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-left">Sair</Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} onClick={() => setMobile(false)} className="btn-primary w-full justify-center mt-2">Entrar</Link>
                                    <Link href={route('register')} onClick={() => setMobile(false)} className="btn-outline w-full justify-center mt-2">Criar Conta</Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-dark/80 backdrop-blur-xl flex items-start justify-center pt-24 px-4"
                        onClick={(e) => e.target === e.currentTarget && setSearch(false)}
                    >
                        <motion.form
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            onSubmit={handleSearch}
                            className="w-full max-w-xl"
                        >
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    autoFocus
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar produtos, marcas, estilos..."
                                    className="input pl-12 pr-12 py-4 text-lg rounded-2xl bg-dark-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearch(false)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-center text-white/30 text-sm mt-3">
                                Pressione Enter para buscar · ESC para fechar
                            </p>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
