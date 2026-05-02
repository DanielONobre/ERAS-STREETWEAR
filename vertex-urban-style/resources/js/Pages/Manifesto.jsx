import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StoreLayout from '@layouts/StoreLayout';

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function Manifesto() {
    return (
        <StoreLayout>
            <Head>
                <title>Manifesto — ERAS Streetwear</title>
                <meta name="description" content="O que a gente faz aqui e por que faz." />
            </Head>

            <div className="container-page py-16 lg:py-24 max-w-2xl">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.12 }}
                    className="space-y-12"
                >
                    {/* Eyebrow */}
                    <motion.p
                        variants={fade}
                        className="text-xs font-semibold tracking-[0.4em] text-eras-mustard uppercase"
                    >
                        ERAS STREETWEAR · DROP 01
                    </motion.p>

                    {/* Título */}
                    <motion.h1
                        variants={fade}
                        className="font-display font-bold text-4xl lg:text-5xl tracking-tight text-eras-bone"
                    >
                        MANIFESTO
                    </motion.h1>

                    {/* Parágrafos */}
                    <motion.div variants={fade} className="divider" />

                    <motion.p variants={fade} className="text-lg leading-relaxed text-white/80">
                        A ERAS nasceu de uma observação simples: roupa boa tem origem. Tem intenção.
                        Tem o nome de quem fez. A gente cansa de peça sem história — produzida em série,
                        vendida em promoção, esquecida na semana seguinte.
                    </motion.p>

                    <motion.p variants={fade} className="text-lg leading-relaxed text-white/80">
                        Cada drop é fechado. Tiragem definida antes do primeiro corte.
                        Sem reposição, sem desconto, sem negociação depois que esgota.
                        Você pega ou alguém pega no seu lugar. Essa é a lógica.
                        Não é criada artificialmente — é o tamanho real do que a gente consegue fazer bem.
                    </motion.p>

                    <motion.p variants={fade} className="text-lg leading-relaxed text-white/80">
                        Modelagem, tecido e produção em São Paulo.
                        Quem corta, quem cose, quem embala — tudo dentro de um raio que a gente conhece
                        pessoalmente. A qualidade não é um argumento de venda. É uma consequência de
                        saber exatamente o que acontece em cada etapa.
                    </motion.p>

                    <motion.p variants={fade} className="text-lg leading-relaxed text-white/80">
                        ERAS é streetwear porque nasce da rua. Da mistura, do concreto, do improviso
                        que vira estética. Mas a execução é outra conversa. Cada peça passa por
                        revisão antes de sair. Se não tá certo, não sai.
                        Simples assim.
                    </motion.p>

                    <motion.div variants={fade} className="divider" />

                    {/* Assinatura */}
                    <motion.p
                        variants={fade}
                        className="font-display text-sm tracking-widest text-white/40 uppercase"
                    >
                        — ERAS, São Paulo
                    </motion.p>
                </motion.div>
            </div>
        </StoreLayout>
    );
}
