// backend/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

import authRoutes from "./routes/auth.js";
import newsRoutes from "./routes/news.js";
import burnbanRoutes from "./routes/burnban.js";
import formRoutes from "./routes/forms.js";
import adminRoutes from "./routes/admins.js";
import logRoutes from "./routes/logs.js";
import settingsRoutes from "./routes/settings.js";
import statsRoutes from "./routes/stats.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Admin route modules
app.use("/api/admin", authRoutes);
app.use("/api/admin/news", newsRoutes);
app.use("/api/admin/burnban", burnbanRoutes);
app.use("/api/admin/forms", formRoutes);
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/logs", logRoutes);
app.use("/api/admin/settings", settingsRoutes);
app.use("/api/admin/stats", statsRoutes);

// Public route for burn ban status
app.get("/api/burnban", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM burn_ban ORDER BY changed_at DESC LIMIT 1"
    );
    res.json(result.rows[0] || { status: false });
  } catch (err) {
    console.error("Error fetching burn ban status:", err);
    res.status(500).json({ error: "Failed to fetch burn ban status" });
  }
});

// TEMP: Hardcoded admin credentials (replace with DB validation in production)
const ADMIN_PASSWORDS = ["Liam2026", "Riverline2026", "OwnerPassword"];
const allowedDiscordIDs = ["1234567890", "0987654321"];
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Admin login route
app.post("/api/admin/login", (req, res) => {
  const { discordID, password } = req.body;

  if (!ADMIN_PASSWORDS.includes(password)) {
    return res.status(401).json({ error: "Invalid password" });
  }

  if (!allowedDiscordIDs.includes(discordID)) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const token = jwt.sign({ discordID }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
});

// Token verification route
app.get("/api/admin/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!allowedDiscordIDs.includes(decoded.discordID)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json({ success: true });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Start server
app.listen(3001, () => {
  console.log("Admin backend running on port 3001");
});
