import { forwardRef } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { cn } from '@lib/utils';

/**
 * Input de quantidade com botões + e -.
 *
 * @param {object}   props
 * @param {number}   props.value    - Valor atual
 * @param {number}   [props.min]    - Mínimo (default 1)
 * @param {number}   [props.max]    - Máximo (default 99)
 * @param {Function} props.onChange - Callback(novoValor: number)
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {boolean}  [props.disabled]
 */
const QuantityInput = forwardRef(function QuantityInput({
    value,
    min = 1,
    max = 99,
    onChange,
    size = 'md',
    disabled = false,
    className,
}, ref) {
    const sizes = {
        sm: { btn: 'w-6 h-6', input: 'w-8 text-xs', icon: 'w-3 h-3' },
        md: { btn: 'w-8 h-8', input: 'w-10 text-sm', icon: 'w-3.5 h-3.5' },
        lg: { btn: 'w-10 h-10', input: 'w-12 text-base', icon: 'w-4 h-4' },
    };
    const s = sizes[size] ?? sizes.md;

    const decrement = () => {
        if (value > min) onChange?.(value - 1);
    };

    const increment = () => {
        if (value < max) onChange?.(value + 1);
    };

    const handleInput = (e) => {
        const v = parseInt(e.target.value, 10);
        if (!isNaN(v)) onChange?.(Math.min(max, Math.max(min, v)));
    };

    return (
        <div
            ref={ref}
            className={cn(
                'inline-flex items-center rounded-xl border border-white/[0.08] bg-dark-200 overflow-hidden',
                disabled && 'opacity-50 pointer-events-none',
                className
            )}
        >
            <button
                type="button"
                onClick={decrement}
                disabled={disabled || value <= min}
                className={cn(
                    s.btn,
                    'flex items-center justify-center text-white/50 hover:text-white',
                    'hover:bg-white/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                )}
                aria-label="Diminuir quantidade"
            >
                <MinusIcon className={s.icon} />
            </button>

            <input
                type="number"
                value={value}
                min={min}
                max={max}
                onChange={handleInput}
                className={cn(
                    s.input,
                    'text-center bg-transparent text-white font-medium',
                    'focus:outline-none appearance-none',
                    '[&::-webkit-inner-spin-button]:appearance-none',
                    '[&::-webkit-outer-spin-button]:appearance-none',
                )}
                aria-label="Quantidade"
            />

            <button
                type="button"
                onClick={increment}
                disabled={disabled || value >= max}
                className={cn(
                    s.btn,
                    'flex items-center justify-center text-white/50 hover:text-white',
                    'hover:bg-white/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                )}
                aria-label="Aumentar quantidade"
            >
                <PlusIcon className={s.icon} />
            </button>
        </div>
    );
});

export default QuantityInput;
