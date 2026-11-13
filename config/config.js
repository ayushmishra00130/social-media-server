const path = require("path");
const dotenv = require("dotenv");

// Load .env relative to server root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

const config = {
    MONGO_URI: process.env.MONGO_URI
};

module.exports = config;
