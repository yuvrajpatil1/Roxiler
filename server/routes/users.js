const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { auth, authorize } = require("../middleware/auth");
const { validateUser, handleValidation } = require("../utils/validation");

// Admin routes
router.get("/dashboard/stats", auth, authorize("admin"), getDashboardStats);
router.get("/", auth, authorize("admin"), getAllUsers);
router.get("/:id", auth, authorize("admin"), getUserById);
router.post(
  "/",
  auth,
  authorize("admin"),
  validateUser,
  handleValidation,
  createUser
);
router.put("/:id", auth, authorize("admin"), updateUser);
router.delete("/:id", auth, authorize("admin"), deleteUser);

module.exports = router;
