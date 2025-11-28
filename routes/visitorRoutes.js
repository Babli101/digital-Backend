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

// Visitor stats (today/week/month totals)
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

// Chart data endpoint for frontend
router.get("/chart/:view", async (req, res) => {
  const { view } = req.params;

  try {
    const now = new Date();
    let categories = [];
    let data = [];

    if (view === "week") {
      const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
      categories = days;

      for (let i = 0; i < 7; i++) {
        const start = new Date();
        start.setDate(now.getDate() - now.getDay() + i + 1);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setHours(23, 59, 59, 999);

        const count = await Visitor.countDocuments({
          createdAt: { $gte: start, $lte: end },
        });

        data.push(count);
      }
    }

    if (view === "month") {
      categories = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

      for (let i = 0; i < 30; i++) {
        const start = new Date();
        start.setDate(now.getDate() - 29 + i);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setHours(23, 59, 59, 999);

        const count = await Visitor.countDocuments({
          createdAt: { $gte: start, $lte: end },
        });

        data.push(count);
      }
    }

    res.json({ categories, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
