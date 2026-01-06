import { ShipmentStatus } from '@flow-cart/shared';

export class Shipment {
    constructor(
        public readonly id: string,
        public readonly orderId: string,
        public trackingNumber: string,
        public courierId: string | null,
        public courierName: string | null,
        public status: ShipmentStatus,
        public pickupAddress: string,
        public deliveryAddress: string,
        public estimatedDelivery: Date | null,
        public actualDelivery: Date | null,
        public notes: string | null,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { }

    static create(
        id: string,
        orderId: string,
        trackingNumber: string,
        pickupAddress: string,
        deliveryAddress: string,
        estimatedDelivery: Date | null = null
    ): Shipment {
        return new Shipment(
            id,
            orderId,
            trackingNumber,
            null,
            null,
            ShipmentStatus.CREATED,
            pickupAddress,
            deliveryAddress,
            estimatedDelivery,
            null,
            null,
            new Date(),
            new Date()
        );
    }

    assignCourier(courierId: string, courierName: string): void {
        this.courierId = courierId;
        this.courierName = courierName;
        this.status = ShipmentStatus.ASSIGNED;
        this.updatedAt = new Date();
    }

    markAsPickedUp(): void {
        this.status = ShipmentStatus.PICKED_UP;
        this.updatedAt = new Date();
    }

    markAsInTransit(): void {
        this.status = ShipmentStatus.IN_TRANSIT;
        this.updatedAt = new Date();
    }

    markAsOutForDelivery(): void {
        this.status = ShipmentStatus.OUT_FOR_DELIVERY;
        this.updatedAt = new Date();
    }

    deliver(): void {
        this.status = ShipmentStatus.DELIVERED;
        this.actualDelivery = new Date();
        this.updatedAt = new Date();
    }

    fail(reason: string): void {
        this.status = ShipmentStatus.FAILED;
        this.notes = reason;
        this.updatedAt = new Date();
    }
}

export class DeliveryEvent {
    constructor(
        public readonly id: string,
        public readonly shipmentId: string,
        public eventType: string,
        public description: string | null,
        public location: string | null,
        public latitude: number | null,
        public longitude: number | null,
        public readonly createdAt: Date
    ) { }

    static create(
        id: string,
        shipmentId: string,
        eventType: string,
        description: string | null = null,
        location: string | null = null,
        latitude: number | null = null,
        longitude: number | null = null
    ): DeliveryEvent {
        return new DeliveryEvent(
            id,
            shipmentId,
            eventType,
            description,
            location,
            latitude,
            longitude,
            new Date()
        );
    }
}
