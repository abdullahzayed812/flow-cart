import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { checkDbConnection } from './config/database';
import { connectRedis } from './config/redis';
import authRoutes from './presentation/routes/authRoutes';
import { ApiResponse, AppError } from '@flow-cart/shared';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof AppError) {
        res.status(err.statusCode).json(ApiResponse.error(err.message));
    } else {
        res.status(500).json(ApiResponse.error('Internal Server Error'));
    }
});

// Start Server
const startServer = async () => {
    await checkDbConnection();
    await connectRedis();

    app.listen(PORT, () => {
        console.log(`🚀 Auth Service running on port ${PORT}`);
    });
};

startServer();
