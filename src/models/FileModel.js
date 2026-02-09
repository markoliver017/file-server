module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define(
        "File",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            url: { type: DataTypes.TEXT, allowNull: false },
            // table_name: { type: DataTypes.STRING(255), allowNull: false },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "file_upload",
            },
            environment: {
                type: DataTypes.ENUM("development", "production"),
                allowNull: false,
                defaultValue: "development",
            },
            domain: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        { timestamps: true, tableName: "files" },
    );

    // File.associate = (models) => {
    //     File.belongsTo(models.User, {
    //         foreignKey: "user_id",
    //         onDelete: "CASCADE",
    //     });
    // };

    return File;
};
