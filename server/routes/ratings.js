const express = require("express");
const router = express.Router();
const {
  submitRating,
  getUserRating,
  getStoreRatings,
  getOwnerDashboard,
  getAllRatings,
} = require("../controllers/ratingController");
const { auth, authorize } = require("../middleware/auth");
const { validateRating, handleValidation } = require("../utils/validation");

// User routes
router.post(
  "/submit",
  auth,
  authorize("user"),
  validateRating,
  handleValidation,
  submitRating
);
router.get("/user/:storeId", auth, authorize("user"), getUserRating);

// Store owner routes
router.get("/store/:storeId", auth, authorize("store_owner"), getStoreRatings);
router.get("/dashboard", auth, authorize("store_owner"), getOwnerDashboard);

// Admin routes
router.get("/admin/all", auth, authorize("admin"), getAllRatings);

module.exports = router;
