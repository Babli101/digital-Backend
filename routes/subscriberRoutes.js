import express from "express";
import Subscriber from "../models/Subscriber.js";

const router = express.Router();

// Add subscriber
router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) 
    return res.status(400).json({ message: "Email is required" });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already subscribed" });

    const subscriber = await Subscriber.create({ email });

    res.status(201).json({
      message: "Subscribed successfully",
      subscriber
    });

  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all subscribers
router.get("/", async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching subscribers" });
  }
});

// WEEKLY SUBSCRIBERS
router.get("/weekly", async (req, res) => {
  try {
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const result = [];

    for (let i = 0; i < 7; i++) {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay() + i + 1);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const count = await Subscriber.countDocuments({
        createdAt: { $gte: start, $lte: end }
      });

      result.push(count);
    }

    res.json({
      categories: days,
      data: result
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
