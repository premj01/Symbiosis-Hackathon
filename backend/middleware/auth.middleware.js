// Authentication middleware
const verifyUser = (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required", status: false });
        }

        // Simple email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format", status: false });
        }

        // Attach email to request object for use in other middlewares
        req.userEmail = email;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ 
            message: 'Authentication failed', 
            error: error.message 
        });
    }
};

module.exports = {
    verifyUser
}; 