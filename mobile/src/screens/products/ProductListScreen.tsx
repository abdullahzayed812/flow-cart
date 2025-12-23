import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProductService from '../../services/product.service';

export default function ProductListScreen({ navigation, route }: any) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { category, search } = route.params || {};

    useEffect(() => {
        fetchProducts();
    }, [category, search]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let response;
            if (search) {
                response = await ProductService.searchProducts(search);
            } else if (category) {
                response = await ProductService.getProductsByCategory(category);
            } else {
                response = await ProductService.getProducts();
            }
            setProducts(response.data || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            try {
                setLoading(true);
                const response = await ProductService.searchProducts(searchQuery);
                setProducts(response.data || []);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const renderProduct = ({ item }: any) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
            <View style={styles.productImage}>
                <Icon name="image" size={48} color="#ccc" />
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                </Text>
                <Text style={styles.productCategory}>{item.category}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
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
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
            </View>

            {/* Header */}
            {(category || search) && (
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        {category ? `Category: ${category}` : `Search: ${search}`}
                    </Text>
                    <Text style={styles.resultCount}>{products.length} products found</Text>
                </View>
            )}

            {/* Product List */}
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item: any) => item.id}
                numColumns={2}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Icon name="shopping-bag" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No products found</Text>
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 16,
        padding: 12,
        borderRadius: 8,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultCount: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    list: {
        padding: 8,
    },
    productCard: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 8,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
    },
    productImage: {
        height: 150,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    productCategory: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
    },
});
