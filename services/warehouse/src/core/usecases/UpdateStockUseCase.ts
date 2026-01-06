import { StockRepository } from "../../infrastructure/repositories/ProductRepository";

export class UpdateStockUseCase {
  constructor(private stockRepo: StockRepository) {}

  async execute(productId: string, quantity: number): Promise<void> {
    await this.stockRepo.updateStock(productId, quantity);

    // Emit socket event
    const { SocketService } = require("../../infrastructure/services/SocketService");
    const socketService = SocketService.getInstance();
    if (socketService) {
      socketService.broadcast("stock.updated", { productId, quantity });
    }
  }
}
