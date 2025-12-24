import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Database } from '../database/Database';
import { UserRole } from '@flow-cart/shared';
import { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
    id: string;
    email: string;
    password_hash: string;
    role: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    is_active: number;
    email_verified: number;
    created_at: Date;
    updated_at: Date;
}

export class UserRepository implements IUserRepository {
    constructor(private db: Database) { }

    async create(user: User): Promise<void> {
        const sql = `
      INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, is_active, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        await this.db.query(sql, [
            user.id,
            user.email,
            user.passwordHash,
            user.role,
            user.firstName,
            user.lastName,
            user.phone,
            user.isActive ? 1 : 0,
            user.emailVerified ? 1 : 0,
            user.createdAt,
            user.updatedAt
        ]);
    }

    async findById(id: string): Promise<User | null> {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const rows = await this.db.query<UserRow[]>(sql, [id]);

        if (rows.length === 0) {
            return null;
        }

        return this.mapRowToUser(rows[0]);
    }

    async findByEmail(email: string): Promise<User | null> {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const rows = await this.db.query<UserRow[]>(sql, [email]);

        if (rows.length === 0) {
            return null;
        }

        return this.mapRowToUser(rows[0]);
    }

    async update(user: User): Promise<void> {
        const sql = `
      UPDATE users 
      SET email = ?, password_hash = ?, role = ?, first_name = ?, last_name = ?, 
          phone = ?, is_active = ?, email_verified = ?, updated_at = ?
      WHERE id = ?
    `;

        await this.db.query(sql, [
            user.email,
            user.passwordHash,
            user.role,
            user.firstName,
            user.lastName,
            user.phone,
            user.isActive ? 1 : 0,
            user.emailVerified ? 1 : 0,
            user.updatedAt,
            user.id
        ]);
    }

    async delete(id: string): Promise<void> {
        const sql = 'DELETE FROM users WHERE id = ?';
        await this.db.query(sql, [id]);
    }

    private mapRowToUser(row: UserRow): User {
        return new User(
            row.id,
            row.email,
            row.password_hash,
            row.role as UserRole,
            row.first_name,
            row.last_name,
            row.phone,
            row.is_active === 1,
            row.email_verified === 1,
            new Date(row.created_at),
            new Date(row.updated_at)
        );
    }
}
