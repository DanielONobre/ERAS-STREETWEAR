<?php $__env->startSection('content'); ?>
    <div class="greeting">BEM-VINDO</div>
    <p class="text">
        <strong style="color:#F5F1EA;"><?php echo e($customer->name); ?></strong>, agora você é da casa.
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
        <a href="<?php echo e(config('app.url')); ?>/produtos" class="btn">
            VER CATÁLOGO
        </a>
    </div>

    <hr class="divider" />
    <p class="text" style="font-size:13px; color:#666666;">
        Próximo drop, você fica sabendo primeiro.
    </p>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('emails.layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\ERAS-STREETWEAR\vertex-urban-style\resources\views/emails/welcome.blade.php ENDPATH**/ ?>