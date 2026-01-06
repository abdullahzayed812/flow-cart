import { OrderStatus, PaymentStatus } from './enums';

export interface Product {
    id: string;
    merchant_id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    sku: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    name: string;
    sku: string;
    price: number;
    attributes: Record<string, string>;
}

export interface CartItem {
    id: string;
    cart_id: string;
    product_id: string;
    variant_id?: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    user_id: string;
    merchant_id: string;
    total_amount: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    shipping_address: string;
    created_at: Date;
    updated_at: Date;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    variant_id?: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Review {
    id: string;
    product_id: string;
    user_id: string;
    order_id: string;
    rating: number;
    comment?: string;
    created_at: Date;
}

export interface Coupon {
    id: string;
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_purchase?: number;
    max_discount?: number;
    valid_from: Date;
    valid_until: Date;
    is_active: boolean;
}
