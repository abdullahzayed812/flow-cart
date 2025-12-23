import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OrderService from '../../services/order.service';

export default function OrderDetailScreen({ route }: any) {
    const { orderId } = route.params;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await OrderService.getOrder(orderId);
            setOrder(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes, Cancel',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await OrderService.cancelOrder(orderId);
                        fetchOrderDetails();
                        Alert.alert('Success', 'Order cancelled successfully');
                    } catch (error: any) {
                        Alert.alert('Error', error.response?.data?.error?.message || 'Failed to cancel order');
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.centered}>
                <Text>Order not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Order Header */}
            <View style={styles.header}>
                <Text style={styles.orderId}>Order #{order.id.substring(0, 8)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#007AFF' }]}>
                    <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                </View>
            </View>

            {/* Order Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Order Information</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{new Date(order.createdAt).toLocaleString()}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Payment Status:</Text>
                    <Text style={styles.value}>{order.paymentStatus}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Payment Method:</Text>
                    <Text style={styles.value}>{order.paymentMethod || 'N/A'}</Text>
                </View>
            </View>

            {/* Shipping Address */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shipping Address</Text>
                <Text style={styles.address}>{order.shippingAddress}</Text>
            </View>

            {/* Order Items */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Items</Text>
                {order.items?.map((item: any, index: number) => (
                    <View key={index} style={styles.item}>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>Product #{item.productId.substring(0, 8)}</Text>
                            <Text style={styles.itemDetails}>
                                Qty: {item.quantity} × ${item.price}
                            </Text>
                        </View>
                        <Text style={styles.itemTotal}>${item.subtotal}</Text>
                    </View>
                ))}
            </View>

            {/* Total */}
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalAmount}>${order.totalAmount}</Text>
            </View>

            {/* Cancel Button */}
            {order.status === 'pending' && (
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
                    <Text style={styles.cancelButtonText}>Cancel Order</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
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
    orderId: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#666',
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
    },
    address: {
        fontSize: 14,
        lineHeight: 20,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    itemDetails: {
        fontSize: 14,
        color: '#666',
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 8,
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
    cancelButton: {
        backgroundColor: '#FF3B30',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
