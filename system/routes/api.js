const express = require("express");
const router = express.Router();
const uploadController = require("@controllers/UploadController");
const apiKeyController = require("@controllers/ApiKeyController");
const { isAdmin, isApiKeyValid } = require("@middlewares/authMiddleware");

// --- API Key Management (Admin Only) ---
router.get("/keys", isAdmin, apiKeyController.index);
router.post("/keys", isAdmin, apiKeyController.store);
router.delete("/keys/:id", isAdmin, apiKeyController.destroy);

// --- File Management ---
// List files (Admin only, or maybe protected via API key too depending on requirements?)
// For now, let's keep list for Admin Dashboard
router.get("/files", isAdmin, uploadController.index);

// Upload File (Admin OR Valid API Key)
// We use a custom middleware stack or just check inside the controller?
// Better to use middleware combination.
// Since `isApiKeyValid` falls through if `req.isAuthenticated()` is true,
// we can use `isApiKeyValid` for the upload endpoint to allow both.
router.post("/upload/image", isApiKeyValid, uploadController.uploadUserPhoto);
router.post("/upload/pdf", isApiKeyValid, uploadController.uploadPdfFile);
router.post("/upload/mixed", isApiKeyValid, uploadController.uploadMixedFile);

// Delete File (Admin Only)
router.delete("/files/:id", isAdmin, uploadController.destroy);

module.exports = router;
