const express = require('express')
const app = express();
const { port, hostname, db } = require('./config/config')
const router = require('./router/route')
const authrouter = require('./router/router.auth')
const levelVerificationRouter = require('./router/studyPlan.router')
const session = require('express-session')
const cors = require('cors');

// database connection 
const ConnectDB = require('./config/config.db');
ConnectDB(db);

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Session middleware
app.use(session({
    secret: process.env.SECRETKEY || 'your-secret-key',
    resave: false,
    saveUninitialized: false, // Only save session when data exists
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true
    }
}));

// Routes
app.use("/auth", authrouter)
app.use("/api", levelVerificationRouter)
app.use("/", router);

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ 
        message: 'Internal server error', 
        error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message 
    });
});

// 404 handler
app.get("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(port, () => {
    console.log(`Server Started on PORT http://${hostname}:${port}`);
    console.log(`API Documentation available at http://${hostname}:${port}/api-docs`);
});