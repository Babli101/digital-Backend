import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Visitor = mongoose.model("Visitor", visitorSchema);

// ✅ Default export
export default Visitor;
