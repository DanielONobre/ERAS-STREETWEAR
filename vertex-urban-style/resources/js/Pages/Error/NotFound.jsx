import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HomeIcon, MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
    return (
        <>
            <Head>
                <title>404 — Página não encontrada</title>
                <meta name="robots" content="noindex" />
            </Head>

            <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 font-body text-white">

                {/* Background glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    w-[600px] h-[600px] rounded-full
                                    bg-primary/5 blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative z-10 text-center max-w-lg"
                >
                    {/* Logo */}
                    <Link href="/" className="inline-block mb-10">
                        <span className="text-2xl font-display font-black tracking-tight">
                            ERAS<span className="text-primary">.</span>
                        </span>
                    </Link>

                    {/* 404 big number */}
                    <div className="relative mb-6">
                        <span className="text-[11rem] sm:text-[14rem] font-display font-black leading-none
                                         text-white/[0.04] select-none block">
                            404
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* SVG illustration — broken link / lost */}
                            <svg viewBox="0 0 160 120" className="w-40 h-32" fill="none">
                                <rect x="10" y="35" width="60" height="50" rx="10" fill="#0d9488" fillOpacity="0.12" stroke="#0d9488" strokeOpacity="0.3" strokeWidth="1.5"/>
                                <rect x="90" y="35" width="60" height="50" rx="10" fill="#0d9488" fillOpacity="0.12" stroke="#0d9488" strokeOpacity="0.3" strokeWidth="1.5"/>
                                {/* broken chain */}
                                <path d="M70 60 L78 60" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round"/>
                                <path d="M82 60 L90 60" stroke="#0d9488" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3"/>
                                {/* left box content */}
                                <rect x="20" y="50" width="40" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.15"/>
                                <rect x="20" y="58" width="30" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.1"/>
                                {/* right box content */}
                                <rect x="100" y="50" width="40" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.15"/>
                                <rect x="100" y="58" width="30" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.1"/>
                                {/* magnifier */}
                                <circle cx="120" cy="85" r="12" stroke="#f97316" strokeOpacity="0.6" strokeWidth="2" fill="none"/>
                                <path d="M129 94 L137 102" stroke="#f97316" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-display font-bold mb-3">
                        Essa peça não tá no catálogo.
                    </h1>
                    <p className="text-white/50 mb-10 text-sm sm:text-base leading-relaxed">
                        O endereço que você tentou acessar não existe ou foi removido.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/" className="btn-primary btn-lg gap-2 w-full sm:w-auto justify-center">
                            <HomeIcon className="w-4 h-4" />
                            VOLTAR PRA HOME
                        </Link>
                    </div>

                    {/* Back link */}
                    <button
                        onClick={() => window.history.back()}
                        className="mt-8 flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60
                                   transition-colors mx-auto"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Voltar à página anterior
                    </button>
                </motion.div>

                {/* Footer minimal */}
                <p className="absolute bottom-6 text-xs text-white/20">
                    © {new Date().getFullYear()} ERAS Streetwear
                </p>
            </div>
        </>
    );
}
