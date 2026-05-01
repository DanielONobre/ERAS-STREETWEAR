<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#080d14" />

    {{-- SEO dinâmico via Inertia Head --}}
    <title inertia>{{ config('app.name', 'ERAS Streetwear') }}</title>

    {{-- Canonical URL (sobrescrito por página via Inertia Head) --}}
    @php
        $canonical = request()->url();
        // Remove parâmetros de paginação e filtros do canonical
        $query = request()->query();
        unset($query['page']);
        $baseCanonical = count($query)
            ? request()->url() . '?' . http_build_query($query)
            : request()->url();
    @endphp
    <link rel="canonical" href="{{ $baseCanonical }}" />

    {{-- Open Graph defaults --}}
    <meta property="og:site_name" content="ERAS Streetwear" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ $baseCanonical }}" />
    <meta property="og:image" content="{{ asset('images/og-default.jpg') }}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    {{-- Twitter Card defaults --}}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@erasstreetwear" />
    <meta name="twitter:image" content="{{ asset('images/og-default.jpg') }}" />

    {{-- Fonts preconnect --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

    {{-- Favicon --}}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="manifest" href="/site.webmanifest" />

    {{-- CSRF Token --}}
    <meta name="csrf-token" content="{{ csrf_token() }}" />

    {{-- Inertia SSR Head (sobrescreve os defaults acima por página) --}}
    @inertiaHead

    {{-- Vite assets --}}
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="font-body bg-dark text-white antialiased">
    @inertia
</body>
</html>
