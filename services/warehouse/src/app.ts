import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { Database } from "./infrastructure/database/Database";
import { createWarehouseRoutes } from "./presentation/routes/warehouseRoutes";
import { ProductController } from "./presentation/controllers/ProductController";
import { StockRepository, ProductRepository } from "./infrastructure/repositories/ProductRepository";
import { StockController } from "./presentation/controllers/StockController";
import { requestLogger } from "@flow-cart/shared";
import { CreateProductUseCase } from "./application/usecases/CreateProductUseCase";

dotenv.config();

export class WarehouseService {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "4003");
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(requestLogger);
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    const db = Database.getInstance();

    const productRepo = new ProductRepository(db);
    const stockRepo = new StockRepository(db);

    const createProductUseCase = new CreateProductUseCase(productRepo);

    const productController = new ProductController(createProductUseCase, productRepo);
    const stockController = new StockController(stockRepo);

    this.app.use("/", createWarehouseRoutes(productController, stockController));

    // Health check
    this.app.get("/health", (req, res) => {
      res.status(200).json({ status: "ok", service: "warehouse" });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`📦 Warehouse Service running on port ${this.port}`);
    });
  }
}
