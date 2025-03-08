const mongoose = require('mongoose');

const studyPreferenceSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'Subject name is required'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration in weeks is required'],
        min: [1, 'Duration must be at least 1 week']
    },
    startDate: {
        type: String,
        required: [true, 'Start date is required']
    },
    level: {
        type: String,
        required: [true, 'Proficiency level is required'],
        enum: ['beginner', 'intermediate', 'expert'],
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const StudyPreference = mongoose.model('StudyPreference', studyPreferenceSchema);

module.exports = StudyPreference; 