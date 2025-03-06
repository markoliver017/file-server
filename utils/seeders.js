const { faker } = require("@faker-js/faker");
const { User } = require("./models"); // Assuming you're using Sequelize

async function seedUsers(count = 10) {
  for (let i = 0; i < count; i++) {
    await User.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      blood_type_id: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8]), // Random blood type
    });
  }
}

seedUsers(10).then(() => console.log("Users seeded successfully!"));
