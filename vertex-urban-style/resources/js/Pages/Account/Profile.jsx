import { useState } from 'react';
import { router } from '@inertiajs/react';
import StoreLayout from '@layouts/StoreLayout';
import AccountLayout from './AccountLayout';
import { UserCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function AccountProfile({ user }) {
    const [form, setForm] = useState({
        name:             user.name,
        email:            user.email,
        phone:            user.phone ?? '',
        current_password: '',
        password:         '',
        password_confirmation: '',
    });
    const [errors,   setErrors]   = useState({});
    const [loading,  setLoading]  = useState(false);
    const [section,  setSection]  = useState('info'); // 'info' | 'password'

    const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        router.put(route('account.profile.update'), form, {
            preserveScroll: true,
            onError:  (errs) => { setErrors(errs); setLoading(false); },
            onFinish: () => setLoading(false),
        });
    };

    const Field = ({ label, name, type = 'text', placeholder, required }) => (
        <div>
            <label className="label">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
            <input
                type={type}
                value={form[name]}
                onChange={set(name)}
                placeholder={placeholder}
                className={`input ${errors[name] ? 'input-error' : ''}`}
            />
            {errors[name] && <p className="field-error">{errors[name]}</p>}
        </div>
    );

    return (
        <StoreLayout title="Meu perfil — ERAS">
            <AccountLayout active="profile">
                <h1 className="section-title mb-6">Meu perfil</h1>

                {/* Avatar placeholder */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                        {user.avatar
                            ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            : <UserCircleIcon className="w-8 h-8 text-primary/60" />
                        }
                    </div>
                    <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-white/40">{user.email}</p>
                    </div>
                </div>

                {/* Section tabs */}
                <div className="flex gap-1 border-b border-white/[0.06] mb-6">
                    {[
                        { id: 'info',     label: 'Dados pessoais',  icon: UserCircleIcon  },
                        { id: 'password', label: 'Senha',           icon: LockClosedIcon  },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setSection(id)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                                section === id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-white/50 hover:text-white'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="card p-6 space-y-5">
                        {section === 'info' && (
                            <>
                                <Field label="Nome completo" name="name" required placeholder="João Silva" />
                                <Field label="E-mail"        name="email" type="email" required placeholder="joao@email.com" />
                                <Field label="Telefone"      name="phone" placeholder="(11) 99999-9999" />
                            </>
                        )}

                        {section === 'password' && (
                            <>
                                <Field label="Senha atual"       name="current_password" type="password" placeholder="••••••••" />
                                <Field label="Nova senha"        name="password"         type="password" placeholder="••••••••" />
                                <Field label="Confirmar senha"   name="password_confirmation" type="password" placeholder="••••••••" />
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center disabled:opacity-60"
                        >
                            {loading
                                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : 'Salvar alterações'
                            }
                        </button>
                    </div>
                </form>
            </AccountLayout>
        </StoreLayout>
    );
}
