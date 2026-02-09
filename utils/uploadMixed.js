const path = require("path");
const multer = require("multer");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".pdf"];
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads");
    },
    filename: (req, file, cb) => {
        const nameWithoutExt = path.basename(
            file.originalname,
            path.extname(file.originalname),
        );

        cb(
            null,
            `${nameWithoutExt}-${Date.now()}${path.extname(file.originalname)}`,
        );
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
        return cb(
            new Error("Only images (JPG, PNG, GIF) and PDF files are allowed!"),
            false,
        );
    }

    cb(null, true);
};

const uploadMixed = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = uploadMixed;
