import { db } from "../infrastructure/database/Database";
import { v4 as uuidv4 } from "uuid";

const seed = async () => {
  try {
    console.log("🌱 Seeding Merchant Service...");
    const connection = await db.getPool().getConnection();

    // Check if stores exist
    const [rows]: any = await connection.query("SELECT COUNT(*) as count FROM stores");
    if (rows[0].count > 0) {
      console.log("⚠️  Stores table already seeded. Skipping.");
      connection.release();
      process.exit(0);
    }

    const storeId = "store-1111-1111-1111-111111111111";
    const merchantId = "22222222-2222-2222-2222-222222222222"; // Matches Auth Service Merchant ID

    await connection.query(
      `INSERT INTO stores (id, merchant_id, store_name, store_description, contact_email, is_active) 
             VALUES (?, ?, ?, ?, ?, ?)`,
      [storeId, merchantId, "FlowCart Demo Store", "The best store in town", "merchant@flowcart.com", true]
    );

    await connection.query(
      `INSERT INTO store_settings (id, store_id, currency, tax_rate, shipping_fee)
             VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), storeId, "USD", 5.0, 10.0]
    );

    console.log("✅ Merchant Service seeded successfully");
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error("❌ Merchant Service seeding failed:", error);
    process.exit(1);
  }
};

seed();
