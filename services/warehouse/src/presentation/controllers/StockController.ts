import { Request, Response, NextFunction } from 'express';
import { UpdateStockUseCase } from '../../core/usecases/UpdateStockUseCase';
import { MySQLStockRepository } from '../../infrastructure/repositories/MySQLRepositories';
import { ApiResponse } from '@flow-cart/shared';

export class StockController {
    private updateStockUseCase: UpdateStockUseCase;

    constructor(stockRepo: MySQLStockRepository) {
        this.updateStockUseCase = new UpdateStockUseCase(stockRepo);
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productId, quantity } = req.body;
            await this.updateStockUseCase.execute(productId, quantity);
            res.status(200).json(ApiResponse.success(null, 'Stock updated'));
        } catch (error) {
            next(error);
        }
    };
}
