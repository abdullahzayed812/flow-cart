export enum UserRole {
    CUSTOMER = 'customer',
    MERCHANT = 'merchant',
    ADMIN = 'admin',
    WAREHOUSE_STAFF = 'warehouse_staff',
    COURIER = 'courier'
}

export enum MerchantStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    SUSPENDED = 'suspended'
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded'
}

export enum ShipmentStatus {
    CREATED = 'created',
    ASSIGNED = 'assigned',
    PICKED_UP = 'picked_up',
    IN_TRANSIT = 'in_transit',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
    FAILED = 'failed',
    RETURNED = 'returned'
}

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

export enum NotificationType {
    ORDER_STATUS = 'order_status',
    LOW_STOCK = 'low_stock',
    NEW_PAYOUT = 'new_payout',
    SHIPMENT_UPDATE = 'shipment_update',
    MERCHANT_APPLICATION = 'merchant_application',
    SYSTEM = 'system'
}
