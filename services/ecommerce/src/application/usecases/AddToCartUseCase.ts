import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Cart, CartItem } from '../../domain/entities/Cart';
import { v4 as uuidv4 } from 'uuid';

export interface AddToCartDTO {
    userId: string;
    productId: string;
    quantity: number;
    variantId?: string;
}

export class AddToCartUseCase {
    constructor(
        private cartRepository: ICartRepository,
        private productRepository: IProductRepository
    ) { }

    async execute(dto: AddToCartDTO): Promise<CartItem> {
        // Verify product exists
        const product = await this.productRepository.findById(dto.productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (!product.isActive) {
            throw new Error('Product is not available');
        }

        // Get or create cart
        let cart = await this.cartRepository.findCartByUserId(dto.userId);
        if (!cart) {
            cart = Cart.create(uuidv4(), dto.userId);
            await this.cartRepository.createCart(cart);
        }

        // Check if item already exists in cart
        const existingItems = await this.cartRepository.getCartItems(cart.id);
        const existingItem = existingItems.find(
            item => item.productId === dto.productId && item.variantId === (dto.variantId || null)
        );

        if (existingItem) {
            // Update quantity
            existingItem.updateQuantity(existingItem.quantity + dto.quantity);
            await this.cartRepository.updateItem(existingItem);
            return existingItem;
        } else {
            // Add new item
            const cartItem = CartItem.create(
                uuidv4(),
                cart.id,
                dto.productId,
                product.price,
                dto.quantity,
                dto.variantId || null
            );
            await this.cartRepository.addItem(cartItem);
            return cartItem;
        }
    }
}
