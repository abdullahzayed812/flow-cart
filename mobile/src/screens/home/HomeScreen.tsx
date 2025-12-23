import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProductService from '../../services/product.service';

const CATEGORIES = [
    { id: '1', name: 'Electronics', icon: 'devices' },
    { id: '2', name: 'Fashion', icon: 'checkroom' },
    { id: '3', name: 'Home', icon: 'home' },
    { id: '4', name: 'Sports', icon: 'sports-soccer' },
    { id: '5', name: 'Books', icon: 'menu-book' },
    { id: '6', name: 'Toys', icon: 'toys' },
];

export default function HomeScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredProducts, setFeaturedProducts] = useState([]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigation.navigate('Products', { search: searchQuery });
        }
    };

    const handleCategoryPress = (category: string) => {
        navigation.navigate('Products', { category });
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Flow Cart</Text>
                <Text style={styles.subtitle}>Multi-Vendor Marketplace</Text>
            </View>

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

            {/* Categories */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={styles.categoryCard}
                            onPress={() => handleCategoryPress(category.name)}
                        >
                            <View style={styles.categoryIcon}>
                                <Icon name={category.icon} size={32} color="#007AFF" />
                            </View>
                            <Text style={styles.categoryName}>{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Featured Products */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Featured Products</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Products')}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.comingSoon}>Browse products in the Products tab</Text>
            </View>

            {/* Promotional Banner */}
            <View style={styles.banner}>
                <Text style={styles.bannerTitle}>🎉 Multi-Vendor Marketplace</Text>
                <Text style={styles.bannerText}>
                    Shop from multiple vendors in one cart!
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#007AFF',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 16,
        padding: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    seeAll: {
        color: '#007AFF',
        fontSize: 14,
    },
    categoryCard: {
        alignItems: 'center',
        marginLeft: 16,
        width: 80,
    },
    categoryIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 12,
        textAlign: 'center',
    },
    comingSoon: {
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 16,
    },
    banner: {
        backgroundColor: '#FFF3CD',
        padding: 20,
        margin: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC107',
    },
    bannerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    bannerText: {
        fontSize: 14,
        color: '#666',
    },
});
