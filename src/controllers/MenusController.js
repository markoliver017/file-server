const { User, Role, Menu, Submenu } = require("@models/index");

module.exports = {
    // Index route
    index: async (req, res) => {
        res.json({ message: "Welcome to Menu Controller" });
    },

    // Create a new role
    store: async (req, res) => {
        try {
            const data = req.body;
            const newMenu = await Menu.create(data);
            res.status(201).json(newMenu);
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
                res.status(400).json({ errors });
            } else {
                res.status(500).json({ errors: error.message });
            }
        }
    },

    // Get all users
    getAllMenus: async (req, res) => {
        try {
            const menus = await Menu.findAll({
                attributes: ["id", "name", "has_child", "link", "ctr", "icon"],
                include: [
                    {
                        attributes: [
                            "id",
                            "name",
                            "has_child",
                            "link",
                            "ctr",
                            "icon",
                        ],
                        model: Submenu,
                        required: false,
                    },
                ],
            });

            res.status(200).json(menus);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a single user by ID
    getMenuById: async (req, res) => {
        try {
            const { id } = req.params;
            const menu = await Menu.findByPk(id, {
                attributes: ["id", "name", "has_child", "link", "ctr", "icon"],
            });
            if (menu) {
                res.status(200).json(menu);
            } else {
                res.status(404).json({ error: "Menu not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a user by ID
    updateMenu: async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const menu = await Menu.findByPk(id);
            if (menu) {
                await menu.update(data);
                res.status(200).json(menu);
            } else {
                res.status(404).json({ error: "Menu not found" });
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

    deleteMenu: async (req, res) => {
        try {
            const { id } = req.params;
            const menu = await Menu.findByPk(id);
            if (menu) {
                await menu.destroy();
                res.status(200).json({ message: "Menu deleted successfully" });
            } else {
                res.status(404).json({ error: "Menu not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
