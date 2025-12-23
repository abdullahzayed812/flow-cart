import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { Database } from './infrastructure/database/Database';

dotenv.config();

class NotificationsService {
    private app: Application;
    private httpServer;
    private io: SocketServer;
    private port: number;
    private wsPort: number;

    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = new SocketServer(this.httpServer, {
            cors: { origin: '*' }
        });
        this.port = parseInt(process.env.PORT || '4006');
        this.wsPort = parseInt(process.env.WS_PORT || '4007');

        this.setupMiddlewares();
        this.setupWebSocket();
        this.setupRoutes();
    }

    private setupMiddlewares(): void {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
    }

    private setupWebSocket(): void {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('subscribe', (userId: string) => {
                socket.join(`user:${userId}`);
                console.log(`User ${userId} subscribed`);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    private setupRoutes(): void {
        const db = Database.getInstance();

        // Get notifications
        this.app.get('/notifications', async (req, res) => {
            res.status(200).json({ success: true, data: [] });
        });

        // Mark as read
        this.app.post('/notifications/:id/read', async (req, res) => {
            res.status(200).json({ success: true, message: 'Marked as read' });
        });

        // Send notification (internal API)
        this.app.post('/notifications/send', async (req, res) => {
            const { userId, type, title, message, data } = req.body;

            // Emit via WebSocket
            this.io.to(`user:${userId}`).emit('notification', {
                type,
                title,
                message,
                data,
                timestamp: new Date()
            });

            res.status(200).json({ success: true, message: 'Notification sent' });
        });

        // Health check
        this.app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok', service: 'notifications' });
        });
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`🔔 Notifications Service (HTTP) running on port ${this.port}`);
        });

        this.httpServer.listen(this.wsPort, () => {
            console.log(`🔔 Notifications Service (WebSocket) running on port ${this.wsPort}`);
        });
    }
}

const notificationsService = new NotificationsService();
notificationsService.start();
