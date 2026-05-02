<?php $__env->startSection('content'); ?>
    <div class="greeting">VOCÊ TÁ NA LISTA</div>
    <p class="text">
        Tudo certo, <strong style="color:#F5F1EA;"><?php echo e($email); ?></strong>.
    </p>
    <p class="text">
        Drop novo, primeiro aviso. Sem spam, sem promessa de desconto fake.
    </p>

    <div class="info-box">
        <div class="label">Drop atual</div>
        <div class="value">CONCRETO E BRASA — 12 peças numeradas, enquanto durar.</div>
    </div>

    <div class="btn-wrap">
        <a href="<?php echo e(config('app.url')); ?>/produtos" class="btn">
            VER CATÁLOGO
        </a>
    </div>

    <hr class="divider" />
    <p class="text" style="font-size:13px; color:#666666;">
        Se mudar de ideia, é só responder esse email pedindo pra sair da lista.
    </p>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('emails.layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\ERAS-STREETWEAR\vertex-urban-style\resources\views/emails/newsletter-subscribed.blade.php ENDPATH**/ ?>