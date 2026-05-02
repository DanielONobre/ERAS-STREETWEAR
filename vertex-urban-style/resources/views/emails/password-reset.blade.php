@extends('emails.layout')

@section('content')
    <div class="greeting">REDEFINIÇÃO DE SENHA</div>
    <p class="text">
        Alguém (esperamos que você) pediu pra redefinir a senha da sua conta ERAS.
    </p>
    <p class="text">
        Se foi você, clica no botão abaixo. Se não foi, ignora esse email
        — sua senha continua a mesma.
    </p>

    <div class="btn-wrap">
        <a href="{{ $url }}" class="btn">
            REDEFINIR SENHA
        </a>
    </div>

    <div class="info-box warning">
        <div class="label">Atenção</div>
        <div class="value" style="font-size:14px; font-weight:400; color:#AAAAAA; margin-top:4px;">
            Esse link expira em <strong style="color:#F5F1EA;">60 minutos</strong>.
        </div>
    </div>

    <hr class="divider" />
    <p class="text" style="font-size:13px;">
        Se o botão não funcionar, copia e cola o link abaixo no navegador:<br />
        <a href="{{ $url }}" style="word-break:break-all; font-size:12px; color:#C8932E;">{{ $url }}</a>
    </p>
@endsection
