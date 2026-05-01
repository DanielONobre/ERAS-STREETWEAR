import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{   opacity: 0, scale: 0.7 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    onClick={scrollToTop}
                    aria-label="Voltar ao topo"
                    className="fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-[80]
                               w-10 h-10 rounded-full
                               bg-dark-100 border border-white/[0.12]
                               flex items-center justify-center
                               text-white/50 hover:text-white hover:border-white/25
                               shadow-lg hover:shadow-primary/10
                               transition-colors"
                    // stays above WhatsApp button (bottom-20 on mobile)
                >
                    <ChevronUpIcon className="w-4 h-4" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
