const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/amar-note', {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`MongoDB not found. Running in Mock Mode (In-Memory).`);
        console.warn(`Error: ${error.message}`);
        // We will handle data persistence in memory/files later if needed
    }
};

module.exports = connectDB;
