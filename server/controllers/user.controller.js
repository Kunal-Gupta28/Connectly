const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const { hash, compare } = require("bcrypt");

module.exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({ message: "email already exists" });
    }

    const user = await userModel.create({ name, email, password });

    if (!user) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "User creation failed" });
    }

    const token = user.generateAuthToken();

    res.status(StatusCodes.CREATED).json({ token, user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

module.exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

       const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();

    res.status(StatusCodes.OK).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

module.exports.logout = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Logout successful (client should discard token)" });
};
