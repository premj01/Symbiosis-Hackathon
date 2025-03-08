const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini API with improved error handling
const initializeGeminiAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
        console.error('Warning: GEMINI_API_KEY is not properly set in environment variables');
        // Instead of throwing an error, we'll return null and handle it gracefully
        return null;
    }
    try {
        return new GoogleGenerativeAI(apiKey);
    } catch (error) {
        console.error('Error initializing Gemini AI:', error);
        return null;
    }
};

const genAI = initializeGeminiAI();

// Generate level verification questions
async function generateLevelVerificationQuestions(lang, level) {
    try {
        // Check if genAI is properly initialized
        if (!genAI) {
            // Return mock data for testing when API is not available
            console.warn('Using mock data for level verification questions as Gemini API is not available');
            return getMockVerificationQuestions(lang, level);
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Generate 3 multiple choice questions to verify if a user truly has ${level} level knowledge in ${lang} programming.
            The questions should specifically test ${level} level concepts.
            Format the response as a JSON array with each question having:
            {
                "question": "detailed question testing ${level} concepts",
                "options": ["option1", "option2", "option3", "option4"],
                "correctAnswer": "correct option",
                "points": 10,
                "conceptTested": "specific concept being tested"
            }
            Make questions progressively harder to truly verify ${level} knowledge.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // Fix: Properly extract and parse the JSON from the text response
        const text = response.text();
        
        // Extract JSON from the text (handling potential markdown code blocks)
        let jsonText = text;
        if (text.includes('```json')) {
            jsonText = text.split('```json')[1].split('```')[0].trim();
        } else if (text.includes('```')) {
            jsonText = text.split('```')[1].split('```')[0].trim();
        }
        
        try {
            const parsedResponse = JSON.parse(jsonText);
            
            if (!Array.isArray(parsedResponse) || parsedResponse.length !== 3) {
                throw new Error('Invalid question format from API');
            }

            return parsedResponse;
        } catch (jsonError) {
            console.error('JSON parsing error:', jsonError, 'Raw text:', text);
            // Return mock data if parsing fails
            return getMockVerificationQuestions(lang, level);
        }
    } catch (error) {
        console.error('Error generating verification questions:', error);
        // Return mock data if API call fails
        return getMockVerificationQuestions(lang, level);
    }
}

// Evaluate level verification answers and provide recommendation
async function evaluateLevelVerification(answers, questions) {
    try {
        const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
        let earnedPoints = 0;
        const conceptResults = [];

        // Calculate points and analyze each answer
        questions.forEach((question, index) => {
            const isCorrect = answers[index] === question.correctAnswer;
            if (isCorrect) earnedPoints += question.points;
            
            conceptResults.push({
                concept: question.conceptTested,
                understood: isCorrect
            });
        });

        const percentageScore = (earnedPoints / totalPoints) * 100;
        
        // Determine level recommendation
        let levelRecommendation;
        if (percentageScore >= 70) {
            levelRecommendation = "maintain"; // Stay at current level
        } else if (percentageScore >= 40) {
            levelRecommendation = "review"; // Review concepts before proceeding
        } else {
            levelRecommendation = "lower"; // Consider lower level
        }

        return {
            score: percentageScore,
            earnedPoints,
            totalPoints,
            levelRecommendation,
            conceptResults,
            feedback: generateFeedback(percentageScore, conceptResults)
        };
    } catch (error) {
        console.error('Error evaluating verification:', error);
        throw new Error('Failed to evaluate level verification');
    }
}

// Helper function to generate feedback
function generateFeedback(score, conceptResults) {
    let feedback = "";
    
    if (score >= 70) {
        feedback = "Excellent! You've demonstrated strong knowledge at this level. ";
    } else if (score >= 40) {
        feedback = "You show potential but might need to review some concepts. ";
    } else {
        feedback = "Consider starting with a lower level to build a stronger foundation. ";
    }

    // Add concept-specific feedback
    const needsWork = conceptResults.filter(r => !r.understood)
        .map(r => r.concept)
        .join(", ");

    if (needsWork) {
        feedback += `Areas to focus on: ${needsWork}`;
    }

    return feedback;
}

// Mock data for testing when API is not available
function getMockVerificationQuestions(lang, level) {
    console.log(`Generating mock ${level} questions for ${lang}`);
    
    if (lang === 'JavaScript') {
        if (level === 'intermediate') {
            return [
                {
                    "question": "What is the output of the following code: console.log(typeof null);",
                    "options": ["null", "undefined", "object", "number"],
                    "correctAnswer": "object",
                    "points": 10,
                    "conceptTested": "JavaScript type system"
                },
                {
                    "question": "Which method is used to create a new array with the results of calling a provided function on every element in the array?",
                    "options": ["forEach()", "map()", "filter()", "reduce()"],
                    "correctAnswer": "map()",
                    "points": 10,
                    "conceptTested": "Array methods"
                },
                {
                    "question": "What is a closure in JavaScript?",
                    "options": [
                        "A function that has access to variables in its outer scope",
                        "A way to close a browser window",
                        "A method to terminate a function execution",
                        "A design pattern for object creation"
                    ],
                    "correctAnswer": "A function that has access to variables in its outer scope",
                    "points": 10,
                    "conceptTested": "Closures"
                }
            ];
        } else if (level === 'advance') {
            return [
                {
                    "question": "What is the difference between 'let', 'const', and 'var' in JavaScript?",
                    "options": [
                        "They are all identical in functionality",
                        "'let' and 'const' are block-scoped, while 'var' is function-scoped",
                        "'var' is block-scoped, while 'let' and 'const' are function-scoped",
                        "'const' can be reassigned, while 'let' and 'var' cannot"
                    ],
                    "correctAnswer": "'let' and 'const' are block-scoped, while 'var' is function-scoped",
                    "points": 10,
                    "conceptTested": "Variable declarations"
                },
                {
                    "question": "What is the purpose of the 'Symbol' type in JavaScript?",
                    "options": [
                        "To create unique identifiers",
                        "To represent mathematical symbols",
                        "To encrypt data",
                        "To format text with special characters"
                    ],
                    "correctAnswer": "To create unique identifiers",
                    "points": 10,
                    "conceptTested": "Symbol type"
                },
                {
                    "question": "What is the output of: Promise.resolve(1).then(() => 2).then(console.log)?",
                    "options": ["1", "2", "undefined", "Error"],
                    "correctAnswer": "2",
                    "points": 10,
                    "conceptTested": "Promises"
                }
            ];
        }
    }
    
    // Default mock questions for any language/level
    return [
        {
            "question": `What is a key feature of ${level} ${lang} programming?`,
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option C",
            "points": 10,
            "conceptTested": `${level} ${lang} concepts`
        },
        {
            "question": `How do you implement error handling in ${lang}?`,
            "options": ["Method 1", "Method 2", "Method 3", "Method 4"],
            "correctAnswer": "Method 2",
            "points": 10,
            "conceptTested": "Error handling"
        },
        {
            "question": `What is the best practice for code organization in ${lang}?`,
            "options": ["Approach 1", "Approach 2", "Approach 3", "Approach 4"],
            "correctAnswer": "Approach 3",
            "points": 10,
            "conceptTested": "Code organization"
        }
    ];
}

module.exports = {
    generateLevelVerificationQuestions,
    evaluateLevelVerification
}; 