const express = require("express");
const bodyParser = require("body-parser");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const jsonParser = bodyParser.json();

// Authentication routes
router.post("/sign-up", jsonParser, authController.signUp);
router.post("/login", jsonParser, authController.login);

// User-related routes
router.use(["/users", "/user-profile/:username"], authMiddleware.authenticate);
router.get("/users", userController.getAllUsers);
router.get("/user-profile/:username", userController.getUserProfile);

module.exports = router;
