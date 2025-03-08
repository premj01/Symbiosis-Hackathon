const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    resources: [{
        title: String,
        url: String,
        type: String // video, article, practice, etc.
    }],
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }
});

const studyPlanSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    modules: [moduleSchema],
    progress: {
        type: Number,
        default: 0 // Percentage of completion
    }
});

const studyPreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
    dailyStudyTime: {
        type: Number, // in minutes
        default: 60
    },
    learningGoal: {
        type: String,
        enum: ['academic', 'practical', 'both'],
        default: 'both'
    },
    studyPlan: studyPlanSchema,
    quizResults: [{
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },
        score: Number,
        maxScore: Number,
        completedAt: Date
    }],
    createdAt: {
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