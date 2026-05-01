import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon,
    InformationCircleIcon, XMarkIcon,
} from '@heroicons/react/24/outline';

// ─── Configuração por tipo ────────────────────────────────────────────────────

const TYPES = {
    success: {
        icon:    CheckCircleIcon,
        bg:      'bg-green-500/15',
        border:  'border-green-500/25',
        text:    'text-green-300',
        bar:     'bg-green-500',
    },
    error: {
        icon:    XCircleIcon,
        bg:      'bg-red-500/15',
        border:  'border-red-500/25',
        text:    'text-red-300',
        bar:     'bg-red-500',
    },
    warning: {
        icon:    ExclamationTriangleIcon,
        bg:      'bg-yellow-500/15',
        border:  'border-yellow-500/25',
        text:    'text-yellow-300',
        bar:     'bg-yellow-500',
    },
    info: {
        icon:    InformationCircleIcon,
        bg:      'bg-primary/15',
        border:  'border-primary/25',
        text:    'text-primary-300',
        bar:     'bg-primary',
    },
};

const AUTO_CLOSE_MS = 5000;

// ─── Toast individual ─────────────────────────────────────────────────────────

/**
 * @param {object} props
 * @param {string} props.id
 * @param {'success'|'error'|'warning'|'info'} props.type
 * @param {string} props.message
 * @param {Function} props.onDismiss
 */
function ToastItem({ id, type, message, onDismiss }) {
    const [alive, setAlive] = useState(true);
    const cfg = TYPES[type] ?? TYPES.info;
    const Icon = cfg.icon;

    // auto dismiss
    useEffect(() => {
        const t = setTimeout(() => setAlive(false), AUTO_CLOSE_MS);
        return () => clearTimeout(t);
    }, []);

    // quando a animação de saída termina, notifica o pai
    const handleExitComplete = useCallback(() => onDismiss(id), [id, onDismiss]);

    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {alive && (
                <motion.div
                    layout
                    role="alert"
                    aria-live="polite"
                    initial={{ opacity: 0, x: 40, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0,  scale: 1    }}
                    exit={{    opacity: 0, x: 40,  scale: 0.95 }}
                    transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                    className={`relative w-full max-w-sm overflow-hidden rounded-2xl border
                                shadow-2xl backdrop-blur-xl flex items-start gap-3 p-4
                                ${cfg.bg} ${cfg.border}`}
                >
                    <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${cfg.text}`} />

                    <p
                        className={`text-sm flex-1 leading-relaxed ${cfg.text}`}
                        dangerouslySetInnerHTML={{ __html: message }}
                    />

                    <button
                        onClick={() => setAlive(false)}
                        className={`flex-shrink-0 ${cfg.text} opacity-50 hover:opacity-100 transition-opacity`}
                        aria-label="Fechar notificação"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>

                    {/* Barra de progresso */}
                    <motion.span
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: AUTO_CLOSE_MS / 1000, ease: 'linear' }}
                        className={`absolute bottom-0 left-0 h-0.5 w-full origin-left ${cfg.bar} opacity-40`}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── Container de múltiplos toasts ────────────────────────────────────────────

let _toastId = 0;

/**
 * Componente de sistema de notificações.
 * Usado em StoreLayout: <Toast messages={flash} />
 *
 * @param {object}  props
 * @param {object}  [props.messages] - Ex: { success: 'OK', error: 'Erro' }
 *
 * Para disparar programaticamente: importe `toast` e chame `toast.success('msg')`.
 */
export default function Toast({ messages }) {
    const [items, setItems] = useState([]);

    // Converte flash messages do Inertia em toasts
    useEffect(() => {
        if (!messages) return;
        const types = ['success', 'error', 'warning', 'info'];
        types.forEach((type) => {
            if (messages[type]) {
                setItems((prev) => [
                    ...prev,
                    { id: ++_toastId, type, message: messages[type] },
                ]);
            }
        });
    }, [messages]);

    const dismiss = useCallback((id) => {
        setItems((prev) => prev.filter((t) => t.id !== id));
    }, []);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            aria-live="polite"
            aria-atomic="false"
            className="fixed bottom-6 right-6 z-[80] flex flex-col gap-3 items-end w-full max-w-sm pointer-events-none"
        >
            <AnimatePresence>
                {items.map((item) => (
                    <div key={item.id} className="pointer-events-auto w-full">
                        <ToastItem {...item} onDismiss={dismiss} />
                    </div>
                ))}
            </AnimatePresence>
        </div>,
        document.body
    );
}

// ─── API programática ─────────────────────────────────────────────────────────

/** @type {Function|null} */
let _push = null;

export function initToastPush(fn) { _push = fn; }

/** Dispara um toast programaticamente: toast.success('Operação OK!') */
export const toast = {
    success: (msg) => _push?.({ type: 'success', message: msg }),
    error:   (msg) => _push?.({ type: 'error',   message: msg }),
    warning: (msg) => _push?.({ type: 'warning', message: msg }),
    info:    (msg) => _push?.({ type: 'info',    message: msg }),
};
