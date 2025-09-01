const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

// Google OAuth Handler
const googleAuth = asyncHandler(async (req, res) => {
  // In production, you would:
  // 1. Redirect to Google OAuth URL with your client ID
  // 2. Handle the callback with the authorization code
  // 3. Exchange code for tokens
  // 4. Get user info from Google
  // 5. Create or update user in database
  // 6. Generate JWT and redirect
  
  // For demo purposes, sending mock response
  res.json({
    message: "Google OAuth endpoint - Configure Google OAuth App",
    setup: {
      step1: "Go to Google Cloud Console",
      step2: "Create OAuth 2.0 Client ID",
      step3: "Add redirect URI: http://localhost:8000/api/auth/google/callback",
      step4: "Install passport and passport-google-oauth20",
      step5: "Configure passport strategy with your credentials"
    }
  });
});

// GitHub OAuth Handler
const githubAuth = asyncHandler(async (req, res) => {
  // In production, you would:
  // 1. Redirect to GitHub OAuth URL with your client ID
  // 2. Handle the callback with the authorization code
  // 3. Exchange code for access token
  // 4. Get user info from GitHub API
  // 5. Create or update user in database
  // 6. Generate JWT and redirect
  
  // For demo purposes, sending mock response
  res.json({
    message: "GitHub OAuth endpoint - Configure GitHub OAuth App",
    setup: {
      step1: "Go to GitHub Settings > Developer settings > OAuth Apps",
      step2: "Create New OAuth App",
      step3: "Add redirect URI: http://localhost:8000/api/auth/github/callback",
      step4: "Install passport and passport-github2",
      step5: "Configure passport strategy with your credentials"
    }
  });
});

// OAuth Callback Handler (for both Google and GitHub)
const oauthCallback = asyncHandler(async (req, res) => {
  const { email, name, provider, providerId, picture } = req.user || {};
  
  if (!email || !name) {
    res.status(400);
    throw new Error("Invalid OAuth response");
  }

  // Check if user exists
  let user = await User.findOne({ email });

  if (user) {
    // Update existing user with OAuth info
    user.name = name;
    user.pic = picture || user.pic;
    user[`${provider}Id`] = providerId;
    await user.save();
  } else {
    // Create new user
    user = await User.create({
      name,
      email,
      password: `${provider}_${providerId}_${Date.now()}`, // Random password for OAuth users
      pic: picture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      [`${provider}Id`]: providerId
    });
  }

  if (user) {
    const token = generateToken(user._id);
    
    // Send success message to popup window
    res.send(`
      <script>
        window.opener.postMessage({
          type: '${provider.toUpperCase()}_AUTH_SUCCESS',
          payload: {
            token: '${token}',
            user: {
              _id: '${user._id}',
              name: '${user.name}',
              email: '${user.email}',
              pic: '${user.pic}'
            }
          }
        }, '${process.env.FRONTEND_URL || 'http://localhost:5173'}');
        window.close();
      </script>
    `);
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

// Mock OAuth for Development (REMOVE IN PRODUCTION)
const mockOAuth = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  
  // Create or find a demo user
  const email = `demo_${provider}@example.com`;
  let user = await User.findOne({ email });
  
  if (!user) {
    user = await User.create({
      name: `Demo ${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email,
      password: `${provider}_demo_${Date.now()}`,
      pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    });
  }
  
  const token = generateToken(user._id);
  
  // Simulate OAuth success
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>OAuth Demo</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
        }
        h2 { color: #333; margin-bottom: 1rem; }
        p { color: #666; margin-bottom: 1.5rem; }
        .btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s;
        }
        .btn:hover { background: #5a67d8; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Demo OAuth Login</h2>
        <p>This is a demo ${provider} authentication. Click continue to proceed.</p>
        <button class="btn" onclick="completeAuth()">Continue to Chat</button>
      </div>
      <script>
        function completeAuth() {
          window.opener.postMessage({
            type: '${provider.toUpperCase()}_AUTH_SUCCESS',
            payload: {
              token: '${token}',
              user: {
                _id: '${user._id}',
                name: '${user.name}',
                email: '${user.email}',
                pic: '${user.pic}'
              }
            }
          }, '${process.env.FRONTEND_URL || 'http://localhost:5173'}');
          window.close();
        }
      </script>
    </body>
    </html>
  `);
});

module.exports = {
  googleAuth,
  githubAuth,
  oauthCallback,
  mockOAuth
};