# Flow Cart - Quick Start Guide

## 🚀 What's Been Built

### ✅ Fully Functional Services (3/6)

1. **Auth Service** (Port 4001)
   - User registration & login
   - JWT authentication
   - Merchant application workflow
   - Role-based access control

2. **E-Commerce Service** (Port 4002)
   - Product CRUD with search
   - Shopping cart management
   - **Multi-vendor checkout** (automatically splits orders by merchant)
   - Order management

3. **Warehouse Service** (Port 4003)
   - Inventory management
   - Stock reservation for orders
   - Inventory logging

### 📊 Database Schemas Ready (6/6)
All database migrations created for all 6 services

---

## 🏃 Running the System

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- npm

### Start All Services

```bash
# From project root
cd /home/abdullah/dev/flow-cart

# Start with Docker Compose
npm run dev:build

# Or without rebuild
npm run dev
```

This starts:
- 6 MySQL databases
- Redis cache
- Nginx API Gateway (port 80)
- All microservices

### View Logs

```bash
# All services
npm run logs

# Specific service
npm run logs:auth
npm run logs:ecommerce
npm run logs:warehouse
```

---

## 🧪 Testing the APIs

### 1. Register a User
```bash
curl -X POST http://localhost/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
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
    "email": "customer@example.com",
    "password": "Test123!"
  }'
```

Save the `access_token` from the response.

### 3. Create a Product (as merchant)
```bash
curl -X POST http://localhost/store/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "Electronics",
    "sku": "LAP-001"
  }'
```

### 4. Browse Products
```bash
# All products
curl http://localhost/store/products

# Search
curl "http://localhost/store/products?search=laptop"

# By category
curl "http://localhost/store/products?category=Electronics"
```

### 5. Add to Cart
```bash
curl -X POST http://localhost/store/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

### 6. Checkout (Multi-Vendor)
```bash
curl -X POST http://localhost/store/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "shippingAddress": "123 Main St, City, Country",
    "paymentMethod": "credit_card"
  }'
```

**Note**: If cart has products from multiple merchants, this creates separate orders for each merchant!

### 7. View Orders
```bash
curl http://localhost/store/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📁 Project Structure

```
flow-cart/
├── services/
│   ├── auth/           ✅ COMPLETE
│   ├── ecommerce/      ✅ COMPLETE
│   ├── warehouse/      ✅ COMPLETE
│   ├── merchant/       🚧 Database ready
│   ├── shipping/       🚧 Database ready
│   └── notifications/  🚧 Database ready
├── shared/types/       ✅ COMPLETE
├── nginx/              ✅ COMPLETE
├── docker-compose.yml  ✅ COMPLETE
└── README.md           ✅ COMPLETE
```

---

## 🔧 Development

### Run Individual Service Locally

```bash
# Auth service
cd services/auth
npm install
npm run dev

# E-Commerce service
cd services/ecommerce
npm install
npm run dev

# Warehouse service
cd services/warehouse
npm install
npm run dev
```

### Environment Variables

Each service uses `.env` file:

```env
PORT=4001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=auth_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_secret_key
```

---

## 🎯 Next Steps

### To Complete the Platform:

1. **Merchant Service** - Store management, sales reports
2. **Shipping Service** - Tracking, courier assignment
3. **Notifications Service** - WebSocket + push notifications
4. **Mobile App** - React Native customer app
5. **Merchant Dashboard** - React web app
6. **Admin Dashboard** - React web app

---

## 📝 Key Features Implemented

✅ JWT Authentication with refresh tokens
✅ Role-based access control (customer, merchant, admin, warehouse_staff, courier)
✅ **Multi-vendor order splitting** (core feature!)
✅ Stock reservation system
✅ Inventory logging
✅ Product search
✅ Clean Architecture (domain, application, infrastructure, presentation)
✅ Raw SQL (no ORM)
✅ Docker containerization
✅ API Gateway with Nginx

---

## 🐛 Troubleshooting

### Services won't start
```bash
# Check if ports are in use
lsof -i :80,3306,6379,4001,4002,4003

# Restart Docker
docker-compose down -v
docker-compose up --build
```

### Database connection errors
```bash
# Check MySQL containers
docker ps | grep mysql

# View database logs
docker logs db_auth
```

### Can't access API
```bash
# Check Nginx
docker logs flow_gateway

# Test direct service access
curl http://localhost:4001/health
curl http://localhost:4002/health
curl http://localhost:4003/health
```

---

## 📚 Documentation

- Full API documentation: See README.md
- Database schemas: Check `services/*/database/migrations/`
- Architecture: Each service follows Clean Architecture pattern

---

## 🎉 What Works Right Now

- ✅ Complete user authentication system
- ✅ Full product catalog with search
- ✅ Shopping cart for multiple vendors
- ✅ **Automatic multi-vendor order splitting**
- ✅ Inventory management with reservations
- ✅ Order tracking
- ✅ Merchant application workflow

The core e-commerce functionality is **fully operational**!
