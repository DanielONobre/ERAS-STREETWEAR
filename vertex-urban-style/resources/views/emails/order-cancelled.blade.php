@extends('emails.layout')

@section('content')

    <div class="greeting">PEDIDO CANCELADO</div>

    <p class="text">
        {{ $customer->name }}, seu pedido <strong style="color:#F5F1EA;">#{{ $order->id }}</strong> foi cancelado.
    </p>

    <div class="info-box warning">
        <strong>O que acontece agora?</strong><br>
        Se você já pagou, o reembolso será processado em até <strong>5 dias úteis</strong>
        pelo mesmo método de pagamento usado na compra.
    </div>

    <table class="order-table" width="100%" cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th align="left">Produto</th>
                <th align="center">Qtd</th>
                <th align="right">Valor</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}{{ $item->variant_name ? ' — ' . $item->variant_name : '' }}</td>
                <td align="center">{{ $item->quantity }}</td>
                <td align="right">R$ {{ number_format($item->unit_price * $item->quantity, 2, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="2">Total cancelado</td>
                <td align="right">{{ $order->formatted_total }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="divider"></div>

    <p class="text">
        Cancelou sem querer? Entra em contato respondendo esse email — a gente vê o que dá pra fazer.
    </p>

    <div class="btn-wrap">
        <a href="{{ route('account.orders') }}" class="btn">VER MEUS PEDIDOS</a>
    </div>

    <p style="color:#666666; font-size:13px; margin-top:24px;">
        — ERAS
    </p>

@endsection
