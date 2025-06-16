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
  // Add more questions if needed
];

export default function Quiz() {
  // Load saved state or start fresh
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("quizStep");
    return savedStep ? Number(savedStep) : 0;
  });
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem("quizAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  // Check if all questions are answered
  const allAnswered = Object.keys(answers).length === QUIZ_QUESTIONS.length;

  // Save step & answers to localStorage on change
  useEffect(() => {
    localStorage.setItem("quizStep", step.toString());
  }, [step]);

  useEffect(() => {
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
  }, [answers]);

  // Handle option selection
  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    if (step + 1 < QUIZ_QUESTIONS.length) {
      setStep(step + 1);
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setAnswers({});
    setStep(0);
    localStorage.removeItem("quizAnswers");
    localStorage.removeItem("quizStep");
  };

  if (!allAnswered) {
    // Show quiz question card
    const currentQuestion = QUIZ_QUESTIONS[step];
    return (
      <div
        style={{
          maxWidth: 500,
          margin: "50px auto",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>{currentQuestion.question}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(currentQuestion.id, option)}
              style={{
                padding: "12px 20px",
                fontSize: 16,
                borderRadius: 6,
                border: "1.5px solid #007bff",
                backgroundColor: "#fff",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#007bff", e.currentTarget.style.color = "#fff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff", e.currentTarget.style.color = "#000")
              }
            >
              {option}
            </button>
          ))}
        </div>
        <p style={{ marginTop: 24, fontSize: 14, color: "#555" }}>
          Question {step + 1} of {QUIZ_QUESTIONS.length}
        </p>
      </div>
    );
  } else {
    // Show recommendation summary + link
    const { skinType, ageRange, primaryGoal } = answers;
    return (
      <div
        style={{
          maxWidth: 500,
          margin: "50px auto",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>
          We recommend a {primaryGoal?.toLowerCase()} routine for {skinType?.toLowerCase()} skin in the age range {ageRange}.
        </h2>
        <button
          onClick={() => {
            window.location.href = "/recommendations";
          }}
          style={{
            marginTop: 20,
            padding: "12px 30px",
            fontSize: 16,
            borderRadius: 6,
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#007bff")
          }
        >
          See Product Recommendations →
        </button>
        <br />
        <button
          onClick={resetQuiz}
          style={{
            marginTop: 30,
            padding: "8px 20px",
            fontSize: 14,
            borderRadius: 6,
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#5a6268")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#6c757d")
          }
        >
          Retake Quiz
        </button>
      </div>
    );
  }
}
