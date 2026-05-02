@extends('emails.layout')

@section('content')
    <div class="greeting">BEM-VINDO</div>
    <p class="text">
        <strong style="color:#F5F1EA;">{{ $customer->name }}</strong>, agora você é da casa.
    </p>
    <p class="text">
        ERAS é streetwear autoral brasileiro. Drops limitados, tecidos selecionados,
        peças que não vão estar em todo lugar.
    </p>

    <div class="info-box">
        <div class="label">Drop atual</div>
        <div class="value">CONCRETO E BRASA — 12 peças, edição numerada, enquanto durar.</div>
    </div>

    <div class="btn-wrap">
        <a href="{{ config('app.url') }}/produtos" class="btn">
            VER CATÁLOGO
        </a>
    </div>

    <hr class="divider" />
    <p class="text" style="font-size:13px; color:#666666;">
        Próximo drop, você fica sabendo primeiro.
    </p>
@endsection
