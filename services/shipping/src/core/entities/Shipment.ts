export class Shipment {
    constructor(
        public id: string,
        public orderId: string,
        public address: string,
        public status: string,
        public courierId: number | null,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}
