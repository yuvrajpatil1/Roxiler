const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updatePassword,
  getProfile,
} = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const {
  validateRegistration,
  validateLogin,
  validatePasswordUpdate,
  handleValidation,
} = require("../utils/validation");

router.post("/register", validateRegistration, handleValidation, register);
router.post("/login", validateLogin, handleValidation, login);

router.put(
  "/update-password",
  auth,
  validatePasswordUpdate,
  handleValidation,
  updatePassword
);
router.get("/profile", auth, getProfile);

module.exports = router;
