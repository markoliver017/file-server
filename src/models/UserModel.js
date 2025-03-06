// const pool = require("@config/database");

// module.exports = {
//   fetchAll: async () => {
//     const [rows] = await pool.query("SELECT * FROM sports");
//     return rows;
//   },
// };

const { DataTypes } = require("sequelize");
const sequelize = require("@config/database");
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
    photo_id: { type: DataTypes.INTEGER, allowNull: true },
    date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
    gender: { type: DataTypes.ENUM("male", "female"), allowNull: false },
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
    is_active: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    contact_number: { type: DataTypes.STRING(20), allowNull: true },
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
  },
  { timestamps: true, tableName: "users" }
);

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
