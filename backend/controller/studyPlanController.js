const { generateStudyPlan } = require('../utils/gemini2');

/**
 * Generate a study plan based on user input
 * @route POST /api/study/plan/generate
 */
exports.generatePlan = async (req, res) => {
    try {
        const { email, lang, level, weeks, startDate } = req.body;
        
        // Validate required fields
        if (!email || !lang || !level || !weeks || !startDate) {
            return res.status(400).json({
                status: 'fail',
                message: 'Missing required fields. Please provide email, lang, level, weeks, and startDate.'
            });
        }
        
        // Validate numeric fields
        if (isNaN(parseInt(weeks)) || parseInt(weeks) <= 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Weeks must be a positive number.'
            });
        }
        
        // Generate the study plan
        const studyPlan = generateStudyPlan({
            email,
            lang,
            level,
            weeks: parseInt(weeks),
            startDate
        });
        
        // Return the generated plan
        res.status(200).json({
            status: 'success',
            data: studyPlan
        });
    } catch (error) {
        console.error('Error generating study plan:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to generate study plan.'
        });
    }
}; 