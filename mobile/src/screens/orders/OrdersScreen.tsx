import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OrderService from '../../services/order.service';

export default function OrdersScreen({ navigation }: any) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await OrderService.getOrders();
            setOrders(response.data || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return '#FFA500';
            case 'confirmed':
            case 'processing':
                return '#007AFF';
            case 'shipped':
            case 'delivered':
                return '#34C759';
            case 'cancelled':
            case 'refunded':
                return '#FF3B30';
            default:
                return '#666';
        }
    };

    const renderOrder = ({ item }: any) => (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.id.substring(0, 8)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>
            <View style={styles.orderInfo}>
                <Text style={styles.orderDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.orderAmount}>${item.totalAmount}</Text>
            </View>
            <View style={styles.orderFooter}>
                <Text style={styles.merchantLabel}>Merchant ID: {item.merchantId.substring(0, 8)}</Text>
                <Icon name="chevron-right" size={24} color="#666" />
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderOrder}
                keyExtractor={(item: any) => item.id}
                contentContainerStyle={styles.list}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    fetchOrders();
                }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Icon name="receipt" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No orders yet</Text>
                        <TouchableOpacity
                            style={styles.shopButton}
                            onPress={() => navigation.navigate('Products')}
                        >
                            <Text style={styles.shopButtonText}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
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
    list: {
        padding: 8,
        flexGrow: 1,
    },
    orderCard: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 8,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    orderInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    orderDate: {
        fontSize: 14,
        color: '#666',
    },
    orderAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    merchantLabel: {
        fontSize: 12,
        color: '#666',
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
});
