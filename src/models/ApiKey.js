const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
    const ApiKey = sequelize.define(
        "ApiKey",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: "Name of the application or user using this key",
            },
            key: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                comment: "The actual API key (hashed or plain)",
            },
            lastUsedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            tableName: "api_keys",
        },
    );

    return ApiKey;
};
