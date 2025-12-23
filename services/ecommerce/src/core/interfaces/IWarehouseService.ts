export interface IWarehouseService {
    checkStock(productId: string): Promise<number>;
    reserveStock(productId: string, quantity: number): Promise<boolean>;
}
