import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StoreLayout from '@layouts/StoreLayout';
import { ShoppingBagIcon, TruckIcon, EnvelopeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { fmt } from '@lib/utils';

/* ─── SVG Checkmark animation ────────────────────────────────────────── */
function AnimatedCheck() {
    return (
        <div className="relative w-24 h-24 mx-auto">
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping [animation-duration:2s]" />
            <div className="absolute inset-2 rounded-full bg-primary/10 animate-ping [animation-duration:2.5s] [animation-delay:0.3s]" />

            {/* Circle + check */}
            <svg
                viewBox="0 0 100 100"
                className="relative z-10 w-24 h-24"
                style={{ filter: 'drop-shadow(0 0 20px rgba(13,148,136,0.5))' }}
            >
                {/* Circle */}
                <circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke="rgba(13,148,136,0.2)"
                    strokeWidth="3"
                />
                <motion.circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="277"
                    initial={{ strokeDashoffset: 277 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ transformOrigin: 'center', rotate: '-90deg' }}
                />
                {/* Check */}
                <motion.path
                    d="M 30 50 L 44 64 L 70 38"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="60"
                    initial={{ strokeDashoffset: 60 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
                />
            </svg>
        </div>
    );
}

/* ─── Status map ─────────────────────────────────────────────────────── */
const STATUS_MAP = {
    pending:   { label: 'Aguardando pagamento', color: 'text-amber-400',  bg: 'bg-amber-400/10 border-amber-400/20' },
    confirmed: { label: 'Confirmado',           color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/20'  },
    paid:      { label: 'Pago',                 color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/20'  },
};

/* ─── Next steps ─────────────────────────────────────────────────────── */
const NEXT_STEPS = [
    {
        icon: EnvelopeIcon,
        title: 'E-mail de confirmação',
        desc: 'Você receberá um e-mail com os detalhes do pedido em até 5 minutos.',
    },
    {
        icon: TruckIcon,
        title: 'Preparação & despacho',
        desc: 'Seu pedido será preparado e despachado em até 2 dias úteis.',
    },
    {
        icon: ChatBubbleLeftRightIcon,
        title: 'Acompanhe seu pedido',
        desc: 'Enviaremos o código de rastreio por e-mail assim que seu pedido sair.',
    },
];

/* ═══════════════════════════════════════════════════════════════════════ */
export default function CheckoutSuccess({ order }) {
    const status = STATUS_MAP[order.payment_status] ?? STATUS_MAP.pending;

    return (
        <StoreLayout>
            <Head>
                <title>Pedido #{order.id} confirmado — ERAS Streetwear</title>
                <meta name="description" content={`Seu pedido #${order.id} foi realizado com sucesso na ERAS Streetwear.`} />
            </Head>

            <div className="container-page py-16 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 22, stiffness: 200 }}
                >
                    {/* Checkmark */}
                    <div className="text-center mb-8">
                        <AnimatedCheck />
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="font-display text-3xl font-bold mt-6 mb-2"
                        >
                            Pedido realizado!
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1 }}
                            className="text-white/50"
                        >
                            Obrigado pela sua compra.{' '}
                            {order.payment_status === 'paid' || order.payment_status === 'confirmed'
                                ? 'Seu pagamento foi confirmado.'
                                : 'Seu pedido foi criado e aguarda confirmação de pagamento.'
                            }
                        </motion.p>
                    </div>

                    {/* Order summary card */}
                    <div className="card p-6 mb-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-display font-semibold">Resumo do pedido</h2>
                            <span className="font-mono text-white/40 text-sm">#{order.id}</span>
                        </div>

                        {/* Items */}
                        {order.items?.length > 0 && (
                            <ul className="space-y-3 mb-5">
                                {order.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        {item.product?.cover_image_url && (
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-dark-100 flex-shrink-0">
                                                <img
                                                    src={item.product.cover_image_url}
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.product?.name ?? item.name}</p>
                                            {item.variant?.label && (
                                                <p className="text-xs text-white/40">{item.variant.label}</p>
                                            )}
                                            <p className="text-xs text-white/40">Qtd: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-white flex-shrink-0">
                                            {fmt(item.line_total ?? item.unit_price * item.quantity)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="divider" />

                        {/* Details */}
                        <dl className="space-y-2 mt-4">
                            {[
                                { label: 'Data', value: new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) },
                                { label: 'Status', value: <span className={status.color}>{status.label}</span> },
                                { label: 'Total', value: <span className="font-semibold text-white">{order.formatted_total}</span> },
                                ...(order.address ? [{ label: 'Entrega', value: order.address }] : []),
                                ...(order.shipping_label ? [{ label: 'Envio', value: order.shipping_label }] : []),
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between text-sm">
                                    <dt className="text-white/50">{label}</dt>
                                    <dd className="text-right max-w-[60%]">{value}</dd>
                                </div>
                            ))}
                        </dl>

                        {/* Pix / Boleto notice */}
                        {order.payment_status === 'pending' && (
                            <div className={`mt-5 p-4 rounded-2xl border text-sm ${status.bg}`}>
                                <p className="font-medium mb-1 text-amber-300">Pagamento pendente</p>
                                <p className="text-amber-400/70">
                                    Seu pedido será confirmado assim que o pagamento for aprovado. Isso pode levar até 2 dias úteis para boleto.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Próximos passos */}
                    <div className="card p-6 mb-6">
                        <h2 className="font-display font-semibold mb-5">Próximos passos</h2>
                        <div className="space-y-4">
                            {NEXT_STEPS.map(({ icon: Icon, title, desc }, i) => (
                                <motion.div
                                    key={title}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.2 + i * 0.15 }}
                                    className="flex gap-4"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{title}</p>
                                        <p className="text-xs text-white/50 mt-0.5">{desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href={route('account.orders')}
                            className="btn-outline flex-1 justify-center"
                        >
                            Ver meu pedido
                        </Link>
                        <Link
                            href={route('products.index')}
                            className="btn-primary flex-1 justify-center"
                        >
                            <ShoppingBagIcon className="w-4 h-4" />
                            Continuar comprando
                        </Link>
                    </div>
                </motion.div>
            </div>
        </StoreLayout>
    );
}
