import { useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShow] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '', password: '', remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/">
                        <span className="font-display text-3xl font-bold text-gradient-brand">ERAS</span>
                    </Link>
                    <p className="text-white/40 text-sm mt-2">Entre na sua conta</p>
                </div>

                <div className="card p-8">
                    {status && (
                        <div className="badge-success p-3 rounded-xl mb-6 text-sm">{status}</div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="label" htmlFor="email">E-mail</label>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    id="email" type="email" autoComplete="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="seu@email.com"
                                    className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                                />
                            </div>
                            {errors.email && <p className="field-error">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="label mb-0" htmlFor="password">Senha</label>
                                {canResetPassword && (
                                    <Link href="#" className="text-xs text-primary hover:text-primary-400">
                                        Esqueceu a senha?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                                />
                                <button type="button" onClick={() => setShow(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="field-error">{errors.password}</p>}
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                                className="form-checkbox rounded bg-dark-100 border-white/20 text-primary"
                            />
                            <span className="text-sm text-white/60">Lembrar de mim</span>
                        </label>

                        <button type="submit" disabled={processing} className="btn-primary w-full justify-center">
                            {processing && (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}
                            Entrar
                        </button>
                    </form>

                    <div className="divider my-6" />

                    <p className="text-center text-sm text-white/50">
                        Não tem uma conta?{' '}
                        <Link href={route('register')} className="text-primary hover:text-primary-400 font-medium">
                            Criar conta
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
