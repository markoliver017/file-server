module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define(
        "Menu",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            has_child: {
                type: DataTypes.STRING(3),
                allowNull: false,
                defaultValue: "no",
            },
            link: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            icon: {
                type: DataTypes.STRING(100),
                allowNull: false,
                defaultValue: "FaHome",
            },
            ctr: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            mod_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            mod_date: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: DataTypes.NOW,
                onUpdate: DataTypes.NOW,
            },
        },
        {
            tableName: "menu",
            timestamps: true,
        }
    );

    Menu.associate = (models) => {
        Menu.hasMany(models.Submenu, {
            foreignKey: "menu_id",
        });
    };

    return Menu;
};
