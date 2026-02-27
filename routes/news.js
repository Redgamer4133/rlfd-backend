// backend/routes/news.js
import express from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

// Get all news posts
router.get("/", requireAdmin, async (req, res) => {
  const result = await pool.query("SELECT * FROM news_posts ORDER BY created_at DESC");
  res.json(result.rows);
});

// Create a new news post
router.post("/", requireAdmin, async (req, res) => {
  const { title, body } = req.body;

  await pool.query(
    "INSERT INTO news_posts (title, body) VALUES ($1, $2)",
    [title, body]
  );

  await pool.query(
    "INSERT INTO admin_logs (admin_id, action) VALUES ($1, $2)",
    [req.adminID, `Created news post: ${title}`]
  );

  res.json({ success: true });
});

// Delete a news post
router.delete("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM news_posts WHERE id = $1", [id]);

  await pool.query(
    "INSERT INTO admin_logs (admin_id, action) VALUES ($1, $2)",
    [req.adminID, `Deleted news post ID ${id}`]
  );

  res.json({ success: true });
});

export default router;
