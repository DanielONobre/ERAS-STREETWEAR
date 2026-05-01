<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name'              => 'ERAS Admin',
                'email'             => 'admin@eras.com.br',
                'email_verified_at' => now(),
                'password'          => Hash::make('eras2026'),
                'phone'             => '(11) 99999-0001',
                'cpf'               => null,
                'avatar'            => null,
                'is_admin'          => true,
                'role'              => 'admin',
                'is_active'         => true,
                'provider'          => null,
                'provider_id'       => null,
                'remember_token'    => null,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'name'              => 'Cliente Teste',
                'email'             => 'cliente@teste.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('password'),
                'phone'             => '(11) 98888-0002',
                'cpf'               => '123.456.789-00',
                'avatar'            => null,
                'is_admin'          => false,
                'role'              => 'customer',
                'is_active'         => true,
                'provider'          => null,
                'provider_id'       => null,
                'remember_token'    => null,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->updateOrInsert(
                ['email' => $user['email']],
                $user
            );
        }

        // Endereço padrão para o cliente de teste
        $clienteId = DB::table('users')->where('email', 'cliente@teste.com')->value('id');

        DB::table('addresses')->insert([
            'user_id'      => $clienteId,
            'name'         => 'Cliente Teste',
            'email'        => 'cliente@teste.com',
            'phone'        => '(11) 98888-0002',
            'cpf'          => '123.456.789-00',
            'zip_code'     => '01310-100',
            'street'       => 'Avenida Paulista',
            'number'       => '1000',
            'complement'   => 'Apto 42',
            'neighborhood' => 'Bela Vista',
            'city'         => 'São Paulo',
            'state'        => 'SP',
            'country'      => 'BR',
            'is_default'   => true,
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);
    }
}
