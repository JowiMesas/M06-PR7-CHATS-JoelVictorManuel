const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Ruta POST para login
router.post("/", authController);

module.exports = router;