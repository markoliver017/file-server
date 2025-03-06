const User = require("@models/UserModel");
const BloodType = require("@models/BloodTypeModel");
const Role = require("@models/RoleModel");
const File = require("@models/FileModel");
const UserRole = require("@models/UserRoleModel");
const sequelize = require("@config/database");

// Relationships
User.belongsTo(BloodType, {
  foreignKey: "blood_type_id",
  onDelete: "SET NULL",
}); //☼
User.belongsTo(Role, { foreignKey: "role_id", onDelete: "SET NULL" });
User.belongsTo(File, { foreignKey: "photo_id", onDelete: "SET NULL" });
File.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

UserRole.belongsTo(User, { foreignKey: "user_id" });
UserRole.belongsTo(Role, { foreignKey: "role_id" });
BloodType.hasMany(User, { foreignKey: "blood_type_id" });

const syncDatabase = async () => {
  try {
    await sequelize.authenticate(); // Check DB connection
    console.log("✅ Database connected successfully.");

    // await sequelize.sync({ alter: true }); // Sync models
    // console.log("✅ Tables synchronized successfully.");
  } catch (error) {
    console.error("❌ Database sync failed:", error);
  }
};
syncDatabase();

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
