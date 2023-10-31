const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

// rota / que chama uma função no controller
router.get("/register", AuthController.register);
router.post("/register", AuthController.registerPost);
// logout
router.get("/logout", AuthController.logout);

// login
router.get("/login", AuthController.login);
router.post("/login", AuthController.loginPost);
module.exports = router;
