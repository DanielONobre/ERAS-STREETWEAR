import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlassIcon, HeartIcon, UserIcon,
    ShoppingBagIcon, Bars3Icon, XMarkIcon,
    ChevronDownIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '@lib/CartContext';
import { SearchSuggestionSkeleton } from '@components/UI/Skeleton';
import axios from 'axios';

// ─── Estrutura de navegação ───────────────────────────────────────────────────

const NAV_LINKS = [
    { label: 'Lançamentos', href: '/lancamentos' },
    {
        label: 'Masculino',
        href: '/categoria/masculino',
        mega: true,
        cols: [
            {
                title: 'Coleções',
                items: [
                    { label: 'Streetwear', href: '/categoria/streetwear' },
                    { label: 'Casual',     href: '/categoria/casual' },
                    { label: 'Esportivo',  href: '/categoria/esportivo' },
                ],
            },
            {
                title: 'Peças',
                items: [
                    { label: 'Camisetas',  href: '/categoria/camisetas' },
                    { label: 'Moletons',   href: '/categoria/moletons' },
                    { label: 'Calças',     href: '/categoria/calcas' },
                    { label: 'Jaquetas',   href: '/categoria/jaquetas' },
                ],
            },
        ],
    },
    {
        label: 'Feminino',
        href: '/categoria/feminino',
        mega: true,
        cols: [
            {
                title: 'Coleções',
                items: [
                    { label: 'Urban Fem',  href: '/categoria/urban-fem' },
                    { label: 'Oversized',  href: '/categoria/oversized' },
                    { label: 'Athleisure', href: '/categoria/athleisure' },
                ],
            },
            {
                title: 'Peças',
                items: [
                    { label: 'Camisetas',  href: '/categoria/camisetas-fem' },
                    { label: 'Vestidos',   href: '/categoria/vestidos' },
                    { label: 'Calças',     href: '/categoria/calcas-fem' },
                    { label: 'Conjuntos',  href: '/categoria/conjuntos' },
                ],
            },
        ],
    },
    { label: 'Acessórios', href: '/categoria/acessorios' },
    { label: 'Sale', href: '/sale', badge: true },
];

// ─── Mega-menu ────────────────────────────────────────────────────────────────

