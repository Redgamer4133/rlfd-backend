// backend/routes/logs.js
import express from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/", requireAdmin, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM admin_logs ORDER BY timestamp DESC LIMIT 100"
  );
  res.json(result.rows);
});

export default router;
