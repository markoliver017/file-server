const fs = require("fs");
const path = require("path");
const upload = require("@/utils/upload");
const { File } = require("../models");
const dotenv = require("dotenv");
const uploadPdf = require("@/utils/uploadPdf");
const uploadMixed = require("@/utils/uploadMixed");
const { env } = require("process");
dotenv.config();

//api endpoint post: http://localhost:5000/api/uploads
//api endpoint put: http://localhost:5000/api/uploads/:id
module.exports = {
    index: async (req, res) => {
        try {
            const files = await File.findAll({
                order: [["createdAt", "DESC"]],
            });
            res.json(files);
        } catch (error) {
            console.error("Error fetching files:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    uploadUserPhoto: async (req, res) => {
        upload.single("file")(req, res, async (err) => {
            if (err) {
                return res
                    .status(400)
                    .json({ errors: { message: err.message } });
            }
            const app_host = process.env.APP_HOST;
            try {
                const file = req.file;
                const data = req.body;
                let fileUrl = "";
                let upload_type = data?.type || "file_upload";

                if (upload_type == "file_upload" && !file) {
                    return res.status(404).json({
                        success: false,
                        message: "No files found to upload!",
                    });
                }

                if (file) {
                    fileUrl = `${app_host}/uploads/${file.filename}`;
                } else {
                    /* for absolute url // no uploads */
                    fileUrl = data.url;
                }

                const newFile = await File.create({
                    url: fileUrl,
                    type: data?.type,
                    environment:
                        data?.environment ||
                        process.env.NODE_ENV ||
                        "development",
                    domain: data?.domain || "SYSTEM NAME",
                });

                console.log("upload successfully", newFile);
                res.status(200).json({
                    success: true,
                    message: "User photo has been updated successfully!",
                    file_data: newFile,
                });
            } catch (error) {
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                res.status(500).json({
                    success: false,
                    message: error.message,
                    error,
                });
            }
        });
    },

    updateUserPhoto: async (req, res) => {
        upload.single("file")(req, res, async (err) => {
            if (err) {
                return res
                    .status(400)
                    .json({ errors: { message: err.message } });
            }

            try {
                const { id } = req.params;
                const file = req.file;
                const data = req.body;
                let fileUrl = "";
                let upload_type = data?.type || "file_upload";

                if (upload_type == "file_upload" && !file) {
                    return res
                        .status(404)
                        .json({ error: "No files found to upload!" });
                }

                if (upload_type == "file_upload") {
                    fileUrl = `/uploads/${file.filename}`;
                } else {
                    fileUrl = data.url;
                }

                const existingFile = await File.findByPk(id);

                if (!existingFile) {
                    return res.status(404).json({
                        success: false,
                        error: `File not found with ID#: ${id} `,
                    });
                }

                if (existingFile.url) {
                    let deletePath = "";
                    let relativePath = "";

                    if (existingFile.url.startsWith("http")) {
                        try {
                            const urlObj = new URL(existingFile.url);
                            relativePath = urlObj.pathname;
                        } catch (e) {}
                    } else {
                        relativePath = existingFile.url;
                    }

                    if (relativePath) {
                        const decodedPath = decodeURIComponent(relativePath);
                        deletePath = path.join(
                            process.cwd(),
                            "public",
                            decodedPath,
                        );
                    }

                    if (deletePath && fs.existsSync(deletePath)) {
                        try {
                            fs.unlinkSync(deletePath); // Delete old file
                        } catch (err) {
                            console.error("Failed to delete old file:", err);
                        }
                    }
                }

                existingFile.url = fileUrl; // Assuming you get the new file path from the request body
                existingFile.type = data.type; // Assuming you get the new file path from the request body
                await existingFile.save();

                res.status(200).json({
                    success: true,
                    message: "User photo has been updated successfully!",
                    file_data: existingFile,
                });
            } catch (error) {
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                res.status(500).json({
                    success: false,
                    message: error.message,
                    error,
                });
            }
        });
    },

    uploadPdfFile: async (req, res) => {
        uploadPdf.single("file")(req, res, async (err) => {
            if (err) {
                return res
                    .status(400)
                    .json({ errors: { message: err.message } });
            }
            const app_host = process.env.APP_HOST;
            try {
                const file = req.file;
                const data = req.body;
                let fileUrl = "";
                let upload_type = data?.type || "file_upload";

                if (
                    (upload_type == "file_upload" ||
                        upload_type == "pdf_upload") &&
                    !file
                ) {
                    return res.status(404).json({
                        success: false,
                        message: "No files found to upload!",
                    });
                }

                if (file) {
                    fileUrl = `${app_host}/uploads/${file.filename}`;
                } else {
                    /* for absolute url // no uploads */
                    fileUrl = data.url;
                }

                const newFile = await File.create({
                    url: fileUrl,
                    type: data.type,
                    environment:
                        data?.environment ||
                        process.env.NODE_ENV ||
                        "development",
                    domain: data?.domain || "SYSTEM NAME",
                });

                console.log("upload successfully", newFile);
                res.status(200).json({
                    success: true,
                    message: "PDF file has been uploaded successfully!",
                    file_data: newFile,
                });
            } catch (error) {
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                res.status(500).json({
                    success: false,
                    message: error.message,
                    error,
                });
            }
        });
    },
    uploadMixedFile: async (req, res) => {
        uploadMixed.single("file")(req, res, async (err) => {
            if (err) {
                return res
                    .status(400)
                    .json({ errors: { message: err.message } });
            }
            const app_host = process.env.APP_HOST;
            try {
                const file = req.file;
                const data = req.body;
                let fileUrl = "";
                let upload_type = data?.type || "file_upload";

                if (!file) {
                    return res.status(404).json({
                        success: false,
                        message: "No files found to upload!",
                    });
                }

                fileUrl = `${app_host}/uploads/${file.filename}`;

                const newFile = await File.create({
                    url: fileUrl,
                    type: data.type || "mixed_upload",
                    environment:
                        data?.environment ||
                        process.env.NODE_ENV ||
                        "development",
                    domain: data?.domain || "SYSTEM NAME",
                });

                console.log("upload successfully", newFile);
                res.status(200).json({
                    success: true,
                    message: "File has been uploaded successfully!",
                    file_data: newFile,
                });
            } catch (error) {
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                res.status(500).json({
                    success: false,
                    message: error.message,
                    error,
                });
            }
        });
    },
    destroy: async (req, res) => {
        try {
            const { id } = req.params;
            const file = await File.findByPk(id);

            if (!file) {
                return res.status(404).json({ error: "File not found" });
            }

            // Extract file path from URL
            // URL might be http://localhost:3040/uploads/foo.jpg or /uploads/foo.jpg
            let filePath = "";
            let relativePath = "";

            if (file.url && file.url.startsWith("http")) {
                try {
                    const urlObj = new URL(file.url);
                    relativePath = urlObj.pathname;
                } catch (e) {
                    /* ignore invalid url parsing */
                }
            } else if (file.url) {
                relativePath = file.url;
            }

            if (relativePath) {
                try {
                    const decodedPath = decodeURIComponent(relativePath);
                    // Ensure no directory traversal hacking, although less likely here
                    // But verify it starts with /uploads to be safe or just trust DB
                    // path.join(process.cwd(), "public", decodedPath)
                    filePath = path.join(process.cwd(), "public", decodedPath);
                } catch (e) {
                    console.error("Error parsing file path:", e);
                }
            }

            if (filePath && fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    console.error("Failed to delete local file:", err);
                }
            }

            await file.destroy();

            res.json({ success: true, message: "File deleted successfully" });
        } catch (error) {
            console.error("Error deleting file:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};
