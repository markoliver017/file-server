const pool = require('@config/database');

module.exports = {
    index: async (req, res) => {
        res.json({ message: "Welcome to Sports Controller" });
    },
    search: async (req, res) => {
        const [rows] = await pool.query("SELECT * FROM sports");
        res.json(rows);
    }
};
