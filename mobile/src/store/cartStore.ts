import { create } from 'zustand';
import CartService from '../services/cart.service';

interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    variantId?: string;
}

interface CartState {
    items: CartItem[];
    total: number;
    isLoading: boolean;
    fetchCart: () => Promise<void>;
    addItem: (productId: string, quantity: number, variantId?: string) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    total: 0,
    isLoading: false,

    fetchCart: async () => {
        try {
            set({ isLoading: true });
            const response = await CartService.getCart();
            set({
                items: response.data.items || [],
                total: response.data.total || 0,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    addItem: async (productId: string, quantity: number, variantId?: string) => {
        try {
            await CartService.addToCart(productId, quantity, variantId);
            await get().fetchCart();
        } catch (error) {
            throw error;
        }
    },

    removeItem: async (itemId: string) => {
        try {
            await CartService.removeFromCart(itemId);
            await get().fetchCart();
        } catch (error) {
            throw error;
        }
    },

    clearCart: async () => {
        try {
            await CartService.clearCart();
            set({ items: [], total: 0 });
        } catch (error) {
            throw error;
        }
    },
}));
