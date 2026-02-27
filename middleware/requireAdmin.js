// backend/middleware/requireAdmin.js
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query(
      "SELECT role FROM admin_users WHERE discord_id = $1",
      [decoded.discordID]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Not authorized" });
    }

    req.adminID = decoded.discordID;
    req.adminRole = result.rows[0].role;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}
