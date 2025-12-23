import { Pool } from 'mysql2/promise';
import { IUserRepository } from '../../core/interfaces/IUserRepository';
import { User } from '../../core/entities/User';

export class MySQLUserRepository implements IUserRepository {
    constructor(private pool: Pool) { }

    async create(user: User): Promise<User> {
        const query = `
      INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
        await this.pool.execute(query, [
            user.id,
            user.email,
            user.passwordHash,
            user.role,
            user.createdAt,
            user.updatedAt
        ]);
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await this.pool.execute(query, [email]);
        const users = rows as any[];

        if (users.length === 0) return null;

        const u = users[0];
        return new User(u.id, u.email, u.password_hash, u.role, u.created_at, u.updated_at);
    }

    async findById(id: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await this.pool.execute(query, [id]);
        const users = rows as any[];

        if (users.length === 0) return null;

        const u = users[0];
        return new User(u.id, u.email, u.password_hash, u.role, u.created_at, u.updated_at);
    }
}
