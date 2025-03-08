const StudyPreference = require('../model/StudyPreference');
const Quiz = require('../model/Quiz');
const Leaderboard = require('../model/Leaderboard');
// We'd need to create a utility for AI integration
// const aiService = require('../utils/aiService');

// Helper function to generate a study plan using AI
const generateStudyPlan = async (subject, duration, level, dailyStudyTime, learningGoal) => {
    // For now, we'll create a mock study plan
    // In production, this would call an AI API (GPT/Gemini)
    
    const weeklyModules = [];
    const totalWeeks = duration;
    const modulesPerWeek = 3; // Average number of modules per week
    
    const startDate = new Date();
    let currentDate = new Date(startDate);
    
    // Generate mock modules for the study plan
    for (let week = 0; week < totalWeeks; week++) {
        for (let i = 0; i < modulesPerWeek; i++) {
            const moduleStartDate = new Date(currentDate);
            
            // Each module takes 2 days
            currentDate.setDate(currentDate.getDate() + 2);
            const moduleEndDate = new Date(currentDate);
            
            weeklyModules.push({
                title: `${subject} Module ${week * modulesPerWeek + i + 1}`,
                description: `Learning concepts of ${subject} for ${level} level students`,
                startDate: moduleStartDate,
                endDate: moduleEndDate,
                completed: false,
                resources: [
                    {
                        title: 'Introduction to the topic',
                        url: 'https://example.com/resource1',
                        type: 'article'
                    },
                    {
                        title: 'Video explanation',
                        url: 'https://example.com/resource2',
                        type: 'video'
                    }
                ]
            });
        }
    }
    
    return {
        title: `${duration}-Week ${subject} Study Plan (${level})`,
        description: `A comprehensive study plan for ${subject} designed for ${level} students over ${duration} weeks with ${dailyStudyTime} minutes of daily study time. Focus: ${learningGoal}.`,
        modules: weeklyModules,
        progress: 0
    };
};

// Create new study preference with AI-generated plan
exports.createStudyPreference = async (req, res) => {
    try {
        const { 
            subject, 
            duration, 
            startDate, 
            level, 
            dailyStudyTime = 60,
            learningGoal = 'both',
            userId // This would come from authentication in a real app
        } = req.body;

        // Generate a study plan based on preferences
        const studyPlan = await generateStudyPlan(
            subject, 
            duration, 
            level, 
            dailyStudyTime,
            learningGoal
        );
        
        // Create new study preference with the generated plan
        const studyPreference = await StudyPreference.create({
            subject,
            duration,
            startDate,
            level,
            dailyStudyTime,
            learningGoal,
            userId: userId || '507f1f77bcf86cd799439011', // Dummy ID for testing
            studyPlan
        });

        // Initialize user in leaderboard if not already present
        await Leaderboard.findOneAndUpdate(
            { 
                userId: studyPreference.userId,
                subject: subject
            },
            {
                $setOnInsert: {
                    username: 'User', // Would come from user profile in real app
                    subject: subject,
                    country: 'Unknown', // Would come from user profile
                    state: 'Unknown',
                    city: 'Unknown'
                }
            },
            {
                upsert: true,
                new: true
            }
        );

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

// Update study preference and plan
exports.updateStudyPreference = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // If trying to update the study plan directly
        if (updates.studyPlan) {
            // Calculate progress based on completed modules
            if (updates.studyPlan.modules) {
                const totalModules = updates.studyPlan.modules.length;
                const completedModules = updates.studyPlan.modules.filter(module => module.completed).length;
                updates.studyPlan.progress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
                
                // Update leaderboard if modules were completed
                if (completedModules > 0) {
                    const studyPref = await StudyPreference.findById(id);
                    
                    if (studyPref) {
                        await Leaderboard.findOneAndUpdate(
                            { userId: studyPref.userId, subject: studyPref.subject },
                            { 
                                $set: { lastActive: new Date() },
                                $inc: { 
                                    modulesCompleted: completedModules,
                                    score: completedModules * 10 // Simple scoring
                                }
                            }
                        );
                    }
                }
            }
        }
        
        // Find and update the study preference
        const studyPreference = await StudyPreference.findByIdAndUpdate(
            id,
            updates,
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