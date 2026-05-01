import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

const STORAGE_KEY = 'vertex_cookie_consent';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const decision = localStorage.getItem(STORAGE_KEY);
        if (!decision) {
            // Delay slightly so it doesn't pop up before the page renders
            const t = setTimeout(() => setVisible(true), 1200);
            return () => clearTimeout(t);
        }
    }, []);

    const accept = () => {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        setVisible(false);
    };

    const reject = () => {
        localStorage.setItem(STORAGE_KEY, 'rejected');
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 120, opacity: 0 }}
                    animate={{ y: 0,   opacity: 1 }}
                    exit={{   y: 120, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6
                               sm:max-w-sm z-[90]"
                    role="dialog"
                    aria-label="Consentimento de cookies"
                    aria-live="polite"
                >
                    <div className="bg-dark-50 border border-white/[0.1] rounded-2xl shadow-2xl p-5 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheckIcon className="w-4 h-4 text-primary" />
                                </div>
                                <span className="font-semibold text-sm">Privacidade & Cookies</span>
                            </div>
                            <button
                                onClick={reject}
                                className="text-white/30 hover:text-white/60 transition-colors p-0.5 flex-shrink-0"
                                aria-label="Fechar"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <p className="text-xs text-white/55 leading-relaxed">
                            Usamos cookies para melhorar sua experiência, personalizar conteúdo
                            e analisar nosso tráfego, em conformidade com a{' '}
                            <strong className="text-white/70">LGPD</strong>.
                            Saiba mais em nossa{' '}
                            <Link
                                href="/privacidade"
                                className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                            >
                                Política de Privacidade
                            </Link>.
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={reject}
                                className="flex-1 py-2 px-3 rounded-xl text-xs font-medium
                                           bg-white/[0.06] text-white/60 hover:bg-white/10 hover:text-white
                                           border border-white/[0.08] transition-all"
                            >
                                Só essenciais
                            </button>
                            <button
                                onClick={accept}
                                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold
                                           bg-primary text-white hover:bg-primary/90 transition-all"
                            >
                                Aceitar todos
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/** Hook to check consent status from anywhere */
export function useCookieConsent() {
    const status = typeof window !== 'undefined'
        ? localStorage.getItem(STORAGE_KEY)
        : null;
    return { accepted: status === 'accepted', rejected: status === 'rejected', decided: !!status };
}
