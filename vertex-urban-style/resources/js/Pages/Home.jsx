import { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination as SwiperPagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import StoreLayout from '@layouts/StoreLayout';
import ProductGrid from '@components/Product/ProductGrid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

/* ─── Fallback slides (quando banners não vem do backend) ─────────────── */
const DEFAULT_BANNERS = [
    {
        id: 1,
        eyebrow: 'DROP 01 — EDIÇÃO LIMITADA',
        title: 'ATITUDE NÃO É TENDÊNCIA.',
        subtitle: 'Streetwear autoral brasileiro. Drops limitados, tecidos selecionados, peças que não vão estar em todo lugar.',
        cta: 'VER DROP ATUAL',
        cta_url: '/produtos',
        overlay: 'from-dark/90 via-dark/60 to-transparent',
        bg: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1400&q=80',
    },
    {
        id: 2,
        title: 'Concreto e Brasa.',
        subtitle: 'Doze peças. Edição numerada. Quando acabar, acabou.',
        cta: 'VER DROP ATUAL',
        cta_url: '/produtos?is_new=1',
        overlay: 'from-dark/90 via-dark/50 to-transparent',
        bg: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1400&q=80',
    },
    {
        id: 3,
        title: 'Brasil na costura.',
        subtitle: 'Modelagem, tecido e produção em São Paulo. Curto circuito, qualidade no ponto.',
        cta: 'MANIFESTO',
        cta_url: '/manifesto',
        overlay: 'from-dark/90 via-dark/60 to-transparent',
        bg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80',
    },
];

/* ─── Instagram placeholders ──────────────────────────────────────────── */
const INSTA_PHOTOS = [
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
    'https://images.unsplash.com/photo-1533659828870-95ee305cee3e?w=400&q=80',
    'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&q=80',
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=80',
    'https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=400&q=80',
];

/* ─── Manifesto ──────────────────────────────────────────────────────── */
const MANIFESTO_COLS = [
    {
        heading: 'PEÇA COM HISTÓRIA',
        body: 'Cada modelo tem origem, intenção e nome. Nada saiu de mood board genérico.',
    },
    {
        heading: 'DROP LIMITADO',
        body: 'Tiragem fechada. Sem reposição. Quem pega, pega — e quem não pega, espera o próximo.',
    },
    {
        heading: 'BRASIL NA COSTURA',
        body: 'Modelagem, tecido e produção em São Paulo. Curto circuito, qualidade no ponto.',
    },
];

/* ─── Countdown ──────────────────────────────────────────────────────── */
function useCountdown(targetDate) {
    const calc = () => {
        const diff = new Date(targetDate) - Date.now();
        if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
        return {
            d: Math.floor(diff / 86400000),
            h: Math.floor((diff % 86400000) / 3600000),
            m: Math.floor((diff % 3600000) / 60000),
            s: Math.floor((diff % 60000) / 1000),
        };
    };
    const [time, setTime] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return time;
}

function CountdownUnit({ value, label }) {
    return (
        <div className="flex flex-col items-center">
            <div className="font-display text-3xl md:text-4xl font-bold text-white tabular-nums min-w-[2.5ch] text-center">
                {String(value).padStart(2, '0')}
            </div>
            <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{label}</div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function Home({
    featuredProducts = [],
    newArrivals = [],
    categories = [],
    banners,
    settings = {},
}) {
    const slides = (banners && banners.length > 0) ? banners : DEFAULT_BANNERS;
    const promoEndsAt = settings?.promo_ends_at ?? new Date(Date.now() + 3 * 86400000).toISOString();
    const countdown = useCountdown(promoEndsAt);
    const swiperRef = useRef(null);
    const [newsletterEmail, setNewsletterEmail] = useState('');

    return (
        <StoreLayout>
            <Head>
                <title>ERAS Streetwear — Atitude não é tendência</title>
                <meta name="description" content="Streetwear autoral brasileiro. Drops limitados, tecidos selecionados, peças que não vão estar em todo lugar." />
                <meta property="og:title" content="ERAS Streetwear — Atitude não é tendência" />
                <meta property="og:description" content="Streetwear autoral brasileiro. Drops limitados, tecidos selecionados." />
                <meta property="og:type" content="website" />
            </Head>

            {/* ══ a) HERO BANNER — Swiper ══════════════════════════════════════════ */}
            <section className="relative w-full overflow-hidden" style={{ height: 'min(90vh, 720px)' }}>
                <Swiper
                    ref={swiperRef}
                    modules={[Autoplay, SwiperPagination, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    pagination={{ clickable: true, el: '.hero-pagination' }}
                    loop
                    className="h-full w-full"
                >
                    {slides.map((slide) => (
                        <SwiperSlide key={slide.id} className="relative h-full">
                            {/* Background */}
                            <div className="absolute inset-0">
                                <img
                                    src={slide.image ?? slide.bg}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay ?? 'from-dark/90 via-dark/60 to-transparent'}`} />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 h-full flex items-center">
                                <div className="container-page">
                                    <div className="max-w-2xl">
                                        <motion.div
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.7, ease: 'easeOut' }}
                                        >
                                            {slide.eyebrow && (
                                                <span className="badge-primary mb-5 inline-flex">
                                                    {slide.eyebrow}
                                                </span>
                                            )}
                                            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                                                {slide.title}
                                            </h1>
                                            <p className="mt-5 text-lg text-white/60 max-w-xl leading-relaxed">
                                                {slide.subtitle}
                                            </p>
                                            <div className="flex flex-wrap gap-4 mt-8">
                                                <Link
                                                    href={slide.cta_url ?? '/produtos'}
                                                    className="btn-primary btn-lg"
                                                >
                                                    {slide.cta ?? 'VER DROP ATUAL'}
                                                    <ArrowRightIcon className="w-5 h-5" />
                                                </Link>
                                                <Link
                                                    href="/manifesto"
                                                    className="btn-outline btn-lg"
                                                >
                                                    MANIFESTO
                                                </Link>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Indicadores animados personalizados */}
                <div className="hero-pagination absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 [&_.swiper-pagination-bullet]:w-8 [&_.swiper-pagination-bullet]:h-1 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-white/30 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:bg-primary [&_.swiper-pagination-bullet-active]:w-12 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300" />

                {/* Scroll hint */}
                <div className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2 text-white/30 text-xs">
                    <div className="w-px h-10 bg-white/20 animate-pulse" />
                    <span className="rotate-90 text-[10px] tracking-widest uppercase">Scroll</span>
                </div>
            </section>

            {/* ══ b) CATEGORY GRID ════════════════════════════════════════════════ */}
            {categories?.length > 0 && (
                <section className="container-page py-20">
                    <SectionHeader
                        title="Categorias"
                        subtitle="Explore por estilo"
                        href="/produtos"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
                        {categories.slice(0, 6).map((cat, i) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                            >
                                <Link
                                    href={`/categoria/${cat.slug}`}
                                    className="group relative block overflow-hidden rounded-2xl aspect-square"
                                >
                                    {cat.image ? (
                                        <img
                                            src={`/storage/${cat.image}`}
                                            alt={cat.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-dark-200 to-dark-400" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
                                    <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                                        <span className="font-display font-semibold text-sm text-white">
                                            {cat.name}
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* ══ c) FEATURED PRODUCTS ════════════════════════════════════════════ */}
            {featuredProducts?.length > 0 && (
                <section className="container-page py-8">
                    <SectionHeader
                        title="DROP ATUAL"
                        subtitle="Concreto e Brasa — Edição numerada."
                        href="/produtos?sort=bestsellers"
                    />
                    <div className="mt-8">
                        <ProductGrid products={featuredProducts.slice(0, 8)} />
                    </div>
                </section>
            )}

            {/* ══ d) SEÇÃO DROP — CONCRETO E BRASA ══════════════════════════════ */}
            <section className="container-page py-12">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-950 via-dark-100 to-dark border border-primary/20">
                    {/* Decore */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,rgba(200,147,46,0.15),transparent)]" />
                    <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-14">
                        <div className="flex-1 text-center md:text-left">
                            <span className="badge-accent mb-4 inline-flex">DROP 01 — EDIÇÃO LIMITADA</span>
                            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                                Concreto e{' '}
                                <span className="text-eras-mustard">Brasa</span>
                            </h2>
                            <p className="mt-3 text-white/50 max-w-sm">
                                A primeira coleção ERAS nasce do contraste: o cinza do concreto urbano e o calor da brasa do interior. Doze peças. Edição numerada. Quando acabar, acabou.
                            </p>

                            {/* Countdown */}
                            <div className="flex justify-center md:justify-start gap-6 mt-8">
                                <CountdownUnit value={countdown.d} label="Dias" />
                                <div className="text-white/20 font-display text-4xl font-bold self-start mt-1">:</div>
                                <CountdownUnit value={countdown.h} label="Horas" />
                                <div className="text-white/20 font-display text-4xl font-bold self-start mt-1">:</div>
                                <CountdownUnit value={countdown.m} label="Min" />
                                <div className="text-white/20 font-display text-4xl font-bold self-start mt-1">:</div>
                                <CountdownUnit value={countdown.s} label="Seg" />
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <Link href="/produtos?is_new=1" className="btn-primary btn-lg">
                                VER DROP ATUAL
                                <ArrowRightIcon className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ e) NEW ARRIVALS ═════════════════════════════════════════════════ */}
            {newArrivals?.length > 0 && (
                <section className="container-page py-8">
                    <SectionHeader
                        title="Lançamentos"
                        subtitle="Acabou de chegar"
                        href="/produtos?is_new=1"
                    />
                    <div className="mt-8">
                        <ProductGrid products={newArrivals.slice(0, 8)} />
                    </div>
                    <div className="text-center mt-10">
                        <Link href="/produtos?is_new=1" className="btn-outline btn-lg inline-flex">
                            Ver todos os lançamentos
                            <ArrowRightIcon className="w-5 h-5" />
                        </Link>
                    </div>
                </section>
            )}

            {/* ══ f) MANIFESTO — O QUE A GENTE FAZ AQUI ══════════════════════════ */}
            <section className="border-y border-white/[0.06] bg-dark-50/30">
                <div className="container-page py-16 lg:py-20">
                    <div className="text-center mb-12">
                        <h2 className="section-title">O QUE A GENTE FAZ AQUI</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {MANIFESTO_COLS.map(({ heading, body }, i) => (
                            <motion.div
                                key={heading}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center md:text-left"
                            >
                                <p className="font-display font-bold text-sm tracking-widest text-eras-mustard uppercase mb-3">
                                    {heading}
                                </p>
                                <p className="text-white/60 text-sm leading-relaxed">{body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ g) ENTRE NA LISTA + INSTAGRAM ══════════════════════════════════ */}
            <section className="container-page py-20">
                <div className="text-center mb-10">
                    <h2 className="section-title">ENTRE NA LISTA</h2>
                    <p className="section-subtitle mt-2">
                        Drop novo, primeiro aviso. Sem spam, sem promessa de desconto fake.
                    </p>
                    <form
                        className="flex gap-3 max-w-md mx-auto mt-6"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="email"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder="seu email"
                            className="input flex-1"
                        />
                        <button type="submit" className="btn-primary flex-shrink-0">
                            QUERO SER AVISADO
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-14">
                    {INSTA_PHOTOS.map((src, i) => (
                        <motion.a
                            key={i}
                            href="https://instagram.com/erasstreetwear"
                            target="_blank"
                            rel="noreferrer"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06 }}
                            className="group relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl block"
                        >
                            <img
                                src={src}
                                alt={`Post ${i + 1} @erasstreetwear`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/50 transition-colors duration-300 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </div>
                        </motion.a>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <a
                        href="https://instagram.com/erasstreetwear"
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline inline-flex"
                    >
                        @erasstreetwear
                    </a>
                </div>
            </section>
        </StoreLayout>
    );
}

/* ─── SectionHeader ──────────────────────────────────────────────────── */
function SectionHeader({ title, subtitle, href }) {
    return (
        <div className="flex items-end justify-between">
            <div>
                <h2 className="section-title">{title}</h2>
                {subtitle && <p className="section-subtitle mt-1">{subtitle}</p>}
            </div>
            {href && (
                <Link
                    href={href}
                    className="text-sm text-primary hover:text-primary-400 flex items-center gap-1.5 transition-colors"
                >
                    Ver todos
                    <ArrowRightIcon className="w-4 h-4" />
                </Link>
            )}
        </div>
    );
}
