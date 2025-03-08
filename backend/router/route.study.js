const express = require('express');
const router = express.Router();
const studyPreferenceController = require('../controller/studyPreferenceController');
const quizController = require('../controller/quizController');
const leaderboardController = require('../controller/leaderboardController');

// Study Preference Routes
router.post('/preference', studyPreferenceController.createStudyPreference);
router.patch('/preference/:id', studyPreferenceController.updateStudyPreference);

// Quiz Routes
router.post('/quiz', quizController.createQuiz);
router.get('/quiz/:id', quizController.getQuiz);
router.post('/quiz/submit', quizController.submitQuiz);

// Leaderboard Routes
router.get('/leaderboard/:subject', leaderboardController.getGlobalLeaderboard);
router.get('/leaderboard/:subject/country/:country', leaderboardController.getCountryLeaderboard);
router.get('/leaderboard/:subject/country/:country/state/:state', leaderboardController.getStateLeaderboard);
router.get('/leaderboard/:subject/country/:country/state/:state/city/:city', leaderboardController.getCityLeaderboard);
router.get('/leaderboard/:subject/user/:userId', leaderboardController.getUserRanking);

module.exports = router;