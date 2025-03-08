const express = require('express');
const router = express.Router();
const {
  getLevelVerificationQuestions,
  submitLevelVerification
} = require('../controller/studyPlan.controller');
const { verifyUser } = require('../middleware/auth.middleware');
const studyPreferenceController = require('../controller/studyPreferenceController');

// Level verification routes
router.post('/preferences', verifyUser, studyPreferenceController.createStudyPreference);
router.post('/verify-level/questions', verifyUser, getLevelVerificationQuestions);
router.post('/verify-level/submit', verifyUser, submitLevelVerification);

module.exports = router; 