import { Product } from "../entities/Product";

export interface IProductRepository {
  create(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findByMerchant(merchantId: string): Promise<Product[]>;
  findBySku(sku: string): Promise<Product | null>;
  findAll(limit?: number, offset?: number): Promise<Product[]>;
  findByCategory(category: string, limit?: number, offset?: number): Promise<Product[]>;
  update(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  search(query: string, limit?: number, offset?: number): Promise<Product[]>;
}
