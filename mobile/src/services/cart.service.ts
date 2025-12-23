import ApiService from './api';

class CartService {
    async getCart() {
        return ApiService.get('/store/cart');
    }

    async addToCart(productId: string, quantity: number, variantId?: string) {
        return ApiService.post('/store/cart/add', { productId, quantity, variantId });
    }

    async removeFromCart(itemId: string) {
        return ApiService.post('/store/cart/remove', { itemId });
    }

    async clearCart() {
        return ApiService.post('/store/cart/clear');
    }
}

export default new CartService();
