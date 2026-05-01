import { Head } from '@inertiajs/react';

/**
 * ProductSEO — injeta no <head>:
 *  - <title>, meta description
 *  - Open Graph (og:) + Twitter Card
 *  - Schema.org Product (JSON-LD)
 *  - Schema.org BreadcrumbList (JSON-LD)
 *  - canonical <link>
 */
export default function ProductSEO({ product, category, url }) {
    const title       = product.meta_title || `${product.name} | ERAS Streetwear`;
    const description = product.meta_description || product.short_description || '';
    const image       = product.primary_image || '/images/og-default.jpg';
    const price       = parseFloat(product.price).toFixed(2);
    const inStock     = product.stock_status !== 'out_of_stock';

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.short_description || '',
        sku: product.sku,
        image: [image],
        url,
        brand: product.brand ? {
            '@type': 'Brand',
            name: product.brand.name,
        } : undefined,
        offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'BRL',
            price,
            availability: inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: 'ERAS Streetwear' },
        },
        aggregateRating: product.average_rating > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: product.average_rating,
            reviewCount: product.reviews?.length || 0,
            bestRating: 5,
            worstRating: 1,
        } : undefined,
        review: product.reviews?.slice(0, 5).map(r => ({
            '@type': 'Review',
            reviewRating: {
                '@type': 'Rating',
                ratingValue: r.rating,
                bestRating: 5,
            },
            author: { '@type': 'Person', name: r.user?.name || 'Cliente' },
            reviewBody: r.body || '',
            datePublished: r.created_at,
        })),
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: window.location.origin },
            { '@type': 'ListItem', position: 2, name: 'Produtos', item: `${window.location.origin}/produtos` },
            category && {
                '@type': 'ListItem',
                position: 3,
                name: category.name,
                item: `${window.location.origin}/categoria/${category.slug}`,
            },
            {
                '@type': 'ListItem',
                position: category ? 4 : 3,
                name: product.name,
                item: url,
            },
        ].filter(Boolean),
    };

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="product" />
            <meta property="og:price:amount" content={price} />
            <meta property="og:price:currency" content="BRL" />

            {/* Twitter Card */}
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Schema.org */}
            <script type="application/ld+json">
                {JSON.stringify(productSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </script>
        </Head>
    );
}
