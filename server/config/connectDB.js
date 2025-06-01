const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
