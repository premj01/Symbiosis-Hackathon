const StudyPreference = require('../model/StudyPreference');

// Create new study preference
exports.createStudyPreference = async (req, res) => {
    try {
        const { subject, duration, startDate, level } = req.body;

        // Create new study preference
        const studyPreference = await StudyPreference.create({
            subject,
            duration,
            startDate,
            level
        });

        res.status(201).json({
            status: 'success',
            data: {
                studyPreference
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get all study preferences
exports.getAllStudyPreferences = async (req, res) => {
    try {
        const studyPreferences = await StudyPreference.find();

        res.status(200).json({
            status: 'success',
            results: studyPreferences.length,
            data: {
                studyPreferences
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get single study preference
exports.getStudyPreference = async (req, res) => {
    try {
        const studyPreference = await StudyPreference.findById(req.params.id);

        if (!studyPreference) {
            return res.status(404).json({
                status: 'fail',
                message: 'Study preference not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                studyPreference
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Update study preference
exports.updateStudyPreference = async (req, res) => {
    try {
        const studyPreference = await StudyPreference.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!studyPreference) {
            return res.status(404).json({
                status: 'fail',
                message: 'Study preference not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                studyPreference
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Delete study preference
exports.deleteStudyPreference = async (req, res) => {
    try {
        const studyPreference = await StudyPreference.findByIdAndDelete(req.params.id);

        if (!studyPreference) {
            return res.status(404).json({
                status: 'fail',
                message: 'Study preference not found'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}; 