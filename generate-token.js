// backend/generate-token.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Replace this with your actual Discord ID
const discordID = "1424182021114171424";

const token = jwt.sign({ discordID }, JWT_SECRET, { expiresIn: "12h" });

console.log("Generated token:", token);
