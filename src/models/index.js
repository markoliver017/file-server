const User = require("@models/UserModel");
const BloodType = require("@models/BloodTypeModel");
const Role = require("@models/RoleModel");
const File = require("@models/FileModel");
const UserRole = require("@models/UserRoleModel");
const sequelize = require("@config/database");

const authDatabase = async () => {
  try {
    await sequelize.authenticate(); // Check DB connection
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Database authentication failed:", error);
  }
};
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Sync models
    console.log("✅ Tables synchronized successfully.");
  } catch (error) {
    console.error("❌ Database sync failed:", error);
  }
};

authDatabase();
// syncDatabase();

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

// Export Models
module.exports = { User, File, Role, UserRole, BloodType };
