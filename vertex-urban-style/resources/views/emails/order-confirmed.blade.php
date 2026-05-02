@extends('emails.layout')

@section('content')
    <div class="greeting">PEDIDO CONFIRMADO</div>
    <p class="text">
        Tudo certo, <strong style="color:#F5F1EA;">{{ $customer->name }}</strong>.
        A gente recebeu seu pedido e já tá separando.
    </p>

    <div class="info-box">
        <div class="label">Número do pedido</div>
        <div class="value">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</div>
    </div>

    @php $order->loadMissing('items.product', 'address'); @endphp

    @if($order->items->count())
    <table class="order-table">
        <thead>
            <tr>
                <th>PRODUTO</th>
                <th style="text-align:right">QTD</th>
                <th style="text-align:right">VALOR</th>
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
            @if($order->discount > 0)
            <tr>
                <td colspan="2" style="text-align:right; color:#666666;">Desconto</td>
                <td style="text-align:right; color:#C8932E;">- R$ {{ number_format($order->discount, 2, ',', '.') }}</td>
            </tr>
            @endif
            <tr>
                <td colspan="2" style="text-align:right; color:#666666;">Frete</td>
                <td style="text-align:right;">
                    @if($order->shipping_cost == 0)
                        <span style="color:#C8932E;">Grátis</span>
                    @else
                        R$ {{ number_format($order->shipping_cost, 2, ',', '.') }}
                    @endif
                </td>
            </tr>
            <tr class="total-row">
                <td colspan="2" style="text-align:right;">TOTAL</td>
                <td style="text-align:right;">{{ $order->formatted_total }}</td>
            </tr>
        </tfoot>
    </table>
    @endif

    @if($order->address)
    <div class="info-box">
        <div class="label">Endereço de entrega</div>
        <div class="value">{{ $order->address->full_address }}</div>
    </div>
    @endif

    <div class="btn-wrap">
        <a href="{{ route('account.orders.detail', $order) }}" class="btn">
            VER MEU PEDIDO
        </a>
    </div>

    <hr class="divider" />
    <p class="text" style="font-size:13px;">
        Dúvida? Responde esse email. A gente lê.
    </p>
@endsection
