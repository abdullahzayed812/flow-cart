import { IMerchantRepository } from '../../domain/repositories/IMerchantRepository';
import { Merchant } from '../../domain/entities/Merchant';
import { Database } from '../database/Database';
import { MerchantStatus } from '../../../../shared/types/enums';
import { RowDataPacket } from 'mysql2';

interface MerchantRow extends RowDataPacket {
    id: string;
    user_id: string;
    business_name: string;
    business_email: string;
    business_phone: string;
    business_address: string | null;
    tax_id: string | null;
    status: string;
    rejection_reason: string | null;
    approved_at: Date | null;
    approved_by: string | null;
    created_at: Date;
    updated_at: Date;
}

export class MerchantRepository implements IMerchantRepository {
    constructor(private db: Database) { }

    async create(merchant: Merchant): Promise<void> {
        const sql = `
      INSERT INTO merchants (id, user_id, business_name, business_email, business_phone, 
                            business_address, tax_id, status, rejection_reason, approved_at, 
                            approved_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        await this.db.query(sql, [
            merchant.id,
            merchant.userId,
            merchant.businessName,
            merchant.businessEmail,
            merchant.businessPhone,
            merchant.businessAddress,
            merchant.taxId,
            merchant.status,
            merchant.rejectionReason,
            merchant.approvedAt,
            merchant.approvedBy,
            merchant.createdAt,
            merchant.updatedAt
        ]);
    }

    async findById(id: string): Promise<Merchant | null> {
        const sql = 'SELECT * FROM merchants WHERE id = ?';
        const rows = await this.db.query<MerchantRow[]>(sql, [id]);

        if (rows.length === 0) {
            return null;
        }

        return this.mapRowToMerchant(rows[0]);
    }

    async findByUserId(userId: string): Promise<Merchant | null> {
        const sql = 'SELECT * FROM merchants WHERE user_id = ?';
        const rows = await this.db.query<MerchantRow[]>(sql, [userId]);

        if (rows.length === 0) {
            return null;
        }

        return this.mapRowToMerchant(rows[0]);
    }

    async update(merchant: Merchant): Promise<void> {
        const sql = `
      UPDATE merchants 
      SET business_name = ?, business_email = ?, business_phone = ?, 
          business_address = ?, tax_id = ?, status = ?, rejection_reason = ?, 
          approved_at = ?, approved_by = ?, updated_at = ?
      WHERE id = ?
    `;

        await this.db.query(sql, [
            merchant.businessName,
            merchant.businessEmail,
            merchant.businessPhone,
            merchant.businessAddress,
            merchant.taxId,
            merchant.status,
            merchant.rejectionReason,
            merchant.approvedAt,
            merchant.approvedBy,
            merchant.updatedAt,
            merchant.id
        ]);
    }

    async findPending(): Promise<Merchant[]> {
        const sql = 'SELECT * FROM merchants WHERE status = ? ORDER BY created_at ASC';
        const rows = await this.db.query<MerchantRow[]>(sql, [MerchantStatus.PENDING]);

        return rows.map(row => this.mapRowToMerchant(row));
    }

    private mapRowToMerchant(row: MerchantRow): Merchant {
        return new Merchant(
            row.id,
            row.user_id,
            row.business_name,
            row.business_email,
            row.business_phone,
            row.business_address,
            row.tax_id,
            row.status as MerchantStatus,
            row.rejection_reason,
            row.approved_at ? new Date(row.approved_at) : null,
            row.approved_by,
            new Date(row.created_at),
            new Date(row.updated_at)
        );
    }
}
