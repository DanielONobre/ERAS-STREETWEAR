import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { cn } from '@lib/utils';

// ─── Accordion section ────────────────────────────────────────────────────────

function Section({ title, children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-white/[0.06] pb-4">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full py-3 text-sm font-semibold
                           text-white/80 hover:text-white transition-colors"
            >
                {title}
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-2 space-y-2">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Range slider dual-handle ─────────────────────────────────────────────────

function PriceRange({ min = 0, max = 2000, value, onChange }) {
    const [localMin, setLocalMin] = useState(value?.[0] ?? min);
    const [localMax, setLocalMax] = useState(value?.[1] ?? max);

    const commit = () => onChange?.([localMin, localMax]);

    return (
        <div className="space-y-3">
            <div className="flex justify-between text-xs text-white/40">
                <span>R$ {localMin}</span>
                <span>R$ {localMax}</span>
            </div>
            <div className="relative h-1 bg-dark-200 rounded-full">
                {/* filled track */}
                <div
                    className="absolute h-1 bg-primary rounded-full"
                    style={{
                        left:  `${((localMin - min) / (max - min)) * 100}%`,
                        right: `${((max - localMax) / (max - min)) * 100}%`,
                    }}
                />
            </div>
            <div className="relative">
                <input
                    type="range" min={min} max={max} step={10}
                    value={localMin}
                    onChange={(e) => setLocalMin(Math.min(+e.target.value, localMax - 10))}
                    onMouseUp={commit} onTouchEnd={commit}
                    className="range-slider absolute inset-0 w-full"
                />
                <input
                    type="range" min={min} max={max} step={10}
                    value={localMax}
                    onChange={(e) => setLocalMax(Math.max(+e.target.value, localMin + 10))}
                    onMouseUp={commit} onTouchEnd={commit}
                    className="range-slider absolute inset-0 w-full"
                />
            </div>
        </div>
    );
}

// ─── FilterSidebar ────────────────────────────────────────────────────────────

/**
 * Barra lateral de filtros com persistência na URL.
 *
 * @param {object}  props
 * @param {Array}   props.categories   - Árvore de categorias
 * @param {Array}   [props.brands]     - Lista de marcas
 * @param {Array}   [props.sizes]      - Ex: ['P','M','G','GG']
 * @param {Array}   [props.colors]     - Ex: [{ value:'preto', hex:'#000', label:'Preto' }]
 * @param {object}  props.filters      - Filtros ativos (da query string)
 * @param {string}  props.baseRoute    - Ex: 'products.index'
 */
export default function FilterSidebar({
    categories = [],
    brands = [],
    sizes = ['PP','P','M','G','GG','XGG'],
    colors = [],
    filters = {},
    baseRoute = '/produtos',
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    // Estado local para edição antes de submeter
    const [local, setLocal] = useState({
        category:  filters.category  ?? '',
        brand:     Array.isArray(filters.brand) ? filters.brand : (filters.brand ? [filters.brand] : []),
        size:      Array.isArray(filters.size)  ? filters.size  : (filters.size  ? [filters.size]  : []),
        color:     Array.isArray(filters.color) ? filters.color : (filters.color ? [filters.color] : []),
        min_price: filters.min_price ?? '',
        max_price: filters.max_price ?? '',
        on_sale:   !!filters.on_sale,
    });

    const hasActive = local.category || local.brand.length || local.size.length ||
                      local.color.length || local.min_price || local.max_price || local.on_sale;

    const apply = useCallback((patch = {}) => {
        const next = { ...local, ...patch };
        setLocal(next);

        const params = {};
        if (next.category)           params.category   = next.category;
        if (next.brand.length)       params.brand      = next.brand;
        if (next.size.length)        params.size       = next.size;
        if (next.color.length)       params.color      = next.color;
        if (next.min_price)          params.min_price  = next.min_price;
        if (next.max_price)          params.max_price  = next.max_price;
        if (next.on_sale)            params.on_sale    = 1;
        if (filters.sort)            params.sort       = filters.sort;
        if (filters.q)               params.q          = filters.q;

        router.get(baseRoute, params, { preserveScroll: true, replace: true });
    }, [local, filters, baseRoute]);

    const toggleArray = (key, val) => {
        const arr = local[key];
        const next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
        apply({ [key]: next });
    };

    const clear = () => {
        const empty = { category: '', brand: [], size: [], color: [], min_price: '', max_price: '', on_sale: false };
        setLocal(empty);
        router.get(baseRoute, {}, { preserveScroll: true, replace: true });
    };

    // ── Conteúdo dos filtros ──────────────────────────────────────────────────
    const FiltersContent = (
        <div className="space-y-1">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-1">
                <span className="text-sm font-semibold text-white/80">Filtros</span>
                {hasActive && (
                    <button onClick={clear} className="flex items-center gap-1 text-xs text-primary hover:text-primary-400">
                        <XMarkIcon className="w-3.5 h-3.5" />
                        Limpar
                    </button>
                )}
            </div>

            {/* Sale */}
            <label className="flex items-center gap-2.5 py-2 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={local.on_sale}
                    onChange={(e) => apply({ on_sale: e.target.checked })}
                    className="sr-only"
                />
                <span className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all',
                    local.on_sale ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-white/40'
                )}>
                    {local.on_sale && <span className="text-white text-[10px] font-bold">✓</span>}
                </span>
                <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                    Em promoção
                </span>
            </label>

            {/* Categorias */}
            {categories.length > 0 && (
                <Section title="Categoria">
                    <ul className="space-y-1">
                        {categories.map((cat) => (
                            <li key={cat.id}>
                                <button
                                    onClick={() => apply({ category: local.category === cat.slug ? '' : cat.slug })}
                                    className={cn(
                                        'w-full text-left text-sm px-2 py-1.5 rounded-lg transition-all',
                                        local.category === cat.slug
                                            ? 'bg-primary/15 text-primary font-medium'
                                            : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                                    )}
                                >
                                    {cat.name}
                                    {cat.products_count != null && (
                                        <span className="ml-1.5 text-xs text-white/30">({cat.products_count})</span>
                                    )}
                                </button>
                                {cat.children?.length > 0 && (
                                    <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-white/[0.06] pl-2">
                                        {cat.children.map((child) => (
                                            <li key={child.id}>
                                                <button
                                                    onClick={() => apply({ category: local.category === child.slug ? '' : child.slug })}
                                                    className={cn(
                                                        'w-full text-left text-xs px-2 py-1 rounded-lg transition-all',
                                                        local.category === child.slug
                                                            ? 'text-primary font-medium'
                                                            : 'text-white/50 hover:text-white'
                                                    )}
                                                >
                                                    {child.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {/* Marcas */}
            {brands.length > 0 && (
                <Section title="Marca" defaultOpen={false}>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                        {brands.map((brand) => (
                            <label key={brand.id ?? brand.slug} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                                <input
                                    type="checkbox"
                                    checked={local.brand.includes(brand.slug)}
                                    onChange={() => toggleArray('brand', brand.slug)}
                                    className="sr-only"
                                />
                                <span className={cn(
                                    'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all',
                                    local.brand.includes(brand.slug)
                                        ? 'bg-primary border-primary'
                                        : 'border-white/20 group-hover:border-white/40'
                                )}>
                                    {local.brand.includes(brand.slug) && <span className="text-white text-[10px] font-bold">✓</span>}
                                </span>
                                <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                                    {brand.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </Section>
            )}

            {/* Tamanho */}
            {sizes.length > 0 && (
                <Section title="Tamanho" defaultOpen={false}>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => toggleArray('size', size)}
                                className={cn(
                                    'w-10 h-10 rounded-lg text-xs font-semibold border transition-all',
                                    local.size.includes(size)
                                        ? 'bg-primary/15 border-primary text-primary'
                                        : 'border-white/[0.08] text-white/60 hover:border-white/30 hover:text-white bg-dark-200'
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </Section>
            )}

            {/* Cor */}
            {colors.length > 0 && (
                <Section title="Cor" defaultOpen={false}>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => toggleArray('color', color.value)}
                                title={color.label}
                                className={cn(
                                    'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                                    local.color.includes(color.value)
                                        ? 'border-white scale-110 ring-2 ring-primary/50'
                                        : 'border-transparent'
                                )}
                                style={{ backgroundColor: color.hex }}
                                aria-label={color.label}
                                aria-pressed={local.color.includes(color.value)}
                            />
                        ))}
                    </div>
                </Section>
            )}

            {/* Preço */}
            <Section title="Faixa de preço" defaultOpen={false}>
                <PriceRange
                    value={[Number(local.min_price) || 0, Number(local.max_price) || 2000]}
                    onChange={([mn, mx]) => apply({ min_price: mn || '', max_price: mx === 2000 ? '' : mx })}
                />
                <div className="flex gap-2 mt-3">
                    {[
                        { label: 'Até R$100', min: 0,   max: 100 },
                        { label: 'R$100–200', min: 100, max: 200 },
                        { label: 'Acima R$200', min: 200, max: '' },
                    ].map((preset) => (
                        <button
                            key={preset.label}
                            onClick={() => apply({ min_price: preset.min || '', max_price: preset.max })}
                            className="text-[10px] px-2 py-1 rounded-lg bg-dark-200 text-white/50 hover:text-white
                                       hover:bg-white/10 border border-white/[0.08] transition-all"
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </Section>
        </div>
    );

    return (
        <>
            {/* ── Desktop sidebar ─────────────────────────────────────────── */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
                {FiltersContent}
            </aside>

            {/* ── Mobile trigger ──────────────────────────────────────────── */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center gap-2 btn-outline btn-sm"
            >
                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                Filtros
                {hasActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
            </button>

            {/* ── Mobile bottom sheet ─────────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[55] bg-dark/70 backdrop-blur-sm lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Bottom sheet */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
                            className="fixed bottom-0 left-0 right-0 z-[56] bg-dark-100 border-t
                                       border-white/[0.08] rounded-t-3xl shadow-2xl lg:hidden
                                       max-h-[85vh] flex flex-col"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Filtros"
                        >
                            {/* Drag handle */}
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 rounded-full bg-white/20" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                                <span className="font-semibold">Filtros</span>
                                <button onClick={() => setMobileOpen(false)} className="btn-icon text-white/50" aria-label="Fechar filtros">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Conteúdo scrollável */}
                            <div className="flex-1 overflow-y-auto p-5">
                                {FiltersContent}
                            </div>

                            {/* CTA fixed no bottom */}
                            <div className="p-4 border-t border-white/[0.06] bg-dark-100">
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="btn-primary w-full justify-center"
                                >
                                    Ver produtos
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
