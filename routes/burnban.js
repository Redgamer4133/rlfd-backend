// backend/routes/burnban.js
import express from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.post("/", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM burn_ban ORDER BY changed_at DESC LIMIT 1"
    );
    const current = result.rows[0];
    const newStatus = !current?.status;

    await pool.query(
      "INSERT INTO burn_ban (status, changed_at) VALUES ($1, NOW())",
      [newStatus]
    );

    await pool.query(
      "INSERT INTO admin_logs (admin_id, action) VALUES ($1, $2)",
      [req.adminID, `Toggled burn ban to ${newStatus}`]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Burn ban update failed:", err);
    res.status(500).json({ error: "Failed to update burn ban" });
  }
});

export default router;
