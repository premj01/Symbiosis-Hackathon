const mongoose = require('mongoose');

const studyPreferenceSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    lang: {
        type: String,
        required: [true, 'Programming language is required'],
        trim: true
    },
    level: {
        type: String,
        required: [true, 'Level is required'],
        enum: ['base', 'intermediate', 'advance'],
        trim: true
    },
    weeks: {
        type: Number,
        required: [true, 'Number of weeks is required'],
        min: [1, 'Duration must be at least 1 week'],
        max: [52, 'Duration cannot exceed 52 weeks']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: function(value) {
                return value >= new Date();
            },
            message: 'Start date must be in the future'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Update lastUpdated timestamp before saving
studyPreferenceSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

const StudyPreference = mongoose.model('StudyPreference', studyPreferenceSchema);

module.exports = StudyPreference; 