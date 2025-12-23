import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../entities/User';
import { PasswordService } from '../../utils/password';
import { AppError } from '@flow-cart/shared';

export class SignupUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(email: string, password: string): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError('User already exists', 409);
        }

        const passwordHash = await PasswordService.hash(password);
        const user = new User(
            uuidv4(),
            email,
            passwordHash,
            'customer',
            new Date(),
            new Date()
        );

        return this.userRepository.create(user);
    }
}
