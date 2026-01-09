import axios from 'axios';
import { Product } from '../../domain/entities/Product';

export class WarehouseClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.WAREHOUSE_SERVICE_URL || 'http://warehouse-service:4003';
    }

    async getProduct(productId: string): Promise<Product | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/warehouse/inventory/${productId}`);
            if (response.data && response.data.success && response.data.data) {
                const p = response.data.data;
                // Map warehouse product to ecommerce product entity
                return new Product(
                    p.id,
                    p.merchantId || 'unknown', // Warehouse might need to provide merchantId
                    p.name,
                    p.description,
                    Number(p.price),
                    p.category || 'general',
                    p.sku,
                    true, // Assuming active if returned
                    new Date(p.createdAt),
                    new Date(p.updatedAt)
                );
            }
            return null;
        } catch (error) {
            console.error(`Error fetching product ${productId} from warehouse:`, error);
            return null;
        }
    }
}
