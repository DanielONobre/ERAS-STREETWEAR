import { useForm } from '@inertiajs/react';
import AppLayout from '@layouts/AppLayout';
import { UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function ProfileShow({ user, addresses }) {
    const profileForm = useForm({
        name:  user.name,
        email: user.email,
        phone: user.phone ?? '',
    });

    const passwordForm = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    });

    const updateProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('profile.update'));
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.patch(route('profile.update-password'), {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AppLayout title="Minha Conta — ERAS Streetwear">
            <div className="container-page py-8 lg:py-12 max-w-2xl">
                <h1 className="section-title mb-8">Minha Conta</h1>

                {/* Avatar */}
                <div className="card p-6 flex items-center gap-5 mb-6">
                    <img src={user.avatar} alt={user.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/40" />
                    <div>
                        <div className="font-display font-semibold text-lg">{user.name}</div>
                        <div className="text-sm text-white/40">{user.email}</div>
                        <div className="text-xs text-white/30 mt-1">{user.orders_count} pedidos realizados</div>
                    </div>
                </div>

                {/* Editar perfil */}
                <div className="card p-6 mb-6">
                    <h2 className="font-semibold mb-5">Dados pessoais</h2>
                    <form onSubmit={updateProfile} className="space-y-4">
                        {[
                            { id: 'name', label: 'Nome', icon: UserIcon },
                            { id: 'email', label: 'E-mail', icon: EnvelopeIcon, type: 'email' },
                            { id: 'phone', label: 'Telefone', icon: PhoneIcon, type: 'tel' },
                        ].map(({ id, label, icon: Icon, type = 'text' }) => (
                            <div key={id}>
                                <label className="label">{label}</label>
                                <div className="relative">
                                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type={type}
                                        value={profileForm.data[id]}
                                        onChange={e => profileForm.setData(id, e.target.value)}
                                        className={`input pl-10 ${profileForm.errors[id] ? 'input-error' : ''}`}
                                    />
                                </div>
                                {profileForm.errors[id] && <p className="field-error">{profileForm.errors[id]}</p>}
                            </div>
                        ))}
                        <button type="submit" disabled={profileForm.processing} className="btn-primary">
                            Salvar alterações
                        </button>
                    </form>
                </div>

                {/* Alterar senha */}
                <div className="card p-6">
                    <h2 className="font-semibold mb-5">Alterar senha</h2>
                    <form onSubmit={updatePassword} className="space-y-4">
                        {[
                            { id: 'current_password', label: 'Senha atual', autoComplete: 'current-password' },
                            { id: 'password',         label: 'Nova senha',   autoComplete: 'new-password' },
                            { id: 'password_confirmation', label: 'Confirmar nova senha', autoComplete: 'new-password' },
                        ].map(({ id, label, autoComplete }) => (
                            <div key={id}>
                                <label className="label">{label}</label>
                                <div className="relative">
                                    <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="password"
                                        autoComplete={autoComplete}
                                        value={passwordForm.data[id]}
                                        onChange={e => passwordForm.setData(id, e.target.value)}
                                        className={`input pl-10 ${passwordForm.errors[id] ? 'input-error' : ''}`}
                                    />
                                </div>
                                {passwordForm.errors[id] && <p className="field-error">{passwordForm.errors[id]}</p>}
                            </div>
                        ))}
                        <button type="submit" disabled={passwordForm.processing} className="btn-outline">
                            Alterar senha
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
