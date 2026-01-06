import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectRedis } from './config/redis';
import routes from './presentation/routes';
import { ApiResponse, AppError, requestLogger } from '@flow-cart/shared';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4004;

app.use(cors());
app.use(helmet());
app.use(requestLogger);
app.use(express.json());

app.use('/', routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof AppError) {
        res.status(err.statusCode).json(ApiResponse.error(err.message));
    } else {
        res.status(500).json(ApiResponse.error('Internal Server Error'));
    }
});

const startServer = async () => {
    // Database connection is handled by the singleton
    await connectRedis();

    app.listen(PORT, () => {
        console.log(`🚀 Shipping Service running on port ${PORT}`);
    });
};

startServer();
