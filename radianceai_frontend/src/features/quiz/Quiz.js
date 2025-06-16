import React, { useState, useEffect } from "react";

const QUIZ_QUESTIONS = [
  {
    id: "ageRange",
    question: "What is your age range?",
    options: ["18-24", "25-34", "35-44", "45+"],
  },
  {
    id: "skinType",
    question: "What is your skin type?",
    options: ["Oily", "Dry", "Combination", "Normal"],
  },
  {
    id: "primaryGoal",
    question: "What is your primary skin goal?",
    options: ["Acne", "Anti-aging", "Hydration", "Brightening"],
  },
  // Add more questions if you have
];

export default function Quiz() {
  const [step, setStep] = useState(() => {
    // Load saved step or start at 0
    const savedStep = localStorage.getItem("quizStep");
    return savedStep ? Number(savedStep) : 0;
  });

  const [answers, setAnswers] = useState(() => {
    // Load saved answers or empty object
    const savedAnswers = localStorage.getItem("quizAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  // Derived mode: if all questions answered, show result, else quiz
  const hasAnswers =
    Object.keys(answers).length === QUIZ_QUESTIONS.length;
  const mode = hasAnswers ? "result" : "quiz";

  useEffect(() => {
    // Save current step in localStorage whenever it changes
    localStorage.setItem("quizStep", step.toString());
  }, [step]);

  useEffect(() => {
    // Save answers in localStorage whenever they change
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
  }, [answers]);

  // Handle answer select
  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
    // Move to next question or show result
    if (step + 1 < QUIZ_QUESTIONS.length) {
      setStep(step + 1);
    }
  };

  // Retake quiz button handler
  const retakeQuiz = () => {
    setAnswers({});
    setStep(0);
    localStorage.removeItem("quizAnswers");
    localStorage.removeItem("quizStep");
  };

  if (mode === "quiz") {
    // Show current question
    const currentQuestion = QUIZ_QUESTIONS[step];
    return (
      <div className="quiz-container">
        <h2>{currentQuestion.question}</h2>
        <div className="options">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(currentQuestion.id, option)}
            >
              {option}
            </button>
          ))}
        </div>
        <p>
          Question {step + 1} of {QUIZ_QUESTIONS.length}
        </p>
      </div>
    );
  }

  if (mode === "result") {
    // Show routine recommendation + button to Recommendations page
    // Customize this message based on answers if you want
    const { skinType, ageRange, primaryGoal } = answers;
    return (
      <div className="result-container">
        <h2>
          We recommend a {primaryGoal?.toLowerCase()} routine for {skinType?.toLowerCase()} skin
          in the age range {ageRange}.
        </h2>
        <button
          onClick={() => {
            // Navigate to Recommendations page, e.g. /recommendations
            // Use your router here, e.g., React Router's useNavigate
            window.location.href = "/recommendations";
          }}
        >
          See Product Recommendations →
        </button>
        <br />
        <button onClick={retakeQuiz} style={{ marginTop: "20px" }}>
          Retake Quiz
        </button>
      </div>
    );
  }

  return null; // fallback
}
