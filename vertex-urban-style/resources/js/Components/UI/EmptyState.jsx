import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/* ─── Carrinho Vazio ─────────────────────────────────────────────────────── */
export function EmptyCart() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-20 gap-6 text-center max-w-sm mx-auto"
        >
            <svg viewBox="0 0 160 160" className="w-36 h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="80" cy="80" r="72" fill="#1a1f2e" />
                <path d="M52 68h56l-7 44H59L52 68z" stroke="#0d9488" strokeWidth="3" strokeLinejoin="round" />
                <path d="M66 68c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" />
                <circle cx="71" cy="86" r="3" fill="#f97316" />
                <circle cx="89" cy="86" r="3" fill="#f97316" />
                <path d="M73 98c2 3 12 3 14 0" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                {/* Estrelinhas */}
                <circle cx="38" cy="40" r="2" fill="#0d9488" opacity="0.4" />
                <circle cx="122" cy="38" r="1.5" fill="#f97316" opacity="0.5" />
                <circle cx="130" cy="62" r="2.5" fill="#0d9488" opacity="0.3" />
                <circle cx="30" cy="65" r="1.5" fill="#f97316" opacity="0.4" />
            </svg>
            <div>
                <h2 className="font-display font-bold text-white/90 text-xl">Sua sacola está vazia</h2>
                <p className="text-sm text-white/40 mt-2 leading-relaxed">
                    Explore nossa coleção e encontre<br />peças que combinam com você.
                </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
                <Link href="/produtos" className="btn-primary justify-center w-full">
                    Explorar coleção
                </Link>
                <Link href="/sale" className="btn-outline justify-center w-full">
                    Ver promoções
                </Link>
            </div>
        </motion.div>
    );
}

/* ─── Sem resultados de busca ────────────────────────────────────────────── */
export function EmptySearch({ query, suggestions = [] }) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-20 gap-6 text-center max-w-md mx-auto"
        >
            <svg viewBox="0 0 160 160" className="w-32 h-32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="80" cy="80" r="72" fill="#1a1f2e" />
                <circle cx="72" cy="68" r="22" stroke="#0d9488" strokeWidth="3" />
                <path d="M88 84l18 18" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" />
                <path d="M64 68h16M72 60v16" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="120" cy="40" r="4" fill="#0d9488" opacity="0.3" />
                <circle cx="38" cy="110" r="3" fill="#f97316" opacity="0.3" />
            </svg>
            <div>
                <h2 className="font-display font-bold text-white/90 text-xl">
                    Nenhum resultado para{' '}
                    {query && <span className="text-primary">"{query}"</span>}
                </h2>
                <p className="text-sm text-white/40 mt-2 leading-relaxed">
                    Tente termos diferentes ou explore<br />nossas categorias em destaque.
                </p>
            </div>
            {suggestions.length > 0 && (
                <div className="text-sm text-left w-full">
                    <p className="text-white/40 mb-2">Você quis dizer:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((s) => (
                            <Link
                                key={s}
                                href={`/busca?q=${encodeURIComponent(s)}`}
                                className="px-3 py-1 rounded-full border border-primary/30 bg-primary/5
                                           text-primary/80 hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                                {s}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            <Link href="/produtos" className="btn-primary">
                Ver todos os produtos
            </Link>
        </motion.div>
    );
}

/* ─── Favoritos Vazios ───────────────────────────────────────────────────── */
export function EmptyWishlist() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-20 gap-6 text-center max-w-sm mx-auto"
        >
            <svg viewBox="0 0 160 160" className="w-36 h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="80" cy="80" r="72" fill="#1a1f2e" />
                <path d="M80 108s-32-18-32-40c0-12 10-20 20-16 6 2.5 10 8 12 12 2-4 6-9.5 12-12 10-4 20 4 20 16 0 22-32 40-32 40z"
                      stroke="#f97316" strokeWidth="3" strokeLinejoin="round" />
                <path d="M68 68l24 0M80 56v24" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
                <circle cx="40" cy="42" r="2" fill="#0d9488" opacity="0.4" />
                <circle cx="118" cy="44" r="3" fill="#f97316" opacity="0.3" />
            </svg>
            <div>
                <h2 className="font-display font-bold text-white/90 text-xl">Nenhum favorito ainda</h2>
                <p className="text-sm text-white/40 mt-2 leading-relaxed">
                    Salve os produtos que você mais gosta<br />tocando no ícone de coração.
                </p>
            </div>
            <Link href="/produtos" className="btn-primary justify-center w-full max-w-xs">
                Descobrir produtos
            </Link>
        </motion.div>
    );
}

/* ─── Sem Pedidos — timeline do que vai acontecer ─────────────────────────── */
export function EmptyOrders() {
    const steps = [
        { icon: '🛍️', title: 'Explore a coleção',    sub: 'Encontre peças que combinam com você' },
        { icon: '💳', title: 'Finalize sua compra',   sub: 'Pagamento seguro: cartão, Pix ou boleto' },
        { icon: '📦', title: 'Preparamos seu pedido', sub: 'Embalagem cuidadosa com nota fiscal' },
        { icon: '🚚', title: 'Rápida entrega',        sub: 'Você acompanha o rastreio em tempo real' },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-lg mx-auto py-16 space-y-10"
        >
            <div className="text-center">
                <p className="text-4xl mb-3">📋</p>
                <h2 className="font-display font-bold text-white/90 text-xl">Nenhum pedido por enquanto</h2>
                <p className="text-sm text-white/40 mt-2">
                    Faça seu primeiro pedido e veja tudo acontecer aqui!
                </p>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Linha vertical */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-primary via-primary/30 to-transparent" />

                <ol className="space-y-6">
                    {steps.map((step, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.1 }}
                            className="flex items-start gap-4"
                        >
                            <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                                            bg-dark-200 border border-primary/20 text-lg flex-shrink-0">
                                {step.icon}
                            </div>
                            <div className="pt-1.5">
                                <p className="text-sm font-semibold text-white/80">{step.title}</p>
                                <p className="text-xs text-white/35 mt-0.5">{step.sub}</p>
                            </div>
                        </motion.li>
                    ))}
                </ol>
            </div>

            <Link href="/produtos" className="btn-primary justify-center w-full">
                Começar agora
            </Link>
        </motion.div>
    );
}
