const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile
} = require("../controllers/authController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();


/*
 * REGISTER
 */

router.post(
  "/register",
  registerUser
);


/*
 * LOGIN
 */

router.post(
  "/login",
  loginUser
);


/*
 * PROFILE
 */

router.get(
  "/profile",
  protect,
  getProfile
);


module.exports = router;