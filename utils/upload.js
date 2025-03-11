const path = require("path");
const multer = require("multer");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const nameWithoutExt = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );

    cb(
      null,
      `${nameWithoutExt}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("Only images (JPG, PNG, GIF) are allowed!"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
