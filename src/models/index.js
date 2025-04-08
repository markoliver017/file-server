const Sequelize = require("sequelize");
const sequelize = require("@config/database");

// Import models
const User = require("@models/UserModel")(sequelize, Sequelize.DataTypes);
const BloodType = require("@models/BloodTypeModel")(
    sequelize,
    Sequelize.DataTypes
);
const Role = require("@models/RoleModel")(sequelize, Sequelize.DataTypes);
const File = require("@models/FileModel")(sequelize, Sequelize.DataTypes);
const Menu = require("@models/MenuModel")(sequelize, Sequelize.DataTypes);
const Submenu = require("@models/SubMenuModel")(sequelize, Sequelize.DataTypes);

const Agency = require("@models/AgencyModel")(sequelize, Sequelize.DataTypes);
const AgencyCoordinator = require("@models/AgencyCoordinatorModel")(
    sequelize,
    Sequelize.DataTypes
);
const Donor = require("@models/DonorModel")(sequelize, Sequelize.DataTypes);
const BloodDonationEvent = require("@models/BloodDonationEventModel")(
    sequelize,
    Sequelize.DataTypes
);
const BookingSchedule = require("@models/BookingScheduleModel")(
    sequelize,
    Sequelize.DataTypes
);
const DonorAppointmentInfo = require("@models/DonorAppointmentInfoModel")(
    sequelize,
    Sequelize.DataTypes
);
const BloodRequest = require("@models/BloodRequestModel")(
    sequelize,
    Sequelize.DataTypes
);
const AuditTrail = require("@models/AuditTrailModel")(
    sequelize,
    Sequelize.DataTypes
);
const Notification = require("@models/NotificationModel")(
    sequelize,
    Sequelize.DataTypes
);
const EmailNotification = require("@models/EmailNotificationModel")(
    sequelize,
    Sequelize.DataTypes
);

// Collect all models in an object for easy access
const models = {
    User,
    BloodType,
    Role,
    File,
    Menu,
    Submenu,
    Agency,
    AgencyCoordinator,
    Donor,
    BloodDonationEvent,
    BookingSchedule,
    DonorAppointmentInfo,
    BloodRequest,
    AuditTrail,
    Notification,
    EmailNotification,
};

// Set up associations by calling associate methods
Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

const authDatabase = async () => {
    try {
        await sequelize.authenticate(); // Check DB connection
        console.log("✅ Database connected successfully.");
    } catch (error) {
        console.error("❌ Database authentication failed:", error);
    }
};
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // Sync models
        console.log("✅ Tables synchronized successfully.");
    } catch (error) {
        console.error("❌ Database sync failed:", error);
    }
};

authDatabase();
// syncDatabase();

process.on("SIGINT", async () => {
    try {
        await sequelize.close();
        console.log("✅ Database connection closed gracefully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error closing database connection:", error);
        process.exit(1);
    }
});

// Export models and sequelize instance
module.exports = { sequelize, ...models };

// const User = require("@models/UserModel");
// const BloodType = require("@models/BloodTypeModel");
// const Role = require("@models/RoleModel");
// const File = require("@models/FileModel");
// const UserRole = require("@models/UserRoleModel");
// const sequelize = require("@config/database");

// const authDatabase = async () => {
//   try {
//     await sequelize.authenticate(); // Check DB connection
//     console.log("✅ Database connected successfully.");
//   } catch (error) {
//     console.error("❌ Database authentication failed:", error);
//   }
// };
// const syncDatabase = async () => {
//   try {
//     await sequelize.sync({ alter: true }); // Sync models
//     console.log("✅ Tables synchronized successfully.");
//   } catch (error) {
//     console.error("❌ Database sync failed:", error);
//   }
// };

// authDatabase();
// syncDatabase();

// process.on("SIGINT", async () => {
//   try {
//     await sequelize.close();
//     console.log("✅ Database connection closed gracefully.");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Error closing database connection:", error);
//     process.exit(1);
//   }
// });

// // Export Models
// module.exports = { User, File, Role, UserRole, BloodType };
