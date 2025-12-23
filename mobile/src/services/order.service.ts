import ApiService from './api';

export interface CheckoutData {
    shippingAddress: string;
    billingAddress?: string;
    paymentMethod?: string;
}

class OrderService {
    async checkout(data: CheckoutData) {
        return ApiService.post('/store/checkout', data);
    }

    async getOrders() {
        return ApiService.get('/store/orders');
    }

    async getOrder(id: string) {
        return ApiService.get(`/store/orders/${id}`);
    }

    async cancelOrder(id: string) {
        return ApiService.post(`/store/orders/${id}/cancel`);
    }
}

export default new OrderService();
