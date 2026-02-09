const { ApiKey } = require("../models");

const isAdmin = (req, res, next) => {
    // Check if user is authenticated via Passport session
    if (req.isAuthenticated()) {
        return next();
    }
    return res
        .status(401)
        .json({ error: "Unauthorized: Admin access required" });
};

const isApiKeyValid = async (req, res, next) => {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
        // If no API key, check if it's an admin session (optional, depending on requirements)
        // For now, specialized endpoints for uploads might allow admin OR api key
        if (req.isAuthenticated()) {
            return next();
        }
        return res
            .status(401)
            .json({ error: "Unauthorized: API Key required" });
    }

    try {
        const key = await ApiKey.findOne({ where: { key: apiKey } });

        if (!key) {
            return res
                .status(403)
                .json({ error: "Forbidden: Invalid API Key" });
        }

        // Update last used time
        key.lastUsedAt = new Date();
        await key.save();

        req.apiKey = key; // Attach key info to request
        next();
    } catch (error) {
        console.error("Error validating API key:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    isAdmin,
    isApiKeyValid,
};
