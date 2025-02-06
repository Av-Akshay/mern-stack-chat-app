const express = require("express");
const dotenv = require("dotenv");
const data = require("./data/data");
const connectToMongoDb = require("./connection/connection");
const userRoutes = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
// const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");

const app = express();

dotenv.config();
const PORT = process.env.PORT || 8000;

// ====================middleware==================
app.use(cors());
app.use(express.json());
// app.use(notFound);
// app.use(errorHandler);

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
    origin: "*",
  },
});

io.on("connection", (socket) => {
  
  socket.on("setup", (userData) => {
    socket.join(userData?._id);
    console.log(`user connected:- ${userData?._id}`);
    
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`user joined room: ${room}`);
  });

  socket.on("new_message", (newMessageReceived) => {
    
    let chat = newMessageReceived?.chatId;
    
    if (!chat.users) return;
    
    chat?.users?.forEach((user) => {
      if (user._id == newMessageReceived?.sender?._id) {
        return;
      } else {
        
        console.log(newMessageReceived);
        io.to(user._id).emit("message_received", newMessageReceived);
      }
    });
  });
});
