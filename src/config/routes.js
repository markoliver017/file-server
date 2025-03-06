const express = require("express");
const router = express.Router();
const userController = require("@controllers/UsersController");
const bloodTypeController = require("@controllers/BloodTypesController");

router.get("/users", userController.getAllUsers);
router.get("/bloodtypes", bloodTypeController.index);
// router.post("/users/store", userController.registerUser);
// router.put("/users/{id}", userController.updateUser);
// router.post("/login", userController.loginUser);

module.exports = router;
