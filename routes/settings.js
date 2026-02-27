// backend/routes/settings.js
import express from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/", requireAdmin, async (req, res) => {
  const result = await pool.query("SELECT * FROM site_settings LIMIT 1");
  res.json(result.rows[0] || {});
});

router.post("/", requireAdmin, async (req, res) => {
  const { siteTitle, contactEmail } = req.body;

  await pool.query("DELETE FROM site_settings");
  await pool.query(
    "INSERT INTO site_settings (site_title, contact_email) VALUES ($1, $2)",
    [siteTitle, contactEmail]
  );

  await pool.query(
    "INSERT INTO admin_logs (admin_id, action) VALUES ($1, $2)",
    [req.adminID, "Updated site settings"]
  );

  res.json({ success: true });
});

export default router;
