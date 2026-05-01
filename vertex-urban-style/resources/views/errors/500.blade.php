<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>500 — Erro interno — ERAS Streetwear</title>
    <meta name="robots" content="noindex">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --primary: #0d9488; --accent: #f97316; --dark: #080d14; --dark-100: #0f1520; }
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
            background: rgba(249, 115, 22, 0.04);
            filter: blur(120px);
            pointer-events: none;
        }
        .logo {
            font-size: 1.5rem;
            font-weight: 900;
            letter-spacing: -0.02em;
            text-decoration: none;
            color: #fff;
            display: inline-block;
            margin-bottom: 2.5rem;
        }
        .logo span { color: var(--primary); }
        .code {
            font-size: clamp(7rem, 20vw, 12rem);
            font-weight: 900;
            line-height: 1;
            color: rgba(255,255,255,0.04);
            user-select: none;
            position: relative;
        }
        h1 {
            font-size: clamp(1.4rem, 4vw, 2rem);
            font-weight: 700;
            margin-bottom: 0.75rem;
        }
        p {
            color: rgba(255,255,255,0.5);
            font-size: 0.95rem;
            line-height: 1.6;
            max-width: 420px;
            margin: 0 auto 2.5rem;
        }
        .btn-row { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            font-size: 0.9rem;
            text-decoration: none;
            cursor: pointer;
            border: none;
            transition: opacity 0.2s;
        }
        .btn:hover { opacity: 0.85; }
        .btn-primary { background: var(--primary); color: #fff; }
        .btn-outline {
            background: transparent;
            color: rgba(255,255,255,0.7);
            border: 1px solid rgba(255,255,255,0.15);
        }
        footer { position: fixed; bottom: 1.5rem; font-size: 0.7rem; color: rgba(255,255,255,0.2); }
    </style>
</head>
<body>
    <div class="glow"></div>

    <a href="/" class="logo">ERAS<span>.</span></a>

    <div class="code">500</div>

    <h1>Erro interno do servidor</h1>
    <p>Algo deu errado no nosso lado. Nossa equipe já foi notificada e estamos trabalhando para resolver.</p>

    <div class="btn-row">
        <button class="btn btn-primary" onclick="window.location.reload()">↺ Tentar novamente</button>
        <a href="/" class="btn btn-outline">⌂ Ir para a Home</a>
    </div>

    <footer>© {{ date('Y') }} ERAS Streetwear</footer>
</body>
</html>
