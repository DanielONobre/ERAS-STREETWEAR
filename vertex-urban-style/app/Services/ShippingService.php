<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ShippingService
{
    private const VIACEP_URL    = 'https://viacep.com.br/ws/%s/json/';
    private const ORIGIN_CEP    = '01310-100'; // CEP de origem (São Paulo — Av. Paulista)
    private const BASE_RATE     = 8.0;         // R$ por kg
    private const BASE_PRICE_PAC   = 14.90;
    private const BASE_PRICE_SEDEX = 24.90;

    // ─── CEP Validation ───────────────────────────────────────────────────────

    /**
     * Valida e retorna dados de endereço para um CEP.
     *
     * @return array{valid: bool, address: array|null}
     */
    public function validateCep(string $cep): array
    {
        $cep = preg_replace('/\D/', '', $cep);

        if (strlen($cep) !== 8) {
            return ['valid' => false, 'address' => null];
        }

        $cacheKey = "cep:{$cep}";

        $cached = Cache::remember($cacheKey, now()->addDays(7), function () use ($cep) {
            try {
                $response = Http::timeout(5)->get(sprintf(self::VIACEP_URL, $cep));

                if ($response->failed() || $response->json('erro')) {
                    return null;
                }

                $data = $response->json();

                return [
                    'cep'          => $data['cep'] ?? '',
                    'street'       => $data['logradouro'] ?? '',
                    'neighborhood' => $data['bairro'] ?? '',
                    'city'         => $data['localidade'] ?? '',
                    'state'        => $data['uf'] ?? '',
                    'ibge'         => $data['ibge'] ?? '',
                ];
            } catch (\Exception $e) {
                Log::warning('ShippingService::validateCep — ViaCEP error: ' . $e->getMessage(), ['cep' => $cep]);
                return null;
            }
        });

        return [
            'valid'   => $cached !== null,
            'address' => $cached,
        ];
    }

    // ─── Shipping Calculation ─────────────────────────────────────────────────

    /**
     * Calcula opções de frete para o CEP e carrinho informados.
     *
     * Estrutura de retorno:
     * [
     *   ['name' => 'PAC', 'code' => 'pac', 'price' => 14.90, 'days' => 7],
     *   ['name' => 'SEDEX', 'code' => 'sedex', 'price' => 24.90, 'days' => 2],
     * ]
     */
    public function calculate(string $cep, Cart $cart): array
    {
        $cep         = preg_replace('/\D/', '', $cep);
        $totalWeight = $this->calculateTotalWeight($cart);
        $subtotal    = (float) $cart->subtotal;

        $freeThreshold = (float) (Setting::get('free_shipping_threshold') ?? 299.90);
        $isFree        = $subtotal >= $freeThreshold;

        $state      = $this->getStateFromCep($cep);
        $multiplier = $this->getRegionalMultiplier($state);

        $pacPrice   = $isFree ? 0.0  : $this->calcPrice(self::BASE_PRICE_PAC, $totalWeight, $multiplier);
        $sedexPrice = $isFree ? 0.0  : $this->calcPrice(self::BASE_PRICE_SEDEX, $totalWeight, $multiplier);
        $pacDays    = $this->calcDays(7, $state);
        $sedexDays  = $this->calcDays(2, $state);

        $options = [
            [
                'name'     => 'PAC' . ($isFree ? ' (Frete Grátis)' : ''),
                'code'     => 'pac',
                'price'    => round($pacPrice, 2),
                'days'     => $pacDays,
                'free'     => $isFree,
                'label'    => $isFree ? 'Grátis' : 'R$ ' . number_format($pacPrice, 2, ',', '.'),
            ],
            [
                'name'     => 'SEDEX' . ($isFree ? ' (Frete Grátis)' : ''),
                'code'     => 'sedex',
                'price'    => round($sedexPrice, 2),
                'days'     => $sedexDays,
                'free'     => $isFree,
                'label'    => $isFree ? 'Grátis' : 'R$ ' . number_format($sedexPrice, 2, ',', '.'),
            ],
        ];

        // ── Melhor Envio (produção) ──────────────────────────────────────────
        // TODO: descomentar e implementar quando tiver credenciais Melhor Envio
        // if (config('services.melhor_envio.token')) {
        //     return $this->calculateViaMelhorEnvio($cep, $cart);
        // }

        return $options;
    }

    // ─── Private Helpers ─────────────────────────────────────────────────────

    private function calculateTotalWeight(Cart $cart): float
    {
        $weight = 0.0;
        foreach ($cart->items as $item) {
            $weight += ($item->product->weight ?? 0.3) * $item->quantity;
        }
        return max($weight, 0.3); // mínimo 300g
    }

    private function calcPrice(float $base, float $weight, float $multiplier): float
    {
        return ($base + (max($weight - 1, 0) * self::BASE_RATE)) * $multiplier;
    }

    private function calcDays(int $base, ?string $state): int
    {
        return match ($state) {
            'SP'            => $base,
            'RJ', 'MG', 'ES' => $base + 1,
            'RS', 'SC', 'PR' => $base + 2,
            'BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA' => $base + 3,
            'MT', 'MS', 'GO', 'DF', 'TO'                           => $base + 3,
            default         => $base + 5,
        };
    }

    private function getRegionalMultiplier(?string $state): float
    {
        return match ($state) {
            'SP'                                                     => 1.0,
            'RJ', 'MG', 'ES'                                        => 1.1,
            'RS', 'SC', 'PR'                                        => 1.15,
            'BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'  => 1.3,
            'AM', 'PA', 'RR', 'RO', 'AC', 'AP'                     => 1.5,
            default                                                   => 1.2,
        };
    }

    /**
     * Infere o estado pelo prefixo do CEP (tabela ECT).
     */
    private function getStateFromCep(string $cep): ?string
    {
        $prefix = (int) substr($cep, 0, 5);

        return match (true) {
            $prefix >= 1000  && $prefix <= 19999  => 'SP',
            $prefix >= 20000 && $prefix <= 28999  => 'RJ',
            $prefix >= 29000 && $prefix <= 29999  => 'ES',
            $prefix >= 30000 && $prefix <= 39999  => 'MG',
            $prefix >= 40000 && $prefix <= 48999  => 'BA',
            $prefix >= 49000 && $prefix <= 49999  => 'SE',
            $prefix >= 50000 && $prefix <= 56999  => 'PE',
            $prefix >= 57000 && $prefix <= 57999  => 'AL',
            $prefix >= 58000 && $prefix <= 58999  => 'PB',
            $prefix >= 59000 && $prefix <= 59999  => 'RN',
            $prefix >= 60000 && $prefix <= 63999  => 'CE',
            $prefix >= 64000 && $prefix <= 64999  => 'PI',
            $prefix >= 65000 && $prefix <= 65999  => 'MA',
            $prefix >= 66000 && $prefix <= 68899  => 'PA',
            $prefix >= 68900 && $prefix <= 68999  => 'AP',
            $prefix >= 69000 && $prefix <= 69299  => 'AM',
            $prefix >= 69300 && $prefix <= 69399  => 'RR',
            $prefix >= 69400 && $prefix <= 69899  => 'AM',
            $prefix >= 69900 && $prefix <= 69999  => 'AC',
            $prefix >= 70000 && $prefix <= 72799  => 'DF',
            $prefix >= 72800 && $prefix <= 72999  => 'GO',
            $prefix >= 73000 && $prefix <= 73699  => 'GO',
            $prefix >= 73700 && $prefix <= 73999  => 'DF',
            $prefix >= 74000 && $prefix <= 76799  => 'GO',
            $prefix >= 76800 && $prefix <= 76999  => 'RO',
            $prefix >= 77000 && $prefix <= 77999  => 'TO',
            $prefix >= 78000 && $prefix <= 78899  => 'MT',
            $prefix >= 78900 && $prefix <= 78999  => 'RO',
            $prefix >= 79000 && $prefix <= 79999  => 'MS',
            $prefix >= 80000 && $prefix <= 87999  => 'PR',
            $prefix >= 88000 && $prefix <= 89999  => 'SC',
            $prefix >= 90000 && $prefix <= 99999  => 'RS',
            default                                => null,
        };
    }
}
