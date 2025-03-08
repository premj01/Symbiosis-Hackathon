const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    }
});

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [optionSchema],
    explanation: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudyPreference',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    questions: [questionSchema],
    timeLimit: {
        type: Number, // in minutes
        default: 15
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAIGenerated: {
        type: Boolean,
        default: true
    }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz; 