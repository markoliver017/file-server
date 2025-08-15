const fs = require("fs");
const upload = require("@/utils/upload");
const { File } = require("../models");
const dotenv = require("dotenv");
const uploadPdf = require("@/utils/uploadPdf");
const { env } = require("process");
dotenv.config();

//api endpoint post: http://localhost:5000/api/uploads
//api endpoint put: http://localhost:5000/api/uploads/:id
module.exports = {
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

                if (upload_type == "file_upload") {
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
                    system_name: data?.system_name || "SYSTEM NAME",
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
                    const deletePath = `./public${existingFile.url}`;

                    if (fs.existsSync(deletePath)) {
                        fs.unlinkSync(deletePath); // Delete old file
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

                if (upload_type == "file_upload" && !file) {
                    return res.status(404).json({
                        success: false,
                        message: "No files found to upload!",
                    });
                }

                if (upload_type == "file_upload") {
                    fileUrl = `${app_host}/uploads/${file.filename}`;
                } else {
                    /* for absolute url // no uploads */
                    fileUrl = data.url;
                }

                const newFile = await File.create({
                    url: fileUrl,
                    type: data.type,
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
};
