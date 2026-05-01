import { Head } from '@inertiajs/react';

/**
 * PageSEO — componente genérico de SEO para páginas não-produto.
 * Injeta: title, meta description, canonical, OG tags, Twitter Card.
 */
export default function PageSEO({
    title,
    description = '',
    canonical,
    image = '/images/og-default.jpg',
    type = 'website',
    noindex = false,
}) {
    const url  = canonical || (typeof window !== 'undefined' ? window.location.href : '');
    const full = title ? `${title} | Vertex Urban Style` : 'Vertex Urban Style — Streetwear';

    return (
        <Head>
            <title>{full}</title>
            {description && <meta name="description" content={description} />}
            {noindex && <meta name="robots" content="noindex,nofollow" />}
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:title" content={full} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />

            {/* Twitter Card */}
            <meta name="twitter:title" content={full} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Head>
    );
}
