import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon,
    InformationCircleIcon, XMarkIcon,
} from '@heroicons/react/24/outline';

const config = {
    success: { icon: CheckCircleIcon,          bg: 'bg-green-500/20',  border: 'border-green-500/30',  text: 'text-green-300' },
    error:   { icon: XCircleIcon,              bg: 'bg-red-500/20',    border: 'border-red-500/30',    text: 'text-red-300'   },
    warning: { icon: ExclamationTriangleIcon,  bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-300' },
    info:    { icon: InformationCircleIcon,    bg: 'bg-primary/20',    border: 'border-primary/30',    text: 'text-primary-300' },
};

export default function FlashMessage({ type = 'info', message }) {
    const [visible, setVisible] = useState(true);
    const { icon: Icon, bg, border, text } = config[type] ?? config.info;

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 4500);
        return () => clearTimeout(timer);
    }, [message]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    role="alert"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0,  scale: 1     }}
                    exit={{    opacity: 0, y: 20,  scale: 0.95  }}
                    className={`fixed bottom-6 right-6 z-[70] max-w-sm w-full
                                ${bg} ${border} border rounded-2xl p-4
                                shadow-2xl backdrop-blur-xl flex items-start gap-3`}
                >
                    <Icon className={`w-5 h-5 ${text} flex-shrink-0 mt-0.5`} />
                    <p
                        className={`text-sm flex-1 ${text} leading-relaxed`}
                        dangerouslySetInnerHTML={{ __html: message }}
                    />
                    <button
                        onClick={() => setVisible(false)}
                        className={`${text} opacity-60 hover:opacity-100 flex-shrink-0`}
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
