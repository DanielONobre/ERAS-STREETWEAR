<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #1e293b;
            line-height: 1.5;
        }

        .page { padding: 30px 40px; }

        /* Header */
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 3px solid #0d9488; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: 800; letter-spacing: 3px; color: #080d14; }
        .logo span { color: #0d9488; }
        .doc-info { text-align: right; }
        .doc-title { font-size: 18px; font-weight: 700; color: #0d9488; }
        .doc-number { font-size: 13px; color: #64748b; margin-top: 4px; }

        /* Info grid */
        .info-grid { display: flex; gap: 24px; margin-bottom: 24px; }
        .info-block { flex: 1; background: #f8fafc; border-radius: 6px; padding: 14px 16px; }
        .info-block .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px; }
        .info-block .value { font-size: 12px; color: #1e293b; font-weight: 600; }
        .info-block .value-sm { font-size: 11px; color: #475569; font-weight: 400; margin-top: 2px; }

        /* Items table */
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        thead th {
            background-color: #080d14;
            color: #ffffff;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 10px 12px;
            text-align: left;
        }
        tbody td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #334155; }
        tbody tr:nth-child(even) td { background-color: #f8fafc; }
        .text-right { text-align: right; }

        /* Totals */
        .totals { margin-left: auto; width: 280px; }
        .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 12px; color: #475569; border-bottom: 1px solid #e2e8f0; }
        .totals-row.total { font-size: 15px; font-weight: 800; color: #0d9488; border-bottom: none; padding-top: 10px; }
        .totals-row.discount { color: #f97316; }

        /* Footer */
        .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 10px; }
        .status-badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; }
        .status-paid { background: #dcfce7; color: #16a34a; }
        .status-pending { background: #fef9c3; color: #a16207; }
        .status-failed { background: #fee2e2; color: #dc2626; }
    </style>
</head>
<body>
<div class="page">

    {{-- Header --}}
    <div class="header">
        <div>
            <div class="logo">Vertex<span>.</span></div>
            <div style="font-size:11px; color:#64748b; margin-top:4px">Urban Style</div>
            <div style="font-size:10px; color:#94a3b8; margin-top:8px">
                CNPJ: 00.000.000/0001-00<br />
                Av. Paulista, 1000 — São Paulo, SP
            </div>
        </div>
        <div class="doc-info">
            <div class="doc-title">COMPROVANTE DE PEDIDO</div>
            <div class="doc-number">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</div>
            <div style="font-size:10px; color:#94a3b8; margin-top:6px">
                Emitido em: {{ now()->format('d/m/Y H:i') }}
            </div>
            @php
                $statusClass = match($order->payment_status) {
                    'paid'    => 'status-paid',
                    'pending' => 'status-pending',
                    default   => 'status-failed',
                };
            @endphp
            <div style="margin-top:8px">
                <span class="status-badge {{ $statusClass }}">{{ strtoupper($order->payment_status_label) }}</span>
            </div>
        </div>
    </div>

    {{-- Info grid --}}
    <div class="info-grid">
        <div class="info-block">
            <div class="label">Cliente</div>
            <div class="value">{{ $order->user?->name }}</div>
            <div class="value-sm">{{ $order->user?->email }}</div>
        </div>
        <div class="info-block">
            <div class="label">Endereço de entrega</div>
            <div class="value" style="font-weight:400; font-size:11px">{{ $order->address?->full_address }}</div>
        </div>
        <div class="info-block">
            <div class="label">Pagamento</div>
            <div class="value">{{ strtoupper(str_replace('_', ' ', $order->payment_method)) }}</div>
            <div class="value-sm">{{ ucfirst($order->shipping_method) }} — {{ $order->tracking_code ?? 'Aguardando envio' }}</div>
        </div>
    </div>

    {{-- Items table --}}
    <table>
        <thead>
            <tr>
                <th>Produto</th>
                <th>SKU</th>
                <th class="text-right">Preço unit.</th>
                <th class="text-right">Qtd</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>
                    {{ $item->product->name }}
                    @if($item->variant)
                        <div style="font-size:10px; color:#94a3b8">{{ $item->variant->display_name }}</div>
                    @endif
                </td>
                <td style="color:#94a3b8">{{ $item->product->sku }}</td>
                <td class="text-right">R$ {{ number_format($item->unit_price, 2, ',', '.') }}</td>
                <td class="text-right">{{ $item->quantity }}</td>
                <td class="text-right">R$ {{ number_format($item->line_total, 2, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    {{-- Totals --}}
    <div class="totals">
        <div class="totals-row">
            <span>Subtotal</span>
            <span>R$ {{ number_format($order->subtotal, 2, ',', '.') }}</span>
        </div>
        @if($order->discount > 0)
        <div class="totals-row discount">
            <span>Desconto (cupom)</span>
            <span>- R$ {{ number_format($order->discount, 2, ',', '.') }}</span>
        </div>
        @endif
        <div class="totals-row">
            <span>Frete ({{ strtoupper($order->shipping_method) }})</span>
            <span>
                @if($order->shipping_cost == 0)
                    Grátis
                @else
                    R$ {{ number_format($order->shipping_cost, 2, ',', '.') }}
                @endif
            </span>
        </div>
        <div class="totals-row total">
            <span>TOTAL</span>
            <span>{{ $order->formatted_total }}</span>
        </div>
    </div>

    {{-- Footer --}}
    <div class="footer">
        <p>Este documento é um comprovante eletrônico e não possui valor fiscal.</p>
        <p style="margin-top:4px">Para dúvidas, acesse {{ config('app.url') }} ou envie e-mail para contato@vertexurbanstyle.com.br</p>
    </div>

</div>
</body>
</html>
