<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    /**
     * Usuário autenticado pode criar avaliações.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Usuário pode editar a própria avaliação não aprovada; admin pode editar qualquer uma.
     */
    public function update(User $user, Review $review): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $review->user_id === $user->id && !$review->is_approved;
    }

    /**
     * Usuário pode deletar a própria avaliação; admin pode deletar qualquer uma.
     */
    public function delete(User $user, Review $review): bool
    {
        return $user->isAdmin() || $review->user_id === $user->id;
    }

    /**
     * Somente admins aprovam avaliações.
     */
    public function approve(User $user, Review $review): bool
    {
        return $user->isAdmin();
    }
}
