import { Head, usePage } from '@inertiajs/react';
import { CartProvider } from '@lib/CartContext';
import Navbar from '@components/Navbar';
import Footer from '@components/Layout/Footer';
import MiniCart from '@components/MiniCart';
import Toast from '@components/UI/Toast';
import CookieConsent from '@components/UI/CookieConsent';
import BackToTop from '@components/UI/BackToTop';
import WhatsAppButton from '@components/UI/WhatsAppButton';

/**
 * Layout principal da loja.
 *
 * @param {object}  props
 * @param {React.ReactNode} props.children
 * @param {string}  [props.title]       - Título da página (sem sufixo)
 * @param {string}  [props.description] - Meta description
 */
export default function StoreLayout({ children, title, description }) {
    const { flash } = usePage().props;

    return (
        <CartProvider>
            {/* Head */}
            <Head>
                {title       && <title>{title} — VERTEX</title>}
                {description && <meta name="description" content={description} />}
            </Head>

            {/* Shell */}
            <div className="min-h-screen bg-dark flex flex-col font-body text-white">
                <Navbar />

                {/* pt-[var(--navbar-height)] is set in CSS via the .pt-navbar utility */}
                <main className="flex-1 pt-navbar">
                    {children}
                </main>

                <Footer />
            </div>

            {/* Overlays (portals) */}
            <MiniCart />
            <Toast messages={flash} />
            <BackToTop />
            <WhatsAppButton />
            <CookieConsent />
        </CartProvider>
    );
}
