export class User {
    constructor(
        public id: string,
        public email: string,
        public passwordHash: string,
        public role: string,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}
