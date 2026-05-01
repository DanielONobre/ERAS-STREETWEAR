<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ImageProcessingService
{
    private const MAX_WIDTH  = 1200;
    private const MAX_HEIGHT = 1200;
    private const QUALITY    = 82;

    /**
     * Processa e armazena uma imagem de produto.
     * Redimensiona para máx 1200×1200px e converte para WebP.
     * Retorna o path relativo ao storage/app/public.
     */
    public function processProductImage(UploadedFile $file, string $directory = 'products'): string
    {
        $filename = Str::uuid() . '.webp';
        $path     = $directory . '/' . $filename;
        $fullPath = storage_path('app/public/' . $path);

        // Garante que o diretório existe
        if (!is_dir(dirname($fullPath))) {
            mkdir(dirname($fullPath), 0755, true);
        }

        if (extension_loaded('imagick')) {
            $this->processWithImagick($file->getRealPath(), $fullPath);
        } elseif (extension_loaded('gd')) {
            $this->processWithGd($file->getRealPath(), $fullPath, $file->getMimeType());
        } else {
            // Fallback: armazena sem conversão se não houver extensão de imagem
            $file->storeAs($directory, pathinfo($filename, PATHINFO_FILENAME) . '.' . $file->getClientOriginalExtension(), 'public');
            return $directory . '/' . pathinfo($filename, PATHINFO_FILENAME) . '.' . $file->getClientOriginalExtension();
        }

        return $path;
    }

    private function processWithImagick(string $sourcePath, string $destPath): void
    {
        $image = new \Imagick($sourcePath);
        $image->stripImage();

        $w = $image->getImageWidth();
        $h = $image->getImageHeight();

        if ($w > self::MAX_WIDTH || $h > self::MAX_HEIGHT) {
            $image->thumbnailImage(self::MAX_WIDTH, self::MAX_HEIGHT, true);
        }

        $image->setImageFormat('webp');
        $image->setImageCompressionQuality(self::QUALITY);
        $image->writeImage($destPath);
        $image->destroy();
    }

    private function processWithGd(string $sourcePath, string $destPath, string $mime): void
    {
        $source = match ($mime) {
            'image/jpeg' => imagecreatefromjpeg($sourcePath),
            'image/png'  => imagecreatefrompng($sourcePath),
            'image/gif'  => imagecreatefromgif($sourcePath),
            'image/webp' => imagecreatefromwebp($sourcePath),
            default      => throw new \RuntimeException("Tipo de imagem não suportado: {$mime}"),
        };

        $origW = imagesx($source);
        $origH = imagesy($source);

        [$newW, $newH] = $this->calculateDimensions($origW, $origH);

        $dest = imagecreatetruecolor($newW, $newH);

        // Preserva transparência para PNG
        if ($mime === 'image/png') {
            imagealphablending($dest, false);
            imagesavealpha($dest, true);
            $transparent = imagecolorallocatealpha($dest, 255, 255, 255, 127);
            imagefilledrectangle($dest, 0, 0, $newW, $newH, $transparent);
        }

        imagecopyresampled($dest, $source, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
        imagewebp($dest, $destPath, self::QUALITY);

        imagedestroy($source);
        imagedestroy($dest);
    }

    private function calculateDimensions(int $origW, int $origH): array
    {
        if ($origW <= self::MAX_WIDTH && $origH <= self::MAX_HEIGHT) {
            return [$origW, $origH];
        }

        $ratio = min(self::MAX_WIDTH / $origW, self::MAX_HEIGHT / $origH);
        return [(int) round($origW * $ratio), (int) round($origH * $ratio)];
    }
}
