const express = require("express");
const dotenv = require("dotenv");
const data = require("./data/data");
const connectToMongoDb = require("./connection/connection");
const userRoutes = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
// const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const User = require("./models/userModel");

const app = express();

dotenv.config();
const PORT = process.env.PORT || 8000;

// ====================middleware==================
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both common dev ports
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Simple middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('API is running');
});

//========== connection ============
connectToMongoDb();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRouter);
app.use("/api/messages", messageRouter);

const server = app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Store online users with their socket IDs and heartbeat info
const onlineUsers = new Map();
const userHeartbeats = new Map();

// Heartbeat interval - check every 30 seconds
const HEARTBEAT_INTERVAL = 30000;
const HEARTBEAT_TIMEOUT = 60000; // Consider offline after 60 seconds

// Function to check and update offline users
const checkOfflineUsers = async () => {
  const now = Date.now();
  
  for (const [userId, lastHeartbeat] of userHeartbeats.entries()) {
    if (now - lastHeartbeat > HEARTBEAT_TIMEOUT) {
      try {
        const user = await User.findById(userId);
        if (user && user.isOnline) {
          user.isOnline = false;
          user.lastSeen = new Date();
          await user.save();
          
          onlineUsers.delete(userId);
          userHeartbeats.delete(userId);
          
          io.emit("user_status_change", {
            userId,
            isOnline: false,
            lastSeen: user.lastSeen
          });
          
          console.log(`User ${userId} marked offline due to timeout`);
        }
      } catch (error) {
        console.error("Error marking user offline:", error);
      }
    }
  }
};

// Run heartbeat check periodically
setInterval(checkOfflineUsers, HEARTBEAT_INTERVAL);

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);
  
  socket.on("setup", async (userData) => {
    if (!userData?._id) {
      console.log("No user ID provided in setup");
      return;
    }

    try {
      // Store user ID on socket for later reference
      socket.userId = userData._id;
      
      // Join user's personal room
      socket.join(userData._id);
      console.log(`User ${userData._id} connected with socket ${socket.id}`);

      // Update user's online status in DB
      const user = await User.findById(userData._id);
      if (user) {
        user.isOnline = true;
        user.lastSeen = new Date();
        await user.save();

        // Store socket ID and heartbeat for this user
        onlineUsers.set(userData._id, socket.id);
        userHeartbeats.set(userData._id, Date.now());

        // Broadcast online status to all connected clients
        io.emit("user_status_change", {
          userId: userData._id,
          isOnline: true,
          lastSeen: user.lastSeen
        });
        
        // Send initial online users list to the newly connected user
        const allOnlineUsers = Array.from(onlineUsers.keys());
        socket.emit("online_users_list", allOnlineUsers);
      }
    } catch (error) {
      console.error("Error in setup:", error);
    }
  });
  
  // Handle heartbeat from client
  socket.on("heartbeat", (userId) => {
    if (userId && onlineUsers.has(userId)) {
      userHeartbeats.set(userId, Date.now());
    }
  });

  socket.on("join chat", (room) => {
    if (!room) return;
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("typing", (room) => {
    if (!room) return;
    socket.to(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    if (!room) return;
    socket.to(room).emit("stop typing");
  });

  socket.on("new_message", (newMessageReceived) => {
    if (!newMessageReceived?.chatId?.users) return;

    const chat = newMessageReceived.chatId;
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      
      // Emit to specific user's room
      io.to(user._id).emit("message_received", newMessageReceived);
    });
  });

  socket.on("logout", async (userId) => {
    if (!userId) return;

    try {
      const user = await User.findById(userId);
      if (user) {
        user.isOnline = false;
        user.lastSeen = new Date();
        await user.save();

        // Remove from online users and heartbeat tracking
        onlineUsers.delete(userId);
        userHeartbeats.delete(userId);

        // Broadcast offline status
        io.emit("user_status_change", {
          userId,
          isOnline: false,
          lastSeen: user.lastSeen
        });
        
        console.log(`User ${userId} logged out and marked offline`);
      }
    } catch (error) {
      console.error("Error in logout:", error);
    }
  });

  socket.on("disconnect", async () => {
    console.log("Socket disconnected:", socket.id);
    
    // Use the userId stored on the socket
    const userId = socket.userId;
    
    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.isOnline = false;
          user.lastSeen = new Date();
          await user.save();

          // Remove from online users and heartbeat tracking
          onlineUsers.delete(userId);
          userHeartbeats.delete(userId);

          // Broadcast offline status
          io.emit("user_status_change", {
            userId,
            isOnline: false,
            lastSeen: user.lastSeen
          });
          
          console.log(`User ${userId} disconnected and marked offline`);
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    }
  });
});
