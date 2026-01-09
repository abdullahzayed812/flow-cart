import { Router } from "express";
import { CartController } from "../controllers/CartController";
import { OrderController } from "../controllers/OrderController";
import { MySQLCartRepository, MySQLOrderRepository } from "../../infrastructure/repositories/MySQLRepositories";
import { Database } from "../../infrastructure/database/Database";
import { AddToCartUseCase } from "../../application/usecases/AddToCartUseCase";
import { CheckoutUseCase } from "../../core/usecases/CheckoutUseCase";
import { WarehouseClient } from "../../infrastructure/clients/WarehouseClient";

const router = Router();
const db = Database.getInstance();
const pool = db.getPool();

const cartRepo = new MySQLCartRepository(pool);
const orderRepo = new MySQLOrderRepository(pool);
const warehouseClient = new WarehouseClient();

const addTocardUseCase = new AddToCartUseCase(cartRepo, warehouseClient);
const checkoutUseCase = new CheckoutUseCase(cartRepo, orderRepo, warehouseClient);

const cartController = new CartController(addTocardUseCase, cartRepo);
const orderController = new OrderController(checkoutUseCase, orderRepo);

router.post("/cart", cartController.addToCart);
router.post("/order", orderController.checkout);

export default router;
