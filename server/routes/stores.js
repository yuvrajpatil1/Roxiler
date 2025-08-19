const express = require("express");
const router = express.Router();
const {
  createStore,
  getAllStores,
  getStoreById,
  getStoresForUser,
  updateStore,
  deleteStore,
} = require("../controllers/storeController");
const { auth, authorize } = require("../middleware/auth");
const { validateStore, handleValidation } = require("../utils/validation");

// Admin routes
router.post(
  "/",
  auth,
  authorize("admin"),
  validateStore,
  handleValidation,
  createStore
);
router.get("/admin/all", auth, authorize("admin"), getAllStores);
router.put(
  "/:id",
  auth,
  authorize("admin"),
  validateStore,
  handleValidation,
  updateStore
);
router.delete("/:id", auth, authorize("admin"), deleteStore);

// User route
router.get("/user/list", auth, authorize("user"), getStoresForUser);

// Common route
router.get("/:id", auth, getStoreById);

module.exports = router;
