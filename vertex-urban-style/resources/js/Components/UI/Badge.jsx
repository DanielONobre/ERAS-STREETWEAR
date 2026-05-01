import { cn } from '@lib/utils';

/**
 * Badge de produto ou status.
 *
 * @param {'new'|'sale'|'soldout'|'featured'|'hot'|string} variant
 * @param {string} [label]    - Texto customizado (sobrescreve o padrão da variante)
 * @param {string} [className]
 */
export default function Badge({ variant = 'new', label, className }) {
    const presets = {
        new: {
            text:   label ?? 'Novo',
            styles: 'bg-primary/20 border-primary/30 text-primary-300',
        },
        sale: {
            text:   label ?? 'Sale',
            styles: 'bg-red-500/20 border-red-500/30 text-red-400',
        },
        soldout: {
            text:   label ?? 'Esgotado',
            styles: 'bg-dark-200 border-white/[0.08] text-white/40',
        },
        featured: {
            text:   label ?? 'Destaque',
            styles: 'bg-accent/20 border-accent/30 text-accent-300',
        },
        hot: {
            text:   label ?? 'Hot 🔥',
            styles: 'bg-rose-500/20 border-rose-500/30 text-rose-400',
        },
    };

    const preset = presets[variant] ?? {
        text:   label ?? variant,
        styles: 'bg-white/10 border-white/10 text-white/70',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center border rounded-full px-2 py-0.5',
                'text-[10px] font-semibold uppercase tracking-wider leading-none',
                preset.styles,
                className
            )}
        >
            {preset.text}
        </span>
    );
}
