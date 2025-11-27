import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser
} from "../controllers/userController.js";

const router = express.Router();

// Create a new user
router.post("/add", createUser);

// Get all users
router.get("/", getUsers);

// Get a single user by ID
router.get("/:id", getUserById);

// ⭐ Delete a user by ID
router.delete("/:id", deleteUser);

// ⭐ Update a user by ID
router.put("/:id", updateUser);

export default router;
