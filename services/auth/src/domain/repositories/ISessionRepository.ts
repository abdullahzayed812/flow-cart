import { Session } from '../entities/Session';

export interface ISessionRepository {
    create(session: Session): Promise<void>;
    findByRefreshToken(refreshToken: string): Promise<Session | null>;
    findByUserId(userId: string): Promise<Session[]>;
    delete(id: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
    deleteExpired(): Promise<void>;
}
