const express = require("express");
const dotenv = require("dotenv");
const data = require("./data/data");
const connectToMongoDb = require("./connection/connection");
const userRoutes = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
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

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
