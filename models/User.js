import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  city: String,
  message: String
});

export default mongoose.model("User", userSchema);
