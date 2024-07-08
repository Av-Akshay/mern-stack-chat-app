const express = require("express");
const dotenv = require("dotenv");
const data = require("./data/data");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;

app.get("/api/chats", (req, res) => {
  return res.json({ data });
});

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
