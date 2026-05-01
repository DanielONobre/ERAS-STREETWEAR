import { Fragment, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@lib/utils';

/**
 * Modal reutilizável com focus trap e fechamento por ESC.
 *
 * @param {object}  props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {string}  [props.title]
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.size]
 * @param {boolean} [props.closable]  - Exibe X e fecha ao clicar no overlay (default true)
 * @param {React.ReactNode} props.children
 * @param {string}  [props.className] - Classes extras do painel
 */
export default function Modal({
    open,
    onClose,
    title,
    size = 'md',
    closable = true,
    children,
    className,
}) {
    const panelRef = useRef(null);

    // ESC para fechar
    useEffect(() => {
        if (!open || !closable) return;
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, closable, onClose]);

    // Bloqueia scroll do body
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    // Focus trap simples
    useEffect(() => {
        if (!open || !panelRef.current) return;
        const focusable = panelRef.current.querySelectorAll(
            'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length) focusable[0].focus();
    }, [open]);

    const sizes = {
        sm:   'max-w-sm',
        md:   'max-w-md',
        lg:   'max-w-lg',
        xl:   'max-w-2xl',
        full: 'max-w-full mx-4',
    };

    return (
        <AnimatePresence>
            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                    className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
                        onClick={() => closable && onClose?.()}
                        aria-hidden="true"
                    />

                    {/* Panel */}
                    <motion.div
                        key="panel"
                        ref={panelRef}
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                        className={cn(
                            'relative w-full bg-dark-100 border border-white/[0.08]',
                            'rounded-3xl shadow-2xl overflow-hidden',
                            sizes[size] ?? sizes.md,
                            className
                        )}
                    >
                        {/* Header */}
                        {(title || closable) && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                                {title && (
                                    <h2 className="font-display font-semibold text-lg">{title}</h2>
                                )}
                                {closable && (
                                    <button
                                        onClick={onClose}
                                        className="btn-icon text-white/50 hover:text-white ml-auto"
                                        aria-label="Fechar modal"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Body */}
                        <div>{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
