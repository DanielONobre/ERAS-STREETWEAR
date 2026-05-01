import { useState, useId } from 'react';
import { motion } from 'framer-motion';

/**
 * Input com label flutuante (placeholder que sobe ao focar).
 *
 * @param {object}   props
 * @param {string}   props.label       - Texto do label / placeholder
 * @param {string}   [props.type]      - Input type (default: text)
 * @param {string}   [props.value]
 * @param {Function} [props.onChange]
 * @param {string}   [props.error]     - Mensagem de erro
 * @param {boolean}  [props.required]
 * @param {object}   [props.rest]      - Demais props do input
 */
export default function FloatLabel({
    label,
    type = 'text',
    value = '',
    onChange,
    error,
    required,
    className = '',
    ...rest
}) {
    const id = useId();
    const [focused, setFocused] = useState(false);

    const isUp = focused || value !== '';

    return (
        <div className={`relative ${className}`}>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required={required}
                className={`peer w-full bg-dark-200 border rounded-xl px-4 pt-5 pb-2
                            text-sm text-white placeholder-transparent
                            focus:outline-none focus:ring-2 transition-all
                            ${error
                                ? 'border-red-500/50 focus:ring-red-500/30'
                                : 'border-white/10 focus:ring-primary/30 focus:border-primary/40'
                            }`}
                placeholder={label}
                aria-describedby={error ? `${id}-error` : undefined}
                {...rest}
            />

            {/* Label flutuante */}
            <motion.label
                htmlFor={id}
                animate={isUp
                    ? { y: -10, scale: 0.75, color: focused ? '#0d9488' : 'rgba(255,255,255,0.4)' }
                    : { y: 0, scale: 1, color: 'rgba(255,255,255,0.35)' }
                }
                initial={{ y: 0, scale: 1, color: 'rgba(255,255,255,0.35)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ originX: 0, originY: 0.5 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none select-none"
            >
                {label}{required && ' *'}
            </motion.label>

            {/* Mensagem de erro */}
            {error && (
                <p id={`${id}-error`} className="mt-1 text-xs text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
