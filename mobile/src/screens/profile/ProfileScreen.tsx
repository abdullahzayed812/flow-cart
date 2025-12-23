import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                },
            },
        ]);
    };

    const menuItems = [
        { icon: 'person', title: 'Edit Profile', onPress: () => { } },
        { icon: 'location-on', title: 'Addresses', onPress: () => { } },
        { icon: 'payment', title: 'Payment Methods', onPress: () => { } },
        { icon: 'notifications', title: 'Notifications', onPress: () => { } },
        { icon: 'help', title: 'Help & Support', onPress: () => { } },
        { icon: 'info', title: 'About', onPress: () => { } },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Icon name="person" size={48} color="#007AFF" />
                </View>
                <Text style={styles.name}>
                    {user?.firstName} {user?.lastName}
                </Text>
                <Text style={styles.email}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
                </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menu}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={item.onPress}
                    >
                        <Icon name={item.icon} size={24} color="#666" />
                        <Text style={styles.menuItemText}>{item.title}</Text>
                        <Icon name="chevron-right" size={24} color="#ccc" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Icon name="logout" size={24} color="#FF3B30" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            {/* App Version */}
            <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    roleBadge: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    roleText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    menu: {
        backgroundColor: '#fff',
        marginTop: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    version: {
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
        marginVertical: 24,
    },
});
