import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", true); // real IP behind proxy

// -----------------------------
// Routes
// -----------------------------
app.use("/api/user", userRoutes);
app.use("/api/visit", visitorRoutes);      // Visitor logging + stats
app.use("/api/subscribers", subscriberRoutes);

// Test route
app.get("/", (req, res) => res.send("Backend running"));

// -----------------------------
// Start server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
