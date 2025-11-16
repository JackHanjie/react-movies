import express from "express";

import User from "../models/userModel.ts";
import asyncHandler from "../middlewares/asyncHandler.ts";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.ts";


const createUser = asyncHandler(async (req: express.Request, res: express.Response) => {  
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "Please provide username, email, and password." });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists." });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  })

  console.log(newUser,'newUser')

  try {
    
    await newUser.save();
    createToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

const loginUser = asyncHandler(async (req: express.Request, res: any) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      createToken(res, existingUser._id);

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        message: "Login successful."
      });
      return;
    } else {
      res.status(400).json({ message: "Invalid password." });
    }
  } else {
    res.status(400).json({ message: "User not found." });
  }
});

export {
  createUser,
  loginUser,
}