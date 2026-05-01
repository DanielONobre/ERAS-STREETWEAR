@extends('emails.layout')

@section('content')
    <div class="greeting" style="color:#f97316">🔔 Novo pedido recebido!</div>
    <p class="text">
        Um novo pedido foi realizado na loja. Confira os detalhes abaixo:
    </p>

    @php $order->loadMissing('user', 'items.product', 'address'); @endphp

    <div class="info-box">
        <div class="label">Pedido</div>
        <div class="value">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</div>
    </div>

    <div class="info-box">
        <div class="label">Cliente</div>
        <div class="value">{{ $order->user?->name }} &lt;{{ $order->user?->email }}&gt;</div>
    </div>

    <div class="info-box">
        <div class="label">Forma de pagamento</div>
        <div class="value">{{ strtoupper(str_replace('_', ' ', $order->payment_method)) }}</div>
    </div>

    @if($order->items->count())
    <table class="order-table">
        <thead>
            <tr>
                <th>Produto</th>
                <th style="text-align:right">Qtd</th>
                <th style="text-align:right">Valor</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product->name }}</td>
                <td style="text-align:right">{{ $item->quantity }}</td>
                <td style="text-align:right">R$ {{ number_format($item->line_total, 2, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="2" style="text-align:right">Total</td>
                <td style="text-align:right">{{ $order->formatted_total }}</td>
            </tr>
        </tfoot>
    </table>
    @endif

    <div class="btn-wrap">
        <a href="{{ route('admin.pedidos.show', $order) }}" class="btn btn-accent">
            Gerenciar pedido no Admin
        </a>
    </div>
@endsection
