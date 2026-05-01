import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { cn } from '@lib/utils';

/**
 * Exibe ou coleta avaliação em estrelas.
 *
 * @param {object}   props
 * @param {number}   props.value     - Nota (0–5, aceita decimais para exibição)
 * @param {number}   [props.count]   - Número de avaliações
 * @param {boolean}  [props.interactive] - Modo de input (clicável)
 * @param {Function} [props.onChange]    - Callback quando clicado (interactive)
 * @param {'xs'|'sm'|'md'|'lg'} [props.size]
 * @param {boolean}  [props.showCount]
 */
export default function StarRating({
    value = 0,
    count,
    interactive = false,
    onChange,
    size = 'sm',
    showCount = true,
    className,
}) {
    const [hovered, setHovered] = useState(0);

    const sizes = {
        xs: 'w-3 h-3',
        sm: 'w-3.5 h-3.5',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };
    const iconSize = sizes[size] ?? sizes.sm;

    const display = interactive ? (hovered || value) : value;

    return (
        <div className={cn('flex items-center gap-1', className)}>
            <div
                className={cn('flex', interactive && 'cursor-pointer')}
                role={interactive ? 'radiogroup' : undefined}
                aria-label={`${value} de 5 estrelas`}
            >
                {[1, 2, 3, 4, 5].map((star) => {
                    const filled  = display >= star;
                    const partial = !filled && display >= star - 0.5;

                    return (
                        <button
                            key={star}
                            type="button"
                            disabled={!interactive}
                            onClick={() => interactive && onChange?.(star)}
                            onMouseEnter={() => interactive && setHovered(star)}
                            onMouseLeave={() => interactive && setHovered(0)}
                            className={cn(
                                'focus:outline-none transition-transform',
                                interactive && 'hover:scale-125'
                            )}
                            aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                            role={interactive ? 'radio' : undefined}
                            aria-checked={interactive ? value === star : undefined}
                        >
                            {filled ? (
                                <StarIcon className={cn(iconSize, 'text-yellow-400')} />
                            ) : partial ? (
                                /* Meia estrela — clip no SVG */
                                <span className="relative inline-block">
                                    <StarOutline className={cn(iconSize, 'text-white/20')} />
                                    <span
                                        className="absolute inset-0 overflow-hidden"
                                        style={{ width: '50%' }}
                                    >
                                        <StarIcon className={cn(iconSize, 'text-yellow-400')} />
                                    </span>
                                </span>
                            ) : (
                                <StarOutline className={cn(iconSize, 'text-white/20')} />
                            )}
                        </button>
                    );
                })}
            </div>

            {showCount && count != null && (
                <span className="text-xs text-white/40">
                    {value.toFixed(1)} ({count})
                </span>
            )}
        </div>
    );
}
