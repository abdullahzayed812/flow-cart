import { Request, Response, NextFunction } from 'express';
import { CreateProductUseCase } from '../../core/usecases/CreateProductUseCase';
import { MySQLProductRepository } from '../../infrastructure/repositories/MySQLRepositories';
import { ApiResponse } from '@flow-cart/shared';

export class ProductController {
    private createProductUseCase: CreateProductUseCase;

    constructor(productRepo: MySQLProductRepository) {
        this.createProductUseCase = new CreateProductUseCase(productRepo);
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = await this.createProductUseCase.execute(req.body);
            res.status(201).json(ApiResponse.success(product, 'Product created'));
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        // TODO: Implement GetAllUseCase
        res.json(ApiResponse.success([], 'Not implemented yet'));
    };
}
