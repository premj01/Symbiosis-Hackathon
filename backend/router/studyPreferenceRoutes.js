const express = require('express');
const router = express.Router();
const studyPreferenceController = require('../controller/studyPreferenceController');

// Routes for study preferencesyou 


router
  .route('/:id')
  .get(studyPreferenceController.getStudyPreference)
  .patch(studyPreferenceController.updateStudyPreference)
  .delete(studyPreferenceController.deleteStudyPreference);

module.exports = router; 