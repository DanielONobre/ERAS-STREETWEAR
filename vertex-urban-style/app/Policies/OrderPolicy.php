<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * Usuário pode ver o próprio pedido; admin pode ver qualquer pedido.
     */
    public function view(User $user, Order $order): bool
    {
        return $user->isAdmin() || $order->user_id === $user->id;
    }

    /**
     * Somente admins atualizam pedidos (status, tracking).
     */
    public function update(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }

    /**
     * Usuário pode cancelar o próprio pedido se ainda estiver em estado cancelável.
     */
    public function cancel(User $user, Order $order): bool
    {
        return $order->user_id === $user->id && $order->canBeCancelled();
    }

    /**
     * Admins podem deletar pedidos (soft delete).
     */
    public function delete(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }
}
