import { db } from "../infrastructure/database/Database";

const reset = async () => {
    try {
        console.log("🗑️  Resetting Ecommerce Service Database...");
        const connection = await db.getPool().getConnection();

        // Disable foreign key checks to allow dropping tables with relationships
        await connection.query("SET FOREIGN_KEY_CHECKS = 0");

        // Get all tables
        const [rows]: any = await connection.query("SHOW TABLES");
        const tables = rows.map((row: any) => Object.values(row)[0]);

        if (tables.length > 0) {
            console.log(`Found ${tables.length} tables to drop: ${tables.join(", ")}`);
            for (const table of tables) {
                await connection.query(`DROP TABLE IF EXISTS ${table}`);
            }
            console.log("✅ All tables dropped successfully");
        } else {
            console.log("⚠️  No tables found to drop");
        }

        // Re-enable foreign key checks
        await connection.query("SET FOREIGN_KEY_CHECKS = 1");

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error("❌ Database reset failed:", error);
        process.exit(1);
    }
};

reset();
