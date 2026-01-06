# Deployment Guide - Flow Cart Platform

## 🚀 Quick Deploy

### Prerequisites
- Docker & Docker Compose installed
- Ports 80, 3306-3311, 4001-4007, 6379 available

### Start All Services

```bash
cd /home/abdullah/dev/flow-cart

# Build and start all services
npm run dev:build

# Or start without rebuild
npm run dev
```

This starts:
- ✅ 6 MySQL databases
- ✅ Redis cache
- ✅ Nginx API Gateway
- ✅ All 6 microservices

### Verify Services

```bash
# Check all services are running
docker ps

# Test health endpoints
curl http://localhost/auth/health
curl http://localhost/store/health
curl http://localhost/warehouse/health
curl http://localhost/shipping/health
curl http://localhost/merchant/health
curl http://localhost/notifications/health
```

---

## 📋 Service Status

### View Logs

```bash
# All services
npm run logs

# Individual services
npm run logs:auth
npm run logs:ecommerce
npm run logs:merchant
npm run logs:warehouse
npm run logs:shipping
npm run logs:notifications
```

### Stop Services

```bash
# Stop all
npm run down

# Stop and remove volumes (clean slate)
npm run down:volumes
```

---

## 🔧 Environment Configuration

Each service uses environment variables. Default values are set in Docker Compose, but you can override them:

### Create `.env` files

```bash
# services/auth/.env
PORT=4001
DB_HOST=db_auth
DB_PORT=3306
DB_USER=abdo
DB_PASSWORD=password
DB_NAME=auth_db
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=change_this_in_production
JWT_REFRESH_SECRET=change_this_in_production_too
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

Repeat for other services with appropriate values.

---

## 🌐 API Gateway Routes

All requests go through Nginx on port 80:

- `/auth/*` → Auth Service (4001)
- `/store/*` → E-Commerce Service (4002)
- `/warehouse/*` → Warehouse Service (4003)
- `/shipping/*` → Shipping Service (4004)
- `/merchant/*` → Merchant Service (4005)
- `/notifications/*` → Notifications Service (4006)
- `/ws` → WebSocket (4007)

---

## 🧪 Testing the Platform

### 1. Register a User

```bash
curl -X POST http://localhost/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

Save the `access_token`.

### 3. Create Product

```bash
curl -X POST http://localhost/store/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "A test product",
    "price": 99.99,
    "category": "Electronics",
    "sku": "TEST-001"
  }'
```

### 4. Add to Cart

```bash
curl -X POST http://localhost/store/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

### 5. Checkout

```bash
curl -X POST http://localhost/store/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "shippingAddress": "123 Main St, City, Country",
    "paymentMethod": "credit_card"
  }'
```

### 6. Test WebSocket

```javascript
// In browser console or Node.js
const socket = io('http://localhost:4007');

socket.on('connect', () => {
  console.log('Connected!');
  socket.emit('subscribe', 'USER_ID');
});

socket.on('notification', (data) => {
  console.log('Notification:', data);
});
```

---

## 🗄 Database Access

### Connect to MySQL

```bash
# Auth database
docker exec -it db_auth mysql -uroot -proot auth_db

# E-commerce database
docker exec -it db_ecommerce mysql -uroot -proot ecommerce_db

# Warehouse database
docker exec -it db_warehouse mysql -uroot -proot warehouse_db
```

### Connect to Redis

```bash
docker exec -it flow_redis redis-cli
```

---

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check port conflicts
lsof -i :80,3306,6379,4001,4002,4003,4004,4005,4006,4007

# Restart Docker
docker-compose down -v
docker-compose up --build
```

### Database Connection Errors

```bash
# Check database containers
docker ps | grep mysql

# View logs
docker logs db_auth
docker logs db_ecommerce
```

### API Gateway Issues

```bash
# Check Nginx logs
docker logs flow_gateway

# Test direct service access
curl http://localhost:4001/health
```

---

## 📈 Production Deployment

### Security Checklist

- [ ] Change all default passwords
- [ ] Update JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Configure log aggregation
- [ ] Set up monitoring

### Recommended Stack

- **Cloud**: AWS, GCP, or Azure
- **Container Orchestration**: Kubernetes or ECS
- **Database**: Managed MySQL (RDS, Cloud SQL)
- **Cache**: Managed Redis (ElastiCache, MemoryStore)
- **Load Balancer**: ALB, Cloud Load Balancing
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack or CloudWatch

---

## 🔐 Security Notes

### Current Setup (Development)

⚠️ **NOT production-ready security**:
- Default passwords
- Weak JWT secrets
- No HTTPS
- Open CORS
- No rate limiting on some endpoints

### For Production

1. **Use strong secrets**: Generate with `openssl rand -base64 32`
2. **Enable HTTPS**: Use Let's Encrypt or cloud certificates
3. **Restrict CORS**: Only allow your frontend domains
4. **Add rate limiting**: Already configured for auth, add to others
5. **Database security**: Use strong passwords, restrict access
6. **API keys**: For service-to-service communication
7. **Input validation**: Already implemented, review for completeness

---

## 📚 Additional Resources

- **API Documentation**: See README.md
- **Quick Start**: See QUICKSTART.md
- **Database Schemas**: Check `services/*/database/migrations/`
- **Architecture**: Each service follows Clean Architecture

---

## ✅ Health Check Summary

All services should return `{"status":"ok","service":"SERVICE_NAME"}`:

```bash
curl http://localhost/auth/health
curl http://localhost/store/health
curl http://localhost/warehouse/health
curl http://localhost/shipping/health
curl http://localhost/merchant/health
curl http://localhost/notifications/health
```

If all return OK, your platform is ready! 🎉
