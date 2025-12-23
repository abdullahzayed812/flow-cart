import { v4 as uuidv4 } from 'uuid';
import { MySQLCartRepository } from '../../infrastructure/repositories/MySQLRepositories';
import { Cart, CartItem } from '../entities/Cart';

export class AddToCartUseCase {
    constructor(private cartRepo: MySQLCartRepository) { }

    async execute(userId: string, productId: string, quantity: number): Promise<void> {
        let cart = await this.cartRepo.getByUserId(userId);

        if (!cart) {
            cart = new Cart(uuidv4(), userId);
            await this.cartRepo.create(cart);
        }

        const item = new CartItem(productId, quantity);
        await this.cartRepo.addItem(cart.id, item);
    }
}
