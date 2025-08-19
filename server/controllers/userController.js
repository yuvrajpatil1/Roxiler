const db = require("../config/database");
const bcrypt = require("bcryptjs");

const getDashboardStats = async (req, res) => {
  try {
    const [userCount] = await db.execute("SELECT COUNT(*) as count FROM users");

    const [storeCount] = await db.execute(
      "SELECT COUNT(*) as count FROM stores"
    );

    const [ratingCount] = await db.execute(
      "SELECT COUNT(*) as count FROM ratings"
    );

    res.json({
      success: true,
      stats: {
        totalUsers: userCount[0].count,
        totalStores: storeCount[0].count,
        totalRatings: ratingCount[0].count,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard statistics",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const {
      search,
      role,
      sortBy = "name",
      sortOrder = "ASC",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT id, name, email, address, role, created_at FROM users";
    let queryParams = [];
    let whereConditions = [];

    if (search) {
      whereConditions.push("(name LIKE ? OR email LIKE ? OR address LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (role && ["admin", "user", "store_owner"].includes(role)) {
      whereConditions.push("role = ?");
      queryParams.push(role);
    }

    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
    }

    const allowedSortFields = ["name", "email", "role", "created_at"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const order = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    query += ` ORDER BY ${sortField} ${order}`;

    query += " LIMIT ? OFFSET ?";
    queryParams.push(parseInt(limit), parseInt(offset));

    const [users] = await db.execute(query, queryParams);

    let countQuery = "SELECT COUNT(*) as total FROM users";
    let countParams = [];

    if (whereConditions.length > 0) {
      countQuery += " WHERE " + whereConditions.join(" AND ");
      countParams = queryParams.slice(0, -2); // Remove limit and offset
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get users",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
             s.name as store_name, s.average_rating as store_rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id
      WHERE u.id = ?
    `;

    const [rows] = await db.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address || "", role]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: result.insertId,
        name,
        email,
        address: address || "",
        role,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role, password } = req.body;

    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }

    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }

    if (address !== undefined) {
      updateFields.push("address = ?");
      updateValues.push(address);
    }

    if (role) {
      updateFields.push("role = ?");
      updateValues.push(role);
    }

    if (password) {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateFields.push("password = ?");
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    updateValues.push(id);

    await db.execute(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await db.execute("DELETE FROM users WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
