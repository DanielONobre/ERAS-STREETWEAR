import { Fragment } from 'react';
import { router } from '@inertiajs/react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@lib/utils';

const OPTIONS = [
    { value: 'featured',   label: 'Mais relevantes' },
    { value: 'newest',     label: 'Mais novos' },
    { value: 'price_asc',  label: 'Menor preço' },
    { value: 'price_desc', label: 'Maior preço' },
    { value: 'bestsellers',label: 'Mais vendidos' },
    { value: 'rating',     label: 'Melhor avaliados' },
];

/**
 * Dropdown de ordenação — atualiza a URL sem reload.
 *
 * @param {object} props
 * @param {string} props.value      - Valor atual (ex: 'featured')
 * @param {object} props.filters    - Outros filtros ativos (preservados na URL)
 * @param {string} props.baseRoute  - URL base para redirect (ex: '/produtos')
 */
export default function SortSelect({ value = 'featured', filters = {}, baseRoute = '/produtos' }) {
    const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

    const handleChange = (option) => {
        router.get(baseRoute, { ...filters, sort: option.value }, {
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <Listbox value={current} onChange={handleChange}>
            <div className="relative">
                <Listbox.Button
                    className="flex items-center gap-2 bg-dark-200 border border-white/[0.08] rounded-xl
                               px-3 py-2 text-sm text-white/70 hover:text-white hover:border-white/20
                               transition-all focus:outline-none focus:ring-1 focus:ring-primary/50
                               min-w-[180px] justify-between"
                >
                    <span>{current.label}</span>
                    <ChevronUpDownIcon className="w-4 h-4 text-white/40" />
                </Listbox.Button>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Listbox.Options
                        className="absolute right-0 mt-1 w-52 bg-dark-100 border border-white/[0.08]
                                   rounded-2xl shadow-2xl py-1.5 z-30 focus:outline-none overflow-hidden"
                    >
                        {OPTIONS.map((option) => (
                            <Listbox.Option
                                key={option.value}
                                value={option}
                                className={({ active }) => cn(
                                    'flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors',
                                    active ? 'bg-white/[0.06] text-white' : 'text-white/60'
                                )}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={selected ? 'font-medium text-white' : ''}>
                                            {option.label}
                                        </span>
                                        {selected && <CheckIcon className="w-4 h-4 text-primary" />}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
