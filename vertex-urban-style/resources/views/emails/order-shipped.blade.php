@extends('emails.layout')

@section('content')
    <div class="greeting">SAIU PRA ENTREGA</div>
    <p class="text">
        Boa, <strong style="color:#F5F1EA;">{{ $customer->name }}</strong>.
        Seu pedido <strong style="color:#F5F1EA;">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</strong>
        tá a caminho.
    </p>

    <div class="info-box">
        <div class="label">Código de rastreio</div>
        <div class="tracking-code">{{ $trackingCode }}</div>
    </div>

    @if($order->shipping_carrier)
    <div class="info-box">
        <div class="label">Transportadora</div>
        <div class="value">{{ $order->shipping_carrier }}</div>
    </div>
    @endif

    <p class="text">
        Prazo estimado:
        <strong style="color:#F5F1EA;">
            @if($order->shipping_method === 'sedex')
                2 a 5 dias úteis
            @else
                5 a 10 dias úteis
            @endif
        </strong>
    </p>

    <div class="btn-wrap">
        <a href="https://rastreamento.correios.com.br/app/index.php?objetos={{ $trackingCode }}"
           class="btn"
           target="_blank">
            RASTREAR PEDIDO
        </a>
    </div>

    <hr class="divider" />
    <p class="text" style="font-size:13px;">
        Quando chegar, manda foto pra gente no Insta
        <a href="https://instagram.com/erasstreetwear" style="color:#C8932E;">@erasstreetwear</a>.
        A gente reposta as boas.
    </p>
@endsection
