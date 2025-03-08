import React, { useState, useEffect } from "react";
import {
  RadioGroup,
  Radio,
  Button,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Spinner,
} from "@heroui/react";
import {
  FaQuestionCircle,
  FaCheckCircle,
  FaClock,
  FaBrain,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AskQuestion = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const email = localStorage.getItem("email");

      if (!authToken || !email) {
        setError("Authentication information missing");
        return;
      }

      const response = await axios.post(
        "http://localhost:9000/api/verify-level/questions",
        {
          SecCode: authToken,
          email: email,
          lang: "java", // You might want to make this dynamic
          level: "intermediate", // You might want to make this dynamic
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      setQuestions(response.data.verificationQuestions);
      setSelectedAnswers(
        new Array(response.data.verificationQuestions.length).fill("")
      );
      setIsLoading(false);
    } catch (error) {
      setError("Failed to fetch questions");
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const authToken = localStorage.getItem("authToken");
      const email = localStorage.getItem("email");

      const response = await axios.post(
        "http://localhost:9000/api/verify-level/submit",
        {
          SecCode: authToken,
          email: email,
          answers: selectedAnswers,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle successful submission
      navigate("/dashboard"); // Redirect to dashboard or results page
    } catch (error) {
      setError("Failed to submit answers");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="dark text-foreground bg-background min-h-screen p-8">
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner size="lg" color="primary" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dark text-foreground bg-background min-h-screen p-8">
        <div className="text-center text-danger">{error}</div>
      </main>
    );
  }

  return (
    <main className="dark text-foreground bg-background min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaBrain className="text-primary" />
            Knowledge Verification
          </h1>
          <p className="text-default-500 mt-2">
            Answer the following questions to verify your skill level
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-default-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-default-500">
              {Math.round(
                ((currentQuestionIndex + 1) / questions.length) * 100
              )}
              %
            </span>
          </div>
          <Progress
            value={((currentQuestionIndex + 1) / questions.length) * 100}
            color="primary"
            className="w-full"
          />
        </div>

        {/* Question Card */}
        {questions.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="flex gap-3">
              <FaQuestionCircle className="text-primary text-xl" />
              <div className="flex flex-col">
                <p className="text-md">Question {currentQuestionIndex + 1}</p>
                <p className="text-sm text-default-500">
                  {questions[currentQuestionIndex].conceptTested}
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="mb-6">
                <h2 className="text-xl mb-4">
                  {questions[currentQuestionIndex].question}
                </h2>
                <RadioGroup
                  value={selectedAnswers[currentQuestionIndex]}
                  onValueChange={handleAnswerSelect}
                  className="gap-4"
                >
                  {questions[currentQuestionIndex].options.map(
                    (option, index) => (
                      <Radio key={index} value={option}>
                        {option}
                      </Radio>
                    )
                  )}
                </RadioGroup>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  color="default"
                  variant="flat"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  Previous
                </Button>
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button
                    color="primary"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    disabled={!selectedAnswers[currentQuestionIndex]}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    color="success"
                    onClick={handleSubmit}
                    disabled={
                      selectedAnswers.some((answer) => !answer) || submitting
                    }
                    startContent={<FaCheckCircle />}
                  >
                    {submitting ? "Submitting..." : "Submit All Answers"}
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Question Navigation */}
        <div className="flex gap-2 justify-center">
          {questions.map((_, index) => (
            <Button
              key={index}
              size="sm"
              color={
                currentQuestionIndex === index
                  ? "primary"
                  : selectedAnswers[index]
                  ? "success"
                  : "default"
              }
              variant={currentQuestionIndex === index ? "solid" : "flat"}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
};
