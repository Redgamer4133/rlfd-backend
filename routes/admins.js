// backend/routes/admins.js
import express from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/", requireAdmin, async (req, res) => {
  const result = await pool.query("SELECT discord_id, role FROM admin_users ORDER BY discord_id");
  res.json(result.rows);
});

router.post("/", requireAdmin, async (req, res) => {
  const { discordID, role } = req.body;

  await pool.query(
    "INSERT INTO admin_users (discord_id, role) VALUES ($1, $2) ON CONFLICT (discord_id) DO UPDATE SET role = $2",
    [discordID, role]
  );

  await pool.query(
    "INSERT INTO admin_logs (admin_id, action) VALUES ($1, $2)",
    [req.adminID, `Added/Updated admin ${discordID} (${role})`]
  );

  res.json({ success: true });
});

router.delete("/:discordID", requireAdmin, async (req, res) => {
  const { discordID } = req.params;

  await pool.query("DELETE FROM admin_users WHERE discord_id = $1", [discordID]);
  await pool.query(
    "INSERT INTO admin_logs (admin_id, action) VALUES ($1, $2)",
    [req.adminID, `Removed admin ${discordID}`]
  );

  res.json({ success: true });
});

export default router;
