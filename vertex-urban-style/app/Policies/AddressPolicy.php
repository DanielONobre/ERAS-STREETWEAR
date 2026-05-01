<?php

namespace App\Policies;

use App\Models\Address;
use App\Models\User;

class AddressPolicy
{
    /**
     * Qualquer usuário autenticado pode criar endereços.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Usuário só pode ver/editar/deletar seus próprios endereços.
     */
    public function view(User $user, Address $address): bool
    {
        return $user->isAdmin() || $address->user_id === $user->id;
    }

    public function update(User $user, Address $address): bool
    {
        return $user->isAdmin() || $address->user_id === $user->id;
    }

    public function delete(User $user, Address $address): bool
    {
        return $user->isAdmin() || $address->user_id === $user->id;
    }
}
