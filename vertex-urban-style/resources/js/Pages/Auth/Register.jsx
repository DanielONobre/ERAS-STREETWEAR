import { useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShow] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', phone: '', password: '', password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    const fields = [
        { id: 'name',  label: 'Nome completo', type: 'text',  icon: UserIcon,     placeholder: 'João Silva',       autoComplete: 'name' },
        { id: 'email', label: 'E-mail',        type: 'email', icon: EnvelopeIcon, placeholder: 'seu@email.com',    autoComplete: 'email' },
        { id: 'phone', label: 'Telefone',      type: 'tel',   icon: PhoneIcon,    placeholder: '(11) 99999-9999',  autoComplete: 'tel', optional: true },
    ];

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link href="/">
                        <div className="font-display font-bold text-3xl tracking-[0.3em] uppercase text-eras-bone select-none inline-block">
                            ERAS<span className="text-eras-mustard">.</span>
                        </div>
                    </Link>
                    <p className="font-display font-bold text-xl tracking-tight mt-4">CRIAR CONTA</p>
                    <p className="text-white/40 text-sm mt-1">Bem-vindo. Drop novo, você fica sabendo primeiro.</p>
                </div>

                <div className="card p-8">
                    <form onSubmit={submit} className="space-y-5">
                        {fields.map(({ id, label, type, icon: Icon, placeholder, autoComplete, optional }) => (
                            <div key={id}>
                                <label className="label" htmlFor={id}>
                                    {label} {optional && <span className="text-white/30">(opcional)</span>}
                                </label>
                                <div className="relative">
                                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        id={id} type={type} autoComplete={autoComplete}
                                        value={data[id]}
                                        onChange={e => setData(id, e.target.value)}
                                        placeholder={placeholder}
                                        className={`input pl-10 ${errors[id] ? 'input-error' : ''}`}
                                    />
                                </div>
                                {errors[id] && <p className="field-error">{errors[id]}</p>}
                            </div>
                        ))}

                        <div>
                            <label className="label" htmlFor="password">Senha</label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    id="password" type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                                />
                                <button type="button" onClick={() => setShow(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="field-error">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="label" htmlFor="password_confirmation">Confirmar senha</label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    id="password_confirmation" type="password"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="Repita a senha"
                                    className="input pl-10"
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={processing} className="btn-primary w-full justify-center">
                            {processing && (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}
                            Criar conta
                        </button>
                    </form>

                    <div className="divider my-6" />

                    <p className="text-center text-sm text-white/50">
                        Já tem conta?{' '}
                        <Link href={route('login')} className="text-primary hover:text-primary-400 font-medium">
                            Entrar
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
