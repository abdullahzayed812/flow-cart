import { IUserRepository } from '../interfaces/IUserRepository';
import { PasswordService } from '../../utils/password';
import { TokenService } from '../../utils/token';
import { AppError } from '@flow-cart/shared';

export class LoginUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isPasswordValid = await PasswordService.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        const accessToken = TokenService.generateAccess(user.id, user.role);
        const refreshToken = TokenService.generateRefresh(user.id);

        return { user, accessToken, refreshToken };
    }
}
