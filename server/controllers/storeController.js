const db = require("../config/database");
const bcrypt = require("bcryptjs");

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerName, ownerPassword } = req.body;

    const [existingStore] = await db.execute(
      "SELECT id FROM stores WHERE email = ?",
      [email]
    );

    if (existingStore.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Store already exists with this email",
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(ownerPassword, saltRounds);

    const [ownerResult] = await db.execute(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [ownerName, email, hashedPassword, address, "store_owner"]
    );

    const [storeResult] = await db.execute(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, ownerResult.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      store: {
        id: storeResult.insertId,
        name,
        email,
        address,
        owner_id: ownerResult.insertId,
      },
    });
  } catch (error) {
    console.error("Create store error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create store",
    });
  }
};

const getAllStores = async (req, res) => {
  try {
    const {
      search,
      sortBy = "name",
      sortOrder = "ASC",
      page = 1,
      limit = 10,
    } = req.query;

    // Ensure page and limit are valid numbers
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let baseQuery = `
      SELECT s.*, u.name as owner_name 
      FROM stores s 
      LEFT JOIN users u ON s.owner_id = u.id
    `;
    let queryParams = [];

    if (search) {
      baseQuery += " WHERE s.name LIKE ? OR s.address LIKE ?";
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const allowedSortFields = [
      "name",
      "email",
      "address",
      "average_rating",
      "total_ratings",
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const order = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    baseQuery += ` ORDER BY s.${sortField} ${order}`;

    // Use string interpolation for LIMIT/OFFSET instead of prepared statements
    const query = `${baseQuery} LIMIT ${limitNum} OFFSET ${offset}`;

    console.log("Query Params:", queryParams);
    console.log("Final Query:", query);

    let stores;
    if (queryParams.length > 0) {
      [stores] = await db.execute(query, queryParams);
    } else {
      [stores] = await db.execute(query);
    }

    // Count query
    let countQuery = "SELECT COUNT(*) as total FROM stores s";
    let countParams = [];

    if (search) {
      countQuery += " WHERE s.name LIKE ? OR s.address LIKE ?";
      countParams.push(`%${search}%`, `%${search}%`);
    }

    let countResult;
    if (countParams.length > 0) {
      [countResult] = await db.execute(countQuery, countParams);
    } else {
      [countResult] = await db.execute(countQuery);
    }

    const total = countResult[0].total;

    res.json({
      success: true,
      stores,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get stores error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get stores: " + error.message,
    });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      `
      SELECT s.*, u.name as owner_name 
      FROM stores s 
      LEFT JOIN users u ON s.owner_id = u.id 
      WHERE s.id = ?
    `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.json({
      success: true,
      store: rows[0],
    });
  } catch (error) {
    console.error("Get store error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get store",
    });
  }
};

const getStoresForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, sortBy = "name", sortOrder = "ASC" } = req.query;

    let query = `
      SELECT s.*, 
             r.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = ?
    `;
    let queryParams = [userId];

    if (search) {
      query += " WHERE s.name LIKE ? OR s.address LIKE ?";
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const allowedSortFields = ["name", "address", "average_rating"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const order = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    query += ` ORDER BY s.${sortField} ${order}`;

    const [stores] = await db.execute(query, queryParams);

    res.json({
      success: true,
      stores,
    });
  } catch (error) {
    console.error("Get stores for user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get stores",
    });
  }
};

const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address } = req.body;

    const [existingStore] = await db.execute(
      "SELECT id FROM stores WHERE id = ?",
      [id]
    );

    if (existingStore.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    await db.execute(
      "UPDATE stores SET name = ?, email = ?, address = ? WHERE id = ?",
      [name, email, address, id]
    );

    res.json({
      success: true,
      message: "Store updated successfully",
    });
  } catch (error) {
    console.error("Update store error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update store",
    });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const [store] = await db.execute(
      "SELECT owner_id FROM stores WHERE id = ?",
      [id]
    );

    if (store.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    await db.execute("DELETE FROM stores WHERE id = ?", [id]);

    if (store[0].owner_id) {
      await db.execute("DELETE FROM users WHERE id = ?", [store[0].owner_id]);
    }

    res.json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (error) {
    console.error("Delete store error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete store",
    });
  }
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  getStoresForUser,
  updateStore,
  deleteStore,
};
