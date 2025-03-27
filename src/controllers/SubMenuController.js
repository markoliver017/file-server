const { Menu, Submenu, sequelize } = require("@models/index");
const { Op } = require("sequelize");

module.exports = {
    // Index route
    index: async (req, res) => {
        res.json({ message: "Welcome to SubMenu Controller" });
    },

    // Create a new role
    store: async (req, res) => {
        const data = req.body;
        const { menu_id } = req.params;
        const { ctr } = data;

        const transaction = await sequelize.transaction();

        try {
            const menu = await Menu.findByPk(menu_id);
            if (!menu) {
                await transaction.rollback();
                return res.status(404).json({ error: "Menu not found" });
            }

            if (ctr !== undefined) {
                await Submenu.increment(
                    { ctr: 1 },
                    {
                        where: {
                            menu_id: menu_id,
                            ctr: { [Op.gte]: ctr },
                        },
                        transaction,
                    }
                );
            }
            data.menu_id = menu_id;
            const submenu = await Submenu.create(data, { transaction });

            await transaction.commit();

            return res.status(201).json(submenu);
        } catch (error) {
            await transaction.rollback();
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

    // Get a single user by ID
    getSubMenuById: async (req, res) => {
        try {
            const { id } = req.params;
            const menu = await Submenu.findByPk(id, {
                attributes: ["id", "name", "has_child", "link", "ctr", "icon"],
            });
            if (menu) {
                res.status(200).json(menu);
            } else {
                res.status(404).json({ error: "Sub Menu not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a user by ID
    updateSubMenu: async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const { ctr } = data;
        const transaction = await sequelize.transaction();

        try {
            const existingMenu = await Submenu.findByPk(id, { transaction });
            if (!existingMenu) {
                await transaction.rollback();
                return res.status(404).json({ message: "Menu not found" });
            }
            const oldCtr = existingMenu.ctr;
            if (ctr !== undefined && oldCtr != ctr) {
                if (ctr > oldCtr) {
                    // Shift down (decrease `ctr` for affected records)
                    await Submenu.increment(
                        { ctr: -1 },
                        {
                            where: {
                                ctr: {
                                    [Op.gt]: oldCtr,
                                    [Op.lte]: ctr,
                                },
                                menu_id: existingMenu.menu_id,
                            },
                            transaction,
                        }
                    );
                } else {
                    // Shift up (increase `ctr` for affected records)
                    await Submenu.increment(
                        { ctr: 1 },
                        {
                            where: {
                                ctr: {
                                    [Op.gte]: ctr,
                                    [Op.lt]: oldCtr,
                                },
                                menu_id: existingMenu.menu_id,
                            },
                            transaction,
                        }
                    );
                }
            }

            const updatedSubMenu = await existingMenu.update(data, {
                transaction,
            });
            await transaction.commit();
            res.status(200).json(updatedSubMenu);
        } catch (error) {
            await transaction.rollback();
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
