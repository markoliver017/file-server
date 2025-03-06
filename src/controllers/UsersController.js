const pool = require("@config/database");
const { User, BloodType, Role } = require("../models/index");

module.exports = {
  index: async (req, res) => {
    res.json({ message: "Welcome to Sports Controller" });
  },
  search: async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["first_name", "last_name"],
        include: [
          {
            attributes: ["blood_type"],
            model: BloodType,
            required: false,
            include: [{ model: User, required: false }],
          },
          {
            attributes: ["role_name"],
            model: Role,
            required: false,
          },
        ],
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
