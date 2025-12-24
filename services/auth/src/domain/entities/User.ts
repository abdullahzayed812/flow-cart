import { UserRole } from '@flow-cart/shared';

export class User {
    constructor(
        public readonly id: string,
        public email: string,
        public passwordHash: string,
        public role: UserRole,
        public firstName: string,
        public lastName: string,
        public phone: string | null,
        public isActive: boolean,
        public emailVerified: boolean,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { }

    static create(
        id: string,
        email: string,
        passwordHash: string,
        firstName: string,
        lastName: string,
        phone: string | null = null,
        role: UserRole = UserRole.CUSTOMER
    ): User {
        return new User(
            id,
            email,
            passwordHash,
            role,
            firstName,
            lastName,
            phone,
            true,
            false,
            new Date(),
            new Date()
        );
    }

    updateProfile(firstName: string, lastName: string, phone: string | null): void {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.updatedAt = new Date();
    }

    verifyEmail(): void {
        this.emailVerified = true;
        this.updatedAt = new Date();
    }

    deactivate(): void {
        this.isActive = false;
        this.updatedAt = new Date();
    }

    activate(): void {
        this.isActive = true;
        this.updatedAt = new Date();
    }
}
