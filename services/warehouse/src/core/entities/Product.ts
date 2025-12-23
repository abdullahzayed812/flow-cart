export class Product {
    constructor(
        public id: string,
        public categoryId: number | null,
        public name: string,
        public description: string,
        public price: number,
        public sku: string,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}
