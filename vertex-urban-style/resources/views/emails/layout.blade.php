<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $subject ?? 'ERAS Streetwear' }}</title>
    <style>
        /* Reset */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background-color: #0f1218;
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #e2e8f0;
            -webkit-text-size-adjust: 100%;
        }
        a { color: #0d9488; text-decoration: none; }
        a:hover { text-decoration: underline; }

        /* Wrapper */
        .wrapper {
            width: 100%;
            background-color: #0f1218;
            padding: 40px 16px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #161c27;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #1e2a3a;
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, #080d14 0%, #0d1a2b 100%);
            padding: 32px 40px;
            text-align: center;
            border-bottom: 2px solid #0d9488;
        }
        .logo {
            font-size: 26px;
            font-weight: 800;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #ffffff;
        }
        .logo span { color: #0d9488; }
        .tagline {
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #64748b;
            margin-top: 4px;
        }

        /* Body */
        .body {
            padding: 40px;
        }
        .greeting {
            font-size: 22px;
            font-weight: 700;
            color: #f1f5f9;
            margin-bottom: 16px;
        }
        .text {
            font-size: 15px;
            line-height: 1.7;
            color: #94a3b8;
            margin-bottom: 16px;
        }

        /* CTA Button */
        .btn-wrap {
            text-align: center;
            margin: 32px 0;
        }
        .btn {
            display: inline-block;
            background-color: #0d9488;
            color: #ffffff !important;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 14px 36px;
            border-radius: 8px;
            text-decoration: none !important;
        }
        .btn:hover { background-color: #0f766e; }
        .btn-accent {
            background-color: #f97316;
        }
        .btn-accent:hover { background-color: #ea6c10; }

        /* Info box */
        .info-box {
            background-color: #1e2a3a;
            border-left: 4px solid #0d9488;
            border-radius: 8px;
            padding: 20px 24px;
            margin: 24px 0;
        }
        .info-box.warning {
            border-left-color: #f97316;
        }
        .info-box .label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #64748b;
            margin-bottom: 6px;
        }
        .info-box .value {
            font-size: 15px;
            font-weight: 600;
            color: #e2e8f0;
        }

        /* Order table */
        .order-table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            font-size: 14px;
        }
        .order-table th {
            background-color: #1e2a3a;
            color: #64748b;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 10px 14px;
            text-align: left;
        }
        .order-table td {
            padding: 12px 14px;
            color: #94a3b8;
            border-bottom: 1px solid #1e2a3a;
        }
        .order-table tr:last-child td { border-bottom: none; }
        .order-table .total-row td {
            font-weight: 700;
            color: #0d9488;
            font-size: 15px;
        }

        /* Divider */
        .divider {
            border: none;
            border-top: 1px solid #1e2a3a;
            margin: 24px 0;
        }

        /* Tracking */
        .tracking-code {
            font-family: 'Courier New', Courier, monospace;
            background-color: #1e2a3a;
            color: #0d9488;
            padding: 10px 16px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 2px;
            display: inline-block;
            margin: 8px 0;
        }

        /* Footer */
        .footer {
            background-color: #080d14;
            padding: 32px 40px;
            text-align: center;
            border-top: 1px solid #1e2a3a;
        }
        .footer-links {
            margin-bottom: 16px;
        }
        .footer-links a {
            color: #64748b;
            font-size: 12px;
            margin: 0 10px;
        }
        .footer-links a:hover { color: #0d9488; }
        .footer-copy {
            font-size: 11px;
            color: #334155;
            line-height: 1.8;
        }
        .footer-brand {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #475569;
            margin-bottom: 8px;
        }

        /* Social */
        .social-links {
            margin: 16px 0;
        }
        .social-links a {
            display: inline-block;
            width: 32px;
            height: 32px;
            background-color: #1e2a3a;
            border-radius: 50%;
            line-height: 32px;
            text-align: center;
            font-size: 13px;
            color: #64748b !important;
            margin: 0 4px;
        }

        /* Responsive */
        @media (max-width: 480px) {
            .header { padding: 24px 20px; }
            .body { padding: 24px 20px; }
            .footer { padding: 24px 20px; }
        }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="container">

        {{-- Header --}}
        <div class="header">
            <div class="logo">ERAS<span>.</span></div>
            <div class="tagline">Streetwear</div>
        </div>

        {{-- Corpo do email --}}
        <div class="body">
            @yield('content')
        </div>

        {{-- Footer --}}
        <div class="footer">
            <div class="social-links">
                <a href="#" title="Instagram">Ig</a>
                <a href="#" title="TikTok">Tk</a>
                <a href="#" title="Pinterest">Pt</a>
            </div>
            <div class="footer-links">
                <a href="{{ config('app.url') }}">Loja</a>
                <a href="{{ config('app.url') }}/minha-conta/pedidos">Meus Pedidos</a>
                <a href="{{ config('app.url') }}/contato">Contato</a>
                <a href="{{ config('app.url') }}/politica-de-privacidade">Privacidade</a>
            </div>
            <div class="footer-brand">ERAS Streetwear</div>
            <div class="footer-copy">
                © {{ date('Y') }} ERAS Streetwear. Todos os direitos reservados.<br />
                São Paulo, SP — CNPJ 00.000.000/0001-00<br />
                Você está recebendo este e-mail porque realizou uma ação em nossa loja.
            </div>
        </div>

    </div>
</div>
</body>
</html>
