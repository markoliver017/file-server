// const pool = require("@config/database");

// module.exports = {
//   fetchAll: async () => {
//     const [rows] = await pool.query("SELECT * FROM sports");
//     return rows;
//   },
// };
const sequelize = require("@config/database");
const BloodType = require("@models/BloodTypeModel");
const Role = require("@models/RoleModel");
const File = require("@models/FileModel");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    blood_type_id: { type: DataTypes.INTEGER, allowNull: true },
    role_id: { type: DataTypes.INTEGER, allowNull: true },
    first_name: { type: DataTypes.STRING(50), allowNull: false },
    last_name: { type: DataTypes.STRING(50), allowNull: false },
    middle_name: { type: DataTypes.STRING(50), allowNull: true },
    prefix: { type: DataTypes.STRING(50), allowNull: true },
    suffix: { type: DataTypes.STRING(50), allowNull: true },
    photo_id: { type: DataTypes.INTEGER, allowNull: true },
    date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
    gender: { type: DataTypes.ENUM("male", "female"), allowNull: false },
    is_active: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    email: { type: DataTypes.STRING(250), allowNull: false, unique: true },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, saltRounds);
        this.setDataValue("password", hashedPassword);
      },
      get() {
        return this.getDataValue("password");
      },
    },
    civil_status: {
      type: DataTypes.ENUM("single", "married", "widowed", "separated"),
      allowNull: false,
      defaultValue: "single",
    },
    weight: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    health_condition: { type: DataTypes.TEXT, allowNull: true },
    is_eligible: {
      type: DataTypes.ENUM("eligible", "not-eligible", "for verification"),
      allowNull: false,
      defaultValue: "for verification",
    },
    contact_number: { type: DataTypes.STRING(20), allowNull: true },
    nationality: { type: DataTypes.STRING(50), allowNull: false },
    occupation: { type: DataTypes.STRING(100), allowNull: true },
    mailing_address: { type: DataTypes.TEXT, allowNull: true },
    home_address: { type: DataTypes.TEXT, allowNull: true },
    office_name: { type: DataTypes.STRING(100), allowNull: true },
    office_address: { type: DataTypes.TEXT, allowNull: true },
    zip_code: { type: DataTypes.STRING(10), allowNull: true },
    type_of_donor: {
      type: DataTypes.ENUM("replacement", "volunteer"),
      allowNull: false,
      defaultValue: "volunteer",
    },
    patient_name: { type: DataTypes.STRING(100), allowNull: true },
    relation: { type: DataTypes.STRING(50), allowNull: true },
    full_name: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.first_name} ${this.last_name}`;
      },
    },
  },
  { timestamps: true, tableName: "users" }
);

// Relationships
User.belongsTo(BloodType, {
  foreignKey: "blood_type_id",
  onDelete: "SET NULL",
});
BloodType.hasMany(User, { foreignKey: "blood_type_id" });

User.belongsTo(Role, { foreignKey: "role_id", onDelete: "SET NULL" });
Role.hasMany(User, { foreignKey: "role_id" });

User.belongsTo(File, { foreignKey: "photo_id", onDelete: "SET NULL" });
File.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

User.prototype.validPassword = async function (password) {
  const currentPass = this.password;
  // const isValid = await bcrypt.compare(password, currentPass);
  return await bcrypt.compare(password, currentPass);
};

module.exports = User;
