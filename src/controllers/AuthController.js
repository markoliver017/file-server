// controllers/AuthController.js
const { User } = require("../models");

module.exports = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });

      if (!user) {
        return res.status(401).send("Invalid username or password");
      }

      if (!user.validPassword(password)) {
        return res.status(401).send("Invalid username or password");
      }

      // Use Passport.js to authenticate the user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).send(err);
        }

        // Store user data in the session
        req.session.user = user;
        res.redirect("/protected");
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
