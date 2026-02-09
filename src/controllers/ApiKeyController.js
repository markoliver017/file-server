const { ApiKey } = require("../models");
const { v4: uuidv4 } = require("uuid"); // Optional if DB handles UUID, but good to have if we generate key manually

module.exports = {
    index: async (req, res) => {
        try {
            const keys = await ApiKey.findAll({
                order: [["createdAt", "DESC"]],
            });
            res.json(keys);
        } catch (error) {
            console.error("Error fetching API keys:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    store: async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ error: "Name is required" });
            }

            // Generate a simple API key
            // In a real production system, you might want a prefix and a secret
            // Here we just use a UUID as the key for simplicity
            const key = `ak_${uuidv4().replace(/-/g, "")}`;

            const newKey = await ApiKey.create({
                name,
                key,
            });

            res.status(201).json(newKey);
        } catch (error) {
            console.error("Error creating API key:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    destroy: async (req, res) => {
        try {
            const { id } = req.params;
            const key = await ApiKey.findByPk(id);

            if (!key) {
                return res.status(404).json({ error: "API Key not found" });
            }

            await key.destroy();
            res.json({ message: "API Key deleted successfully" });
        } catch (error) {
            console.error("Error deleting API key:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};
