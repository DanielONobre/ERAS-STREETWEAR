import { createContext, useContext, useState, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

/** @type {React.Context<CartContextValue|null>} */
const CartContext = createContext(null);

/**
 * @typedef {Object} CartItem
 * @property {number}  id
 * @property {number}  quantity
 * @property {number}  unit_price
 * @property {number}  line_total
 * @property {Object}  product
 * @property {Object|null} variant
 */

/**
 * @typedef {Object} CartContextValue
 * @property {boolean}    isOpen
 * @property {Function}   openCart
 * @property {Function}   closeCart
 * @property {Object}     cart       - { item_count, subtotal, items }
 * @property {Object}     pricing    - { subtotal, discount, shipping, total, ... }
 * @property {boolean}    loading
 * @property {string|null} error
 * @property {Function}   fetchMini
 * @property {Function}   addItem
 * @property {Function}   updateItem
 * @property {Function}   removeItem
 * @property {Function}   applyCoupon
 * @property {Function}   removeCoupon
 * @property {Function}   calculateShipping
 */

export function CartProvider({ children }) {
    const { cart: sharedCart } = usePage().props;

    const [isOpen, setIsOpen]   = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);
    const [couponCode, setCouponCode] = useState('');

    // Cart data (items come from /carrinho/mini on demand)
    const [cart, setCart] = useState({
        item_count: sharedCart?.count ?? sharedCart?.item_count ?? 0,
        subtotal:   sharedCart?.subtotal ?? 0,
        items:      [],
    });

    const [pricing, setPricing] = useState({
        subtotal:   sharedCart?.subtotal ?? 0,
        discount:   0,
        shipping:   0,
        total:      sharedCart?.subtotal ?? 0,
        free_shipping: false,
        formatted_subtotal: null,
        formatted_total:    null,
    });

    // ─── Cart Drawer ──────────────────────────────────────────────────────────

    const openCart = useCallback(async () => {
        setIsOpen(true);
        await fetchMini();
    }, []);

    const closeCart = useCallback(() => setIsOpen(false), []);

    // ─── Data Fetching ────────────────────────────────────────────────────────

    /** Carrega dados completos do carrinho para o mini-cart. */
    const fetchMini = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get('/carrinho/mini');
            setCart(prev => ({
                ...prev,
                item_count: data.item_count,
                subtotal:   data.subtotal,
                items:      data.items,
            }));
        } catch {
            setError('Não foi possível carregar o carrinho.');
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Mutations ────────────────────────────────────────────────────────────

    /**
     * Adiciona produto ao carrinho.
     * @param {number} productId
     * @param {number|null} variantId
     * @param {number} quantity
     */
    const addItem = useCallback(async (productId, variantId = null, quantity = 1) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post('/carrinho/adicionar', {
                product_id: productId,
                variant_id: variantId,
                quantity,
            });
            setCart(data.cart);
            setIsOpen(true);
            return { success: true, message: data.message };
        } catch (err) {
            const msg = err.response?.data?.message ?? 'Erro ao adicionar produto.';
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Atualiza a quantidade de um item.
     * @param {number} itemId
     * @param {number} quantity
     */
    const updateItem = useCallback(async (itemId, quantity) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.put(`/carrinho/item/${itemId}`, { quantity });
            setCart(data.cart);
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message ?? 'Erro ao atualizar quantidade.';
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Remove um item do carrinho.
     * @param {number} itemId
     */
    const removeItem = useCallback(async (itemId) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.delete(`/carrinho/item/${itemId}`);
            setCart(data.cart);
            return { success: true };
        } catch {
            setError('Erro ao remover item.');
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Aplica cupom de desconto.
     * @param {string} code
     * @param {number} shippingCost
     */
    const applyCoupon = useCallback(async (code, shippingCost = 0) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post('/carrinho/cupom', {
                code,
                shipping_cost: shippingCost,
            });
            if (data.pricing) setPricing(data.pricing);
            return { success: true, message: data.message };
        } catch (err) {
            const msg = err.response?.data?.message ?? 'Cupom inválido.';
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    /** Remove cupom aplicado. */
    const removeCoupon = useCallback(async (shippingCost = 0) => {
        setLoading(true);
        try {
            const { data } = await axios.delete('/carrinho/cupom', {
                data: { shipping_cost: shippingCost },
            });
            if (data.pricing) setPricing(data.pricing);
            setCouponCode('');
            return { success: true };
        } catch {
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Calcula opções de frete para o CEP informado.
     * @param {string} cep
     */
    const calculateShipping = useCallback(async (cep) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post('/carrinho/frete', { cep });
            return { success: true, data };
        } catch (err) {
            const msg = err.response?.data?.error ?? 'CEP inválido.';
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <CartContext.Provider value={{
            isOpen, openCart, closeCart,
            cart, pricing, loading, error,
            couponCode, setCouponCode,
            fetchMini,
            addItem, updateItem, removeItem,
            applyCoupon, removeCoupon,
            calculateShipping,
        }}>
            {children}
        </CartContext.Provider>
    );
}

/** @returns {CartContextValue} */
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
    return ctx;
}
