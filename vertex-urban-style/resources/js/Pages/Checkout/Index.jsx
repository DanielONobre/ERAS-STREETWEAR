import { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import StoreLayout from '@layouts/StoreLayout';
import AddressForm from '@components/UI/AddressForm';
import { fmt } from '@lib/utils';
import {
    CheckCircleIcon, MapPinIcon, CreditCardIcon,
    TruckIcon, LockClosedIcon, QrCodeIcon,
    DocumentTextIcon, ClipboardDocumentIcon,
    CheckIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline';

/* ─── Steps ──────────────────────────────────────────────────────────── */
const STEPS = [
    { label: 'Identificação', icon: MapPinIcon },
    { label: 'Entrega',       icon: TruckIcon },
    { label: 'Pagamento',     icon: CreditCardIcon },
];

const SHIPPING_METHODS = [
    { id: 'pac',   label: 'PAC',   sub: '5–8 dias úteis',  cost: 19.9  },
    { id: 'sedex', label: 'SEDEX', sub: '1–3 dias úteis',  cost: 34.9  },
];

/* ─── Card brand detection ──────────────────────────────────────────── */
const CARD_BRANDS = [
    { name: 'Visa',       regex: /^4/, color: '#1a1f71' },
    { name: 'Mastercard', regex: /^5[1-5]|^2[2-7]/, color: '#eb001b' },
    { name: 'Amex',       regex: /^3[47]/, color: '#2e77bc' },
    { name: 'Elo',        regex: /^6(?:36368|04175|37599)/, color: '#ffcc00' },
];

const detectBrand = (num) => {
    const n = num.replace(/\D/g, '');
    return CARD_BRANDS.find(b => b.regex.test(n))?.name ?? null;
};

/* ─── Masks ──────────────────────────────────────────────────────────── */
const maskCard    = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
const maskExpiry  = (v) => v.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);
const maskCpf     = (v) => v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4').slice(0, 14);
const maskCep     = (v) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

/* ─── PIX countdown ─────────────────────────────────────────────────── */
function PixCountdown({ expiresAt }) {
    const calc = () => {
        const diff = new Date(expiresAt) - Date.now();
        if (diff <= 0) return '00:00';
        const m = String(Math.floor(diff / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        return `${m}:${s}`;
    };
    const [display, setDisplay] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setDisplay(calc()), 1000);
        return () => clearInterval(id);
    }, [expiresAt]);
    return <span className="font-mono text-amber-400">{display}</span>;
}

/* ─── Pix mock data ─────────────────────────────────────────────────── */
const PIX_CODE = 'VERTEX00010126BRBRCUPBR01041234567890123456789012345678901234';
const PIX_EXPIRES = new Date(Date.now() + 30 * 60 * 1000).toISOString();

/* ─── Boleto mock ────────────────────────────────────────────────────── */
const BOLETO_LINE = '00190.00009 01234.567890 12345.678901 1 00000000019900';

