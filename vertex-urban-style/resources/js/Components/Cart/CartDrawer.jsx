import { Fragment } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ShoppingBagIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function CartDrawer({ open, onClose }) {
    const { cart } = usePage().props;

    // Cart items são carregados na página do carrinho, aqui exibimos apenas o summary
    // Para um drawer completo, seria necessário um state global ou Suspense
    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    return (
        <Transition show={open} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-[60]">

                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-150"  leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-dark/70 backdrop-blur-sm" aria-hidden="true" />
                </Transition.Child>

                {/* Panel */}
                <div className="fixed inset-y-0 right-0 flex max-w-full">
                    <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-300"
                        enterFrom="translate-x-full" enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-200"
                        leaveFrom="translate-x-0"  leaveTo="translate-x-full"
                    >
                        <Dialog.Panel className="relative flex flex-col w-screen max-w-md bg-dark-100 border-l border-white/[0.06] shadow-2xl">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                                <Dialog.Title className="font-display font-semibold text-lg flex items-center gap-2">
                                    <ShoppingBagIcon className="w-5 h-5 text-primary" />
                                    Carrinho
                                    {cart.count > 0 && (
                                        <span className="badge-primary">{cart.count}</span>
                                    )}
                                </Dialog.Title>
                                <button
                                    onClick={onClose}
                                    className="btn-icon text-white/50 hover:text-white"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {cart.count === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                                        <div className="w-20 h-20 rounded-full bg-white/[0.04] flex items-center justify-center">
                                            <ShoppingBagIcon className="w-10 h-10 text-white/20" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white/70">Carrinho vazio</p>
                                            <p className="text-sm text-white/30 mt-1">Adicione produtos para começar</p>
                                        </div>
                                        <Link
                                            href={route('products.index')}
                                            onClick={onClose}
                                            className="btn-primary"
                                        >
                                            Ver produtos
                                        </Link>
                                    </div>
                                ) : (
                                    <p className="text-white/40 text-sm">
                                        {cart.count} {cart.count === 1 ? 'item' : 'itens'} no carrinho.{' '}
                                        <Link
                                            href={route('cart.index')}
                                            onClick={onClose}
                                            className="text-primary hover:text-primary-400 underline"
                                        >
                                            Ver carrinho completo
                                        </Link>
                                    </p>
                                )}
                            </div>

                            {/* Footer */}
                            {cart.count > 0 && (
                                <div className="border-t border-white/[0.06] px-6 py-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/50">Subtotal</span>
                                        <span className="font-semibold text-white">{fmt(cart.subtotal)}</span>
                                    </div>
                                    <Link
                                        href={route('cart.index')}
                                        onClick={onClose}
                                        className="btn-primary w-full justify-center"
                                    >
                                        Finalizar compra
                                    </Link>
                                    <button
                                        onClick={onClose}
                                        className="btn-ghost w-full justify-center text-sm"
                                    >
                                        Continuar comprando
                                    </button>
                                </div>
                            )}
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
