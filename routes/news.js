// routes/news.js
import express from "express";
const router = express.Router();

// Optional: import requireAdmin if you want to protect the route
// import requireAdmin from "../middleware/requireAdmin.js";

// Example route
router.get("/", async (req, res) => {
  res.json({ message: "News route is working!" });
});

export default router;
