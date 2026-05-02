import { useState, useCallback } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@layouts/AdminLayout';
import {
    CheckIcon, PhotoIcon, EyeIcon, EyeSlashIcon,
    GlobeAltIcon, PhoneIcon, EnvelopeIcon,
    TruckIcon, CreditCardIcon, BuildingOfficeIcon,
    ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

/* ─── Tabs ────────────────────────────────────────────────────────────── */
const TABS = [
    { key: 'store',    label: 'Loja',       icon: BuildingOfficeIcon },
    { key: 'social',   label: 'Redes Sociais', icon: GlobeAltIcon },
    { key: 'shipping', label: 'Frete',       icon: TruckIcon },
    { key: 'payment',  label: 'Pagamentos',  icon: CreditCardIcon },
    { key: 'email',    label: 'E-mails',     icon: EnvelopeIcon },
];

/* ─── Logo/Favicon Dropzone ──────────────────────────────────────────── */
function AssetDropzone({ label, current, onDrop, aspect = 'aspect-video' }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.ico'] },
        multiple: false,
        onDrop: (files) => onDrop(files[0]),
    });

    return (
        <div>
            <p className="label mb-2">{label}</p>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${aspect} flex items-center justify-center ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-white/15 hover:border-white/30'
                }`}
            >
                <input {...getInputProps()} />
                {current ? (
                    <img src={current} alt={label} className="max-h-24 max-w-full object-contain" />
                ) : (
                    <div>
                        <PhotoIcon className="w-8 h-8 text-white/20 mx-auto mb-2" />
                        <p className="text-xs text-white/40">Arraste ou clique</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Password field ─────────────────────────────────────────────────── */
function PasswordField({ label, value, onChange, placeholder }) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label className="label">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder ?? '••••••••••••••••'}
                    className="input pr-10 font-mono text-sm"
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                    {show ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}

/* ─── Toggle switch ──────────────────────────────────────────────────── */
function Toggle({ value, onChange, label }) {
    return (
        <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-white/70">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!value)}
                className={`relative w-10 h-5.5 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-dark-300'}`}
            >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
        </label>
    );
}

