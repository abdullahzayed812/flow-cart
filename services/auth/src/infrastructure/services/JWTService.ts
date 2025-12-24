import jwt from "jsonwebtoken";
import { UserRole } from "@flow-cart/shared";

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class JWTService {
  private static readonly ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
  private static readonly REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret_key";
  private static readonly ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
  private static readonly REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

  static generateTokenPair(payload: JWTPayload): TokenPair {
    const accessToken = jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign({ userId: payload.userId }, this.REFRESH_TOKEN_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getExpiresInSeconds(this.ACCESS_TOKEN_EXPIRES_IN),
    };
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired access token");
    }
  }

  static verifyRefreshToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  private static getExpiresInSeconds(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case "s":
        return value;
      case "m":
        return value * 60;
      case "h":
        return value * 3600;
      case "d":
        return value * 86400;
      default:
        return 900; // 15 minutes default
    }
  }
}
