const express = require("express");
const router = express.Router();
const uploadController = require("@controllers/UploadController");
const authJWTTokenMiddleware = require("@middlewares/authJWTTokenMiddleware");
const auditLogger = require("@middlewares/auditLoggerMiddleware");
const jwt = require("jsonwebtoken");
const passport = require("@config/passport");

/* middlewares */
router.use(auditLogger);

/* File Upload */
router.get("/uploads", authJWTTokenMiddleware, uploadController.index);
router.post(
    "/uploads",
    authJWTTokenMiddleware,
    uploadController.uploadUserPhoto
);
router.post(
    "/upload-pdf",
    authJWTTokenMiddleware,
    uploadController.uploadPdfFile
);
router.put("/uploads/:id", uploadController.updateUserPhoto);

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res
                .status(500)
                .json({ error: true, message: "Internal Server Error", err });
        }
        if (!user) {
            return res
                .status(401)
                .json({ error: true, message: "Invalid username or password" });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: true, message: "Internal Server Error" });
            }
            return res
                .status(200)
                .json({ error: false, message: "Login successful", user });
        });
    })(req, res, next);
});

router.get("/validate_login", (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({
            authenticated: true,
            // user: req.user
            session: req.session,
        });
    } else {
        return res
            .status(401)
            .json({ authenticated: false, message: "Not logged in" });
    }
});

/* AUTHENTICATION TOKEN */
router.post("/user/generate-token", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: "Internal Server Error",
                err,
            });
        }
        if (!user) {
            return res.status(401).json({
                error: true,
                message: "Invalid username or password",
            });
        }

        // Generate JWT token after successful authentication
        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.json({
            error: false,
            message: "Authentication successful",
            token,
        });
    })(req, res, next);
});

router.get("/user/validateToken", (req, res) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET;

    try {
        const token = req.header("Authorization");

        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.send("Successfully Verified");
        } else {
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
});

router.get("/login", (req, res) => {
    res.sendFile("login.html", { root: "public" });
});

module.exports = router;
