import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProductService from '../../services/product.service';
import { useCartStore } from '../../store/cartStore';

export default function ProductDetailScreen({ route, navigation }: any) {
    const { productId } = route.params;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await ProductService.getProduct(productId);
            setProduct(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        try {
            await addItem(productId, quantity);
            Alert.alert('Success', 'Added to cart', [
                { text: 'Continue Shopping', style: 'cancel' },
                { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error?.message || 'Failed to add to cart');
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.centered}>
                <Text>Product not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Icon name="image" size={120} color="#ccc" />
                </View>

                {/* Product Info */}
                <View style={styles.content}>
                    <Text style={styles.category}>{product.category}</Text>
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.price}>${product.price}</Text>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>

                    {/* SKU */}
                    <View style={styles.section}>
                        <Text style={styles.label}>SKU: {product.sku}</Text>
                    </View>

                    {/* Quantity Selector */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quantity</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Icon name="remove" size={24} color="#007AFF" />
                            </TouchableOpacity>
                            <Text style={styles.quantity}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(quantity + 1)}
                            >
                                <Icon name="add" size={24} color="#007AFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Add to Cart Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                    <Icon name="shopping-cart" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        height: 300,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 16,
    },
    category: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    label: {
        fontSize: 14,
        color: '#666',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantity: {
        fontSize: 20,
        fontWeight: '600',
        marginHorizontal: 24,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    addButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        padding: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
});
