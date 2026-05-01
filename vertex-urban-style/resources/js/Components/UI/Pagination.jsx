import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@lib/utils';

/**
 * Paginação usando os links do Laravel (Inertia).
 *
 * @param {object} props
 * @param {object} props.meta     - Objeto de paginação do Laravel (current_page, last_page, links, etc.)
 * @param {string} [props.className]
 * @param {boolean} [props.showInfo] - Exibe "Exibindo X–Y de Z resultados"
 */
export default function Pagination({ meta, className, showInfo = true }) {
    if (!meta || meta.last_page <= 1) return null;

    const { current_page, last_page, from, to, total, links = [] } = meta;

    // Links sem "Previous" e "Next" do Laravel
    const pageLinks = links.filter(
        (l) => l.label !== '&laquo; Previous' && l.label !== 'Next &raquo;'
    );

    // Janela de páginas visíveis: páginas próximas à atual
    const visible = pageLinks.filter((l) => {
        const n = parseInt(l.label, 10);
        return isNaN(n) || Math.abs(n - current_page) <= 2 || n === 1 || n === last_page;
    });

    return (
        <div className={cn('flex flex-col items-center gap-4', className)}>
            {/* Info */}
            {showInfo && from && to && (
                <p className="text-sm text-white/40">
                    Exibindo{' '}
                    <span className="text-white/70 font-medium">{from}–{to}</span>
                    {' '}de{' '}
                    <span className="text-white/70 font-medium">{total}</span>{' '}
                    {total === 1 ? 'produto' : 'produtos'}
                </p>
            )}

            {/* Links */}
            <nav aria-label="Paginação" className="flex items-center gap-1">
                {/* Previous */}
                {current_page > 1 ? (
                    <Link
                        href={links.find((l) => l.label === '&laquo; Previous')?.url ?? '#'}
                        className="btn-icon text-white/50 hover:text-white"
                        preserveScroll
                        aria-label="Página anterior"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </Link>
                ) : (
                    <span className="btn-icon text-white/20 cursor-not-allowed" aria-disabled="true">
                        <ChevronLeftIcon className="w-4 h-4" />
                    </span>
                )}

                {/* Page numbers */}
                {(() => {
                    let lastNum = null;
                    return visible.map((link, i) => {
                        const num = parseInt(link.label, 10);
                        const gap = !isNaN(num) && lastNum !== null && num - lastNum > 1;
                        lastNum = num;
                        return (
                            <span key={i} className="flex items-center gap-1">
                                {gap && (
                                    <span className="px-2 text-white/20 select-none">…</span>
                                )}
                                {link.active ? (
                                    <span className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/40
                                                     text-primary text-sm font-semibold
                                                     flex items-center justify-center">
                                        {link.label}
                                    </span>
                                ) : link.url ? (
                                    <Link
                                        href={link.url}
                                        preserveScroll
                                        className="w-9 h-9 rounded-xl bg-dark-200 border border-white/[0.06]
                                                   text-white/50 text-sm hover:text-white hover:border-white/20
                                                   flex items-center justify-center transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                ) : null}
                            </span>
                        );
                    });
                })()}

                {/* Next */}
                {current_page < last_page ? (
                    <Link
                        href={links.find((l) => l.label === 'Next &raquo;')?.url ?? '#'}
                        className="btn-icon text-white/50 hover:text-white"
                        preserveScroll
                        aria-label="Próxima página"
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                ) : (
                    <span className="btn-icon text-white/20 cursor-not-allowed" aria-disabled="true">
                        <ChevronRightIcon className="w-4 h-4" />
                    </span>
                )}
            </nav>
        </div>
    );
}
