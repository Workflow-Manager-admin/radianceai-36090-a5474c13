// quiz.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppleFadeTransition, MotionWrapper } from "../../utils/animation";

const blue = "#93bafe";
const blueAccent = "#2a6ae7";
const blue2 = "#e3f0ff";

const QUIZ_QUESTIONS = [
  {
    key: "skinType",
    question: "What is your skin type?",
    options: [
      { label: "Oily", value: "oily" },
      { label: "Normal", value: "normal" },
      { label: "Dry", value: "dry" },
      { label: "Sensitive", value: "sensitive" },
    ],
  },
  {
    key: "primaryGoal",
    question: "What is your primary skin goal?",
    options: [
      { label: "Hydration", value: "hydration" },
      { label: "Brightening", value: "brightening" },
      { label: "Anti-aging", value: "antiaging" },
      { label: "Acne-free", value: "acne" },
    ],
  },
  {
    key: "age",
    question: "What is your age range?",
    options: [
      { label: "Under 18", value: "<18" },
      { label: "18-24", value: "18-24" },
      { label: "25-34", value: "25-34" },
      { label: "35-44", value: "35-44" },
      { label: "45-54", value: "45-54" },
      { label: "55+", value: "55+" },
    ],
  },
];

// Helper function to initialize state from localStorage
const getInitialAnswers = () => {
  try {
    const storedAnswers = localStorage.getItem("quizAnswers");
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  } catch (error) {
    console.error("Error parsing quiz answers from localStorage:", error);
    return {};
  }
};

function Quiz() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState(getInitialAnswers);
  const [step, setStep] = useState(0);
  // Removed 'mode' state as it's no longer needed for navigation logic.
  // The 'result' display logic will now only appear if the quiz is fully submitted
  // and we explicitly decide to show it before navigating.

  // Effect to save answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
  }, [answers]);

  const handleSelect = (key) => (value) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  };

  const handleNextQuestion = () => {
    // Check if the current question has an answer before proceeding
    const currentQuestionKey = QUIZ_QUESTIONS[step].key;
    if (!answers[currentQuestionKey]) {
        console.warn("Please select an answer before proceeding.");
        return; // Prevent advancing if no answer is selected
    }

    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      // This is the last step, so we are submitting the quiz.
      // Ensure answers are saved BEFORE navigating.
      // The useEffect will handle saving the last answer to localStorage.
      // Then navigate to recommendations.
      navigate("/recommendations");
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  // Removed submitQuiz function as its logic is now integrated into handleNextQuestion
  // when it's the last step. The form's onSubmit will no longer trigger this directly.

  // If the quiz is finished (all steps completed and we navigated away),
  // this component won't be rendered.
  // The 'result' display logic should ideally be part of your Recommendations
  // or a separate "QuizResultsSummary" component, not within the quiz itself,
  // if you're navigating immediately.

  const q = QUIZ_QUESTIONS[step];

  return (
    <section
      className="container"
      style={{ maxWidth: 500, margin: "0 auto", paddingTop: 40, paddingBottom: 32 }}
    >
      <AppleFadeTransition>
        {/* Remove onSubmit={submitQuiz} from the form */}
        <form>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            style={{
              marginBottom: 26,
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontWeight: 800,
                fontSize: "1.41em",
                margin: "0 0 14px 0",
                color: blueAccent,
                letterSpacing: ".01em",
              }}
            >
              Personalized Skincare Quiz
            </h2>
            <div
              style={{
                background: "linear-gradient(97deg,#93bafe 60%,#e3f0ff 100%)",
                color: blueAccent,
                borderRadius: 14,
                fontWeight: 500,
                fontSize: 14.8,
                padding: "12px 20px",
                margin: "0 auto 4px auto",
                maxWidth: 350,
                boxShadow: "0 1.5px 10px #93bafe13",
              }}
            >
              Answer a few quick questions for targeted recommendations.
            </div>
          </motion.div>
          <div
            style={{
              color: blueAccent,
              fontWeight: 700,
              fontSize: "1.19em",
              margin: "0 0 11px 2px",
            }}
          >
            {q.question}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginBottom: 17 }}>
            {q.options.map((opt) => {
              const active = answers[q.key] === opt.value;
              return (
                <span
                  style={{
                    background: active
                      ? "linear-gradient(97deg,#93bafe 60%,#e3f0ff 100%)"
                      : "#fff",
                    border: active ? "2.5px solid #2a6ae7" : "1.2px solid #e3f0ff",
                    boxShadow: active ? "0 2.5px 15px #93bafe66" : "0 1px 7px #e3f0ff30",
                    color: active ? "#2a6ae7" : "#47567f",
                    fontWeight: 700,
                    borderRadius: 22,
                    padding: "12px 22px",
                    margin: "0 5px 12px 0",
                    cursor: "pointer",
                    fontSize: 16,
                    transition: "all 0.16s cubic-bezier(.25,1.45,.48,1)",
                  }}
                  onClick={() => handleSelect(q.key)(opt.value)}
                  key={opt.value}
                >
                  {opt.label}
                </span>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "space-between",
              maxWidth: 350,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {step > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                style={{
                  background: "#fff",
                  color: blueAccent,
                  fontWeight: 700,
                  fontSize: "1.09em",
                  borderRadius: 13,
                  boxShadow: "0 4px 15px #93bafe23",
                  border: `2px solid ${blueAccent}`,
                  padding: "10px 22px",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
            ) : (
              <div style={{ width: 92 }} />
            )}

            {step < QUIZ_QUESTIONS.length - 1 ? (
              <button
                type="button" // Change to type="button" to prevent form submission
                style={{
                  background: "linear-gradient(91deg,#2a6ae7 54%,#93bafe 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.09em",
                  borderRadius: 13,
                  boxShadow: "0 4px 15px #93bafe23",
                  padding: "10px 22px",
                  cursor: answers[q.key] ? "pointer" : "not-allowed",
                }}
                onClick={handleNextQuestion} // Use the new function
                disabled={!answers[q.key]}
              >
                Next
              </button>
            ) : (
              <button
                type="button" // Change to type="button" for consistency or 'submit' if you want a true form submit
                style={{
                  background: "linear-gradient(91deg,#2a6ae7 54%,#93bafe 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.09em",
                  borderRadius: 13,
                  boxShadow: "0 4px 15px #93bafe23",
                  padding: "10px 22px",
                  cursor: answers[q.key] ? "pointer" : "not-allowed",
                }}
                onClick={handleNextQuestion} // Use the new function
                disabled={!answers[q.key]}
              >
                Get My Recommendations
              </button>
            )}
          </div>
        </form>
      </AppleFadeTransition>
    </section>
  );
}

export default Quiz;