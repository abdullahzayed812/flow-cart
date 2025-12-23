import ApiService from './api';

class ProductService {
    async getProducts(params?: { limit?: number; offset?: number; category?: string; search?: string }) {
        const queryParams = new URLSearchParams(params as any).toString();
        return ApiService.get(`/store/products?${queryParams}`);
    }

    async getProduct(id: string) {
        return ApiService.get(`/store/products/${id}`);
    }

    async searchProducts(query: string) {
        return ApiService.get(`/store/products?search=${query}`);
    }

    async getProductsByCategory(category: string) {
        return ApiService.get(`/store/products?category=${category}`);
    }
}

export default new ProductService();
