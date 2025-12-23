import { v4 as uuidv4 } from 'uuid';
import { MySQLProductRepository } from '../../infrastructure/repositories/MySQLRepositories';
import { Product } from '../entities/Product';

export class CreateProductUseCase {
    constructor(private productRepo: MySQLProductRepository) { }

    async execute(data: { name: string; description: string; price: number; sku: string; categoryId?: number }): Promise<Product> {
        const product = new Product(
            uuidv4(),
            data.categoryId || null,
            data.name,
            data.description,
            data.price,
            data.sku,
            new Date(),
            new Date()
        );
        return this.productRepo.create(product);
    }
}
