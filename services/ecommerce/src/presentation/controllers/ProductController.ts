import { Request, Response } from "express";
import { CreateProductUseCase } from "../../core/usecases/CreateProductUseCase";
import { IProductRepository } from "../../domain/repositories/IProductRepository";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export class ProductController {
  constructor(private createProductUseCase: CreateProductUseCase, private productRepository: IProductRepository) {}

  createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } });
        return;
      }

      const { name, description, price, category, sku } = req.body;

      if (!name || !description || price === undefined || !category || !sku) {
        res
          .status(400)
          .json({ success: false, error: { code: "VALIDATION_ERROR", message: "Missing required fields" } });
        return;
      }

      const product = await this.createProductUseCase.execute({
        merchantId: req.user.userId,
        name,
        description,
        price: parseFloat(price),
        category,
        sku,
      });

      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { code: "PRODUCT_CREATION_FAILED", message: error.message } });
    }
  };

  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;
      const search = req.query.search as string;

      let products;
      if (search) {
        products = await this.productRepository.search(search, limit, offset);
      } else if (category) {
        products = await this.productRepository.findByCategory(category, limit, offset);
      } else {
        products = await this.productRepository.findAll(limit, offset);
      }

      res.status(200).json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: "FETCH_FAILED", message: error.message } });
    }
  };

  getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productRepository.findById(id);

      if (!product) {
        res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Product not found" } });
        return;
      }

      res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: "FETCH_FAILED", message: error.message } });
    }
  };

  updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } });
        return;
      }

      const { id } = req.params;
      const product = await this.productRepository.findById(id);

      if (!product) {
        res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Product not found" } });
        return;
      }

      if (product.merchantId !== req.user.userId && req.user.role !== "admin") {
        res
          .status(403)
          .json({ success: false, error: { code: "FORBIDDEN", message: "Not authorized to update this product" } });
        return;
      }

      const { name, description, price, category } = req.body;
      product.updateDetails(name, description, parseFloat(price), category);
      await this.productRepository.update(product);

      res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { code: "UPDATE_FAILED", message: error.message } });
    }
  };

  deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } });
        return;
      }

      const { id } = req.params;
      const product = await this.productRepository.findById(id);

      if (!product) {
        res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Product not found" } });
        return;
      }

      if (product.merchantId !== req.user.userId && req.user.role !== "admin") {
        res
          .status(403)
          .json({ success: false, error: { code: "FORBIDDEN", message: "Not authorized to delete this product" } });
        return;
      }

      await this.productRepository.delete(id);
      res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: "DELETE_FAILED", message: error.message } });
    }
  };
}
