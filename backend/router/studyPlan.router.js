const express = require('express');
const router = express.Router();
const { 
    getLevelVerificationQuestions, 
    submitLevelVerification 
} = require('../controller/studyPlan.controller');
const { verifyUser } = require('../middleware/auth.middleware');

// Level verification routes
router.post('/verify-level/questions', verifyUser, getLevelVerificationQuestions);
router.post('/verify-level/submit', verifyUser, submitLevelVerification);

module.exports = router; 