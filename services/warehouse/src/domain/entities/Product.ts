export class Product {
  constructor(
    public readonly id: string,
    public merchantId: string,
    public name: string,
    public description: string,
    public price: number,
    public category: string,
    public sku: string,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(
    id: string,
    merchantId: string,
    name: string,
    description: string,
    price: number,
    category: string,
    sku: string
  ): Product {
    return new Product(id, merchantId, name, description, price, category, sku, true, new Date(), new Date());
  }

  updateDetails(name: string, description: string, price: number, category: string): void {
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.updatedAt = new Date();
  }

  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error("Price cannot be negative");
    }
    this.price = newPrice;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
