import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/home/HomeScreen';
import ProductListScreen from '../screens/products/ProductListScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

import { useAuthStore } from '../store/authStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName = 'home';
                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Products') iconName = 'shopping-bag';
                    else if (route.name === 'Cart') iconName = 'shopping-cart';
                    else if (route.name === 'Orders') iconName = 'receipt';
                    else if (route.name === 'Profile') iconName = 'person';
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Products" component={ProductListScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Orders" component={OrdersScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return null; // Or a loading screen
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                        <Stack.Screen name="Checkout" component={CheckoutScreen} />
                        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
