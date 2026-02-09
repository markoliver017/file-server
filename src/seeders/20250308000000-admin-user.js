"use strict";
const bcrypt = require("bcrypt");

module.exports = {
    async up(queryInterface, Sequelize) {
        // efficient check if admin exists
        const adminExists = await queryInterface.rawSelect(
            "users",
            {
                where: {
                    username: "admin",
                },
            },
            ["id"],
        );

        if (!adminExists) {
            await queryInterface.bulkInsert("users", [
                {
                    username: "admin",
                    email: "admin@example.com",
                    password: await bcrypt.hash("password123", 10),
                    is_active: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ]);
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users", { username: "admin" }, {});
    },
};
