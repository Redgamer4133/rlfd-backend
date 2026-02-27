import express from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/", requireAdmin, async (req, res) => {
  const [news, forms, admins, logs] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM news_posts"),
    pool.query("SELECT COUNT(*) FROM contact_forms"),
    pool.query("SELECT COUNT(*) FROM admin_users"),
    pool.query("SELECT COUNT(*) FROM admin_logs")
  ]);

  res.json({
    news: parseInt(news.rows[0].count),
    forms: parseInt(forms.rows[0].count),
    admins: parseInt(admins.rows[0].count),
    logs: parseInt(logs.rows[0].count)
  });
});

export default router;
