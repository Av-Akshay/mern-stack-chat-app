const express = require("express");
const { googleAuth, githubAuth, oauthCallback, mockOAuth } = require("../controllers/authController");

const router = express.Router();

// OAuth Routes
router.get("/google", googleAuth);
router.get("/github", githubAuth);
router.get("/google/callback", oauthCallback);
router.get("/github/callback", oauthCallback);

// Mock OAuth for Development (REMOVE IN PRODUCTION)
// These routes simulate OAuth flow for testing
router.get("/mock/:provider", mockOAuth);

module.exports = router;