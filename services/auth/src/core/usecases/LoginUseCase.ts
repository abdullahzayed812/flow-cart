import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ISessionRepository } from "../../domain/repositories/ISessionRepository";
import { PasswordService } from "../../infrastructure/services/PasswordService";
import { JWTService, TokenPair } from "../../infrastructure/services/JWTService";
import { Session } from "../../domain/entities/Session";
import { v4 as uuidv4 } from "uuid";

export interface LoginDTO {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private sessionRepository: ISessionRepository
  ) {}

  async execute(dto: LoginDTO, ipAddress?: string, userAgent?: string): Promise<TokenPair> {
    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await PasswordService.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate tokens
    const tokens = JWTService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const session = Session.create(uuidv4(), user.id, tokens.refreshToken, expiresAt, ipAddress, userAgent);

    await this.sessionRepository.create(session);

    return tokens;
  }
}
