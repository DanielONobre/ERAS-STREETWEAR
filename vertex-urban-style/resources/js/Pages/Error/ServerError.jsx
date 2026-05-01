import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HomeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function ServerError({ status = 500 }) {
    const messages = {
        500: { title: 'Erro interno do servidor', desc: 'Algo deu errado no nosso lado. Nossa equipe já foi notificada.' },
        503: { title: 'Serviço indisponível', desc: 'Estamos em manutenção. Voltaremos em breve.' },
        419: { title: 'Sessão expirada', desc: 'Sua sessão expirou por inatividade. Recarregue a página.' },
    };

    const { title, desc } = messages[status] ?? messages[500];

    return (
        <>
            <Head>
                <title>{status} — {title}</title>
                <meta name="robots" content="noindex" />
            </Head>

            <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 font-body text-white">
                {/* Background glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    w-[600px] h-[600px] rounded-full
                                    bg-accent/5 blur-[120px]" />
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
                            VERTEX<span className="text-primary">.</span>
                        </span>
                    </Link>

                    {/* Status big number */}
                    <div className="relative mb-6">
                        <span className="text-[11rem] sm:text-[14rem] font-display font-black leading-none
                                         text-white/[0.04] select-none block">
                            {status}
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* SVG illustration — server/warning */}
                            <svg viewBox="0 0 160 120" className="w-40 h-32" fill="none">
                                {/* Server racks */}
                                <rect x="35" y="20" width="90" height="25" rx="6" fill="#f97316" fillOpacity="0.1" stroke="#f97316" strokeOpacity="0.3" strokeWidth="1.5"/>
                                <rect x="35" y="52" width="90" height="25" rx="6" fill="#f97316" fillOpacity="0.08" stroke="#f97316" strokeOpacity="0.2" strokeWidth="1.5"/>
                                <rect x="35" y="84" width="90" height="25" rx="6" fill="#f97316" fillOpacity="0.06" stroke="#f97316" strokeOpacity="0.15" strokeWidth="1.5"/>
                                {/* LEDs */}
                                <circle cx="112" cy="32" r="3" fill="#ef4444"/>
                                <circle cx="120" cy="32" r="3" fill="#f97316" fillOpacity="0.5"/>
                                <circle cx="112" cy="64" r="3" fill="#f97316"/>
                                <circle cx="120" cy="64" r="3" fill="#22c55e" fillOpacity="0.5"/>
                                <circle cx="112" cy="96" r="3" fill="#22c55e"/>
                                <circle cx="120" cy="96" r="3" fill="#22c55e"/>
                                {/* Warning triangle */}
                                <path d="M80 25 L90 42 L70 42 Z" fill="#ef4444" fillOpacity="0.8"/>
                                <path d="M80 30 L80 38" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="80" cy="41" r="1" fill="white"/>
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-display font-bold mb-3">{title}</h1>
                    <p className="text-white/50 mb-10 text-sm sm:text-base leading-relaxed">{desc}</p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary btn-lg gap-2 w-full sm:w-auto justify-center"
                        >
                            <ArrowPathIcon className="w-4 h-4" />
                            Tentar novamente
                        </button>
                        <Link href="/" className="btn-outline btn-lg gap-2 w-full sm:w-auto justify-center">
                            <HomeIcon className="w-4 h-4" />
                            Ir para a Home
                        </Link>
                    </div>
                </motion.div>

                <p className="absolute bottom-6 text-xs text-white/20">
                    © {new Date().getFullYear()} Vertex Urban Style
                </p>
            </div>
        </>
    );
}
