const mongoose = require('mongoose');
const { db } = require('../config/config')

const ConnectDB = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(db, options);
        console.log("Connected to MongoDB successfully");

        // Handle connection errors after initial connection
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit if unable to connect to database
    }
}

module.exports = ConnectDB;