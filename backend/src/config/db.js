const mongoose = require("mongoose");

const uri = process.env.MONGO_URL;
async function connectToDB() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB :",uri);
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

module.exports = connectToDB;
