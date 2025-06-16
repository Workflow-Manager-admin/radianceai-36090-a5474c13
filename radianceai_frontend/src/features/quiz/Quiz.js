import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

function Quiz() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("quizAnswers");
    return saved ? JSON.parse(saved) : {};
  });

  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("quizStep");
    return savedStep !== null ? parseInt(savedStep, 10) : 0;
  });

  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("quizAnswers");
    return saved ? "report" : "quiz";
  });

  useEffect(() => {
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("quizStep", step.toString());
  }, [step]);

  const handleSelect = (key) => (value) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  };

  const nextStep = () => {
    if (step < QUIZ_QUESTIONS.length - 1) setStep((s) => s + 1);
    else setMode("result");
  };

  const prevStep = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const submitQuiz = (e) => {
    e.preventDefault();
    setMode("result");
  };

  if (mode === "report") {
    return (
      <section className="container" style={{ maxWidth: 500, margin: "0 auto", padding: "40px 0 32px 0" }}>
        <AppleFadeTransition>
          <h2 style={{ fontSize: "1.31rem", fontWeight: 800, color: blueAccent, textAlign: "center", marginBottom: 16 }}>
            Your Last Quiz Answers
          </h2>
          <div style={{
            background: "linear-gradient(97deg,#93bafe 60%,#e3f0ff 100%)",
            border: "2px solid #2a6ae7",
            borderRadius: 18,
            padding: "18px 20px",
            color: blueAccent,
            fontWeight: 600,
          }}>
            {QUIZ_QUESTIONS.map((q) => (
              <div key={q.key} style={{ marginBottom: 10 }}>
                <strong>{q.question}</strong><br />
                <span style={{ color: blue }}>{answers[q.key] || "Not answered"}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              onClick={() => {
                setAnswers({});
                setStep(0);
                setMode("quiz");
                localStorage.removeItem("quizAnswers");
                localStorage.removeItem("quizStep");
              }}
              style={{
                backgroundColor: blueAccent,
                color: "#fff",
                fontWeight: 700,
                padding: "10px 24px",
                fontSize: 16,
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                boxShadow: "0 4px 15px #93bafe70",
              }}
            >
              Take Quiz Again →
            </button>
          </div>
        </AppleFadeTransition>
      </section>
    );
  }

  if (mode === "result") {
    return (
      <section
        className="container"
        style={{ maxWidth: 500, margin: "0 auto", padding: "40px 0 32px 0" }}
      >
        <AppleFadeTransition>
          <h2
            style={{
              fontSize: "1.31rem",
              fontWeight: 800,
              color: blueAccent,
              margin: "25px 0 9px 0",
              textAlign: "center",
            }}
          >
            Your Quiz Results
          </h2>
          <div
            style={{
              margin: "0 0 12px 0",
              textAlign: "center",
              color: blue,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Tailored recommendations based on your answers.
          </div>
          <MotionWrapper>
            <div
              style={{
                background:
                  "linear-gradient(97deg,#93bafe 60%,#e3f0ff 100%)",
                border: "2px solid #2a6ae7",
                borderRadius: 18,
                boxShadow: "0 1.5px 10px #93bafe20",
                padding: "20px 15px 18px 15px",
                margin: "0 auto",
                maxWidth: 410,
                fontWeight: 600,
                color: blueAccent,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  background: blue2,
                  color: blueAccent,
                  fontWeight: 700,
                  borderRadius: "50em",
                  fontSize: 14,
                  padding: "2.5px 10px",
                  marginBottom: 12,
                }}
              >
                Routine Recommendation
              </span>
              <div style={{ fontSize: 17, margin: "7px 0 5px 0" }}>
                We recommend a <b>{answers.primaryGoal || "hydration"}</b> routine for{" "}
                <b>{answers.skinType || "normal"}</b> skin in the age range{" "}
                <b>{answers.age || "18-24"}</b>.
              </div>
              <div style={{ color: blue, marginTop: 7 }}>
                <button
                  onClick={() => navigate("/recommendations", { state: { answers } })}
                  style={{
                    cursor: "pointer",
                    color: "#fff",
                    backgroundColor: blueAccent,
                    border: "none",
                    borderRadius: 12,
                    fontWeight: 700,
                    padding: "10px 22px",
                    fontSize: 16,
                    marginTop: 12,
                    boxShadow: "0 4px 15px #93bafe70",
                  }}
                  aria-label="See Product Recommendations"
                >
                  See Product Recommendations →
                </button>
              </div>
            </div>
          </MotionWrapper>
        </AppleFadeTransition>
      </section>
    );
  }

  const q = QUIZ_QUESTIONS[step];

  return (
    <section
      className="container"
      style={{ maxWidth: 500, margin: "0 auto", paddingTop: 40, paddingBottom: 32 }}
    >
      <AppleFadeTransition>
        <form onSubmit={submitQuiz}>
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
                type="button"
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
                onClick={nextStep}
                disabled={!answers[q.key]}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
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
                disabled={!answers[q.key]}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </form>
      </AppleFadeTransition>
    </section>
  );
}

export default Quiz;
