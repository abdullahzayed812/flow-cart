# Merchant Dashboard

React web application for merchants to manage their stores on the Flow Cart platform.

## Features

- Dashboard with sales overview
- Product management
- Order management
- Sales analytics
- Store settings
- Payout requests

## Setup

```bash
npm install
npm run dev
```

The dashboard will be available at http://localhost:3000

## Tech Stack

- React 18
- TypeScript
- Material-UI
- Zustand (state management)
- React Router
- Vite

## API Integration

The dashboard connects to the backend API through a proxy configured in `vite.config.ts`.

All API requests are sent to `/api/*` which proxies to `http://localhost` (the Nginx API Gateway).
