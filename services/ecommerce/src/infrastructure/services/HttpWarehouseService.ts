import axios from 'axios';
import { IWarehouseService } from '../../core/interfaces/IWarehouseService';

export class HttpWarehouseService implements IWarehouseService {
    private baseUrl = process.env.WAREHOUSE_URL || 'http://warehouse_service:4003/warehouse';

    async checkStock(productId: string): Promise<number> {
        // Mock implementation for now as we might not have the endpoint ready or network setup
        // In production, this would call GET /warehouse/stock/:productId
        return 100;
    }

    async reserveStock(productId: string, quantity: number): Promise<boolean> {
        try {
            await axios.post(`${this.baseUrl}/stock/update`, {
                productId,
                quantity: -quantity // Negative for reservation/deduction
            });
            return true;
        } catch (error) {
            console.error('Failed to reserve stock', error);
            return false;
        }
    }
}
