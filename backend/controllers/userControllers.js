const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic, bio } = req.body;
  console.log(name, email, password, pic);

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic: pic || undefined,
    bio: bio || undefined,
    isOnline: true,
    lastSeen: new Date(),
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      bio: user.bio,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);

  if (!email || !password) {
    console.log("Email or password missing");
    return res.status(400).send({ message: "Please provide email and password" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    // Debug info - be careful with password info in logs
    console.log("User found:", user ? "Yes" : "No");
    
    // If no user found
    if (!user) {
      console.log("No user found with this email");
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Compare passwords - debug the comparison
    console.log("Comparing passwords...");
    console.log("Stored hashed password length:", user.password.length);
    console.log("Provided password length:", password.length);
    
    const isMatch = await user.matchPassword(password);
    console.log("Password match result:", isMatch);
    
    if (isMatch) {
      console.log("Password matched, updating user status");
      // Update online status
      user.isOnline = true;
      user.lastSeen = new Date();
      await user.save();
      
      // Send user data with token
      console.log("Sending successful response");
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        bio: user.bio || "Hey there! I'm using Talk-A-Tive",
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        token: generateToken(user._id),
      });
    } else {
      console.log("Password did not match");
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error details:", error);
    return res.status(500).json({ message: "Server error, please try again later" });
  }
});

const allUsers = asyncHandler(async (req, res) => {
  // Check if there's a search query
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : null;
  // If no search query is provided, return an empty array
  if (!keyword) {
    return res.send([]);
  }
  
  // If there's a search query, proceed with the database search
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  
  res.send(users);
});

// Add profile update endpoint
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, pic, bio } = req.body;
  
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update fields if provided
  if (name) user.name = name;
  if (pic) user.pic = pic;
  if (bio) user.bio = bio;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    pic: updatedUser.pic,
    bio: updatedUser.bio,
    isOnline: updatedUser.isOnline,
    lastSeen: updatedUser.lastSeen,
    token: req.headers.authorization?.split(" ")[1] || generateToken(updatedUser._id),
  });
});

// Get user profile by ID
const getUserProfile = asyncHandler(async (req, res) => {
  const userIdToFind = req.params.id;
  console.log(`[getUserProfile] Received request for user ID: ${userIdToFind}`); // Log received ID

  if (!userIdToFind || typeof userIdToFind !== 'string' || userIdToFind.length < 5) {
     console.warn(`[getUserProfile] Invalid ID format received: ${userIdToFind}`);
     res.status(400); // Bad Request for invalid ID format
     throw new Error("Invalid User ID format");
  }

  try {
      const user = await User.findById(userIdToFind);
      console.log(user);
      
      
      if (!user) {
        console.warn(`[getUserProfile] User not found in DB for ID: ${userIdToFind}`);
        res.status(404);
        throw new Error("User not found");
      } else {
        console.log(`[getUserProfile] Successfully found user for ID: ${userIdToFind}`);
        res.json(user); // Send user data
      }
  } catch (error) {
      // Handle potential CastError if ID format is wrong for MongoDB
      if (error.name === 'CastError') {
          console.error(`[getUserProfile] CastError: Invalid ID format for MongoDB: ${userIdToFind}`, error);
          res.status(400);
          throw new Error("Invalid User ID format");
      } else {
          // Re-throw other errors (like the 404 we throw manually)
          console.error(`[getUserProfile] Error processing request for ID: ${userIdToFind}`, error);
          throw error; 
      }
  }
});

// Set user as offline
const setUserOffline = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.isOnline = false;
    user.lastSeen = new Date();
    await user.save();
    res.status(200).json({ message: "User set to offline" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.isOnline = false;
    user.lastSeen = new Date();
    await user.save();
    
    res.status(200).json({ 
      success: true,
      message: "Logged out successfully" 
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getOnlineUsers = asyncHandler(async (req, res) => {
  const onlineUsers = await User.find({ isOnline: true })
    .select("_id name email pic isOnline lastSeen");
  
  res.status(200).json(onlineUsers);
});

module.exports = { 
  registerUser, 
  authUser, 
  allUsers, 
  updateUserProfile, 
  getUserProfile,
  setUserOffline,
  logoutUser,
  getOnlineUsers 
};
