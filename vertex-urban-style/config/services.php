<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Stripe
    |--------------------------------------------------------------------------
    | Configurações para integração Stripe (cartão, Pix, Boleto).
    | Em produção, defina STRIPE_KEY, STRIPE_SECRET e STRIPE_WEBHOOK_SECRET no .env
    */
    'stripe' => [
        'key'            => env('STRIPE_KEY'),
        'secret'         => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Melhor Envio
    |--------------------------------------------------------------------------
    | API de cotação e geração de etiquetas de frete.
    | Obtenha o token em: https://melhorenvio.com.br/painel/gerenciar/tokens
    */
    'melhor_envio' => [
        'token'       => env('MELHOR_ENVIO_TOKEN'),
        'sandbox'     => env('MELHOR_ENVIO_SANDBOX', true),
        'from_cep'    => env('MELHOR_ENVIO_FROM_CEP', '01310100'),
        'from_name'   => env('MELHOR_ENVIO_FROM_NAME', 'ERAS Streetwear'),
        'from_email'  => env('MELHOR_ENVIO_FROM_EMAIL', 'logistica@eras.com.br'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Mailgun / SMTP
    |--------------------------------------------------------------------------
    | Laravel usa MAIL_* no .env. Defina aqui configs adicionais se necessário.
    */
    'mailgun' => [
        'domain'    => env('MAILGUN_DOMAIN'),
        'secret'    => env('MAILGUN_SECRET'),
        'endpoint'  => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme'    => 'https',
    ],

    /*
    |--------------------------------------------------------------------------
    | Postmark
    |--------------------------------------------------------------------------
    */
    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    /*
    |--------------------------------------------------------------------------
    | AWS SES
    |--------------------------------------------------------------------------
    */
    'ses' => [
        'key'    => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

];
