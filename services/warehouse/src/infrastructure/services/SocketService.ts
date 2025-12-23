import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import http from 'http';

export class SocketService {
    private static instance: SocketService;
    public io: Server;

    private constructor(httpServer: http.Server) {
        this.io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        this.setupRedisAdapter();
        this.setupConnection();
    }

    private async setupRedisAdapter() {
        const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);

        this.io.adapter(createAdapter(pubClient, subClient));
    }

    private setupConnection() {
        this.io.on('connection', (socket) => {
            console.log(`🔌 Client connected: ${socket.id}`);

            socket.on('disconnect', () => {
                console.log(`🔌 Client disconnected: ${socket.id}`);
            });
        });
    }

    public static getInstance(httpServer?: http.Server): SocketService {
        if (!SocketService.instance && httpServer) {
            SocketService.instance = new SocketService(httpServer);
        }
        return SocketService.instance;
    }

    public broadcast(event: string, data: any) {
        this.io.emit(event, data);
    }
}
