const db = require("../config/database");

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    const [store] = await db.execute("SELECT id FROM stores WHERE id = ?", [
      storeId,
    ]);

    if (store.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const [existingRating] = await db.execute(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    if (existingRating.length > 0) {
      await db.execute(
        "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
        [rating, userId, storeId]
      );

      res.json({
        success: true,
        message: "Rating updated successfully",
      });
    } else {
      await db.execute(
        "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
        [userId, storeId, rating]
      );

      res.status(201).json({
        success: true,
        message: "Rating submitted successfully",
      });
    }
  } catch (error) {
    console.error("Submit rating error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit rating",
    });
  }
};

const getUserRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const [rows] = await db.execute(
      "SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    res.json({
      success: true,
      rating: rows.length > 0 ? rows[0].rating : null,
    });
  } catch (error) {
    console.error("Get user rating error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get rating",
    });
  }
};

const getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const [store] = await db.execute(
      "SELECT owner_id FROM stores WHERE id = ?",
      [storeId]
    );

    if (store.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    if (store[0].owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view ratings for your own store",
      });
    }

    const [ratings] = await db.execute(
      `
      SELECT r.rating, r.created_at, u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
    `,
      [storeId]
    );

    const [stats] = await db.execute(
      `
      SELECT average_rating, total_ratings
      FROM stores
      WHERE id = ?
    `,
      [storeId]
    );

    res.json({
      success: true,
      ratings,
      statistics: stats[0],
    });
  } catch (error) {
    console.error("Get store ratings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get store ratings",
    });
  }
};

const getOwnerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [store] = await db.execute(
      "SELECT id, name, average_rating, total_ratings FROM stores WHERE owner_id = ?",
      [userId]
    );

    if (store.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No store found for this owner",
      });
    }

    const storeData = store[0];

    const [recentRatings] = await db.execute(
      `
      SELECT r.rating, r.created_at, u.name as user_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `,
      [storeData.id]
    );

    const [ratingDistribution] = await db.execute(
      `
      SELECT rating, COUNT(*) as count
      FROM ratings
      WHERE store_id = ?
      GROUP BY rating
      ORDER BY rating
    `,
      [storeData.id]
    );

    res.json({
      success: true,
      dashboard: {
        store: storeData,
        recentRatings,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Get owner dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard data",
    });
  }
};

const getAllRatings = async (req, res) => {
  try {
    const { page = 1, limit = 10, storeId } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, u.name as user_name, u.email as user_email, 
             s.name as store_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
    `;
    let queryParams = [];

    if (storeId) {
      query += " WHERE r.store_id = ?";
      queryParams.push(storeId);
    }

    query += " ORDER BY r.created_at DESC LIMIT ? OFFSET ?";
    queryParams.push(parseInt(limit), parseInt(offset));

    const [ratings] = await db.execute(query, queryParams);

    let countQuery = "SELECT COUNT(*) as total FROM ratings";
    let countParams = [];

    if (storeId) {
      countQuery += " WHERE store_id = ?";
      countParams.push(storeId);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      ratings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all ratings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get ratings",
    });
  }
};

module.exports = {
  submitRating,
  getUserRating,
  getStoreRatings,
  getOwnerDashboard,
  getAllRatings,
};
