import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import OrderService from '../../services/order.service';
import { useCartStore } from '../../store/cartStore';

export default function CheckoutScreen({ navigation }: any) {
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [loading, setLoading] = useState(false);
    const { total, clearCart } = useCartStore();

    const handleCheckout = async () => {
        if (!shippingAddress.trim()) {
            Alert.alert('Error', 'Please enter shipping address');
            return;
        }

        try {
            setLoading(true);
            const response = await OrderService.checkout({
                shippingAddress,
                billingAddress: billingAddress || shippingAddress,
                paymentMethod,
            });

            await clearCart();

            Alert.alert(
                'Order Placed!',
                `Successfully created ${response.data.length} order(s)`,
                [
                    {
                        text: 'View Orders',
                        onPress: () => navigation.navigate('Orders'),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Checkout Failed', error.response?.data?.error?.message || 'Please try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Checkout</Text>

                {/* Shipping Address */}
                <View style={styles.section}>
                    <Text style={styles.label}>Shipping Address *</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Enter your shipping address"
                        value={shippingAddress}
                        onChangeText={setShippingAddress}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Billing Address */}
                <View style={styles.section}>
                    <Text style={styles.label}>Billing Address (Optional)</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Same as shipping address"
                        value={billingAddress}
                        onChangeText={setBillingAddress}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={styles.label}>Payment Method</Text>
                    <View style={styles.paymentOptions}>
                        <TouchableOpacity
                            style={[
                                styles.paymentOption,
                                paymentMethod === 'credit_card' && styles.paymentOptionActive,
                            ]}
                            onPress={() => setPaymentMethod('credit_card')}
                        >
                            <Text
                                style={[
                                    styles.paymentOptionText,
                                    paymentMethod === 'credit_card' && styles.paymentOptionTextActive,
                                ]}
                            >
                                Credit Card
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.paymentOption,
                                paymentMethod === 'cash_on_delivery' && styles.paymentOptionActive,
                            ]}
                            onPress={() => setPaymentMethod('cash_on_delivery')}
                        >
                            <Text
                                style={[
                                    styles.paymentOptionText,
                                    paymentMethod === 'cash_on_delivery' && styles.paymentOptionTextActive,
                                ]}
                            >
                                Cash on Delivery
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Order Summary */}
                <View style={styles.summary}>
                    <Text style={styles.summaryTitle}>Order Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Amount:</Text>
                        <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.note}>
                        Note: Orders will be split by merchant automatically
                    </Text>
                </View>

                {/* Place Order Button */}
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleCheckout}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Place Order</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
    },
    paymentOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    paymentOption: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    paymentOptionActive: {
        borderColor: '#007AFF',
        backgroundColor: '#E3F2FD',
    },
    paymentOptionText: {
        fontSize: 14,
        color: '#666',
    },
    paymentOptionTextActive: {
        color: '#007AFF',
        fontWeight: '600',
    },
    summary: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#666',
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    note: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
