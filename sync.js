require("module-alias/register");
const { sequelize } = require("./src/models");

const runSync = async () => {
    try {
        console.log("🔄 Starting database synchronization...");

        // Check if we are in production
        if (process.env.NODE_ENV === "production") {
            console.warn(
                "⚠️  WARNING: You are running sync in PRODUCTION environment.",
            );
            console.warn(
                "   This may alter your database schema and cause data loss.",
            );
            console.warn(
                "   Waiting 5 seconds before proceeding... (Ctrl+C to cancel)",
            );
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        // Sync all models
        // alter: true will check the current state of the database and add/modify columns to match the model
        await sequelize.sync({ alter: true });

        console.log("✅ Database synchronized successfully.");
    } catch (error) {
        console.error("❌ Error synchronizing database:", error);
        process.exit(1);
    } finally {
        try {
            await sequelize.close();
            console.log("🔒 Database connection closed.");
        } catch (e) {
            console.error("Error closing connection:", e);
        }
    }
};

runSync();
