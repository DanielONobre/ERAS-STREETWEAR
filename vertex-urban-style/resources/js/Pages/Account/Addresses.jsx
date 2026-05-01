import { useState } from 'react';
import { router } from '@inertiajs/react';
import StoreLayout from '@layouts/StoreLayout';
import AccountLayout from './AccountLayout';
import AddressForm from '@components/UI/AddressForm';
import Modal from '@components/UI/Modal';
import { PlusIcon, PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function AccountAddresses({ addresses }) {
    const [showAdd,  setShowAdd]  = useState(false);
    const [editing,  setEditing]  = useState(null); // Address object

    const handleStore = (data) => {
        router.post(route('account.addresses.store'), data, {
            onSuccess: () => setShowAdd(false),
            preserveScroll: true,
        });
    };

    const handleUpdate = (data) => {
        router.put(route('account.addresses.update', editing.id), data, {
            onSuccess: () => setEditing(null),
            preserveScroll: true,
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Remover este endereço?')) return;
        router.delete(route('account.addresses.destroy', id), { preserveScroll: true });
    };

    return (
        <StoreLayout title="Endereços — VERTEX">
            <AccountLayout active="addresses">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="section-title">Meus endereços</h1>
                    <button onClick={() => setShowAdd(true)} className="btn-primary btn-sm gap-2">
                        <PlusIcon className="w-4 h-4" /> Adicionar
                    </button>
                </div>

                {addresses.length === 0 ? (
                    <div className="card p-16 text-center">
                        <p className="text-white/40 mb-4">Nenhum endereço cadastrado.</p>
                        <button onClick={() => setShowAdd(true)} className="btn-primary btn-sm inline-flex gap-2">
                            <PlusIcon className="w-4 h-4" /> Adicionar endereço
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                            <div key={addr.id} className={`card p-5 relative ${addr.is_default ? 'border-primary/30' : ''}`}>
                                {addr.is_default && (
                                    <span className="absolute top-4 right-4 badge-primary text-xs flex items-center gap-1">
                                        <StarSolid className="w-3 h-3" /> Padrão
                                    </span>
                                )}
                                <p className="font-medium mb-1">{addr.name}</p>
                                {addr.phone && <p className="text-xs text-white/40 mb-2">{addr.phone}</p>}
                                <div className="text-sm text-white/50 space-y-0.5">
                                    <p>{addr.street}, {addr.number}{addr.complement ? `, ${addr.complement}` : ''}</p>
                                    <p>{addr.neighborhood}</p>
                                    <p>{addr.city}/{addr.state} — {addr.zip_code}</p>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => setEditing(addr)}
                                        className="btn-ghost btn-sm gap-1.5"
                                    >
                                        <PencilIcon className="w-3.5 h-3.5" /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="btn-ghost btn-sm text-red-400 hover:text-red-300 gap-1.5"
                                    >
                                        <TrashIcon className="w-3.5 h-3.5" /> Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </AccountLayout>

            {/* Add modal */}
            <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Novo endereço" size="lg">
                <div className="p-6">
                    <AddressForm onSubmit={handleStore} submitLabel="Salvar endereço" />
                </div>
            </Modal>

            {/* Edit modal */}
            <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar endereço" size="lg">
                <div className="p-6">
                    {editing && (
                        <AddressForm
                            initialData={editing}
                            onSubmit={handleUpdate}
                            submitLabel="Atualizar endereço"
                        />
                    )}
                </div>
            </Modal>
        </StoreLayout>
    );
}
