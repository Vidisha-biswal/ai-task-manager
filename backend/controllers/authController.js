const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");


const registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password
    } = req.body;


    /*
     * VALIDATION
     */

    if (
      !name ||
      !name.trim() ||
      !email ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Name, email, and password are required."
      });
    }


    const normalizedName =
      name.trim();

    const normalizedEmail =
      email.trim().toLowerCase();


    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long."
      });
    }


    /*
     * CHECK EXISTING USER
     */

    const userExists =
      await User.findOne({
        email: normalizedEmail
      });

    if (userExists) {
      return res.status(400).json({
        message:
          "An account with this email already exists."
      });
    }


    /*
     * HASH PASSWORD
     */

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    /*
     * CREATE USER
     */

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword
    });


    /*
     * RESPONSE
     */

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (error) {

    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error: " +
        error.message
    });
  }
};


const loginUser = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;


    if (
      !email ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Email and password are required."
      });
    }


    const normalizedEmail =
      email.trim().toLowerCase();


    /*
     * FIND USER
     */

    const user =
      await User.findOne({
        email: normalizedEmail
      });


    /*
     * CHECK PASSWORD
     */

    if (
      !user ||
      !(await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.status(401).json({
        message:
          "Invalid email or password."
      });
    }


    /*
     * SUCCESS
     */

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      message:
        "Server internal error: " +
        error.message
    });
  }
};


const getProfile = async (req, res) => {
  try {

    return res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });

  } catch (error) {

    console.error(
      "Profile error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve profile."
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getProfile
};