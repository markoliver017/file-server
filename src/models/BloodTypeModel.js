module.exports = (sequelize, DataTypes) => {
    const BloodType = sequelize.define(
        "BloodType",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            blood_type: { type: DataTypes.STRING(3), allowNull: false },
            rh_factor: { type: DataTypes.ENUM("+", "-"), allowNull: false },
        },
        {
            timestamps: false,
            tableName: "blood_types",
            indexes: [
                {
                    unique: true,
                    fields: ["blood_type", "rh_factor"],
                },
            ],
        }
    );

    // Define associations in the `associate` method
    // BloodType.associate = (models) => {
    //     BloodType.hasMany(models.User, {
    //         foreignKey: "blood_type_id",
    //     });
    // };

    return BloodType;
};
