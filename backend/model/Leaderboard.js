const mongoose = require('mongoose');

const leaderboardEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    modulesCompleted: {
        type: Number,
        default: 0
    },
    quizzesPassed: {
        type: Number,
        default: 0
    },
    streak: {
        type: Number,
        default: 0 // Consecutive days of activity
    },
    totalStudyTimeMinutes: {
        type: Number,
        default: 0
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient ranking queries
leaderboardEntrySchema.index({ subject: 1, score: -1 });
leaderboardEntrySchema.index({ subject: 1, country: 1, score: -1 });
leaderboardEntrySchema.index({ subject: 1, state: 1, score: -1 });
leaderboardEntrySchema.index({ subject: 1, city: 1, score: -1 });

const Leaderboard = mongoose.model('Leaderboard', leaderboardEntrySchema);

module.exports = Leaderboard; 