function MegaMenu({ cols, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[480px]
                       bg-dark-100 border border-white/[0.08] rounded-2xl shadow-2xl
                       p-6 grid gap-6"
            style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)` }}
        >
            {cols.map((col) => (
                <div key={col.title}>
                    <p className="text-2xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                        {col.title}
                    </p>
                    <ul className="space-y-1">
                        {col.items.map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    onClick={onClose}
                                    className="flex items-center gap-1.5 text-sm text-white/60
                                               hover:text-white transition-colors py-1 rounded-lg
                                               hover:pl-1"
                                >
                                    <ChevronRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </motion.div>
    );
}

// ─── Banner de promoção ───────────────────────────────────────────────────────

function PromoBanner() {
    const [visible, setVisible] = useState(() => {
        try { return localStorage.getItem('promo-dismissed') !== '1'; }
        catch { return true; }
    });
    if (!visible) return null;
    return (
        <motion.div
            initial={false}
            animate={{ height: 'auto' }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary text-white text-xs font-medium text-center py-2 px-8 relative select-none"
        >
            🚚&nbsp; <strong>Frete Grátis</strong> em compras acima de R$&nbsp;299 — use o código{' '}
            <strong>VERTEX299</strong>
            <button
                onClick={() => {
                    setVisible(false);
                    try { localStorage.setItem('promo-dismissed', '1'); } catch {}
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
                aria-label="Fechar banner"
            >
                <XMarkIcon className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
}

// ─── Mobile menu item com subcategorias expansíveis ──────────────────────────

function MobileLinkItem({ link, onClose }) {
    const [expanded, setExpanded] = useState(false);

    if (!link.mega) {
        return (
            <Link
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all
                            ${link.badge
                                ? 'text-red-400 hover:bg-red-500/10'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
            >
                {link.badge && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                {link.label}
            </Link>
        );
    }

    return (
        <div>
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-medium
                           text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
                {link.label}
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="ml-3 pl-3 border-l border-white/[0.08] py-1 space-y-1">
                            {link.cols.map((col) => (
                                <div key={col.title} className="pb-2">
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-2 py-1">
                                        {col.title}
                                    </p>
                                    {col.items.map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={onClose}
                                            className="block px-2 py-2 text-sm text-white/55 hover:text-white
                                                       hover:bg-white/5 rounded-lg transition-all"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Search com debounce + sugestões ────────────────────────────────────────

function SearchOverlay({ onClose }) {
    const [term, setTerm]                 = useState('');
    const [suggestions, setSuggestions]   = useState([]);
    const [loadingSugg, setLoadingSugg]   = useState(false);
    const debounceRef = useRef(null);

    const fetchSuggestions = useCallback(async (q) => {
        if (q.length < 2) { setSuggestions([]); setLoadingSugg(false); return; }
        setLoadingSugg(true);
        try {
            const res = await axios.get('/api/search/suggestions', { params: { q } });
            setSuggestions(res.data.suggestions ?? []);
        } catch {
            setSuggestions([]);
        } finally {
            setLoadingSugg(false);
        }
    }, []);

    const handleChange = (e) => {
        const v = e.target.value;
        setTerm(v);
        clearTimeout(debounceRef.current);
        if (v.trim().length >= 2) {
            setLoadingSugg(true);
            debounceRef.current = setTimeout(() => fetchSuggestions(v.trim()), 300);
        } else {
            setSuggestions([]);
            setLoadingSugg(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!term.trim()) return;
        router.get('/busca', { q: term });
        onClose();
    };

    const hasSuggestions = suggestions.length > 0 || loadingSugg;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-dark/80 backdrop-blur-xl
                       flex items-start justify-center pt-20 sm:pt-24 px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                className="w-full max-w-xl"
            >
                <form onSubmit={handleSubmit} className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                    <input
                        autoFocus
                        type="search"
                        value={term}
                        onChange={handleChange}
                        placeholder="Buscar produtos, marcas, estilos…"
                        className="w-full bg-dark-100 border border-white/10 rounded-2xl
                                   pl-12 pr-12 py-4 text-lg text-white placeholder-white/30
                                   focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        aria-label="Fechar busca"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </form>

                {/* Sugestões */}
                <AnimatePresence>
                    {hasSuggestions && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="mt-2 bg-dark-100 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl"
                        >
                            {loadingSugg ? (
                                <SearchSuggestionSkeleton count={4} />
                            ) : (
                                <ul className="p-2">
                                    {suggestions.map((s) => (
                                        <li key={s.id}>
                                            <Link
                                                href={`/produtos/${s.slug}`}
                                                onClick={onClose}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                                                           text-sm hover:bg-white/5 transition-colors"
                                            >
                                                {s.image && (
                                                    <img
                                                        src={s.image}
                                                        alt={s.name}
                                                        className="w-9 h-9 rounded-lg object-cover bg-dark-200 flex-shrink-0"
                                                    />
                                                )}
                                                <span className="flex-1 text-white/80">{s.name}</span>
                                                {s.price && (
                                                    <span className="text-primary/80 font-medium text-xs">{s.price}</span>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-white/30 text-sm mt-3">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50 text-xs">Enter</kbd>{' '}
                    para buscar ·{' '}
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50 text-xs">Esc</kbd>{' '}
                    para fechar
                </p>
            </motion.div>
        </motion.div>
    );
}

// ─── Navbar principal ─────────────────────────────────────────────────────────

export default function Navbar() {
    const { auth, cart: sharedCart } = usePage().props;
    const { cart, openCart } = useCart();

    const [scrolled, setScrolled]     = useState(false);
    const [mobileOpen, setMobile]     = useState(false);
    const [searchOpen, setSearch]     = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const timerRef = useRef(null);

    const itemCount = cart.item_count ?? sharedCart?.count ?? 0;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 768) setMobile(false); };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') setSearch(false); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleMenuEnter = (label) => { clearTimeout(timerRef.current); setActiveMenu(label); };
    const handleMenuLeave = () => { timerRef.current = setTimeout(() => setActiveMenu(null), 150); };

    return (
        <>
            <PromoBanner />

            <header
                className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300
                    ${scrolled
                        ? 'bg-dark/95 backdrop-blur-xl border-b border-white/[0.06] shadow-lg'
                        : 'bg-dark/80 backdrop-blur-sm'
                    }`}
            >
                <div className="container-page h-16 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <span className="font-display text-xl font-bold tracking-tight">
                            VERTEX<span className="text-primary">.</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
                        {NAV_LINKS.map((link) => (
                            <div
                                key={link.label}
                                className="relative"
                                onMouseEnter={() => link.mega && handleMenuEnter(link.label)}
                                onMouseLeave={() => link.mega && handleMenuLeave()}
                            >
                                <Link
                                    href={link.href}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm
                                               font-medium transition-all duration-150
                                               ${link.badge
                                                   ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                                   : 'text-white/70 hover:text-white hover:bg-white/10'
                                               }`}
                                >
                                    {link.badge && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    )}
                                    {link.label}
                                    {link.mega && (
                                        <ChevronDownIcon
                                            className={`w-3 h-3 transition-transform duration-150
                                                ${activeMenu === link.label ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </Link>

                                <AnimatePresence>
                                    {link.mega && activeMenu === link.label && (
                                        <MegaMenu
                                            cols={link.cols}
                                            onClose={() => setActiveMenu(null)}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setSearch(true)}
                            className="btn-icon text-white/60 hover:text-white"
                            aria-label="Buscar"
                        >
                            <MagnifyingGlassIcon className="w-5 h-5" />
                        </button>

                        {auth?.user && (
                            <Link
                                href="/minha-conta/favoritos"
                                className="btn-icon text-white/60 hover:text-white hidden sm:flex"
                                aria-label="Favoritos"
                            >
                                <HeartIcon className="w-5 h-5" />
                            </Link>
                        )}

                        {auth?.user ? (
                            <Link
                                href="/minha-conta"
                                className="btn-icon text-white/60 hover:text-white hidden sm:flex"
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
                                href="/entrar"
                                className="btn-icon text-white/60 hover:text-white hidden sm:flex"
                                aria-label="Entrar"
                            >
                                <UserIcon className="w-5 h-5" />
                            </Link>
                        )}

                        {/* Cart — bounce animation ao incrementar */}
                        <button
                            onClick={openCart}
                            className="btn-icon text-white/60 hover:text-white relative"
                            aria-label={`Carrinho (${itemCount} ${itemCount === 1 ? 'item' : 'itens'})`}
                        >
                            <ShoppingBagIcon className="w-5 h-5" />
                            <AnimatePresence mode="popLayout">
                                {itemCount > 0 && (
                                    <motion.span
                                        key={itemCount}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                        className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-0.5
                                                   bg-accent text-white text-[10px] font-bold
                                                   rounded-full flex items-center justify-center leading-none"
                                    >
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            className="btn-icon md:hidden text-white/60 hover:text-white ml-1"
                            onClick={() => setMobile(!mobileOpen)}
                            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                            aria-expanded={mobileOpen}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {mobileOpen ? (
                                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                        <XMarkIcon className="w-5 h-5" />
                                    </motion.span>
                                ) : (
                                    <motion.span key="bars" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                        <Bars3Icon className="w-5 h-5" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Mobile drawer ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-dark/60 backdrop-blur-sm md:hidden"
                            onClick={() => setMobile(false)}
                        />

                        <motion.nav
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-dark-100 border-r
                                       border-white/[0.06] shadow-2xl overflow-y-auto md:hidden"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Menu mobile"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                                <span className="font-display font-bold text-lg">
                                    VERTEX<span className="text-primary">.</span>
                                </span>
                                <button onClick={() => setMobile(false)} className="btn-icon text-white/50" aria-label="Fechar menu">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Links com subcategorias expandíveis */}
                            <div className="px-3 py-3 space-y-0.5">
                                {NAV_LINKS.map((link) => (
                                    <MobileLinkItem
                                        key={link.label}
                                        link={link}
                                        onClose={() => setMobile(false)}
                                    />
                                ))}
                            </div>

                            <div className="h-px bg-white/[0.06] mx-4" />

                            {/* Auth */}
                            <div className="px-5 py-4 space-y-2">
                                {auth?.user ? (
                                    <>
                                        <p className="text-xs text-white/30 px-1 mb-2">
                                            Olá, {auth.user.name.split(' ')[0]} 👋
                                        </p>
                                        <Link href="/minha-conta"             onClick={() => setMobile(false)} className="mobile-link">Minha Conta</Link>
                                        <Link href="/minha-conta/pedidos"     onClick={() => setMobile(false)} className="mobile-link">Meus Pedidos</Link>
                                        <Link href="/minha-conta/favoritos"   onClick={() => setMobile(false)} className="mobile-link">Favoritos</Link>
                                        <Link href="/sair" method="post" as="button"
                                              className="mobile-link text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full text-left">
                                            Sair
                                        </Link>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2.5">
                                        <Link href="/entrar"   onClick={() => setMobile(false)} className="btn-primary justify-center">Entrar</Link>
                                        <Link href="/cadastro" onClick={() => setMobile(false)} className="btn-outline justify-center">Criar Conta</Link>
                                    </div>
                                )}
                            </div>

                            {/* Footer da sidebar */}
                            <div className="px-5 pb-6 mt-4">
                                <p className="text-xs text-white/20 text-center">
                                    © {new Date().getFullYear()} Vertex Urban Style
                                </p>
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>

            {/* ── Search overlay ────────────────────────────────────────────── */}
            <AnimatePresence>
                {searchOpen && <SearchOverlay onClose={() => setSearch(false)} />}
            </AnimatePresence>
        </>
    );
}
