const { DataTypes } = require("sequelize");
const sequelize = require("@config/database");
const User = require("@models/UserModel");

const File = sequelize.define(
  "File",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    url: { type: DataTypes.TEXT, allowNull: false },
    table_name: { type: DataTypes.STRING(255), allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM("online", "project"), allowNull: false },
  },
  { timestamps: true, tableName: "files" }
);

module.exports = File;
