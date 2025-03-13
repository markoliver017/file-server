const fs = require("fs");
const upload = require("@/utils/upload");
const { User, BloodType, Role, File } = require("@models/index");

module.exports = {
    // Index route
    index: async (req, res) => {
        res.json({ message: "Welcome to Users Controller" });
    },

    // Create a new user
    store: async (req, res) => {
        upload.single("file")(req, res, async (err) => {
            if (err) {
                return res
                    .status(400)
                    .json({ errors: { user_photo: err.message } });
            }

            try {
                const data = req.body;

                if (
                    data.password &&
                    data.password !== data.passwordConfirmation
                ) {
                    return res.status(400).json({
                        errors: { password: `Passwords do not match.` },
                    });
                }

                delete data.passwordConfirmation;
                delete data.file;

                const newUser = await User.create(data);

                const fileUrl = req.file
                    ? `/uploads/${req.file.filename}`
                    : null;
                if (fileUrl) {
                    const newFile = await File.create({
                        url: fileUrl,
                        table_name: "users",
                        user_id: newUser.id,
                        type: "project",
                    });

                    await newUser.update({ photo_id: newFile.id });
                }
                const newUserData = await User.findByPk(newUser.id, {
                    attributes: ["id", "first_name", "last_name", "email"],
                    include: [
                        {
                            attributes: ["id", "blood_type"],
                            model: BloodType,
                            required: false,
                        },
                        {
                            attributes: ["id", "role_name"],
                            model: Role,
                            required: false,
                        },
                        {
                            attributes: ["id", "url", "type"],
                            model: File,
                            required: false,
                        },
                    ],
                });
                res.status(201).json(newUserData);
            } catch (error) {
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                if (
                    error.name === "SequelizeValidationError" ||
                    error.name === "SequelizeUniqueConstraintError"
                ) {
                    const errors = error.errors.reduce((acc, err) => {
                        if (error.name === "SequelizeUniqueConstraintError") {
                            acc[err.path] = `${err.path} already exists!`;
                        } else {
                            acc[err.path] = err.message;
                        }
                        return acc;
                    }, {});
                    res.status(400).json({ errors });
                } else {
                    res.status(500).json({ errors: error.message });
                }
            }
        });
    },

    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "middle_name",
                    "suffix",
                    "prefix",
                    "contact_number",
                    "email",
                    "gender",
                    "full_name",
                ],
                include: [
                    {
                        attributes: ["id", "blood_type"],
                        model: BloodType,
                        required: false,
                    },
                    {
                        attributes: ["id", "role_name"],
                        model: Role,
                        required: false,
                    },
                    {
                        attributes: ["id", "url", "type"],
                        model: File,
                        required: false,
                    },
                ],
                order: [["createdAt", "DESC"]],
            });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a single user by ID
    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id, {
                attributes: ["id", "first_name", "last_name", "email"],
                include: [
                    {
                        attributes: ["id", "blood_type"],
                        model: BloodType,
                        required: false,
                    },
                    {
                        attributes: ["id", "role_name"],
                        model: Role,
                        required: false,
                    },
                    {
                        attributes: ["id", "url", "type"],
                        model: File,
                        required: false,
                    },
                ],
            });
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a user by ID
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const user = await User.findByPk(id);

            if (user) {
                if (!data.isChangePassword) {
                    delete data.password;
                }

                const updatedUser = await user.update(data);
                res.status(200).json(updatedUser);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            if (
                error.name === "SequelizeValidationError" ||
                error.name === "SequelizeUniqueConstraintError"
            ) {
                const errors = error.errors.reduce((acc, err) => {
                    if (error.name === "SequelizeUniqueConstraintError") {
                        acc[err.path] = `${err.path} already exists!`;
                    } else {
                        acc[err.path] = err.message;
                    }
                    return acc;
                }, {});
                res.status(500).json({ errors });
            } else {
                res.status(500).json({ errors: error.message });
            }
        }
    },

    updateUserPhoto: async (req, res) => {
        upload.single("file")(req, res, async (err) => {
            if (err) {
                return res
                    .status(400)
                    .json({ errors: { user_photo: err.message } });
            }

            try {
                const { id } = req.params;
                const file = req.file;

                if (!file) {
                    return res
                        .status(404)
                        .json({ error: "No files found to upload!" });
                }
                const fileUrl = `/uploads/${file.filename}`;

                const user = await User.findByPk(id);
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }

                if (!user.photo_id) {
                    const newFile = await File.create({
                        url: fileUrl,
                        table_name: "users",
                        user_id: user.id,
                        type: "project",
                    });

                    user.photo_id = newFile.id;
                    await user.save();
                } else {
                    const existingFile = await File.findByPk(user.photo_id);

                    if (!existingFile) {
                        return res.status(404).json({
                            error:
                                "File associated with the user was not found. ID: " +
                                user.photo_id,
                        });
                    }

                    if (existingFile.url) {
                        const deletePath = `./public${existingFile.url}`;

                        if (fs.existsSync(deletePath)) {
                            fs.unlinkSync(deletePath); // Delete old file
                        }
                    }

                    existingFile.url = fileUrl; // Assuming you get the new file path from the request body
                    await existingFile.save();
                }

                res.status(200).json({
                    message: "User photo has been updated successfully!",
                    filePath: fileUrl,
                });
            } catch (error) {
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                res.status(500).json({ error: error.message });
            }
        });
    },

    // Delete a user by ID
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (user) {
                await user.destroy();
                res.status(200).json({ message: "User deleted successfully" });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
