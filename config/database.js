const mongoose = require('mongoose');
const config = require('./config');

async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("MongoDB connected Successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
