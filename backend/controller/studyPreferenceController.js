const StudyPreference = require('../model/StudyPreference');

// Create new study preference
exports.createStudyPreference = async (req, res) => {
    try {
        const { email, lang, level, weeks, startDate } = req.body;

        // Validate required fields
        if (!email || !lang || !level || !weeks || !startDate) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email, programming language, level, weeks, and start date are required'
            });
        }

        // Validate start date
        const startDateObj = new Date(startDate);
        if (isNaN(startDateObj.getTime())) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid start date format. Please use YYYY-MM-DD format'
            });
        }

        // Create new study preference
        const studyPreference = await StudyPreference.create({
            email,
            lang,
            level,
            weeks,
            startDate: startDateObj
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
        const { email } = req.query;
        let query = {};
        
        // If email is provided, filter by email
        if (email) {
            query.email = email.toLowerCase();
        }

        const studyPreferences = await StudyPreference.find(query)
            .sort({ startDate: 1 }); // Sort by start date ascending

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
        const updates = req.body;
        
        // Prevent email modification
        if (updates.email) {
            delete updates.email;
        }

        // Validate start date if provided
        if (updates.startDate) {
            const startDateObj = new Date(updates.startDate);
            if (isNaN(startDateObj.getTime())) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Invalid start date format. Please use YYYY-MM-DD format'
                });
            }
            updates.startDate = startDateObj;
        }

        const studyPreference = await StudyPreference.findByIdAndUpdate(
            req.params.id,
            { 
                ...updates,
                lastUpdated: new Date() 
            },
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