@extends('emails.layout')

@section('content')
    <div class="greeting">Redefinição de senha</div>
    <p class="text">Olá, <strong>{{ $customer->name }}</strong>!</p>
    <p class="text">
        Recebemos uma solicitação para redefinir a senha da sua conta.
        Clique no botão abaixo para criar uma nova senha:
    </p>

    <div class="btn-wrap">
        <a href="{{ $url }}" class="btn">
            Redefinir minha senha
        </a>
    </div>

    <div class="info-box warning">
        <div class="label">Importante</div>
        <div class="value" style="font-size:14px; font-weight:400; color:#94a3b8; margin-top:4px">
            Este link expira em <strong style="color:#f97316">60 minutos</strong>.
            Se você não solicitou a redefinição, ignore este e-mail — sua senha permanece a mesma.
        </div>
    </div>

    <hr class="divider" />
    <p class="text" style="font-size:13px">
        Se o botão não funcionar, copie e cole o link abaixo no seu navegador:<br />
        <a href="{{ $url }}" style="word-break:break-all; font-size:12px">{{ $url }}</a>
    </p>
@endsection
