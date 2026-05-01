import '../css/app.css';
import './bootstrap';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { AnimatePresence, motion } from 'framer-motion';

const appName = import.meta.env.VITE_APP_NAME || 'ERAS Streetwear';

/** Variantes de page transition — fade + slide sutil */
const pageVariants = {
    initial:  { opacity: 0, y: 8 },
    animate:  { opacity: 1, y: 0 },
    exit:     { opacity: 0, y: -8 },
};

const pageTransition = {
    duration: 0.22,
    ease: [0.25, 0.46, 0.45, 0.94],
};

createInertiaApp({
    title: (title) => title ? `${title} — ${appName}` : appName,

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={props.initialPage?.url ?? 'page'}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                    style={{ minHeight: '100%' }}
                >
                    <App {...props} />
                </motion.div>
            </AnimatePresence>
        );
    },

    progress: {
        color: '#0d9488',
        showSpinner: false,
        delay: 200,
    },
});