/* ─── Section card ───────────────────────────────────────────────────── */
function Section({ title, children }) {
    return (
        <div className="card p-5 space-y-4">
            {title && <h3 className="font-semibold text-sm border-b border-white/[0.06] pb-3">{title}</h3>}
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function AdminSettings({ settings = {}, stats = {} }) {
    const [activeTab, setActiveTab] = useState('store');
    const [saved, setSaved]         = useState(false);

    const { data, setData, post, processing } = useForm({
        // Loja
        store_name:          settings.store_name ?? 'ERAS Streetwear',
        store_email:         settings.store_email ?? '',
        store_phone:         settings.store_phone ?? '',
        store_cnpj:          settings.store_cnpj  ?? '',
        store_address:       settings.store_address ?? '',
        // Redes sociais
        social_instagram:    settings.social_instagram ?? '',
        social_facebook:     settings.social_facebook  ?? '',
        social_twitter:      settings.social_twitter   ?? '',
        social_tiktok:       settings.social_tiktok    ?? '',
        social_youtube:      settings.social_youtube   ?? '',
        social_whatsapp:     settings.social_whatsapp  ?? '',
        // Frete
        free_shipping_above: settings.free_shipping_above ?? 299,
        disable_free_shipping: settings.disable_free_shipping ?? false,
        // Pagamentos
        stripe_key:          settings.stripe_key ?? '',
        stripe_secret:       settings.stripe_secret ?? '',
        pagarme_api_key:     settings.pagarme_api_key ?? '',
        pix_key:             settings.pix_key ?? '',
        pix_key_type:        settings.pix_key_type ?? 'cpf',
        payment_credit_card: settings.payment_credit_card ?? true,
        payment_pix:         settings.payment_pix ?? true,
        payment_boleto:      settings.payment_boleto ?? true,
        // Emails
        email_header:        settings.email_header ?? '',
        email_footer:        settings.email_footer ?? '',
        email_from_name:     settings.email_from_name ?? '',
        email_from_address:  settings.email_from_address ?? '',
        // Logos
        logo_url:            settings.logo_url ?? null,
        favicon_url:         settings.favicon_url ?? null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/configuracoes', {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            },
        });
    };

    const maskCnpj = (v) => v.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, '$1.$2.$3/$4-$5').slice(0, 18);
    const maskPhone = (v) => v.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d)/, '($1) $2-$3').slice(0, 15);

    return (
        <AdminLayout
            title="Configurações"
            breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Configurações' }]}
            stats={stats}
        >
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-xl font-bold text-white">Configurações da Loja</h1>
                <AnimatePresence>
                    {saved && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/15 border border-green-500/25 text-green-400 text-sm"
                        >
                            <CheckIcon className="w-4 h-4" />
                            Salvo!
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Sidebar de tabs */}
                    <div className="xl:col-span-1">
                        <div className="card overflow-hidden">
                            {TABS.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-l-2 text-left ${
                                            activeTab === tab.key
                                                ? 'border-primary text-primary bg-primary/10'
                                                : 'border-transparent text-white/50 hover:text-white hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="xl:col-span-3 space-y-5">
                        <AnimatePresence mode="wait">

                            {/* ── LOJA ──────────────────────────────────────── */}
                            {activeTab === 'store' && (
                                <motion.div key="store" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                                    <Section title="Identidade Visual">
                                        <div className="grid grid-cols-2 gap-4">
                                            <AssetDropzone
                                                label="Logo"
                                                current={data.logo_url}
                                                onDrop={file => setData('logo_url', URL.createObjectURL(file))}
                                                aspect="aspect-[3/1]"
                                            />
                                            <AssetDropzone
                                                label="Favicon"
                                                current={data.favicon_url}
                                                onDrop={file => setData('favicon_url', URL.createObjectURL(file))}
                                                aspect="aspect-square"
                                            />
                                        </div>
                                    </Section>

                                    <Section title="Dados da Loja">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="label">Nome da loja *</label>
                                                <input type="text" value={data.store_name} onChange={e => setData('store_name', e.target.value)} className="input" />
                                            </div>
                                            <div>
                                                <label className="label">E-mail de contato</label>
                                                <div className="relative">
                                                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <input type="email" value={data.store_email} onChange={e => setData('store_email', e.target.value)} className="input pl-9" placeholder="contato@loja.com.br" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="label">Telefone</label>
                                                <div className="relative">
                                                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <input type="text" value={data.store_phone} onChange={e => setData('store_phone', maskPhone(e.target.value))} className="input pl-9" placeholder="(11) 99999-9999" maxLength={15} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="label">CNPJ</label>
                                                <input type="text" value={data.store_cnpj} onChange={e => setData('store_cnpj', maskCnpj(e.target.value))} className="input font-mono" placeholder="00.000.000/0000-00" maxLength={18} />
                                            </div>
                                            <div>
                                                <label className="label">Endereço completo</label>
                                                <input type="text" value={data.store_address} onChange={e => setData('store_address', e.target.value)} className="input" placeholder="Rua, Cidade, Estado" />
                                            </div>
                                        </div>
                                    </Section>
                                </motion.div>
                            )}

                            {/* ── REDES SOCIAIS ─────────────────────────────── */}
                            {activeTab === 'social' && (
                                <motion.div key="social" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    <Section title="Redes Sociais">
                                        <div className="space-y-3">
                                            {[
                                                { key: 'social_instagram', label: 'Instagram', placeholder: '@erasstreetwear' },
                                                { key: 'social_facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/...' },
                                                { key: 'social_twitter',   label: 'X / Twitter', placeholder: '@erasstreetwear' },
                                                { key: 'social_tiktok',    label: 'TikTok',    placeholder: '@erasstreetwear' },
                                                { key: 'social_youtube',   label: 'YouTube',   placeholder: 'https://youtube.com/...' },
                                                { key: 'social_whatsapp',  label: 'WhatsApp',  placeholder: '5511999999999' },
                                            ].map(({ key, label, placeholder }) => (
                                                <div key={key}>
                                                    <label className="label">{label}</label>
                                                    <div className="relative">
                                                        <GlobeAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                        <input
                                                            type="text"
                                                            value={data[key]}
                                                            onChange={e => setData(key, e.target.value)}
                                                            className="input pl-9"
                                                            placeholder={placeholder}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                </motion.div>
                            )}

                            {/* ── FRETE ─────────────────────────────────────── */}
                            {activeTab === 'shipping' && (
                                <motion.div key="shipping" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    <Section title="Regras de Frete">
                                        <div>
                                            <label className="label">Valor mínimo para frete grátis (R$)</label>
                                            <div className="relative w-48">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">R$</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={data.free_shipping_above}
                                                    onChange={e => setData('free_shipping_above', +e.target.value)}
                                                    className="input pl-9"
                                                />
                                            </div>
                                            <p className="text-xs text-white/40 mt-1">
                                                Compras acima de R$ {Number(data.free_shipping_above).toFixed(2)} terão frete grátis automático.
                                            </p>
                                        </div>
                                        <Toggle
                                            label="Desabilitar frete grátis"
                                            value={data.disable_free_shipping}
                                            onChange={v => setData('disable_free_shipping', v)}
                                        />
                                    </Section>
                                </motion.div>
                            )}

                            {/* ── PAGAMENTOS ────────────────────────────────── */}
                            {activeTab === 'payment' && (
                                <motion.div key="payment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                                    <Section title="Métodos habilitados">
                                        <div className="space-y-3">
                                            <Toggle label="Cartão de crédito" value={data.payment_credit_card} onChange={v => setData('payment_credit_card', v)} />
                                            <Toggle label="Pix" value={data.payment_pix} onChange={v => setData('payment_pix', v)} />
                                            <Toggle label="Boleto bancário" value={data.payment_boleto} onChange={v => setData('payment_boleto', v)} />
                                        </div>
                                    </Section>

                                    <Section title="Stripe">
                                        <PasswordField label="Publishable Key" value={data.stripe_key} onChange={v => setData('stripe_key', v)} placeholder="pk_live_..." />
                                        <PasswordField label="Secret Key" value={data.stripe_secret} onChange={v => setData('stripe_secret', v)} placeholder="sk_live_..." />
                                    </Section>

                                    <Section title="Pagar.me">
                                        <PasswordField label="API Key" value={data.pagarme_api_key} onChange={v => setData('pagarme_api_key', v)} placeholder="ak_live_..." />
                                    </Section>

                                    <Section title="Pix">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="label">Tipo de chave</label>
                                                <select value={data.pix_key_type} onChange={e => setData('pix_key_type', e.target.value)} className="input">
                                                    <option value="cpf">CPF</option>
                                                    <option value="cnpj">CNPJ</option>
                                                    <option value="email">E-mail</option>
                                                    <option value="phone">Telefone</option>
                                                    <option value="random">Aleatória</option>
                                                </select>
                                            </div>
                                            <div>
                                                <PasswordField label="Chave Pix" value={data.pix_key} onChange={v => setData('pix_key', v)} placeholder="Sua chave pix" />
                                            </div>
                                        </div>
                                    </Section>
                                </motion.div>
                            )}

                            {/* ── EMAILS ────────────────────────────────────── */}
                            {activeTab === 'email' && (
                                <motion.div key="email" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                                    <Section title="Identidade do remetente">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="label">Nome do remetente</label>
                                                <input type="text" value={data.email_from_name} onChange={e => setData('email_from_name', e.target.value)} className="input" placeholder="ERAS Streetwear" />
                                            </div>
                                            <div>
                                                <label className="label">E-mail remetente</label>
                                                <input type="email" value={data.email_from_address} onChange={e => setData('email_from_address', e.target.value)} className="input" placeholder="noreply@eras.com.br" />
                                            </div>
                                        </div>
                                    </Section>

                                    <Section title="Textos dos e-mails transacionais">
                                        <div>
                                            <label className="label">Cabeçalho padrão</label>
                                            <textarea
                                                rows={4}
                                                value={data.email_header}
                                                onChange={e => setData('email_header', e.target.value)}
                                                className="input resize-none text-sm leading-relaxed"
                                                placeholder="Texto exibido no topo de todos os e-mails enviados pela loja..."
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Rodapé padrão</label>
                                            <textarea
                                                rows={4}
                                                value={data.email_footer}
                                                onChange={e => setData('email_footer', e.target.value)}
                                                className="input resize-none text-sm leading-relaxed"
                                                placeholder="Informações legais, endereço, links de descadastramento..."
                                            />
                                        </div>
                                        <div className="p-3 rounded-xl bg-dark-200 border border-white/[0.06] text-xs text-white/40">
                                            <p className="font-medium text-white/60 mb-1">Variáveis disponíveis:</p>
                                            <p><code className="text-primary">{'{{customer_name}}'}</code> — Nome do cliente</p>
                                            <p><code className="text-primary">{'{{order_number}}'}</code> — Número do pedido</p>
                                            <p><code className="text-primary">{'{{store_name}}'}</code> — Nome da loja</p>
                                        </div>
                                    </Section>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Save button */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary px-8"
                            >
                                {processing ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <CheckIcon className="w-4 h-4" />
                                )}
                                {processing ? 'Salvando...' : 'SALVAR'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
