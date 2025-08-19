const { body, validationResult } = require("express-validator");

const validateRegistration = [
  body("name")
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage(
      "Password must contain at least one uppercase letter and one special character"
    ),
  body("address")
    .optional()
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateStore = [
  body("name")
    .notEmpty()
    .withMessage("Store name is required")
    .isLength({ max: 255 })
    .withMessage("Store name cannot exceed 255 characters"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),
];

const validateRating = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("storeId").isInt().withMessage("Valid store ID is required"),
];

const validatePasswordUpdate = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8, max: 16 })
    .withMessage("New password must be between 8 and 16 characters")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage(
      "New password must contain at least one uppercase letter and one special character"
    ),
];

const validateUser = [
  body("name")
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .optional()
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage(
      "Password must contain at least one uppercase letter and one special character"
    ),
  body("address")
    .optional()
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),
  body("role")
    .isIn(["admin", "user", "store_owner"])
    .withMessage("Invalid role specified"),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => error.msg),
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateStore,
  validateRating,
  validatePasswordUpdate,
  validateUser,
  handleValidation,
};
