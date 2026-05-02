import { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    const [email, setEmail] = useState('');

    return (
        <footer className="bg-dark-100 border-t border-white/[0.06] mt-auto">
            <div className="container-page py-12 lg:py-16">

                {/* Grid principal */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">

                    {/* Coluna 1 — Marca */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="font-display font-bold text-3xl tracking-[0.3em] uppercase text-eras-bone select-none">
                            ERAS<span className="text-eras-mustard">.</span>
                        </div>
                        <p className="mt-2 text-xs tracking-[0.4em] text-eras-concrete uppercase">
                            STREETWEAR · BRASIL · DROP LIMITADO
                        </p>

                        {/* Instagram */}
                        <div className="flex gap-3 mt-5">
                            <a
                                href="https://instagram.com/erasstreetwear"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center
                                           text-white/40 hover:text-white hover:bg-primary/20 transition-all"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Coluna 2 — Navegar */}
                    <div>
                        <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
                            NAVEGAR
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Catálogo',   href: '/produtos' },
                                { label: 'Drop atual', href: '/produtos?is_new=1' },
                                { label: 'Manifesto',  href: '/manifesto' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/50 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Coluna 3 — Ajuda */}
                    <div>
                        <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
                            AJUDA
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Trocas e devoluções', href: '#' },
                                { label: 'Guia de tamanhos',    href: '#' },
                                { label: 'Entrega',             href: '#' },
                                { label: 'Contato',             href: '#' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/50 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Coluna 4 — A Gente */}
                    <div>
                        <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
                            A GENTE
                        </h4>
                        <ul className="space-y-2.5 mb-5">
                            <li>
                                <a
                                    href="https://instagram.com/erasstreetwear"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-white/50 hover:text-white transition-colors"
                                >
                                    Instagram
                                </a>
                            </li>
                        </ul>
                        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2">
                            Newsletter
                        </p>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex gap-2"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu email"
                                className="input flex-1 text-sm"
                            />
                            <button
                                type="submit"
                                className="btn-primary btn-sm flex-shrink-0 px-3 text-xs"
                            >
                                ENTRAR
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="divider mt-10 mb-6" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
                    <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                        <p>© 2026 ERAS STREETWEAR. Drop limitado, atitude ilimitada.</p>
                        <p className="text-white/20">CNPJ XX.XXX.XXX/0001-XX</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="hover:text-white/60 transition-colors">Política de Privacidade</Link>
                        <Link href="#" className="hover:text-white/60 transition-colors">Termos de Uso</Link>
                        <a
                            href="https://vaxon.com.br"
                            target="_blank"
                            rel="noreferrer"
                            className="text-white/15 hover:text-white/30 transition-colors text-[10px] tracking-widest uppercase"
                        >
                            ENGINEERED BY VAXON
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
