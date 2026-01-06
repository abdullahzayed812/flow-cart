import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { StockController } from "../controllers/StockController";

export function createWarehouseRoutes(productController: ProductController, stockController: StockController): Router {
  const router = Router();

  router.get("/products", productController.getProducts);
  router.get("/products/:id", productController.getProduct);
  router.post("/products", productController.createProduct);
  router.put("/products/:id", productController.updateProduct);
  router.delete("/products/:id", productController.deleteProduct);
  router.post("/stock/update", stockController.update);

  return router;
}
