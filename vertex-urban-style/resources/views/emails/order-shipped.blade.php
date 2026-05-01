@extends('emails.layout')

@section('content')
    <div class="greeting">Seu pedido está a caminho! 🚚</div>
    <p class="text">Olá, <strong>{{ $customer->name }}</strong>!</p>
    <p class="text">
        Seu pedido <strong>#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</strong> foi despachado e
        já está com a transportadora. Acompanhe pelo código abaixo:
    </p>

    <div class="info-box">
        <div class="label">Código de rastreio</div>
        <div class="tracking-code">{{ $trackingCode }}</div>
    </div>

    <p class="text">
        Prazo estimado de entrega:
        <strong>
            @if($order->shipping_method === 'sedex')
                2 a 5 dias úteis
            @else
                5 a 10 dias úteis
            @endif
        </strong>
    </p>

    <div class="btn-wrap">
        <a href="https://rastreamento.correios.com.br/app/index.php?objetos={{ $trackingCode }}"
           class="btn btn-accent"
           target="_blank">
            Rastrear entrega
        </a>
    </div>

    <div class="btn-wrap">
        <a href="{{ route('account.orders.detail', $order) }}" class="btn">
            Ver detalhes do pedido
        </a>
    </div>

    <hr class="divider" />
    <p class="text" style="font-size:13px">
        Problema com a entrega? Entre em contato com nosso suporte.
    </p>
@endsection
