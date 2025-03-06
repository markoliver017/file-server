"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcrypt");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          blood_type_id: 1,
          role_id: 1,
          first_name: "John",
          last_name: "Doe",
          middle_name: "A",
          photo_id: null,
          date_of_birth: "1990-01-01",
          gender: "male",
          civil_status: "single",
          weight: 70.5,
          health_condition: "Healthy",
          is_eligible: "eligible",
          is_active: 1,
          contact_number: "1234567890",
          email: "john.doe@example.com",
          password: bcrypt("password123"),
          nationality: "American",
          occupation: "Engineer",
          mailing_address: "123 Main St",
          home_address: "123 Main St",
          office_name: "Tech Corp",
          office_address: "456 Tech St",
          zip_code: "12345",
          type_of_donor: "volunteer",
          patient_name: null,
          relation: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          blood_type_id: 2,
          role_id: 2,
          first_name: "Jane",
          last_name: "Smith",
          middle_name: "B",
          photo_id: null,
          date_of_birth: "1985-05-15",
          gender: "female",
          civil_status: "married",
          weight: 60.0,
          health_condition: "Healthy",
          is_eligible: "eligible",
          is_active: 1,
          contact_number: "0987654321",
          email: "jane.smith@example.com",
          password: bcrypt("password456"),
          nationality: "Canadian",
          occupation: "Doctor",
          mailing_address: "789 Health St",
          home_address: "789 Health St",
          office_name: "Health Clinic",
          office_address: "101 Medical St",
          zip_code: "67890",
          type_of_donor: "replacement",
          patient_name: "John Doe",
          relation: "Friend",
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
