const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  authUser,
  allUsers,
  updateUserProfile,
  getUserProfile,
  setUserOffline,
  logoutUser,
  getOnlineUsers
} = require("../controllers/userControllers");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.route("/login").post(authUser);
router.route("/logout").post(protect, logoutUser);
router.route("/profile").put(protect, updateUserProfile);
router.route("/profile/:id").get(protect, getUserProfile);
router.route("/offline").post(protect, setUserOffline);
router.route("/online").get(protect, getOnlineUsers);

module.exports = router;
