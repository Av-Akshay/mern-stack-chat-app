const mongoose = require("mongoose");

const connectToMongoDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb is connected : ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error in mongodb connection: ${error}`);
    process.exit();
  }
};

module.exports = connectToMongoDb;
