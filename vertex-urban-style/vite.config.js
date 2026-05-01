import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
            '@components': path.resolve(__dirname, './resources/js/Components'),
            '@pages': path.resolve(__dirname, './resources/js/Pages'),
            '@layouts': path.resolve(__dirname, './resources/js/Layouts'),
            '@hooks': path.resolve(__dirname, './resources/js/hooks'),
            '@lib': path.resolve(__dirname, './resources/js/lib'),
        },
    },
    server: {
        hmr: {
            host: 'localhost',
        },
        watch: {
            usePolling: true,
        },
    },
    build: {
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                // Chunks por feature area — reduz bundle inicial
                manualChunks(id) {
                    // Core React + Inertia — sempre carregado
                    if (id.includes('node_modules/react/') ||
                        id.includes('node_modules/react-dom/') ||
                        id.includes('node_modules/@inertiajs/')) {
                        return 'vendor-react';
                    }

                    // UI libs — carregado em todas as páginas com componentes
                    if (id.includes('node_modules/@headlessui/') ||
                        id.includes('node_modules/@heroicons/') ||
                        id.includes('node_modules/framer-motion/')) {
                        return 'vendor-ui';
                    }

                    // Stripe — somente na página de checkout
                    if (id.includes('node_modules/@stripe/') ||
                        id.includes('node_modules/stripe')) {
                        return 'vendor-stripe';
                    }

                    // Páginas Admin — chunk separado para reduzir bundle do storefront
                    if (id.includes('/Pages/Admin/')) {
                        return 'pages-admin';
                    }

                    // Páginas de Account — chunk separado
                    if (id.includes('/Pages/Account/')) {
                        return 'pages-account';
                    }

                    // Checkout
                    if (id.includes('/Pages/Checkout/')) {
                        return 'pages-checkout';
                    }
                },
            },
        },
    },
});
