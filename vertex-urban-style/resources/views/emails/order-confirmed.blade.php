@extends('emails.layout')

@section('content')
    <div class="greeting">Pedido confirmado! 🎉</div>
    <p class="text">Olá, <strong>{{ $customer->name }}</strong>!</p>
    <p class="text">
        Recebemos seu pedido e ele está sendo processado. Em breve você receberá
        uma atualização com o código de rastreio.
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
            @if($order->discount > 0)
            <tr>
                <td colspan="2" style="text-align:right; color:#64748b">Desconto</td>
                <td style="text-align:right; color:#f97316">- R$ {{ number_format($order->discount, 2, ',', '.') }}</td>
            </tr>
            @endif
            <tr>
                <td colspan="2" style="text-align:right; color:#64748b">Frete</td>
                <td style="text-align:right">
                    @if($order->shipping_cost == 0)
                        <span style="color:#0d9488">Grátis</span>
                    @else
                        R$ {{ number_format($order->shipping_cost, 2, ',', '.') }}
                    @endif
                </td>
            </tr>
            <tr class="total-row">
                <td colspan="2" style="text-align:right">Total</td>
                <td style="text-align:right">{{ $order->formatted_total }}</td>
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
            Ver detalhes do pedido
        </a>
    </div>

    <hr class="divider" />
    <p class="text" style="font-size:13px">
        Dúvidas? Responda este e-mail ou acesse nosso suporte.
    </p>
@endsection
