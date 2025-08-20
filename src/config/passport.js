// filepath: c:\Users\mcroman\Desktop\clone\NodeExpressMVC\src\config\passport.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("@models/index");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({
                    where: { email },
                    attributes: ["id", "email", "password", "username"],
                });
                if (!user) {
                    return done(null, false, {
                        message: "Invalid username or password",
                    });
                }
                const isValid = await user.validPassword(password);
                if (!isValid) {
                    return done(null, false, {
                        message: "Invalid username or password",
                    });
                }
                const userWithoutPassword = user.get({ plain: true });
                delete userWithoutPassword.password;
                return done(null, userWithoutPassword);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
