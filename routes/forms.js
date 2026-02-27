// backend/routes/forms.js
import express from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/", requireAdmin, async (req, res) => {
  const result = await pool.query("SELECT * FROM contact_forms ORDER BY submitted_at DESC");
  res.json(result.rows);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM contact_forms WHERE id = $1", [id]);
  await pool.query(
    "INSERT INTO admin_logs (admin_id, action) VALUES ($1, $2)",
    [req.adminID, `Deleted form submission ID ${id}`]
  );

  res.json({ success: true });
});

export default router;
