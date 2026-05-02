<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>" class="dark">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0F0F0F" />
    <meta name="description" content="ERAS STREETWEAR — Streetwear autoral brasileiro. Drops limitados, tecidos selecionados, peças com história. São Paulo." />
    <meta name="keywords" content="streetwear brasileiro, streetwear premium, drop limitado, moda autoral, roupas urbanas, eras streetwear" />
    <meta name="author" content="ERAS STREETWEAR" />
    <meta name="robots" content="index, follow" />

    
    <title inertia><?php echo e(config('app.name', 'ERAS STREETWEAR')); ?></title>

    
    <?php
        $canonical = request()->url();
        // Remove parâmetros de paginação e filtros do canonical
        $query = request()->query();
        unset($query['page']);
        $baseCanonical = count($query)
            ? request()->url() . '?' . http_build_query($query)
            : request()->url();
    ?>
    <link rel="canonical" href="<?php echo e($baseCanonical); ?>" />

    
    <meta property="og:site_name" content="ERAS STREETWEAR" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="<?php echo e($baseCanonical); ?>" />
    <meta property="og:title" content="ERAS STREETWEAR — Atitude não é tendência." />
    <meta property="og:description" content="Streetwear autoral brasileiro. Drops limitados, tecidos selecionados, peças que não vão estar em todo lugar." />
    <meta property="og:image" content="<?php echo e(asset('og-image.png')); ?>" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="pt_BR" />

    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@erasstreetwear" />
    <meta name="twitter:title" content="ERAS STREETWEAR — Atitude não é tendência." />
    <meta name="twitter:description" content="Streetwear autoral brasileiro. Drops limitados." />
    <meta name="twitter:image" content="<?php echo e(asset('og-image.png')); ?>" />

    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

    
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="manifest" href="/site.webmanifest" />

    
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>" />

    
    <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->head; } ?>

    
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.jsx']); ?>
</head>
<body class="font-body bg-dark text-white antialiased">
    <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } else { ?><div id="app" data-page="<?php echo e(json_encode($page)); ?>"></div><?php } ?>
</body>
</html>
<?php /**PATH C:\ERAS-STREETWEAR\vertex-urban-style\resources\views/app.blade.php ENDPATH**/ ?>