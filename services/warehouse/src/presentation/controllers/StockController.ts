import { Request, Response, NextFunction } from "express";
import { UpdateStockUseCase } from "../../core/usecases/UpdateStockUseCase";
import { StockRepository } from "../../infrastructure/repositories/ProductRepository";
import { ApiResponse } from "@flow-cart/shared";

export class StockController {
  private updateStockUseCase: UpdateStockUseCase;

  constructor(stockRepo: StockRepository) {
    this.updateStockUseCase = new UpdateStockUseCase(stockRepo);
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, quantity } = req.body;
      await this.updateStockUseCase.execute(productId, quantity);
      res.status(200).json(ApiResponse.success(null, "Stock updated"));
    } catch (error) {
      next(error);
    }
  };
}
