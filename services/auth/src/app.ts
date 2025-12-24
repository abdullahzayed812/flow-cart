import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { Database } from "./infrastructure/database/Database";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { MerchantRepository } from "./infrastructure/repositories/MerchantRepository";
import { SessionRepository } from "./infrastructure/repositories/SessionRepository";
import { RegisterUserUseCase } from "./application/usecases/RegisterUserUseCase";
import { LoginUseCase } from "./application/usecases/LoginUseCase";
import { ApplyMerchantUseCase } from "./application/usecases/ApplyMerchantUseCase";
import { RefreshTokenUseCase } from "./application/usecases/RefreshTokenUseCase";
import { GetUserProfileUseCase } from "./application/usecases/GetUserProfileUseCase";
import { AuthController } from "./presentation/controllers/AuthController";
import { createAuthRoutes } from "./presentation/routes/authRoutes";
import { connectRedis } from "./config/redis";

import { AppError } from "@flow-cart/shared";

dotenv.config();

export class AuthService {
    private app: Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || "4001");
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupGlobalErrorHandler();
    }

    private setupMiddlewares(): void {
        // Security middlewares
        this.app.use(helmet());
        this.app.use(cors());

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: "Too many requests from this IP, please try again later",
        });
        this.app.use("/auth", limiter);

        // Body parsing
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private setupRoutes(): void {
        // Initialize database
        const db = Database.getInstance();

        // Initialize repositories
        const userRepository = new UserRepository(db);
        const merchantRepository = new MerchantRepository(db);
        const sessionRepository = new SessionRepository(db);

        // Initialize use cases
        const registerUserUseCase = new RegisterUserUseCase(userRepository, sessionRepository);
        const loginUseCase = new LoginUseCase(userRepository, sessionRepository);
        const applyMerchantUseCase = new ApplyMerchantUseCase(userRepository, merchantRepository);
        const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, sessionRepository);
        const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);

        // Initialize controller
        const authController = new AuthController(
            registerUserUseCase,
            loginUseCase,
            applyMerchantUseCase,
            refreshTokenUseCase,
            getUserProfileUseCase
        );

        // Setup routes
        this.app.use("/auth", createAuthRoutes(authController));

        // Health check
        this.app.get("/health", (req, res) => {
            res.status(200).json({ status: "ok", service: "auth" });
        });

        // 404 handler
        this.app.use((req, res, next) => {
            // Pass to global error handler if needed, or just return JSON
            // Using existing logic but ensuring it doesn't conflict with global handler
            if (!res.headersSent) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: "NOT_FOUND",
                        message: "Route not found",
                    },
                });
            }
        });
    }

    private setupGlobalErrorHandler(): void {
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err);
            if (err instanceof AppError) {
                res.status(err.statusCode).json({
                    success: false,
                    error: {
                        code: 'ERROR',
                        message: err.message
                    }
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Internal Server Error'
                    }
                });
            }
        });
    }

    public async start(): Promise<void> {
        // Connect to Redis
        await connectRedis();

        this.app.listen(this.port, () => {
            console.log(`🚀 Auth Service running on port ${this.port}`);
        });
    }
}
