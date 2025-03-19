module.exports = (sequelize, DataTypes) => {
    const Submenu = sequelize.define(
        "Submenu",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            menu_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            has_child: {
                type: DataTypes.STRING(10),
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
            tableName: "sub_menu",
            timestamps: true,
        }
    );
    Submenu.associate = (models) => {
        Submenu.belongsTo(models.Menu, {
            foreignKey: "menu_id",
        });
    };

    return Submenu;
};
