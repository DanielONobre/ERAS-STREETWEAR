@extends('emails.layout')

@section('content')
    <div class="greeting">CHEGOU</div>
    <p class="text">
        <strong style="color:#F5F1EA;">{{ $customer->name }}</strong>,
        seu pedido foi entregue. Esperamos que tenha gostado.
    </p>

    <p class="text">
        Achou ruim algo? Responde esse email — a gente resolve em 24h.
    </p>

    <p class="text">
        E se gostou: marca a gente.
        <a href="https://instagram.com/erasstreetwear" style="color:#C8932E;">@erasstreetwear</a>.
    </p>

    <div class="btn-wrap">
        <a href="{{ route('account.orders.detail', $order) }}" class="btn">
            VER MEU PEDIDO
        </a>
    </div>

    <hr class="divider" />
    <p class="text" style="font-size:13px;">
        Algum produto chegou com problema? A gente tem 7 dias pra resolver.
        <a href="{{ config('app.url') }}/politica-de-troca" style="color:#C8932E;">Ver política de troca</a>.
    </p>
    <p class="text" style="font-size:13px; color:#666666;">— ERAS</p>
@endsection
