const { DataTypes } = require("sequelize");
const sequelize = require("@config/database");
const User = require("@models/UserModel");
const Role = require("@models/RoleModel");

const UserRole = sequelize.define(
  "UserRole",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { timestamps: true, tableName: "user_roles" }
);

UserRole.belongsTo(User, { foreignKey: "user_id" });
UserRole.belongsTo(Role, { foreignKey: "role_id" });

module.exports = UserRole;
