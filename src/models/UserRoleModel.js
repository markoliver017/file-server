const { DataTypes } = require("sequelize");
const sequelize = require("@config/database");

const UserRole = sequelize.define(
  "UserRole",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { timestamps: true, tableName: "user_roles" }
);

module.exports = UserRole;
