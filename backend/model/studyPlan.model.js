const mongoose = require('mongoose');

const conceptResultSchema = new mongoose.Schema({
    concept: {
        type: String,
        required: true
    },
    understood: {
        type: Boolean,
        required: true
    }
});

const verificationResultSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    earnedPoints: {
        type: Number,
        required: true,
        min: 0
    },
    totalPoints: {
        type: Number,
        required: true,
        min: 0
    },
    levelRecommendation: {
        type: String,
        required: true,
        enum: ['maintain', 'review', 'lower']
    },
    conceptResults: [conceptResultSchema],
    feedback: {
        type: String,
        required: true
    }
});

const levelVerificationSchema = new mongoose.Schema({
    lang: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: String,
        required: true,
        enum: ['base', 'intermediate', 'advance']
    },
    verificationResults: {
        type: verificationResultSchema,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add indexes for better query performance
levelVerificationSchema.index({ email: 1, createdAt: -1 });
levelVerificationSchema.index({ lang: 1, level: 1 });

module.exports = mongoose.model('LevelVerification', levelVerificationSchema); 