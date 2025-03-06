const { DataTypes } = require("sequelize");
const sequelize = require("@config/database");

const Role = sequelize.define(
  "Role",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    role_name: { type: DataTypes.STRING(50), allowNull: false },
  },
  { timestamps: true, tableName: "roles" }
);

module.exports = Role;
