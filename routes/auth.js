import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Login route
router.post("/login", async (req, res) => {
  const { discordID, password } = req.body;

  // TEMP: Replace with real password check or OAuth later
  const validPasswords = ["Liam2026", "Riverline2026", "OwnerPassword"];
  if (!validPasswords.includes(password)) {
    return res.status(403).json({ error: "Invalid password" });
  }

  const result = await pool.query(
    "SELECT role FROM admin_users WHERE discord_id = $1",
    [discordID]
  );

  if (result.rows.length === 0) {
    return res.status(403).json({ error: "Not an admin" });
  }

  const token = jwt.sign({ discordID }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token });
});

// Verify route
router.get("/verify", async (req, res) => {
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

    res.json({ discordID: decoded.discordID, role: result.rows[0].role });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
