const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            username: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            is_active: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
            },
            email: {
                type: DataTypes.STRING(250),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: "Email field must be a valid email.",
                    },
                },
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    len: {
                        args: [8, 255],
                        msg: "Password must be atleast 8 characters long.",
                    },
                    notEmpty: {
                        msg: "Password field is required.",
                    },
                },
                set(value) {
                    if (value && value.length >= 8) {
                        // Check if already a bcrypt hash
                        const bcryptRegex = /^\$2[aby]\$.{56}$/;

                        if (bcryptRegex.test(value)) {
                            // Already hashed, just set it
                            this.setDataValue("password", value);
                        } else {
                            // Not hashed, hash it
                            const hashedPassword = bcrypt.hashSync(
                                value,
                                saltRounds
                            );
                            this.setDataValue("password", hashedPassword);
                        }
                    } else {
                        this.setDataValue("password", value);
                    }
                },
            },
        },
        { timestamps: true, tableName: "users" }
    );

    User.prototype.validPassword = async function (password) {
        const currentPass = this.password;
        // const isValid = await bcrypt.compare(password, currentPass);
        return await bcrypt.compare(password, currentPass);
    };

    // Define associations in the `associate` method
    // User.associate = (models) => {
    //     User.belongsTo(models.Role, {
    //         foreignKey: "role_id",
    //         onDelete: "RESTRICT",
    //     });
    //     User.belongsTo(models.File, {
    //         foreignKey: "photo_id",
    //         onDelete: "SET NULL",
    //     });
    // };

    return User;
};
