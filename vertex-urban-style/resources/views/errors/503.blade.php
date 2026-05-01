<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Em Manutenção — Vertex Urban Style</title>
    <meta name="robots" content="noindex">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --primary: #0d9488; --dark: #080d14; }
        body {
            background: var(--dark);
            color: #fff;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
        }
        .glow {
            position: fixed;
            top: 33%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            height: 600px;
            border-radius: 50%;
            background: rgba(13, 148, 136, 0.05);
            filter: blur(120px);
            pointer-events: none;
        }
        .logo { font-size: 1.5rem; font-weight: 900; color: #fff; margin-bottom: 3rem; display: inline-block; }
        .logo span { color: var(--primary); }
        svg.icon { width: 80px; height: 80px; margin-bottom: 1.5rem; opacity: 0.7; }
        h1 { font-size: clamp(1.6rem, 5vw, 2.4rem); font-weight: 800; margin-bottom: 1rem; }
        .badge {
            display: inline-block;
            background: rgba(13,148,136,0.15);
            border: 1px solid rgba(13,148,136,0.3);
            color: var(--primary);
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.3rem 0.85rem;
            border-radius: 2rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 1.5rem;
        }
        p { color: rgba(255,255,255,0.5); font-size: 1rem; line-height: 1.7; max-width: 420px; margin: 0 auto 0.75rem; }
        .message {
            margin-top: 2rem;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 0.75rem;
            padding: 1rem 1.5rem;
            font-size: 0.875rem;
            color: rgba(255,255,255,0.6);
            max-width: 400px;
        }
        footer { position: fixed; bottom: 1.5rem; font-size: 0.7rem; color: rgba(255,255,255,0.2); }
    </style>
</head>
<body>
    <div class="glow"></div>

    <span class="logo">VERTEX<span>.</span></span>

    <svg class="icon" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" stroke="#0d9488" stroke-opacity="0.4" stroke-width="2"/>
        <path d="M28 40 C28 33 33 28 40 28 C47 28 52 33 52 40" stroke="#0d9488" stroke-opacity="0.6" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M34 40 L40 34 L46 40" stroke="#0d9488" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="36" y="40" width="8" height="14" rx="2" fill="#0d9488" fill-opacity="0.4"/>
        <circle cx="56" cy="26" r="8" fill="#f97316" fill-opacity="0.15" stroke="#f97316" stroke-opacity="0.4" stroke-width="1.5"/>
        <path d="M56 23 L56 27" stroke="#f97316" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round"/>
        <circle cx="56" cy="29.5" r="1" fill="#f97316" fill-opacity="0.8"/>
    </svg>

    <span class="badge">Manutenção</span>
    <h1>Voltamos em breve</h1>
    <p>Estamos realizando melhorias para oferecer uma experiência ainda melhor para você.</p>

    @if($exception->getMessage())
    <div class="message">
        {{ $exception->getMessage() }}
    </div>
    @endif

    <footer>© {{ date('Y') }} Vertex Urban Style</footer>
</body>
</html>
