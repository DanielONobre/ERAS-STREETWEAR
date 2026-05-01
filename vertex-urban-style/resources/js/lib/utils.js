/**
 * Formata um valor numérico como moeda BRL.
 * @param {number} value
 * @returns {string} ex: "R$ 129,90"
 */
export const fmt = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);

/**
 * Combina classes CSS condicionalmente (substituto leve de clsx/cn).
 * @param  {...(string|false|null|undefined)} classes
 * @returns {string}
 */
export const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Trunca texto ao número de caracteres informado.
 * @param {string} text
 * @param {number} max
 * @returns {string}
 */
export const truncate = (text, max = 80) =>
    text && text.length > max ? text.slice(0, max).trimEnd() + '…' : text;

/**
 * Formata CEP: "01310100" → "01310-100"
 * @param {string} cep
 * @returns {string}
 */
export const formatCep = (cep) => {
    const digits = cep.replace(/\D/g, '');
    return digits.length === 8 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : cep;
};

/**
 * Busca endereço pelo CEP via ViaCEP.
 * @param {string} cep
 * @returns {Promise<object|null>}
 */
export const fetchCep = async (cep) => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return null;
    try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        return data.erro ? null : data;
    } catch {
        return null;
    }
};
