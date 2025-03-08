const express = require('express');
const router = express.Router();
const studyPreferenceController = require('../controller/studyPreferenceController');

// Routes for study preferences
router.get('/', studyPreferenceController.getAllStudyPreferences);
router.post('/', studyPreferenceController.createStudyPreference);
router.get('/:id', studyPreferenceController.getStudyPreference);
router.patch('/:id', studyPreferenceController.updateStudyPreference);
router.delete('/:id', studyPreferenceController.deleteStudyPreference);

module.exports = router; 