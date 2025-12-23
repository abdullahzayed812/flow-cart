import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { Session } from '../../domain/entities/Session';
import { Database } from '../database/Database';
import { RowDataPacket } from 'mysql2';

interface SessionRow extends RowDataPacket {
    id: string;
    user_id: string;
    refresh_token: string;
    ip_address: string | null;
    user_agent: string | null;
    expires_at: Date;
    created_at: Date;
}

export class SessionRepository implements ISessionRepository {
    constructor(private db: Database) { }

    async create(session: Session): Promise<void> {
        const sql = `
      INSERT INTO sessions (id, user_id, refresh_token, ip_address, user_agent, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        await this.db.query(sql, [
            session.id,
            session.userId,
            session.refreshToken,
            session.ipAddress,
            session.userAgent,
            session.expiresAt,
            session.createdAt
        ]);
    }

    async findByRefreshToken(refreshToken: string): Promise<Session | null> {
        const sql = 'SELECT * FROM sessions WHERE refresh_token = ?';
        const rows = await this.db.query<SessionRow[]>(sql, [refreshToken]);

        if (rows.length === 0) {
            return null;
        }

        return this.mapRowToSession(rows[0]);
    }

    async findByUserId(userId: string): Promise<Session[]> {
        const sql = 'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC';
        const rows = await this.db.query<SessionRow[]>(sql, [userId]);

        return rows.map(row => this.mapRowToSession(row));
    }

    async delete(id: string): Promise<void> {
        const sql = 'DELETE FROM sessions WHERE id = ?';
        await this.db.query(sql, [id]);
    }

    async deleteByUserId(userId: string): Promise<void> {
        const sql = 'DELETE FROM sessions WHERE user_id = ?';
        await this.db.query(sql, [userId]);
    }

    async deleteExpired(): Promise<void> {
        const sql = 'DELETE FROM sessions WHERE expires_at < NOW()';
        await this.db.query(sql);
    }

    private mapRowToSession(row: SessionRow): Session {
        return new Session(
            row.id,
            row.user_id,
            row.refresh_token,
            row.ip_address,
            row.user_agent,
            new Date(row.expires_at),
            new Date(row.created_at)
        );
    }
}
