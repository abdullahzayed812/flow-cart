import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";
import { v4 as uuidv4 } from "uuid";

export interface CreateProductDTO {
  merchantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
}

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(dto: CreateProductDTO): Promise<Product> {
    // Check if SKU already exists
    const existingProduct = await this.productRepository.findBySku(dto.sku);
    if (existingProduct) {
      throw new Error("Product with this SKU already exists");
    }

    // Validate price
    if (dto.price < 0) {
      throw new Error("Price cannot be negative");
    }

    // Create product
    const product = Product.create(
      uuidv4(),
      dto.merchantId,
      dto.name,
      dto.description,
      dto.price,
      dto.category,
      dto.sku
    );

    await this.productRepository.create(product);
    return product;
  }
}
