const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyBQYihomr3HOCTt9TP70Rns5HqziTOHoAk");

// Generate level verification questions
async function generateLevelVerificationQuestions(lang, level) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate 3 technical multiple choice questions to verify ${level} level knowledge in ${lang} programming.

The response must be a JSON array containing exactly 3 questions with this structure:
{
  "question": "A detailed technical question about ${lang} programming",
  "options": ["Four", "Different", "Technical", "Options"],
  "correctAnswer": "One of the exact options",
  "points": 10,
  "conceptTested": "Specific ${lang} concept being tested"
}

Requirements:
1. Questions must be specific to ${level} level ${lang} programming
2. Questions should test different concepts and increase in difficulty
3. All options must be technically accurate and realistic
4. The correctAnswer must exactly match one of the options
5. Each question must test a different core ${lang} concept
6. Options should be detailed and specific, not generic like "Option A" or "Method 1"
7. conceptTested should name the specific programming concept being tested

Focus Areas for ${lang} ${level}:
- Core language features
- Common design patterns
- Error handling and debugging
- Performance optimization
- Best practices and conventions
- Framework and library usage

Return ONLY the JSON array with 3 questions, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the response
    let jsonText = text.includes('```') ? text.split('```')[1].split('```')[0].trim() : text;
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsedResponse = JSON.parse(jsonText);

      // Validate response structure
      if (!Array.isArray(parsedResponse) || parsedResponse.length !== 3) {
        throw new Error('Invalid response format');
      }

      // Validate each question
      const isValid = parsedResponse.every(q =>
        q.question &&
        typeof q.question === 'string' &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        q.options.every(opt => typeof opt === 'string' && opt.trim().length > 0) &&
        q.correctAnswer &&
        q.options.includes(q.correctAnswer) &&
        q.points === 10 &&
        q.conceptTested &&
        typeof q.conceptTested === 'string'
      );

      if (!isValid) {
        throw new Error('Invalid question structure');
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Failed to generate valid questions');
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions');
  }
}

// Evaluate level verification answers and provide recommendation
async function evaluateLevelVerification(answers, questions) {
  try {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    let earnedPoints = 0;
    const conceptResults = [];

    questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) earnedPoints += question.points;

      conceptResults.push({
        concept: question.conceptTested,
        understood: isCorrect
      });
    });

    const percentageScore = (earnedPoints / totalPoints) * 100;
    let levelRecommendation = percentageScore >= 70 ? "maintain"
      : percentageScore >= 40 ? "review"
        : "lower";

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

function generateFeedback(score, conceptResults) {
  let feedback = score >= 70 ? "Excellent! You've demonstrated strong knowledge at this level. "
    : score >= 40 ? "You show potential but might need to review some concepts. "
      : "Consider starting with a lower level to build a stronger foundation. ";

  const needsWork = conceptResults.filter(r => !r.understood)
    .map(r => r.concept)
    .join(", ");

  if (needsWork) {
    feedback += `Areas to focus on: ${needsWork}`;
  }

  return feedback;
}

module.exports = {
  generateLevelVerificationQuestions,
  evaluateLevelVerification
};


generateLevelVerificationQuestions("java", "intermediate").then(console.log).catch(console.error);