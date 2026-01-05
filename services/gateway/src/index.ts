import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(helmet());

// Proxy configuration
const services = {
    auth: 'http://localhost:4001',
    ecommerce: 'http://localhost:4002',
    warehouse: 'http://localhost:4003',
    shipping: 'http://localhost:4004',
    merchant: 'http://localhost:4005',
    notifications: 'http://localhost:4006',
    notifications_ws: 'http://localhost:4007'
};

// Auth Service
app.use('/auth', createProxyMiddleware({
    target: services.auth,
    changeOrigin: true,
    pathRewrite: {
        '^/auth': '' // Remove /auth prefix when forwarding to service if service doesn't expect it. 
        // Wait, looking at nginx conf:
        // location /auth/ { proxy_pass http://auth_service/; }
        // This implies /auth/foo -> http://auth_service/foo
        // So we should rewrite '^/auth': '' ONLY if the service routes don't include /auth prefix.
        // Checking auth service routes... usually they are mounted at root or /api.
        // Let's check auth service index.ts again.
        // It likely mounts routes at root.
        // So yes, rewrite is needed.
    }
}));

// Ecommerce Service
app.use('/ecommerce', createProxyMiddleware({
    target: services.ecommerce,
    changeOrigin: true,
    pathRewrite: { '^/ecommerce': '' }
}));

// Warehouse Service
app.use('/warehouse', createProxyMiddleware({
    target: services.warehouse,
    changeOrigin: true,
    pathRewrite: { '^/warehouse': '' }
}));

// Shipping Service
app.use('/shipping', createProxyMiddleware({
    target: services.shipping,
    changeOrigin: true,
    pathRewrite: { '^/shipping': '' }
}));

// Merchant Service
app.use('/merchant', createProxyMiddleware({
    target: services.merchant,
    changeOrigin: true,
    pathRewrite: { '^/merchant': '' }
}));

// Notifications Service (HTTP)
app.use('/notifications', createProxyMiddleware({
    target: services.notifications,
    changeOrigin: true,
    pathRewrite: { '^/notifications': '' }
}));

// Notifications Service (WebSocket)
// http-proxy-middleware supports WS upgrade
app.use('/socket.io', createProxyMiddleware({
    target: services.notifications_ws,
    changeOrigin: true,
    ws: true
}));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'gateway-local' });
});

app.listen(PORT, () => {
    console.log(`🚀 Local Gateway running on http://localhost:${PORT}`);
    console.log(`👉 Auth:        http://localhost:${PORT}/auth`);
    console.log(`👉 Ecommerce:   http://localhost:${PORT}/ecommerce`);
    console.log(`👉 Warehouse:   http://localhost:${PORT}/warehouse`);
    console.log(`👉 Shipping:    http://localhost:${PORT}/shipping`);
    console.log(`👉 Merchant:    http://localhost:${PORT}/merchant`);
    console.log(`👉 Notifications: http://localhost:${PORT}/notifications`);
});
