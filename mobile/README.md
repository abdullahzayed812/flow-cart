# Flow Cart Mobile App

React Native mobile application for the Flow Cart multi-vendor e-commerce platform.

## Features

- ✅ User authentication (login/register)
- ✅ Product browsing and search
- ✅ Shopping cart (multi-vendor)
- ✅ Checkout flow
- ✅ Order tracking
- ✅ Real-time notifications (WebSocket)
- ✅ Profile management

## Setup

### Prerequisites

- Node.js 18+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

### Installation

```bash
cd mobile
npm install

# iOS only
cd ios && pod install && cd ..
```

### Running

```bash
# Android
npm run android

# iOS
npm run ios
```

## Project Structure

```
mobile/
├── src/
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # Screen components
│   │   ├── auth/        # Login, Register
│   │   ├── home/        # Home screen
│   │   ├── products/    # Product list, details
│   │   ├── cart/        # Shopping cart
│   │   ├── checkout/    # Checkout flow
│   │   ├── orders/      # Order history, tracking
│   │   └── profile/     # User profile
│   ├── components/      # Reusable components
│   ├── services/        # API services
│   ├── store/           # Zustand state management
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
├── App.tsx              # Main app component
└── package.json
```

## State Management

Using **Zustand** for global state:
- `authStore` - Authentication state
- `cartStore` - Shopping cart state

## API Integration

All API calls go through the `ApiService` which handles:
- Token management
- Automatic token refresh
- Request/response interceptors

## Configuration

Update API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://YOUR_API_URL';
```

For local development:
- Android Emulator: `http://10.0.2.2`
- iOS Simulator: `http://localhost`
- Physical Device: Your computer's IP address
