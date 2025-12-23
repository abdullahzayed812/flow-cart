export class Session {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public refreshToken: string,
        public ipAddress: string | null,
        public userAgent: string | null,
        public expiresAt: Date,
        public readonly createdAt: Date
    ) { }

    static create(
        id: string,
        userId: string,
        refreshToken: string,
        expiresAt: Date,
        ipAddress: string | null = null,
        userAgent: string | null = null
    ): Session {
        return new Session(
            id,
            userId,
            refreshToken,
            ipAddress,
            userAgent,
            expiresAt,
            new Date()
        );
    }

    isExpired(): boolean {
        return new Date() > this.expiresAt;
    }
}
