const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyBQYihomr3HOCTt9TP70Rns5HqziTOHoAk");

// Generate level verification questions
async function generateLevelVerificationQuestions(lang, level) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate 3 technical multiple choice questions to verify ${level} level knowledge in ${lang} programming.

Return a JSON array with 3 questions in this format:
[
  {
    "question": "A technical question about ${lang}",
    "options": ["Four", "Different", "Technical", "Options"],
    "correctAnswer": "One of the options",
    "points": 10,
    "conceptTested": "${lang} concept being tested"
  }
]

Make sure:
- Questions are ${level} level ${lang}-specific
- Questions test different core concepts
- Options are technically accurate
- correctAnswer matches one option exactly
- conceptTested is specific`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    try {
      // Clean and parse the response
      const jsonText = text.replace(/```json\n|\n```|```/g, '').trim();
      const parsedResponse = JSON.parse(jsonText);

      // Validate response
      if (!Array.isArray(parsedResponse) || parsedResponse.length !== 3) {
        throw new Error('Invalid response format');
      }

      // Validate each question
      const isValid = parsedResponse.every(q =>
        q.question &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        q.options.every(opt => opt && opt.trim().length > 0) &&
        q.correctAnswer &&
        q.options.includes(q.correctAnswer) &&
        q.points === 10 &&
        q.conceptTested
      );

      if (!isValid) {
        throw new Error('Invalid question structure');
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error parsing response:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
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
    const levelRecommendation = percentageScore >= 70 ? "maintain"
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
    throw error;
  }
}

function generateFeedback(score, conceptResults) {
  const feedback = score >= 70 ? "Excellent! You've demonstrated strong knowledge at this level. "
    : score >= 40 ? "You show potential but might need to review some concepts. "
      : "Consider starting with a lower level to build a stronger foundation. ";

  const needsWork = conceptResults.filter(r => !r.understood)
    .map(r => r.concept)
    .join(", ");

  return needsWork ? `${feedback}Areas to focus on: ${needsWork}` : feedback;
}

module.exports = {
  generateLevelVerificationQuestions,
  evaluateLevelVerification
};

