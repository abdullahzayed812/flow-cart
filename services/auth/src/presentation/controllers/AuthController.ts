import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../core/usecases/RegisterUserUseCase";
import { LoginUseCase } from "../../core/usecases/LoginUseCase";
import { ApplyMerchantUseCase } from "../../core/usecases/ApplyMerchantUseCase";
import { RefreshTokenUseCase } from "../../core/usecases/RefreshTokenUseCase";
import { GetUserProfileUseCase } from "../../core/usecases/GetUserProfileUseCase";
import { AuthRequest } from "../middlewares/authMiddleware";

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUseCase: LoginUseCase,
    private applyMerchantUseCase: ApplyMerchantUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private getUserProfileUseCase: GetUserProfileUseCase
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Email, password, first name, and last name are required",
          },
        });
        return;
      }

      const ipAddress = req.ip;
      const userAgent = req.headers["user-agent"];

      const tokens = await this.registerUserUseCase.execute(
        { email, password, firstName, lastName, phone },
        ipAddress,
        userAgent
      );

      res.status(201).json({
        success: true,
        data: tokens,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: "REGISTRATION_FAILED",
          message: error.message,
        },
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Email and password are required",
          },
        });
        return;
      }

      const ipAddress = req.ip;
      const userAgent = req.headers["user-agent"];

      const tokens = await this.loginUseCase.execute({ email, password }, ipAddress, userAgent);

      res.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: {
          code: "LOGIN_FAILED",
          message: error.message,
        },
      });
    }
  };

  applyMerchant = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        });
        return;
      }

      const { businessName, businessEmail, businessPhone, businessAddress, taxId } = req.body;

      if (!businessName || !businessEmail || !businessPhone) {
        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Business name, email, and phone are required",
          },
        });
        return;
      }

      const merchant = await this.applyMerchantUseCase.execute({
        userId: req.user.userId,
        businessName,
        businessEmail,
        businessPhone,
        businessAddress,
        taxId,
      });

      res.status(201).json({
        success: true,
        data: merchant,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: "MERCHANT_APPLICATION_FAILED",
          message: error.message,
        },
      });
    }
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Refresh token is required",
          },
        });
        return;
      }

      const ipAddress = req.ip;
      const userAgent = req.headers["user-agent"];

      const tokens = await this.refreshTokenUseCase.execute(refreshToken, ipAddress, userAgent);

      res.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: {
          code: "REFRESH_FAILED",
          message: error.message,
        },
      });
    }
  };

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        });
        return;
      }

      const profile = await this.getUserProfileUseCase.execute(req.user.userId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: error.message,
        },
      });
    }
  };
}
