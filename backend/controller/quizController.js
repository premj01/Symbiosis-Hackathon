const Quiz = require('../model/Quiz');
const StudyPreference = require('../model/StudyPreference');
const Leaderboard = require('../model/Leaderboard');

// Helper function to generate quiz questions using AI
const generateQuizQuestions = async (subject, moduleTitle, difficulty) => {
    // In production, this would call an AI API (GPT/Gemini)
    // For now, we'll create mock questions
    
    const questions = [];
    const numberOfQuestions = 5;
    
    for (let i = 0; i < numberOfQuestions; i++) {
        questions.push({
            question: `Question ${i+1} about ${moduleTitle} in ${subject}?`,
            options: [
                { text: 'Option 1', isCorrect: i % 4 === 0 },
                { text: 'Option 2', isCorrect: i % 4 === 1 },
                { text: 'Option 3', isCorrect: i % 4 === 2 },
                { text: 'Option 4', isCorrect: i % 4 === 3 }
            ],
            explanation: `Explanation for question ${i+1} about ${moduleTitle}`,
            difficulty: difficulty
        });
    }
    
    return questions;
};

// Create a new quiz for a module
exports.createQuiz = async (req, res) => {
    try {
        const { moduleId, subject, difficulty = 'medium' } = req.body;
        
        // Get the module information
        const studyPreference = await StudyPreference.findOne(
            { 'studyPlan.modules._id': moduleId }
        );
        
        if (!studyPreference) {
            return res.status(404).json({
                status: 'fail',
                message: 'Module not found'
            });
        }
        
        // Find the specific module
        const module = studyPreference.studyPlan.modules.id(moduleId);
        
        // Generate quiz questions
        const questions = await generateQuizQuestions(
            subject,
            module.title,
            difficulty
        );
        
        // Create the quiz
        const quiz = await Quiz.create({
            title: `Quiz for ${module.title}`,
            moduleId,
            subject,
            questions,
            timeLimit: 15, // Default 15 minutes
            isAIGenerated: true
        });
        
        // Update the module with the quiz reference
        module.quizId = quiz._id;
        await studyPreference.save();
        
        res.status(201).json({
            status: 'success',
            data: {
                quiz
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get a quiz by ID
exports.getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({
                status: 'fail',
                message: 'Quiz not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                quiz
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Submit quiz answers and get results
exports.submitQuiz = async (req, res) => {
    try {
        const { quizId, answers, userId } = req.body;
        
        // Get the quiz
        const quiz = await Quiz.findById(quizId);
        
        if (!quiz) {
            return res.status(404).json({
                status: 'fail',
                message: 'Quiz not found'
            });
        }
        
        // Calculate score
        let score = 0;
        const maxScore = quiz.questions.length;
        
        answers.forEach((answer, index) => {
            if (index < quiz.questions.length) {
                const correctOption = quiz.questions[index].options.findIndex(opt => opt.isCorrect);
                if (answer === correctOption) {
                    score++;
                }
            }
        });
        
        // Update study preference with quiz result
        const studyPreference = await StudyPreference.findOne({
            'studyPlan.modules.quizId': quizId
        });
        
        if (studyPreference) {
            // Add quiz result
            studyPreference.quizResults.push({
                quizId,
                score,
                maxScore,
                completedAt: new Date()
            });
            
            // If score is good enough, mark module as completed (e.g., > 70%)
            const passingScore = maxScore * 0.7;
            if (score >= passingScore) {
                const module = studyPreference.studyPlan.modules.find(
                    m => m.quizId && m.quizId.toString() === quizId
                );
                
                if (module) {
                    module.completed = true;
                }
                
                // Update leaderboard
                await Leaderboard.findOneAndUpdate(
                    { userId, subject: studyPreference.subject },
                    {
                        $set: { lastActive: new Date() },
                        $inc: {
                            quizzesPassed: 1,
                            score: 20, // Bonus for passing quiz
                            streak: 1
                        }
                    }
                );
            }
            
            // Calculate overall progress
            const totalModules = studyPreference.studyPlan.modules.length;
            const completedModules = studyPreference.studyPlan.modules.filter(m => m.completed).length;
            studyPreference.studyPlan.progress = (completedModules / totalModules) * 100;
            
            await studyPreference.save();
        }
        
        // Return the results
        res.status(200).json({
            status: 'success',
            data: {
                score,
                maxScore,
                percentage: (score / maxScore) * 100,
                passed: score >= maxScore * 0.7,
                feedback: score >= maxScore * 0.7 
                    ? "Great job! You've passed the quiz!" 
                    : "You didn't pass this time. Review the material and try again!"
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}; 