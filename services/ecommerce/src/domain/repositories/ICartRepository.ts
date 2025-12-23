import { Cart, CartItem } from '../entities/Cart';

export interface ICartRepository {
    createCart(cart: Cart): Promise<void>;
    findCartByUserId(userId: string): Promise<Cart | null>;
    addItem(item: CartItem): Promise<void>;
    updateItem(item: CartItem): Promise<void>;
    removeItem(itemId: string): Promise<void>;
    getCartItems(cartId: string): Promise<CartItem[]>;
    clearCart(cartId: string): Promise<void>;
    deleteCart(cartId: string): Promise<void>;
}
