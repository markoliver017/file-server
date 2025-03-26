"use strict";

const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "Users",
            [
                {
                    role_id: 1,
                    first_name: faker.person.firstName(),
                    last_name: faker.person.lastName(),
                    middle_name: faker.person.middleName(),
                    photo_id: null,
                    gender: faker.helpers.arrayElement(["male", "female"]),
                    is_active: faker.helpers.arrayElement([0, 1]),
                    email: faker.internet.email(),
                    password: bcrypt.hashSync("password1234", 10),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users", null, {});
    },
};