/* ═══════════════════════════════════════════════════════════════════════ */
export default function CheckoutIndex({ cart, pricing, addresses = [] }) {
    const { auth } = usePage().props;
    const isLogged = !!auth?.user;

    const [step,          setStep]    = useState(0);
    const [authTab,       setAuthTab] = useState('login');   // 'login' | 'guest'
    const [selectedAddr,  setAddr]    = useState(addresses[0]?.id ?? null);
    const [showNewAddr,   setNewAddr] = useState(addresses.length === 0);
    const [shipping,      setShip]    = useState('pac');
    const [payment,       setPay]     = useState('pix');
    const [loading,       setLoading] = useState(false);
    const [error,         setError]   = useState(null);
    const [pixCopied,     setPixCopied] = useState(false);
    const [boletoCopied,  setBoletoCopied] = useState(false);

    // Card state
    const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const brand = detectBrand(card.number);

    // Login / guest forms
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [guestForm, setGuestForm] = useState({ name: '', email: '', cpf: '' });

    const shippingCost  = SHIPPING_METHODS.find(m => m.id === shipping)?.cost ?? 0;
    const freeShipping  = (cart?.subtotal ?? 0) >= 299;
    const finalShipping = freeShipping ? 0 : shippingCost;
    const discount      = pricing?.discount ?? 0;
    const subtotal      = pricing?.subtotal ?? cart?.subtotal ?? 0;
    const total         = subtotal - discount + finalShipping;

    /* ── Step 1: save address ───────────────────────────────────────────── */
    const handleAddressNext = async (formData) => {
        setError(null);
        setLoading(true);
        try {
            const payload = showNewAddr ? formData : { address_id: selectedAddr };
            const res = await axios.post(route('checkout.address'), payload);
            setAddr(res.data.address?.id ?? selectedAddr);
            setStep(1);
        } catch (e) {
            setError(e.response?.data?.message ?? 'Erro ao salvar endereço.');
        } finally {
            setLoading(false);
        }
    };

    /* ── Step 3: place order ─────────────────────────────────────────────── */
    const handlePlaceOrder = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await axios.post(route('checkout.payment'), {
                address_id:      selectedAddr,
                payment_method:  payment,
                shipping_method: shipping,
                shipping_cost:   finalShipping,
                card_data:       payment === 'credit_card' ? card : undefined,
            });
            if (res.data.success) {
                router.visit(res.data.redirect);
            } else {
                setError(res.data.message ?? 'Erro no pagamento.');
            }
        } catch (e) {
            setError(e.response?.data?.message ?? 'Erro ao processar o pedido.');
        } finally {
            setLoading(false);
        }
    };

    /* ── Copy ─────────────────────────────────────────────────────────────── */
    const copyPix = async () => {
        await navigator.clipboard.writeText(PIX_CODE);
        setPixCopied(true);
        setTimeout(() => setPixCopied(false), 2000);
    };
    const copyBoleto = async () => {
        await navigator.clipboard.writeText(BOLETO_LINE);
        setBoletoCopied(true);
        setTimeout(() => setBoletoCopied(false), 2000);
    };

    return (
        <StoreLayout>
            <Head>
                <title>Checkout — Vertex Urban Style</title>
                <meta name="description" content="Finalize sua compra de forma segura na Vertex Urban Style." />
            </Head>

            <div className="container-page py-8 lg:py-12 max-w-5xl">
                <Link
                    href={route('cart.index')}
                    className="text-sm text-white/40 hover:text-white mb-8 inline-flex items-center gap-1 transition-colors"
                >
                    ← Voltar ao carrinho
                </Link>

                {/* Stepper */}
                <div className="flex items-center gap-2 mb-10">
                    {STEPS.map(({ label, icon: Icon }, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                                i < step  ? 'bg-primary/20 text-primary cursor-pointer' :
                                i === step ? 'bg-primary text-white' :
                                             'bg-dark-100 text-white/30'
                            }`}
                                onClick={() => i < step && setStep(i)}
                            >
                                {i < step
                                    ? <CheckCircleIcon className="w-4 h-4" />
                                    : <Icon className="w-4 h-4" />
                                }
                                <span className="hidden sm:inline">{label}</span>
                                <span className="sm:hidden">{i + 1}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`h-px flex-1 w-6 sm:w-12 ${i < step ? 'bg-primary' : 'bg-white/10'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── Left: steps ──────────────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-4">
                        {error && (
                            <div className="card p-4 bg-red-500/10 border-red-500/25 text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <AnimatePresence mode="wait">

                            {/* ── ETAPA 0 — Identificação & Endereço ───────────── */}
                            {step === 0 && (
                                <motion.div
                                    key="step0"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    {/* Tabs login / guest (apenas se não logado) */}
                                    {!isLogged && (
                                        <div className="card p-6">
                                            <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-5">
                                                Identificação
                                            </h2>
                                            <div className="flex gap-1 p-1 bg-dark-100 rounded-xl mb-5">
                                                {[
                                                    { key: 'login', label: 'Já tenho conta' },
                                                    { key: 'guest', label: 'Comprar sem cadastro' },
                                                ].map(tab => (
                                                    <button
                                                        key={tab.key}
                                                        onClick={() => setAuthTab(tab.key)}
                                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                                            authTab === tab.key
                                                                ? 'bg-primary text-white'
                                                                : 'text-white/50 hover:text-white'
                                                        }`}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </div>

                                            {authTab === 'login' ? (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="label mb-1" htmlFor="checkout-email">E-mail</label>
                                                        <input
                                                            id="checkout-email"
                                                            type="email"
                                                            value={loginForm.email}
                                                            onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                                                            className="input w-full"
                                                            placeholder="seu@email.com"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="label mb-1" htmlFor="checkout-pass">Senha</label>
                                                        <input
                                                            id="checkout-pass"
                                                            type="password"
                                                            value={loginForm.password}
                                                            onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                                                            className="input w-full"
                                                            placeholder="••••••••"
                                                        />
                                                    </div>
                                                    <button className="btn-primary w-full justify-center">
                                                        Entrar e continuar
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="label mb-1" htmlFor="guest-name">Nome completo</label>
                                                        <input id="guest-name" type="text" className="input w-full" placeholder="Seu nome" value={guestForm.name} onChange={e => setGuestForm(f => ({...f, name: e.target.value}))} />
                                                    </div>
                                                    <div>
                                                        <label className="label mb-1" htmlFor="guest-email">E-mail</label>
                                                        <input id="guest-email" type="email" className="input w-full" placeholder="seu@email.com" value={guestForm.email} onChange={e => setGuestForm(f => ({...f, email: e.target.value}))} />
                                                    </div>
                                                    <div>
                                                        <label className="label mb-1" htmlFor="guest-cpf">CPF</label>
                                                        <input id="guest-cpf" type="text" className="input w-full" placeholder="000.000.000-00" value={guestForm.cpf} onChange={e => setGuestForm(f => ({...f, cpf: maskCpf(e.target.value)}))} maxLength={14} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Endereço */}
                                    <div className="card p-6">
                                        <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-5">
                                            <MapPinIcon className="w-5 h-5 text-primary" />
                                            Endereço de entrega
                                        </h2>

                                        {addresses.length > 0 && (
                                            <div className="space-y-2 mb-4">
                                                {addresses.map((addr) => (
                                                    <label
                                                        key={addr.id}
                                                        className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                                                            selectedAddr === addr.id && !showNewAddr
                                                                ? 'border-primary/50 bg-primary/10'
                                                                : 'border-white/[0.08] hover:border-white/20'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="addr"
                                                            checked={selectedAddr === addr.id && !showNewAddr}
                                                            onChange={() => { setAddr(addr.id); setNewAddr(false); }}
                                                            className="mt-1 text-primary"
                                                        />
                                                        <div className="text-sm">
                                                            <p className="font-medium text-white">{addr.name}</p>
                                                            <p className="text-white/50">{addr.street}, {addr.number}{addr.complement ? `, ${addr.complement}` : ''}</p>
                                                            <p className="text-white/50">{addr.neighborhood} — {addr.city}/{addr.state} — CEP {addr.zip_code}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                                <button
                                                    onClick={() => { setNewAddr(true); setAddr(null); }}
                                                    className={`w-full p-4 rounded-2xl border border-dashed text-sm transition-all ${
                                                        showNewAddr
                                                            ? 'border-primary/50 text-primary'
                                                            : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'
                                                    }`}
                                                >
                                                    + Adicionar novo endereço
                                                </button>
                                            </div>
                                        )}

                                        {showNewAddr && (
                                            <AddressForm
                                                submitLabel="Confirmar endereço"
                                                loading={loading}
                                                onSubmit={handleAddressNext}
                                            />
                                        )}

                                        {!showNewAddr && selectedAddr && (
                                            <button
                                                onClick={() => handleAddressNext({})}
                                                disabled={loading}
                                                className="btn-primary w-full justify-center mt-4"
                                            >
                                                {loading
                                                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    : <>Continuar <ChevronRightIcon className="w-4 h-4" /></>
                                                }
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* ── ETAPA 1 — Frete ──────────────────────────────── */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="card p-6"
                                >
                                    <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-5">
                                        <TruckIcon className="w-5 h-5 text-primary" />
                                        Método de envio
                                    </h2>

                                    {freeShipping && (
                                        <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary">
                                            <CheckIcon className="w-4 h-4" />
                                            Frete grátis para compras acima de R$299!
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        {SHIPPING_METHODS.map((method) => (
                                            <label
                                                key={method.id}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                                                    shipping === method.id
                                                        ? 'border-primary/50 bg-primary/10'
                                                        : 'border-white/[0.08] hover:border-white/20'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="ship"
                                                    value={method.id}
                                                    checked={shipping === method.id}
                                                    onChange={() => setShip(method.id)}
                                                    className="text-primary"
                                                />
                                                <TruckIcon className="w-5 h-5 text-primary/60 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-white text-sm">{method.label}</p>
                                                    <p className="text-xs text-white/40">{method.sub}</p>
                                                </div>
                                                <span className={`text-sm font-semibold ${freeShipping ? 'text-primary' : 'text-white'}`}>
                                                    {freeShipping ? 'Grátis' : fmt(method.cost)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button onClick={() => setStep(0)} className="btn-ghost flex-1">← Voltar</button>
                                        <button onClick={() => setStep(2)} className="btn-primary flex-1 justify-center">
                                            Continuar <ChevronRightIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── ETAPA 2 — Pagamento ──────────────────────────── */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="card p-6"
                                >
                                    <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-5">
                                        <CreditCardIcon className="w-5 h-5 text-primary" />
                                        Forma de pagamento
                                    </h2>

                                    {/* Tabs de método */}
                                    <div className="flex gap-1 p-1 bg-dark-100 rounded-xl mb-6">
                                        {[
                                            { key: 'credit_card', label: 'Cartão' },
                                            { key: 'pix',         label: 'Pix'    },
                                            { key: 'boleto',      label: 'Boleto' },
                                        ].map(tab => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setPay(tab.key)}
                                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    payment === tab.key
                                                        ? 'bg-primary text-white'
                                                        : 'text-white/50 hover:text-white'
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Cartão */}
                                    {payment === 'credit_card' && (
                                        <div className="space-y-4">
                                            {/* Card visual */}
                                            <div className="relative h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-dark-200 to-dark-400 border border-white/10 p-5 mb-2">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <span className="text-xs text-white/40 uppercase tracking-widest">Vertex Card</span>
                                                        {brand && <span className="text-sm font-semibold text-white">{brand}</span>}
                                                    </div>
                                                    <p className="font-mono text-lg text-white tracking-widest">
                                                        {card.number || '•••• •••• •••• ••••'}
                                                    </p>
                                                    <div className="flex justify-between mt-3">
                                                        <p className="text-xs text-white/50">{card.name || 'NOME NO CARTÃO'}</p>
                                                        <p className="text-xs text-white/50">{card.expiry || 'MM/AA'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="label mb-1" htmlFor="card-number">Número do cartão</label>
                                                <div className="relative">
                                                    <input
                                                        id="card-number"
                                                        type="text"
                                                        value={card.number}
                                                        onChange={e => setCard(c => ({ ...c, number: maskCard(e.target.value) }))}
                                                        placeholder="0000 0000 0000 0000"
                                                        maxLength={19}
                                                        className="input w-full font-mono pr-16"
                                                    />
                                                    {brand && (
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50">
                                                            {brand}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="label mb-1" htmlFor="card-name">Nome no cartão</label>
                                                <input
                                                    id="card-name"
                                                    type="text"
                                                    value={card.name}
                                                    onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                                                    placeholder="NOME COMO NO CARTÃO"
                                                    className="input w-full uppercase"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="label mb-1" htmlFor="card-expiry">Validade</label>
                                                    <input
                                                        id="card-expiry"
                                                        type="text"
                                                        value={card.expiry}
                                                        onChange={e => setCard(c => ({ ...c, expiry: maskExpiry(e.target.value) }))}
                                                        placeholder="MM/AA"
                                                        maxLength={5}
                                                        className="input w-full font-mono"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="label mb-1" htmlFor="card-cvv">CVV</label>
                                                    <input
                                                        id="card-cvv"
                                                        type="text"
                                                        value={card.cvv}
                                                        onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                                                        placeholder="•••"
                                                        maxLength={4}
                                                        className="input w-full font-mono"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="label mb-1">Parcelas</label>
                                                <select className="input w-full">
                                                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                                                        <option key={n} value={n}>
                                                            {n}× de {fmt(total / n)}{n === 1 ? ' à vista' : ' sem juros'}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {/* Pix */}
                                    {payment === 'pix' && (
                                        <div className="text-center space-y-5">
                                            <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                                                <QrCodeIcon className="w-4 h-4" />
                                                QR Code válido por <PixCountdown expiresAt={PIX_EXPIRES} />
                                            </div>

                                            {/* QR Code SVG simulado */}
                                            <div className="inline-block p-4 bg-white rounded-2xl">
                                                <svg width="160" height="160" viewBox="0 0 160 160" className="block">
                                                    {/* Simplified QR code pattern */}
                                                    <rect width="160" height="160" fill="white"/>
                                                    <g fill="#111">
                                                        {/* Corner squares */}
                                                        <rect x="10" y="10" width="40" height="40"/>
                                                        <rect x="14" y="14" width="32" height="32" fill="white"/>
                                                        <rect x="18" y="18" width="24" height="24"/>
                                                        <rect x="110" y="10" width="40" height="40"/>
                                                        <rect x="114" y="14" width="32" height="32" fill="white"/>
                                                        <rect x="118" y="18" width="24" height="24"/>
                                                        <rect x="10" y="110" width="40" height="40"/>
                                                        <rect x="14" y="114" width="32" height="32" fill="white"/>
                                                        <rect x="18" y="118" width="24" height="24"/>
                                                        {/* Data dots */}
                                                        {[60,70,80,90,100].map(x => [60,70,80,90,100].map(y => (
                                                            Math.random() > 0.5
                                                                ? <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8"/>
                                                                : null
                                                        )))}
                                                        <rect x="60" y="60" width="8" height="8"/>
                                                        <rect x="76" y="60" width="8" height="8"/>
                                                        <rect x="60" y="76" width="8" height="8"/>
                                                        <rect x="92" y="60" width="8" height="8"/>
                                                        <rect x="68" y="68" width="8" height="8"/>
                                                        <rect x="84" y="68" width="8" height="8"/>
                                                        <rect x="76" y="84" width="8" height="8"/>
                                                        <rect x="92" y="92" width="8" height="8"/>
                                                        <rect x="60" y="92" width="8" height="8"/>
                                                        <rect x="84" y="92" width="8" height="8"/>
                                                        <rect x="60" y="108" width="8" height="8"/>
                                                        <rect x="68" y="100" width="8" height="8"/>
                                                        <rect x="92" y="76" width="8" height="8"/>
                                                    </g>
                                                </svg>
                                            </div>

                                            <p className="text-sm text-white/50">
                                                Aponte a câmera para pagar <strong className="text-white">{fmt(total)}</strong> via Pix
                                            </p>

                                            {/* Código copia-e-cola */}
                                            <div className="bg-dark-100 border border-white/[0.08] rounded-xl p-3">
                                                <p className="text-xs text-white/40 mb-2">Código Pix (copia e cola)</p>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-xs text-white/60 flex-1 truncate font-mono">
                                                        {PIX_CODE}
                                                    </code>
                                                    <button
                                                        onClick={copyPix}
                                                        className="flex-shrink-0 flex items-center gap-1 text-xs text-primary hover:text-primary-400 transition-colors"
                                                    >
                                                        {pixCopied
                                                            ? <><CheckIcon className="w-3.5 h-3.5" />Copiado!</>
                                                            : <><ClipboardDocumentIcon className="w-3.5 h-3.5" />Copiar</>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Boleto */}
                                    {payment === 'boleto' && (
                                        <div className="space-y-5">
                                            <div className="card p-5 text-center space-y-3 bg-dark-100">
                                                <DocumentTextIcon className="w-12 h-12 text-white/30 mx-auto" />
                                                <p className="font-medium">Boleto Bancário</p>
                                                <p className="text-sm text-white/50">
                                                    Vencimento em <strong className="text-white">3 dias úteis</strong>.<br />
                                                    Aprovação em até 2 dias úteis após o pagamento.
                                                </p>
                                            </div>

                                            <div className="bg-dark-100 border border-white/[0.08] rounded-xl p-4">
                                                <p className="text-xs text-white/40 mb-2">Linha digitável</p>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-xs text-white/70 flex-1 font-mono break-all leading-relaxed">
                                                        {BOLETO_LINE}
                                                    </code>
                                                    <button
                                                        onClick={copyBoleto}
                                                        className="flex-shrink-0 flex items-center gap-1 text-xs text-primary hover:text-primary-400 transition-colors"
                                                    >
                                                        {boletoCopied
                                                            ? <><CheckIcon className="w-3.5 h-3.5" />Copiado!</>
                                                            : <><ClipboardDocumentIcon className="w-3.5 h-3.5" />Copiar</>
                                                        }
                                                    </button>
                                                </div>
                                            </div>

                                            <a
                                                href="#"
                                                className="btn-outline w-full justify-center text-sm"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                <DocumentTextIcon className="w-4 h-4" />
                                                Download do boleto (PDF)
                                            </a>
                                        </div>
                                    )}

                                    {/* Resumo final */}
                                    <div className="mt-6 pt-5 border-t border-white/[0.06] space-y-2 text-sm">
                                        <div className="flex justify-between text-white/50">
                                            <span>Subtotal</span><span>{fmt(subtotal)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between text-green-400">
                                                <span>Desconto</span><span>-{fmt(discount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-white/50">
                                            <span>Frete</span>
                                            <span className={freeShipping ? 'text-primary' : ''}>
                                                {freeShipping ? 'Grátis' : fmt(finalShipping)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-white/[0.06]">
                                            <span>Total</span><span>{fmt(total)}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button onClick={() => setStep(1)} className="btn-ghost flex-1">← Voltar</button>
                                        <button
                                            id="btn-place-order"
                                            onClick={handlePlaceOrder}
                                            disabled={loading}
                                            className="btn-primary flex-1 justify-center"
                                        >
                                            {loading
                                                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                : <><LockClosedIcon className="w-4 h-4" /> Finalizar pedido</>
                                            }
                                        </button>
                                    </div>

                                    <p className="flex items-center justify-center gap-1 text-xs text-white/30 mt-4">
                                        <LockClosedIcon className="w-3 h-3" />
                                        Pagamento 100% seguro e criptografado
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Right: order summary ─────────────────────────────────── */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24 space-y-4">
                            <h2 className="font-display font-semibold">Seu pedido</h2>

                            <ul className="space-y-3 max-h-56 overflow-y-auto no-scrollbar">
                                {cart?.items?.map((item) => (
                                    <li key={item.id} className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-dark-200 overflow-hidden flex-shrink-0">
                                            {(item.product.cover_image_url ?? item.product.primary_image) && (
                                                <img
                                                    src={item.product.cover_image_url ?? `/storage/${item.product.primary_image}`}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-white/70 truncate">{item.product.name}</p>
                                            {item.variant && <p className="text-xs text-white/30">{item.variant}</p>}
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xs text-white/50">{item.quantity}×</p>
                                            <p className="text-xs font-semibold text-white">{fmt(item.unit_price)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="divider" />

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-white/50">
                                    <span>Subtotal</span><span>{fmt(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Desconto</span><span>-{fmt(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-white/50">
                                    <span>Frete</span>
                                    <span className={freeShipping ? 'text-primary' : ''}>
                                        {step === 0 ? 'A calcular' : freeShipping ? 'Grátis' : fmt(finalShipping)}
                                    </span>
                                </div>
                            </div>

                            <div className="divider" />
                            <div className="flex justify-between font-semibold text-xl">
                                <span>Total</span><span>{fmt(step > 0 ? total : subtotal - discount)}</span>
                            </div>

                            <p className="text-xs text-white/30 flex items-center gap-1">
                                <LockClosedIcon className="w-3 h-3" />
                                Compra segura — SSL
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
