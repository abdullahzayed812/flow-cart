import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCartStore } from '../../store/cartStore';

export default function CartScreen({ navigation }: any) {
    const { items, total, isLoading, fetchCart, removeItem, clearCart } = useCartStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        setRefreshing(true);
        await fetchCart();
        setRefreshing(false);
    };

    const handleRemoveItem = (itemId: string) => {
        Alert.alert('Remove Item', 'Remove this item from cart?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await removeItem(itemId);
                    } catch (error) {
                        Alert.alert('Error', 'Failed to remove item');
                    }
                },
            },
        ]);
    };

    const handleClearCart = () => {
        Alert.alert('Clear Cart', 'Remove all items from cart?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Clear',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await clearCart();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to clear cart');
                    }
                },
            },
        ]);
    };

    const handleCheckout = () => {
        if (items.length === 0) {
            Alert.alert('Empty Cart', 'Add items to cart before checkout');
            return;
        }
        navigation.navigate('Checkout');
    };

    const renderCartItem = ({ item }: any) => (
        <View style={styles.cartItem}>
            <View style={styles.itemImage}>
                <Icon name="image" size={48} color="#ccc" />
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>Product #{item.productId.substring(0, 8)}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <View style={styles.itemActions}>
                <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
                <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                    <Icon name="delete" size={24} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (isLoading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Shopping Cart</Text>
                {items.length > 0 && (
                    <TouchableOpacity onPress={handleClearCart}>
                        <Text style={styles.clearButton}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Cart Items */}
            <FlatList
                data={items}
                renderItem={renderCartItem}
                keyExtractor={(item: any) => item.id}
                contentContainerStyle={styles.list}
                refreshing={refreshing}
                onRefresh={loadCart}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Icon name="shopping-cart" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>Your cart is empty</Text>
                        <TouchableOpacity
                            style={styles.shopButton}
                            onPress={() => navigation.navigate('Products')}
                        >
                            <Text style={styles.shopButtonText}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* Footer */}
            {items.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    clearButton: {
        color: '#FF3B30',
        fontSize: 14,
    },
    list: {
        flexGrow: 1,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 8,
    },
    itemImage: {
        width: 80,
        height: 80,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
    },
    itemActions: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    itemTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    shopButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    shopButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    checkoutButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
