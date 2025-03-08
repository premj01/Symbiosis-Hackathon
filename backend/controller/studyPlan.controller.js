const LevelVerification = require('../model/studyPlan.model');
const { 
    generateLevelVerificationQuestions, 
    evaluateLevelVerification
} = require('../utils/gemini');

// Validate level verification input
const validateLevelInput = (data) => {
    const errors = {};
    const { lang, level, email } = data;

    if (!lang) errors.lang = 'Programming language is required';
    if (!email) errors.email = 'Email is required';
    
    if (!['base', 'intermediate', 'advance'].includes(level)) {
        errors.level = 'Level must be base, intermediate, or advance';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Get level verification questions
exports.getLevelVerificationQuestions = async (req, res) => {
    try {
        const validation = validateLevelInput(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ errors: validation.errors });
        }

        const { lang, level, email } = req.body;

        // For base level, no verification needed
        if (level === 'base') {
            // Save base level verification directly
            try {
                const baseVerification = new LevelVerification({
                    lang,
                    level,
                    email,
                    verificationResults: {
                        score: 100,
                        earnedPoints: 10,
                        totalPoints: 10,
                        levelRecommendation: 'maintain',
                        conceptResults: [{
                            concept: 'Base Level Knowledge',
                            understood: true
                        }],
                        feedback: 'Base level selected - no verification required'
                    }
                });
                await baseVerification.save();
            } catch (dbError) {
                console.error('Error saving base level verification:', dbError);
            }

            return res.status(200).json({
                message: 'Base level selected - no verification required',
                requiresVerification: false
            });
        }

        // Generate verification questions for intermediate and advance levels
        const verificationQuestions = await generateLevelVerificationQuestions(lang, level);
        
        // Store verification data in session with email as key
        req.session[email] = { 
            lang, 
            level,
            email,
            questions: verificationQuestions
        };

        return res.status(200).json({
            message: 'Level verification questions generated',
            requiresVerification: true,
            verificationQuestions,
            email: email
        });

    } catch (error) {
        console.error('Error in getLevelVerificationQuestions:', error);
        res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message 
        });
    }
};

// Submit level verification answers
exports.submitLevelVerification = async (req, res) => {
    try {
        const { answers, email } = req.body;

        if (!answers || !email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Get verification data using email
        const verificationData = req.session[email];
        
        if (!verificationData || !verificationData.questions) {
            return res.status(400).json({ 
                message: 'No verification questions found for this email. Please get questions first.' 
            });
        }

        // Evaluate verification answers
        const verificationResults = await evaluateLevelVerification(answers, verificationData.questions);

        // Save verification results
        try {
            const levelVerification = new LevelVerification({
                lang: verificationData.lang,
                level: verificationData.level,
                email: email,
                verificationResults: {
                    score: verificationResults.score,
                    earnedPoints: verificationResults.earnedPoints,
                    totalPoints: verificationResults.totalPoints,
                    levelRecommendation: verificationResults.levelRecommendation,
                    conceptResults: verificationResults.conceptResults.map(cr => ({
                        concept: cr.concept,
                        understood: cr.understood
                    })),
                    feedback: verificationResults.feedback
                }
            });

            await levelVerification.save();
            console.log('Verification results saved successfully');
        } catch (dbError) {
            console.error('Error saving verification results:', dbError);
            return res.status(500).json({ 
                message: 'Failed to save verification results', 
                error: dbError.message 
            });
        }

        // Clear session data for this email
        delete req.session[email];

        res.status(200).json({
            message: 'Level verification completed',
            verificationResults,
            recommendedAction: verificationResults.levelRecommendation,
            currentLevel: verificationData.level
        });

    } catch (error) {
        console.error('Error in submitLevelVerification:', error);
        res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message 
        });
    }
}; 