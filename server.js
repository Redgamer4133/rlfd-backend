// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import newsRoutes from "./routes/news.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Root route for testing
app.get("/", (req, res) => {
  res.send("RLFD backend is running");
});

// Mount admin news route
app.use("/api/admin/news", newsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
