import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a new pool using the connection string
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test that the pool can connect to the database
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Database connected successfully at:", res.rows[0].now);
  }
});

export default pool;
