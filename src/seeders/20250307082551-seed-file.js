"use strict";

const { faker, fa } = require("@faker-js/faker");
const relationships = [
  "mother",
  "father",
  "cousin",
  "sibling",
  "friend",
  "colleague",
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          blood_type_id: 1,
          role_id: 1,
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          middle_name: faker.person.middleName(),
          photo_id: faker.image.urlPicsumPhotos(),
          date_of_birth: faker.date.birthdate(),
          gender: faker.person.gender(),
          civil_status: "single",
          weight: faker.number.int({ min: 50, max: 100 }),
          health_condition: faker.word.adjective(),
          is_eligible: "for verification",
          is_active: 1,
          contact_number: faker.phone.number(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          nationality: faker.location.country(),
          occupation: faker.person.jobTitle(),
          mailing_address: faker.location.streetAddress(),
          home_address: faker.location.streetAddress(),
          office_name: "Tech Corp",
          office_address: faker.location.streetAddress(),
          zip_code: faker.location.zipCode(),
          type_of_donor: faker.helpers.arrayElement([
            "replacement",
            "volunteer",
          ]),
          patient_name: faker.person.fullName(),
          relation: faker.helpers.arrayElement(relationships),
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
