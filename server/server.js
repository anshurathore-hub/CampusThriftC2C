import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import listingRoutes from "./routes/listings.js";
import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";
import favoriteRoutes from "./routes/favorites.js";
import reportRoutes from "./routes/reports.js";
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]); // Uses Cloudflare DNS

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/listings", listingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
    res.send("CampusThrift API running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});