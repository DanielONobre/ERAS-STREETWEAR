@extends('emails.layout')

@section('content')
    <div class="greeting">Pedido entregue com sucesso! ✅</div>
    <p class="text">Olá, <strong>{{ $customer->name }}</strong>!</p>
    <p class="text">
        Seu pedido <strong>#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</strong> foi entregue.
        Esperamos que você ame o seu novo estilo!
    </p>

    <div class="info-box warning">
        <div class="label">Sua opinião importa</div>
        <div class="value" style="font-size:14px; font-weight:400; color:#94a3b8; margin-top:4px">
            Avalie os produtos que você recebeu e ajude outros clientes a
            fazer a melhor escolha.
        </div>
    </div>

    <div class="btn-wrap">
        <a href="{{ route('account.orders.detail', $order) }}" class="btn btn-accent">
            ⭐ Avaliar minha compra
        </a>
    </div>

    <div class="btn-wrap">
        <a href="{{ route('home') }}" class="btn">
            Continuar comprando
        </a>
    </div>

    <hr class="divider" />
    <p class="text" style="font-size:13px">
        Algum produto chegou com problema? Temos 7 dias para troca.
        <a href="{{ config('app.url') }}/politica-de-troca">Ver política de troca</a>.
    </p>
@endsection
