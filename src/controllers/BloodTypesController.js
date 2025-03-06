const pool = require("@config/database");
const { User, BloodType } = require("@models/index");

module.exports = {
  // index: async (req, res) => {
  //   res.json({ message: "Welcome Blood Type Controllers" });
  // },

  index: async (req, res) => {
    try {
      const bloodType = await BloodType.findAll();
      res.status(200).json(bloodType);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
