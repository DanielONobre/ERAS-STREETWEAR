import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { fetchCep, formatCep } from '@lib/utils';
import { cn } from '@lib/utils';

/**
 * Formulário de endereço com auto-preenchimento via ViaCEP.
 *
 * @param {object}   props
 * @param {object}   [props.initialData]   - Dados iniciais (Address model)
 * @param {Function} [props.onSubmit]      - Callback(data) chamado ao submeter
 * @param {string}   [props.submitLabel]   - Label do botão (default "Salvar endereço")
 * @param {boolean}  [props.loading]
 */
export default function AddressForm({ initialData = {}, onSubmit, submitLabel = 'Salvar endereço', loading = false }) {
    const [form, setForm] = useState({
        name:         initialData.name         ?? '',
        phone:        initialData.phone        ?? '',
        zip_code:     initialData.zip_code     ?? '',
        street:       initialData.street       ?? '',
        number:       initialData.number       ?? '',
        complement:   initialData.complement   ?? '',
        neighborhood: initialData.neighborhood ?? '',
        city:         initialData.city         ?? '',
        state:        initialData.state        ?? '',
        is_default:   initialData.is_default   ?? false,
    });
    const [errors, setErrors]     = useState({});
    const [cepStatus, setCepStatus] = useState(null); // null | 'loading' | 'ok' | 'error'

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    // ── CEP lookup ────────────────────────────────────────────────────────────

    const handleCepBlur = useCallback(async () => {
        const raw = form.zip_code.replace(/\D/g, '');
        if (raw.length !== 8) return;

        setCepStatus('loading');
        const data = await fetchCep(raw);

        if (!data) {
            setCepStatus('error');
            setErrors((prev) => ({ ...prev, zip_code: 'CEP não encontrado.' }));
            return;
        }

        setCepStatus('ok');
        setErrors((prev) => { const n = { ...prev }; delete n.zip_code; return n; });
        setForm((prev) => ({
            ...prev,
            street:       data.logradouro ?? prev.street,
            neighborhood: data.bairro     ?? prev.neighborhood,
            city:         data.localidade ?? prev.city,
            state:        data.uf         ?? prev.state,
        }));
    }, [form.zip_code]);

    // ── Validation ────────────────────────────────────────────────────────────

    const validate = () => {
        const errs = {};
        if (!form.name.trim())         errs.name         = 'Nome é obrigatório.';
        if (!form.zip_code.trim())     errs.zip_code     = 'CEP é obrigatório.';
        if (!form.street.trim())       errs.street       = 'Rua é obrigatória.';
        if (!form.number.trim())       errs.number       = 'Número é obrigatório.';
        if (!form.neighborhood.trim()) errs.neighborhood = 'Bairro é obrigatório.';
        if (!form.city.trim())         errs.city         = 'Cidade é obrigatória.';
        if (!form.state.trim())        errs.state        = 'Estado é obrigatório.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) onSubmit?.(form);
    };

    // ── Field helper ─────────────────────────────────────────────────────────

    const Field = ({ label, name, required, type = 'text', placeholder, children, ...rest }) => (
        <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">
                {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {children ?? (
                <input
                    type={type}
                    value={form[name]}
                    onChange={set(name)}
                    placeholder={placeholder}
                    className={cn(
                        'w-full bg-dark-200 border rounded-xl px-3 py-2.5 text-sm text-white',
                        'placeholder-white/25 focus:outline-none focus:ring-1 transition-all',
                        errors[name]
                            ? 'border-red-500/50 focus:ring-red-500/30'
                            : 'border-white/[0.08] focus:border-white/20 focus:ring-primary/30',
                    )}
                    {...rest}
                />
            )}
            {errors[name] && (
                <p className="text-xs text-red-400 mt-1">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Nome */}
            <Field label="Nome completo" name="name" required placeholder="João Silva" />

            {/* Telefone */}
            <Field label="Telefone" name="phone" placeholder="(11) 99999-9999" />

            {/* CEP */}
            <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">
                    CEP <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={form.zip_code}
                        onChange={(e) => {
                            setForm((p) => ({ ...p, zip_code: formatCep(e.target.value) }));
                            setCepStatus(null);
                        }}
                        onBlur={handleCepBlur}
                        placeholder="00000-000"
                        maxLength={9}
                        className={cn(
                            'w-full bg-dark-200 border rounded-xl px-3 py-2.5 pr-10 text-sm text-white',
                            'placeholder-white/25 focus:outline-none focus:ring-1 transition-all',
                            errors.zip_code
                                ? 'border-red-500/50 focus:ring-red-500/30'
                                : 'border-white/[0.08] focus:border-white/20 focus:ring-primary/30',
                        )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {cepStatus === 'loading' && (
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                className="block w-4 h-4 border-2 border-white/20 border-t-primary rounded-full"
                            />
                        )}
                        {cepStatus === 'ok'    && <CheckCircleIcon    className="w-4 h-4 text-green-400" />}
                        {cepStatus === 'error' && <ExclamationCircleIcon className="w-4 h-4 text-red-400" />}
                        {cepStatus === null    && <MagnifyingGlassIcon   className="w-4 h-4 text-white/25" />}
                    </span>
                </div>
                {errors.zip_code && <p className="text-xs text-red-400 mt-1">{errors.zip_code}</p>}
            </div>

            {/* Rua + Número */}
            <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                    <Field label="Rua / Logradouro" name="street" required placeholder="Rua das Flores" />
                </div>
                <Field label="Número" name="number" required placeholder="123" />
            </div>

            {/* Complemento + Bairro */}
            <div className="grid grid-cols-2 gap-3">
                <Field label="Complemento" name="complement" placeholder="Apto 42" />
                <Field label="Bairro" name="neighborhood" required placeholder="Centro" />
            </div>

            {/* Cidade + Estado */}
            <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                    <Field label="Cidade" name="city" required placeholder="São Paulo" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">
                        UF <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.state}
                        onChange={set('state')}
                        placeholder="SP"
                        maxLength={2}
                        className={cn(
                            'w-full bg-dark-200 border rounded-xl px-3 py-2.5 text-sm text-white uppercase',
                            'placeholder-white/25 focus:outline-none focus:ring-1 transition-all',
                            errors.state
                                ? 'border-red-500/50 focus:ring-red-500/30'
                                : 'border-white/[0.08] focus:border-white/20 focus:ring-primary/30',
                        )}
                    />
                    {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
                </div>
            </div>

            {/* Endereço padrão */}
            <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                    type="checkbox"
                    checked={form.is_default}
                    onChange={set('is_default')}
                    className="w-4 h-4 rounded border-white/20 bg-dark-200 text-primary
                               focus:ring-primary/30 cursor-pointer"
                />
                <span className="text-sm text-white/60">Usar como endereço padrão</span>
            </label>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-60"
            >
                {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : submitLabel}
            </button>
        </form>
    );
}
