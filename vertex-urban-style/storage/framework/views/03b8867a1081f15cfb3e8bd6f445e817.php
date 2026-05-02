<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title><?php echo e($subject ?? 'ERAS STREETWEAR'); ?></title>
    <style>
        /* Google Fonts — carrega em clientes que suportam */
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

        /* Reset de email */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        table td { border-collapse: collapse; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }

        body {
            margin: 0; padding: 0;
            background-color: #0F0F0F;
            font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
            color: #F5F1EA;
        }

        a { color: #C8932E; text-decoration: none; }
        a:hover { text-decoration: underline; }

        /* ─── Classes usadas pelas views filhas ───────────────────────── */
        .greeting {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.01em;
            color: #F5F1EA;
            margin-bottom: 16px;
            font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
        }
        .text {
            font-size: 15px;
            line-height: 1.75;
            color: #AAAAAA;
            margin-bottom: 16px;
        }
        .btn-wrap {
            text-align: center;
            margin: 32px 0;
        }
        /* Botão como tabela para máxima compatibilidade */
        .btn {
            display: inline-block;
            background-color: #C8932E;
            color: #0F0F0F !important;
            font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 14px 36px;
            text-decoration: none !important;
        }
        .btn:hover { background-color: #A07524; }
        .btn-accent { background-color: #C8932E; }
        .info-box {
            background-color: #222222;
            border-left: 4px solid #C8932E;
            padding: 20px 24px;
            margin: 24px 0;
        }
        .info-box.warning { border-left-color: #C8932E; }
        .info-box .label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #666666;
            margin-bottom: 6px;
        }
        .info-box .value {
            font-size: 15px;
            font-weight: 600;
            color: #F5F1EA;
        }
        .order-table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            font-size: 14px;
        }
        .order-table th {
            background-color: #222222;
            color: #666666;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 10px 14px;
            text-align: left;
        }
        .order-table td {
            padding: 12px 14px;
            color: #AAAAAA;
            border-bottom: 1px solid #222222;
        }
        .order-table tr:last-child td { border-bottom: none; }
        .order-table .total-row td {
            font-weight: 700;
            color: #C8932E;
            font-size: 15px;
        }
        .divider {
            border: none;
            border-top: 1px solid #222222;
            margin: 24px 0;
        }
        .tracking-code {
            font-family: 'Courier New', Courier, monospace;
            background-color: #222222;
            color: #C8932E;
            padding: 10px 16px;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 2px;
            display: inline-block;
            margin: 8px 0;
        }

        @media (max-width: 480px) {
            .email-container { width: 100% !important; }
            .email-body { padding: 24px 20px !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#0F0F0F;">

<!-- Wrapper externo -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background-color:#0F0F0F; padding:40px 16px;">
    <tr>
        <td align="center">

            <!-- Container do email — max 600px -->
            <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0"
                   style="max-width:600px; width:100%; background-color:#1A1A1A; border:1px solid #222222;">

                <!-- Header -->
                <tr>
                    <td align="center"
                        style="background-color:#0F0F0F; padding:32px 40px; border-bottom:2px solid #C8932E;">
                        <div style="font-family:'Space Grotesk','Helvetica Neue',Arial,sans-serif;
                                    font-size:28px; font-weight:700; letter-spacing:0.3em;
                                    text-transform:uppercase; color:#F5F1EA; line-height:1;">
                            ERAS<span style="color:#C8932E;">.</span>
                        </div>
                        <div style="font-family:'Space Grotesk','Helvetica Neue',Arial,sans-serif;
                                    font-size:10px; letter-spacing:0.4em; text-transform:uppercase;
                                    color:#4A4A4A; margin-top:6px;">
                            STREETWEAR · BRASIL · DROP LIMITADO
                        </div>
                    </td>
                </tr>

                <!-- Conteúdo da view filha -->
                <tr>
                    <td class="email-body" style="padding:40px;">
                        <?php echo $__env->yieldContent('content'); ?>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background-color:#0F0F0F; padding:28px 40px;
                               border-top:1px solid #222222; text-align:center;">
                        <div style="margin-bottom:14px;">
                            <a href="<?php echo e(config('app.url')); ?>"
                               style="color:#666666; font-size:11px; text-decoration:none; margin:0 8px;">Loja</a>
                            <a href="<?php echo e(config('app.url')); ?>/minha-conta/pedidos"
                               style="color:#666666; font-size:11px; text-decoration:none; margin:0 8px;">Meus Pedidos</a>
                            <a href="<?php echo e(config('app.url')); ?>/manifesto"
                               style="color:#666666; font-size:11px; text-decoration:none; margin:0 8px;">Manifesto</a>
                            <a href="<?php echo e(config('app.url')); ?>/politica-de-privacidade"
                               style="color:#666666; font-size:11px; text-decoration:none; margin:0 8px;">Privacidade</a>
                        </div>
                        <div style="font-family:'Space Grotesk','Helvetica Neue',Arial,sans-serif;
                                    font-size:11px; color:#333333; line-height:1.8;">
                            © <?php echo e(date('Y')); ?> ERAS STREETWEAR. Drop limitado, atitude ilimitada.<br />
                            São Paulo, SP — CNPJ XX.XXX.XXX/0001-XX<br />
                            Você recebeu este email por ter realizado uma ação em nossa loja.
                        </div>
                        <div style="margin-top:14px; font-family:'Space Grotesk','Helvetica Neue',Arial,sans-serif;
                                    font-size:9px; letter-spacing:0.25em; text-transform:uppercase; color:#2A2A2A;">
                            ENGINEERED BY VAXON
                        </div>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>
<?php /**PATH C:\ERAS-STREETWEAR\vertex-urban-style\resources\views/emails/layout.blade.php ENDPATH**/ ?>