const Leaderboard = require('../model/Leaderboard');

// Get global leaderboard for a subject
exports.getGlobalLeaderboard = async (req, res) => {
    try {
        const { subject } = req.params;
        const { limit = 10 } = req.query;
        
        const leaderboard = await Leaderboard.find({ subject })
            .sort({ score: -1 })
            .limit(parseInt(limit))
            .select('username score modulesCompleted quizzesPassed streak totalStudyTimeMinutes country');
        
        res.status(200).json({
            status: 'success',
            results: leaderboard.length,
            data: {
                leaderboard
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get country leaderboard for a subject
exports.getCountryLeaderboard = async (req, res) => {
    try {
        const { subject, country } = req.params;
        const { limit = 10 } = req.query;
        
        const leaderboard = await Leaderboard.find({ subject, country })
            .sort({ score: -1 })
            .limit(parseInt(limit))
            .select('username score modulesCompleted quizzesPassed streak totalStudyTimeMinutes state city');
        
        res.status(200).json({
            status: 'success',
            results: leaderboard.length,
            data: {
                leaderboard
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get state leaderboard for a subject
exports.getStateLeaderboard = async (req, res) => {
    try {
        const { subject, country, state } = req.params;
        const { limit = 10 } = req.query;
        
        const leaderboard = await Leaderboard.find({ subject, country, state })
            .sort({ score: -1 })
            .limit(parseInt(limit))
            .select('username score modulesCompleted quizzesPassed streak totalStudyTimeMinutes city');
        
        res.status(200).json({
            status: 'success',
            results: leaderboard.length,
            data: {
                leaderboard
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get city leaderboard for a subject
exports.getCityLeaderboard = async (req, res) => {
    try {
        const { subject, country, state, city } = req.params;
        const { limit = 10 } = req.query;
        
        const leaderboard = await Leaderboard.find({ subject, country, state, city })
            .sort({ score: -1 })
            .limit(parseInt(limit))
            .select('username score modulesCompleted quizzesPassed streak totalStudyTimeMinutes');
        
        res.status(200).json({
            status: 'success',
            results: leaderboard.length,
            data: {
                leaderboard
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get a user's ranking
exports.getUserRanking = async (req, res) => {
    try {
        const { userId, subject } = req.params;
        
        // Get the user's entry
        const userEntry = await Leaderboard.findOne({ userId, subject });
        
        if (!userEntry) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found in leaderboard'
            });
        }
        
        // Count how many users have a higher score
        const higherScores = await Leaderboard.countDocuments({
            subject,
            score: { $gt: userEntry.score }
        });
        
        // User's rank is position + 1
        const rank = higherScores + 1;
        
        res.status(200).json({
            status: 'success',
            data: {
                rank,
                score: userEntry.score,
                modulesCompleted: userEntry.modulesCompleted,
                quizzesPassed: userEntry.quizzesPassed,
                streak: userEntry.streak,
                totalStudyTimeMinutes: userEntry.totalStudyTimeMinutes
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}; 