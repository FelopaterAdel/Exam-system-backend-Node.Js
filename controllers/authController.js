import { catchAsync } from '../utils/wrapperFunction.js';
import User from '../models/User.js'; // Ensure correct path and .js extension
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { auth } from '../middlewares/authMiddleware.js';
export const register = async (req, res) => {
  try {
    
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      status: "fail",
      message: "Please provide email and password"
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid email "
    });
  }
  console.log(user);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid  password"
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    status: "success",
    token: token
  });
});
export const getUser = async (req, res) => {
  try {
    const userId = req.userId;
   
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("-password");   

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
