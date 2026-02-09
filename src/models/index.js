const Sequelize = require("sequelize");
const sequelize = require("@config/database");

// Import models
const User = require("@models/UserModel")(sequelize, Sequelize.DataTypes);
const File = require("@models/FileModel")(sequelize, Sequelize.DataTypes);

// Collect all models in an object for easy access
const models = {
    User,
    File,
    ApiKey: require("@models/ApiKey")(sequelize, Sequelize.DataTypes),
};

// Set up associations by calling associate methods
Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

const authDatabase = async () => {
    try {
        await sequelize.authenticate(); // Check DB connection
        console.log("✅ Database connected successfully.");
    } catch (error) {
        console.error("❌ Database authentication failed:", error);
    }
};
const syncDatabase = async () => {
    // Only run sync in development to avoid data loss in production
    if (process.env.NODE_ENV === "development") {
        try {
            await sequelize.sync({ alter: true }); // Sync models
            console.log("✅ Tables synchronized successfully.");
        } catch (error) {
            console.error("❌ Database sync failed:", error);
        }
    } else {
        console.log(
            "ℹ️ Production environment: Skipping automatic table sync. Use migrations instead.",
        );
    }
};

// authDatabase();
// syncDatabase(); // Don't auto-run these on import!

process.on("SIGINT", async () => {
    try {
        await sequelize.close();
        console.log("✅ Database connection closed gracefully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error closing database connection:", error);
        process.exit(1);
    }
});

module.exports = { sequelize, ...models, authDatabase, syncDatabase };
