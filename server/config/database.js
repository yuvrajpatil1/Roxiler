const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "store_rating_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
});

const promisePool = pool.promise();

const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log("Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

testConnection();

module.exports = promisePool;

// const { Pool } = require("pg");
// require("dotenv").config();

// // Create PostgreSQL connection pool
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl:
//     process.env.NODE_ENV === "production"
//       ? { rejectUnauthorized: false }
//       : false,
//   max: 10,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 60000,
// });

// // For development, you can also use individual config options:
// // const pool = new Pool({
// //   host: process.env.DB_HOST || "localhost",
// //   user: process.env.DB_USER || "postgres",
// //   password: process.env.DB_PASSWORD || "",
// //   database: process.env.DB_NAME || "store_rating_db",
// //   port: process.env.DB_PORT || 5432,
// //   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
// //   max: 10,
// //   idleTimeoutMillis: 30000,
// //   connectionTimeoutMillis: 60000,
// // });

// const testConnection = async () => {
//   try {
//     console.log("Attempting database connection...");
//     if (process.env.DATABASE_URL) {
//       const url = new URL(process.env.DATABASE_URL);
//       console.log(
//         `Connecting to: ${url.hostname}:${url.port}/${url.pathname.slice(1)}`
//       );
//       console.log(`Username: ${url.username}`);
//     } else {
//       console.log(
//         `Connecting to: ${process.env.DB_HOST || "localhost"}:${
//           process.env.DB_PORT || 5432
//         }`
//       );
//     }

//     const client = await pool.connect();
//     console.log("PostgreSQL database connected successfully");
//     const result = await client.query("SELECT NOW()");
//     console.log("Database time:", result.rows[0].now);
//     client.release();
//   } catch (error) {
//     console.error("Database connection failed:", error.message);
//     console.error("Full error:", error);

//     if (process.env.NODE_ENV !== "production") {
//       process.exit(1);
//     }
//   }
// };

// testConnection();

// // Graceful shutdown
// process.on("SIGINT", async () => {
//   console.log("Closing database connections...");
//   await pool.end();
//   process.exit(0);
// });

// process.on("SIGTERM", async () => {
//   console.log("Closing database connections...");
//   await pool.end();
//   process.exit(0);
// });

// module.exports = pool;
