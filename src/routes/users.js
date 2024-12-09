const express = require("express");
const router = express.Router();
const userController = require("../controller/users.js");

// CREATE
router.post("/", userController.createNewUser);

// READ
router.get("/", userController.getAllUsers);

// GET USER PROFILE
router.get("/:idUser", userController.getUserProfile);

// UPDATE
router.patch("/:idUser", userController.updateUser);

// DELETE
router.delete("/:idUser", userController.deleteUser);

module.exports = router;
