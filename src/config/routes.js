const express = require("express");
const router = express.Router();
const userController = require("@controllers/UsersController");
const roleController = require("@controllers/RolesController");
const bloodTypeController = require("@controllers/BloodTypesController");
const authJWTTokenMiddleware = require("@middlewares/authJWTTokenMiddleware");
const jwt = require("jsonwebtoken");
const passport = require("@config/passport");
const menusController = require("@controllers/MenusController");
const subMenusController = require("@controllers/SubMenuController");

/** Users routes **/
router.get("/", userController.index);
router.get("/users", userController.getAllUsers);
router.post("/users", userController.store);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.put("/users/:id/files", userController.updateUserPhoto);
router.delete("/users/:id", userController.deleteUser);

/** Roles routes**/
router.get("/", roleController.index);
router.get("/roles", roleController.getAllRoles);
router.post("/roles", roleController.store);
router.get("/roles/:id", roleController.getRoleById);
router.put("/roles/:id", roleController.updateRole);
router.delete("/roles/:id", roleController.deleteRole);

/** Menus routes**/
router.get("/menus", menusController.getAllMenus);
router.post("/menus", menusController.store);
router.get("/menus/:id", menusController.getMenuById);
router.put("/menus/:id", menusController.updateMenu);
router.delete("/menus/:id", menusController.deleteMenu);

/** SubMenu routes**/
// router.get("/menus/:menu_id/sub_menu", menusController.getAllMenus);
router.post("/menus/:menu_id/sub_menu", subMenusController.store);
router.get("/sub_menu/:id", subMenusController.getSubMenuById);
router.put("/sub_menu/:id", subMenusController.updateSubMenu);
router.delete("/sub_menu/:id", subMenusController.deleteMenu);

router.get("/bloodtypes", bloodTypeController.index);

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res
                .status(500)
                .json({ error: true, message: "Internal Server Error" });
        }
        if (!user) {
            return res
                .status(401)
                .json({ error: true, message: "Invalid username or password" });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: true, message: "Internal Server Error" });
            }
            return res
                .status(200)
                .json({ error: false, message: "Login successful", user });
        });
    })(req, res, next);
});

/* AUTHENTICATION TOKEN */
router.post("/user/generate-token", (req, res) => {
    const user = { id: 1, email: "testuser@email.com" }; // Example user payload
    const token = jwt.sign(user, process.env.JWT_SECRET);
    res.json({ token });
});

router.get("/user/validateToken", (req, res) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET;

    try {
        const token = req.header("Authorization");

        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.send("Successfully Verified");
        } else {
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
});

module.exports = router;
