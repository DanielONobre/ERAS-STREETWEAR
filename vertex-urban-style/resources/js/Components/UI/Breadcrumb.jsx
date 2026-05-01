import { Link } from '@inertiajs/react';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '@lib/utils';

/**
 * Breadcrumb de navegação.
 *
 * @param {object} props
 * @param {Array<{label:string, href?:string}>} props.items
 * @param {string} [props.className]
 */
export default function Breadcrumb({ items = [], className }) {
    return (
        <nav
            aria-label="Navegação estrutural"
            className={cn('flex items-center gap-1.5 text-sm', className)}
        >
            <Link href="/" className="text-white/40 hover:text-white transition-colors flex-shrink-0" aria-label="Início">
                <HomeIcon className="w-4 h-4" />
            </Link>

            {items.map((item, idx) => {
                const isLast = idx === items.length - 1;
                return (
                    <span key={idx} className="flex items-center gap-1.5 min-w-0">
                        <ChevronRightIcon className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                        {isLast || !item.href ? (
                            <span className={cn(
                                'truncate',
                                isLast ? 'text-white/80 font-medium' : 'text-white/40'
                            )}>
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-white/40 hover:text-white transition-colors truncate"
                            >
                                {item.label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
