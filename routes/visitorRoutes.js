import express from "express";
import Visitor from "../models/Visitor.js";

const router = express.Router();

// Log a visit (called explicitly from frontend)
router.post("/", async (req, res) => {
  try {
    const ip = req.body.ip || "unknown";

    // Optional safety: prevent double logging from same IP within 1 minute
    const recent = await Visitor.findOne({
      ip,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) }
    });

    if (!recent) {
      await Visitor.create({ ip });
    }

    res.json({ message: "Visit logged successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Visitor stats
router.get("/stats", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await Visitor.countDocuments({ createdAt: { $gte: today } });
    const weekCount = await Visitor.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } });
    const monthCount = await Visitor.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } });

    res.json({ today: todayCount, week: weekCount, month: monthCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
