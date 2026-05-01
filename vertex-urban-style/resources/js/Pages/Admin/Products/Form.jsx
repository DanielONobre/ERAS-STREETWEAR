import { useState, useEffect, useCallback, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import AdminLayout from '@layouts/AdminLayout';
import {
    PhotoIcon, XMarkIcon, PlusIcon, TrashIcon,
    ArrowUpIcon, ArrowDownIcon, StarIcon, CheckIcon,
    GlobeAltIcon, InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

/* ─── Tabs ────────────────────────────────────────────────────────────── */
const TABS = [
    { key: 'info',      label: 'Informações' },
    { key: 'images',    label: 'Imagens'      },
    { key: 'variants',  label: 'Variantes'    },
    { key: 'pricing',   label: 'Preço & Estoque' },
    { key: 'seo',       label: 'SEO'          },
];

/* ─── Slug generator ─────────────────────────────────────────────────── */
const toSlug = (str) =>
    str.toLowerCase()
       .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
       .replace(/[^a-z0-9]+/g, '-')
       .replace(/^-|-$/g, '');

/* ─── Character counter ──────────────────────────────────────────────── */
function CharCount({ value, max, optimal }) {
    const len = value?.length ?? 0;
    const color = len === 0 ? 'text-white/30'
        : len > max      ? 'text-red-400'
        : len >= (optimal[0] ?? 0) && len <= (optimal[1] ?? max) ? 'text-green-400'
        : 'text-amber-400';
    return (
        <span className={`text-xs ${color}`}>{len}/{max}</span>
    );
}

/* ─── Image Dropzone ─────────────────────────────────────────────────── */
function ImageDropzone({ images, onAdd, onRemove, onSetMain, onReorder }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
        multiple: true,
        onDrop: onAdd,
    });

    return (
        <div className="space-y-4">
            {/* Drop zone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-white/15 hover:border-white/30 hover:bg-white/[0.02]'
                }`}
            >
                <input {...getInputProps()} />
                <PhotoIcon className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/60">
                    {isDragActive
                        ? 'Solte as imagens aqui...'
                        : 'Arraste imagens ou clique para selecionar'
                    }
                </p>
                <p className="text-xs text-white/30 mt-1">JPG, PNG, WebP, GIF — máximo 5MB cada</p>
            </div>

            {/* Images grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {images.map((img, i) => (
                        <div key={img.id ?? i} className="relative group rounded-xl overflow-hidden aspect-square bg-dark-200">
                            <img
                                src={img.preview ?? img.url ?? (img.path ? `/storage/${img.path}` : undefined)}
                                alt=""
                                className="w-full h-full object-cover"
                            />

                            {/* Main indicator */}
                            {img.is_main && (
                                <div className="absolute top-1.5 left-1.5">
                                    <StarSolid className="w-4 h-4 text-yellow-400 drop-shadow" />
                                </div>
                            )}

                            {/* Upload progress */}
                            {img.progress !== undefined && img.progress < 100 && (
                                <div className="absolute inset-0 bg-dark/70 flex flex-col items-center justify-center">
                                    <div className="w-4/5 h-1 bg-dark-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-200"
                                            style={{ width: `${img.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-white/60 mt-1">{img.progress}%</span>
                                </div>
                            )}

                            {/* Hover actions */}
                            <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => onSetMain(i)}
                                    title="Definir como principal"
                                    className="w-7 h-7 rounded-lg bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/40 flex items-center justify-center text-xs"
                                >
                                    <StarIcon className="w-3.5 h-3.5" />
                                </button>
                                {i > 0 && (
                                    <button type="button" onClick={() => onReorder(i, i - 1)} className="w-7 h-7 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center">
                                        <ArrowUpIcon className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                {i < images.length - 1 && (
                                    <button type="button" onClick={() => onReorder(i, i + 1)} className="w-7 h-7 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center">
                                        <ArrowDownIcon className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <button type="button" onClick={() => onRemove(i)} className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 flex items-center justify-center">
                                    <TrashIcon className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─── Google Preview ─────────────────────────────────────────────────── */
function GooglePreview({ title, description, slug }) {
    const url = `vertexurbanstyle.com.br/produtos/${slug || 'produto-exemplo'}`;
    return (
        <div className="bg-white rounded-xl p-4 max-w-xl">
            <p className="text-[#202124] text-xs mb-0.5 truncate">{url}</p>
            <p className="text-[#1a0dab] text-lg font-medium leading-snug mb-1 line-clamp-1">
                {title || 'Título da página aparecerá aqui'}
            </p>
            <p className="text-[#4d5156] text-sm leading-relaxed line-clamp-2">
                {description || 'A descrição da página aparecerá aqui. Use entre 120–160 caracteres para melhor resultado.'}
            </p>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function ProductForm({
    product,
    categories = [],
    brands = [],
    stats = {},
}) {
    const isEdit = !!product?.id;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name:              product?.name ?? '',
        slug:              product?.slug ?? '',
        short_description: product?.short_description ?? '',
        description:       product?.description ?? '',
        category_id:       product?.category_id ?? '',
        brand_id:          product?.brand_id ?? '',
        is_active:         product?.is_active ?? true,
        is_featured:       product?.is_featured ?? false,
        is_new:            product?.is_new ?? true,
        // pricing
        price:             product?.price ?? '',
        compare_price:     product?.compare_price ?? '',
        cost_price:        product?.cost_price ?? '',
        stock:             product?.stock ?? 0,
        sku:               product?.sku ?? '',
        weight:            product?.weight ?? '',
        stock_status:      product?.stock_status ?? 'in_stock',
        // seo
        meta_title:        product?.meta_title ?? '',
        meta_description:  product?.meta_description ?? '',
    });

    const [activeTab, setActiveTab] = useState('info');
    const [slugEdited, setSlugEdited] = useState(isEdit);
    const [images, setImages]         = useState(
        (product?.images ?? []).map(img => ({
            ...img,
            preview: img.url ?? `/storage/${img.path}`,
        }))
    );
    const [variants, setVariants]     = useState(product?.variants ?? []);
    const [sizeOptions, setSizeOptions] = useState(
        [...new Set((product?.variants ?? []).map(v => v.size).filter(Boolean))]
    );
    const [colorOptions, setColorOptions] = useState(
        [...new Set((product?.variants ?? []).map(v => v.color_name).filter(Boolean))]
    );
    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState('');
    const richEditorRef = useRef(null);

    /* Auto-slug */
    useEffect(() => {
        if (!slugEdited) {
            setData('slug', toSlug(data.name));
        }
    }, [data.name, slugEdited]);

    /* Auto meta_title */
    useEffect(() => {
        if (!data.meta_title) {
            setData('meta_title', data.name ? `${data.name} — Vertex Urban Style` : '');
        }
    }, [data.name]);

    /* Image handlers */
    const handleDrop = useCallback((acceptedFiles) => {
        const newImgs = acceptedFiles.map(file => ({
            id: null,
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            is_main: images.length === 0,
        }));
        setImages(prev => [...prev, ...newImgs]);
        // Simulate upload progress
        newImgs.forEach((img, i) => {
            const interval = setInterval(() => {
                setImages(prev => prev.map(p =>
                    p.preview === img.preview
                        ? { ...p, progress: Math.min((p.progress ?? 0) + 20, 100) }
                        : p
                ));
            }, 200);
            setTimeout(() => clearInterval(interval), 1200);
        });
    }, [images]);

    const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));

    const setMainImage = (i) => {
        setImages(prev => prev.map((img, idx) => ({ ...img, is_main: idx === i })));
    };

    const reorderImages = (from, to) => {
        setImages(prev => {
            const arr = [...prev];
            [arr[from], arr[to]] = [arr[to], arr[from]];
            return arr;
        });
    };

    /* Variant generation */
    const generateVariants = () => {
        if (!sizeOptions.length && !colorOptions.length) return;
        const combinations = [];
        const sizes  = sizeOptions.length ? sizeOptions : [''];
        const colors = colorOptions.length ? colorOptions : [''];
        sizes.forEach(size => {
            colors.forEach(color => {
                const exists = variants.find(v =>
                    (!size || v.size === size) && (!color || v.color_name === color)
                );
                if (!exists) {
                    combinations.push({
                        id: null,
                        size: size || null,
                        color_name: color || null,
                        color_hex: '',
                        sku: '',
                        price: '',
                        stock: 0,
                    });
                }
            });
        });
        setVariants(prev => [...prev, ...combinations]);
    };

    const updateVariant = (i, field, value) => {
        setVariants(prev => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v));
    };

    const removeVariant = (i) => setVariants(prev => prev.filter((_, idx) => idx !== i));

    /* Submit */
    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url    = isEdit ? `/admin/produtos/${product.id}` : '/admin/produtos';
        method(url, {
            ...data,
            images: images.map(img => ({ id: img.id, file: img.file, is_main: img.is_main })),
            variants,
        });
    };

    const breadcrumbs = [
        { label: 'Admin', href: '/admin' },
        { label: 'Produtos', href: '/admin/produtos' },
        { label: isEdit ? `Editar: ${product.name}` : 'Novo Produto' },
    ];

    return (
        <AdminLayout
            title={isEdit ? `Editar Produto` : 'Novo Produto'}
            breadcrumbs={breadcrumbs}
            stats={stats}
        >
            <form onSubmit={handleSubmit}>
                {/* Tab bar */}
                <div className="flex gap-1 mb-6 border-b border-white/[0.06] overflow-x-auto">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                                activeTab === tab.key
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-white/50 hover:text-white hover:border-white/20'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* ── Main area ──────────────────────────────────────── */}
                    <div className="xl:col-span-2 space-y-5">

                        {/* ── ABA: INFORMAÇÕES ────────────────────────────── */}
                        {activeTab === 'info' && (
                            <motion.div key="info" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                                <div className="card p-5 space-y-4">
                                    <div>
                                        <label className="label">Nome do produto *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className={`input ${errors.name ? 'input-error' : ''}`}
                                            placeholder="Ex: Camiseta Streetwear 2025"
                                        />
                                        {errors.name && <p className="field-error">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="label flex items-center justify-between">
                                            <span>Slug</span>
                                            {!slugEdited && (
                                                <span className="text-[10px] text-white/30">Gerado automaticamente</span>
                                            )}
                                        </label>
                                        <div className="flex gap-2">
                                            <span className="flex items-center px-3 bg-dark-200 border border-white/10 rounded-l-xl text-xs text-white/30 border-r-0">
                                                /produtos/
                                            </span>
                                            <input
                                                type="text"
                                                value={data.slug}
                                                onChange={e => { setSlugEdited(true); setData('slug', toSlug(e.target.value)); }}
                                                className="input rounded-l-none flex-1 font-mono text-xs"
                                                placeholder="nome-do-produto"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label">Descrição curta</label>
                                        <textarea
                                            rows={3}
                                            value={data.short_description}
                                            onChange={e => setData('short_description', e.target.value)}
                                            className="input resize-none"
                                            placeholder="Resumo de até 160 caracteres para cards e SEO"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Descrição completa</label>
                                        <div className="rounded-xl border border-white/10 overflow-hidden bg-dark-100">
                                            {/* Toolbar Rico simplificado */}
                                            <div className="flex gap-1 px-3 py-2 border-b border-white/[0.06] flex-wrap">
                                                {['B', 'I', 'U', 'H2', 'H3', '• Lista', '1. Lista', '🔗', '—'].map(cmd => (
                                                    <button
                                                        key={cmd}
                                                        type="button"
                                                        className="px-2 py-1 text-xs text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
                                                    >
                                                        {cmd}
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                rows={10}
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                                className="w-full bg-transparent text-white/80 text-sm px-4 py-3 resize-none outline-none leading-relaxed"
                                                placeholder="Descrição detalhada do produto. Suporta HTML básico."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── ABA: IMAGENS ─────────────────────────────────── */}
                        {activeTab === 'images' && (
                            <motion.div key="images" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="card p-5">
                                    <h3 className="font-semibold mb-4">Galeria de Imagens</h3>
                                    <ImageDropzone
                                        images={images}
                                        onAdd={handleDrop}
                                        onRemove={removeImage}
                                        onSetMain={setMainImage}
                                        onReorder={reorderImages}
                                    />
                                    <p className="text-xs text-white/30 mt-4 flex items-center gap-1">
                                        <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
                                        Clique na estrela para definir a imagem principal
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* ── ABA: VARIANTES ──────────────────────────────── */}
                        {activeTab === 'variants' && (
                            <motion.div key="variants" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                                {/* Attribute builder */}
                                <div className="card p-5">
                                    <h3 className="font-semibold mb-4">Atributos</h3>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        {/* Tamanhos */}
                                        <div>
                                            <label className="label mb-2">Tamanhos</label>
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {sizeOptions.map(s => (
                                                    <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-xs">
                                                        {s}
                                                        <button type="button" onClick={() => setSizeOptions(prev => prev.filter(x => x !== s))}>
                                                            <XMarkIcon className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newSize}
                                                    onChange={e => setNewSize(e.target.value)}
                                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newSize.trim()) { setSizeOptions(p => [...p, newSize.trim()]); setNewSize(''); } } }}
                                                    placeholder="P, M, G, GG..."
                                                    className="input text-sm h-8"
                                                />
                                                <button type="button" onClick={() => { if (newSize.trim()) { setSizeOptions(p => [...p, newSize.trim()]); setNewSize(''); } }} className="btn-outline btn-sm h-8 px-3">
                                                    <PlusIcon className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        {/* Cores */}
                                        <div>
                                            <label className="label mb-2">Cores</label>
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {colorOptions.map(c => (
                                                    <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/15 text-accent text-xs">
                                                        {c}
                                                        <button type="button" onClick={() => setColorOptions(prev => prev.filter(x => x !== c))}>
                                                            <XMarkIcon className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newColor}
                                                    onChange={e => setNewColor(e.target.value)}
                                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newColor.trim()) { setColorOptions(p => [...p, newColor.trim()]); setNewColor(''); } } }}
                                                    placeholder="Preto, Branco..."
                                                    className="input text-sm h-8"
                                                />
                                                <button type="button" onClick={() => { if (newColor.trim()) { setColorOptions(p => [...p, newColor.trim()]); setNewColor(''); } }} className="btn-outline btn-sm h-8 px-3">
                                                    <PlusIcon className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateVariants}
                                        className="btn-outline btn-sm"
                                    >
                                        Gerar combinações automaticamente
                                    </button>
                                </div>

                                {/* Variants table */}
                                {variants.length > 0 && (
                                    <div className="card overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-white/[0.06]">
                                                        {['Tamanho', 'Cor', 'HEX', 'SKU', 'Preço', 'Estoque', ''].map(h => (
                                                            <th key={h} className="px-4 py-3 text-left text-[11px] text-white/35 font-medium">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/[0.03]">
                                                    {variants.map((v, i) => (
                                                        <tr key={i} className="hover:bg-white/[0.02]">
                                                            <td className="px-4 py-2"><input type="text" value={v.size ?? ''} onChange={e => updateVariant(i, 'size', e.target.value)} className="input h-8 text-xs w-20" placeholder="P" /></td>
                                                            <td className="px-4 py-2"><input type="text" value={v.color_name ?? ''} onChange={e => updateVariant(i, 'color_name', e.target.value)} className="input h-8 text-xs w-24" placeholder="Preto" /></td>
                                                            <td className="px-4 py-2">
                                                                <div className="flex items-center gap-1.5">
                                                                    <input type="color" value={v.color_hex || '#000000'} onChange={e => updateVariant(i, 'color_hex', e.target.value)} className="w-7 h-7 rounded-lg border border-white/10 bg-dark-200 cursor-pointer" />
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2"><input type="text" value={v.sku ?? ''} onChange={e => updateVariant(i, 'sku', e.target.value)} className="input h-8 text-xs w-28 font-mono" placeholder="SKU-001" /></td>
                                                            <td className="px-4 py-2"><input type="number" value={v.price ?? ''} onChange={e => updateVariant(i, 'price', e.target.value)} className="input h-8 text-xs w-24" placeholder="Padrão" /></td>
                                                            <td className="px-4 py-2"><input type="number" min="0" value={v.stock ?? 0} onChange={e => updateVariant(i, 'stock', +e.target.value)} className="input h-8 text-xs w-20" /></td>
                                                            <td className="px-4 py-2"><button type="button" onClick={() => removeVariant(i)} className="text-white/30 hover:text-red-400 transition-colors"><TrashIcon className="w-4 h-4" /></button></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="px-4 py-3 border-t border-white/[0.06]">
                                            <button
                                                type="button"
                                                onClick={() => setVariants(prev => [...prev, { id: null, size: '', color_name: '', color_hex: '', sku: '', price: '', stock: 0 }])}
                                                className="btn-ghost btn-sm text-xs"
                                            >
                                                <PlusIcon className="w-3.5 h-3.5" />
                                                Adicionar linha
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* ── ABA: PREÇO & ESTOQUE ────────────────────────── */}
                        {activeTab === 'pricing' && (
                            <motion.div key="pricing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="card p-5 space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="label">Preço de venda *</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">R$</span>
                                                <input type="number" step="0.01" min="0" value={data.price} onChange={e => setData('price', e.target.value)} className={`input pl-8 ${errors.price ? 'input-error' : ''}`} placeholder="0,00" />
                                            </div>
                                            {errors.price && <p className="field-error">{errors.price}</p>}
                                        </div>
                                        <div>
                                            <label className="label">Preço comparativo (riscado)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">R$</span>
                                                <input type="number" step="0.01" min="0" value={data.compare_price} onChange={e => setData('compare_price', e.target.value)} className="input pl-8" placeholder="0,00" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="label">Preço de custo</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">R$</span>
                                                <input type="number" step="0.01" min="0" value={data.cost_price} onChange={e => setData('cost_price', e.target.value)} className="input pl-8" placeholder="0,00" />
                                            </div>
                                        </div>
                                    </div>

                                    {data.price && data.cost_price && (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                            <span className="text-sm text-green-400">
                                                Margem: {(((+data.price - +data.cost_price) / +data.price) * 100).toFixed(1)}%
                                            </span>
                                            <span className="text-sm text-green-300 font-semibold">
                                                Lucro: R$ {(+data.price - +data.cost_price).toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="divider" />

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="label">SKU</label>
                                            <input type="text" value={data.sku} onChange={e => setData('sku', e.target.value)} className="input font-mono text-sm" placeholder="SKU-001" />
                                        </div>
                                        <div>
                                            <label className="label">Estoque total</label>
                                            <input type="number" min="0" value={data.stock} onChange={e => setData('stock', +e.target.value)} className={`input ${errors.stock ? 'input-error' : ''}`} />
                                        </div>
                                        <div>
                                            <label className="label">Peso (kg)</label>
                                            <input type="number" step="0.1" min="0" value={data.weight} onChange={e => setData('weight', e.target.value)} className="input" placeholder="0.5" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label">Status de estoque</label>
                                        <select value={data.stock_status} onChange={e => setData('stock_status', e.target.value)} className="input w-auto">
                                            <option value="in_stock">Em estoque</option>
                                            <option value="out_of_stock">Esgotado</option>
                                            <option value="pre_order">Pré-venda</option>
                                            <option value="discontinued">Descontinuado</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── ABA: SEO ─────────────────────────────────────── */}
                        {activeTab === 'seo' && (
                            <motion.div key="seo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                                <div className="card p-5 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="label mb-0">Meta Title</label>
                                            <CharCount value={data.meta_title} max={60} optimal={[50, 60]} />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.meta_title}
                                            onChange={e => setData('meta_title', e.target.value)}
                                            className="input"
                                            placeholder="Título para SEO (50–60 caracteres)"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="label mb-0">Meta Description</label>
                                            <CharCount value={data.meta_description} max={160} optimal={[120, 160]} />
                                        </div>
                                        <textarea
                                            rows={3}
                                            value={data.meta_description}
                                            onChange={e => setData('meta_description', e.target.value)}
                                            className="input resize-none"
                                            placeholder="Descrição para mecanismos de busca (120–160 caracteres)"
                                        />
                                    </div>
                                </div>

                                {/* Google Preview */}
                                <div className="card p-5">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <GlobeAltIcon className="w-4 h-4 text-primary" />
                                        Preview no Google
                                    </h3>
                                    <GooglePreview
                                        title={data.meta_title}
                                        description={data.meta_description}
                                        slug={data.slug}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* ── Sidebar direita ─────────────────────────────────── */}
                    <div className="space-y-4">
                        {/* Status & visibilidade */}
                        <div className="card p-5 space-y-4">
                            <h3 className="font-semibold text-sm">Publicação</h3>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-white/70">Produto ativo</span>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_active', !data.is_active)}
                                        className={`relative w-10 h-5.5 rounded-full transition-colors ${data.is_active ? 'bg-primary' : 'bg-dark-300'}`}
                                    >
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                    </button>
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-white/70">Em destaque</span>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_featured', !data.is_featured)}
                                        className={`relative w-10 h-5.5 rounded-full transition-colors ${data.is_featured ? 'bg-primary' : 'bg-dark-300'}`}
                                    >
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                    </button>
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-white/70">Novo produto</span>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_new', !data.is_new)}
                                        className={`relative w-10 h-5.5 rounded-full transition-colors ${data.is_new ? 'bg-primary' : 'bg-dark-300'}`}
                                    >
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_new ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                    </button>
                                </label>
                            </div>
                        </div>

                        {/* Categoria e Marca */}
                        <div className="card p-5 space-y-3">
                            <h3 className="font-semibold text-sm">Organização</h3>
                            <div>
                                <label className="label">Categoria *</label>
                                <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className={`input ${errors.category_id ? 'input-error' : ''}`}>
                                    <option value="">Selecionar...</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="field-error">{errors.category_id}</p>}
                            </div>
                            <div>
                                <label className="label">Marca</label>
                                <select value={data.brand_id} onChange={e => setData('brand_id', e.target.value)} className="input">
                                    <option value="">Sem marca</option>
                                    {brands.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary w-full justify-center"
                            >
                                {processing
                                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <CheckIcon className="w-4 h-4" />
                                }
                                {processing ? 'Salvando...' : (isEdit ? 'Salvar alterações' : 'Criar produto')}
                            </button>
                            <Link href="/admin/produtos" className="btn-ghost w-full justify-center text-sm">
                                Cancelar
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
