export class RefreshToken {
    constructor(
        public id: string,
        public userId: string,
        public token: string,
        public expiresAt: Date,
        public revoked: boolean
    ) { }
}
