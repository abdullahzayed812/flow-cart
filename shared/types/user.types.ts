import { UserRole, MerchantStatus } from './enums';

export interface User {
    id: string;
    email: string;
    password_hash: string;
    role: UserRole;
    first_name: string;
    last_name: string;
    phone?: string;
    created_at: Date;
    updated_at: Date;
}

export interface UserProfile {
    id: string;
    email: string;
    role: UserRole;
    first_name: string;
    last_name: string;
    phone?: string;
}

export interface Merchant {
    id: string;
    user_id: string;
    business_name: string;
    business_email: string;
    business_phone: string;
    tax_id?: string;
    status: MerchantStatus;
    created_at: Date;
    updated_at: Date;
}

export interface Session {
    id: string;
    user_id: string;
    refresh_token: string;
    expires_at: Date;
    created_at: Date;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export interface JWTPayload {
    user_id: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}
