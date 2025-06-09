import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppleFadeTransition, MotionWrapper } from "../../utils/animation";

/**
 * PUBLIC_INTERFACE
 * Multi-step, animated quiz modal for collecting personalized skincare information.
 */

// Quiz questions definition
const quizSteps = [
  {
    key: "skinType",
    title: "What's your skin type?",
    description:
      "Select the option that best describes your facial skin. This helps us personalize your routine.",
    options: [
      { value: "normal", label: "Normal" },
      { value: "dry", label: "Dry" },
      { value: "oily", label: "Oily" },
      { value: "combination", label: "Combination" },
      { value: "sensitive", label: "Sensitive" },
      { value: "not_sure", label: "Not sure" },
    ],
    type: "choice",
  },
  {
    key: "goals",
    title: "What are your skincare goals?",
    description:
      "Pick 1–3 goals that matter to you. This helps us recommend relevant products and steps.",
    options: [
      "Reduce Acne/Blemishes",
      "Hydration",
      "Even Skin Tone",
      "Anti-Aging",
      "Minimize Pores",
      "Brightening",
      "Reduce Redness",
      "Sun Protection",
      "Soothe Sensitivity",
    ],
    type: "multi",
    min: 1,
    max: 3,
  },
  {
    key: "budget",
    title: "What's your skincare budget?",
    description:
      "Choose your preferred price range for your routine and products.",
    options: [
      { value: "drugstore", label: "Budget-Friendly ($)" },
      { value: "midrange", label: "Midrange ($$)" },
      { value: "premium", label: "Premium ($$$)" },
      { value: "no_limit", label: "No Preference" },
    ],
    type: "choice",
  },
];

// Option button component
function OptionButton({ label, selected, onClick, disabled, ariaLabel, style }) {
  return (
    <button
      className="quiz-option-btn"
      type="button"
      aria-label={ariaLabel || label}
      style={{
        background: selected
          ? "linear-gradient(92deg,#fadadd 45%,#f339db 100%)"
          : "rgba(255,255,255,0.12)",
        color: selected ? "#27174e" : "#190155",
        fontWeight: selected ? 700 : 500,
        border: selected
          ? "2.2px solid #f339db"
          : "2.2px solid #e7b3ff2e",
        borderRadius: 15,
        padding: "17px 0px",
        margin: "0 0",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: 18.1,
        width: "100%",
        minHeight: 53,
        boxShadow: selected
          ? "0 2px 16px 0 #fadadd61"
          : "0 1px 8px 0 rgba(0,0,0,0.04)",
        outline: selected ? "2.5px solid #f339db88" : "none",
        letterSpacing: ".01em",
        transition: "box-shadow 0.16s, background 0.18s, color 0.18s, border 0.16s",
        ...style,
      }}
      onClick={onClick}
      disabled={!!disabled}
    >
      {label}
    </button>
  );
}

// Step indicator dots
function StepProgressDots({ steps, currentStep }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "center",
        marginBottom: 18,
        marginTop: 10,
      }}
      aria-label="quiz progress"
    >
      {steps.map((_, idx) => (
        <div
          key={idx}
          style={{
            width: 15,
            height: 15,
            borderRadius: "50%",
            background:
              idx === currentStep
                ? "linear-gradient(90deg, #fadadd 60%, #e7b3ff 100%)"
                : "rgba(255,255,255,0.16)",
            border: idx === currentStep ? "0px" : "1.5px solid #fadadd45",
            opacity: idx <= currentStep ? 1 : 0.7,
            boxShadow:
              idx === currentStep ? "0 1px 7px 0 #fadadd68" : undefined,
            transition: "all .2s cubic-bezier(.36,1.5,.48,1)",
          }}
          aria-current={idx === currentStep}
        />
      ))}
    </div>
  );
}

// Multi-step quiz modal component
const QuizModal = ({
  open,
  onClose,
  onComplete,
  animationKey = 0,
  defaultData,
}) => {
  // Step state
  const [step, setStep] = useState(0);
  // Store answers: { skinType, goals, budget }
  const [answers, setAnswers] = useState(defaultData || {});

  const current = quizSteps[step];

  // Handlers for each step
  function selectOption(val) {
    setAnswers({ ...answers, [current.key]: val });
  }
  function selectMulti(val) {
    let arr = answers[current.key] || [];
    const { max } = current;
    if (arr.includes(val)) {
      arr = arr.filter((k) => k !== val);
    } else {
      if (!max || arr.length < max) arr = [...arr, val];
    }
    setAnswers({ ...answers, [current.key]: arr });
  }
  function canProceed() {
    if (current.type === "choice") return !!answers[current.key];
    if (current.type === "multi") {
      const sel = answers[current.key] || [];
      return (
        sel.length >= (current.min || 0) &&
        (!current.max || sel.length <= current.max)
      );
    }
    return false;
  }
  function onNext(e) {
    e.preventDefault();
    if (!canProceed()) return;
    if (step < quizSteps.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Complete
      if (onComplete) onComplete(answers);
    }
  }
  function onBack() {
    if (step === 0) return;
    setStep((s) => s - 1);
  }

  // Animation variants
  const modalVariants = {
    initial: { opacity: 0, y: 36, scale: 0.92 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -32, scale: 0.98 },
  };
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 0.97 },
    exit: { opacity: 0 },
  };

  // Accessible ARIA modal
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="quiz-modal-overlay"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayVariants}
          style={{
            position: "fixed",
            zIndex: 4000,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(105deg, #170957fc 0%, #282187fd 100%)",
            backdropFilter: "blur(7px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Quiz modal background"
          onClick={onClose}
        >
          <motion.div
            className="quiz-modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-step-title"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalVariants}
            transition={{
              duration: 0.46,
              ease: [0.35, 1.27, 0.48, 1],
            }}
            style={{
              background:
                "linear-gradient(101deg, #fff 0%, #fadadd 60%, #e7b3ff 100%)",
              borderRadius: 28,
              boxShadow:
                "0 9px 48px 0 #fadadd39, 0 1.2px 2.4px 0 #e7b3ff30",
              maxWidth: 430,
              width: "98vw",
              minWidth: 312,
              minHeight: 355,
              padding: "42px 24px 30px 24px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              outline: "none",
              position: "relative",
              transition: "box-shadow 0.18s, background 0.18s",
            }}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            key={"step-" + step + animationKey}
          >
            {/* Close button */}
            <button
              aria-label="Close quiz"
              onClick={onClose}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#ffeafdcc",
                border: "none",
                color: "#f339db",
                fontWeight: 800,
                fontSize: 27,
                borderRadius: 19,
                width: 34,
                height: 34,
                cursor: "pointer",
                opacity: 0.82,
                boxShadow: "0 1.5px 10px #fadadd3b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity 0.18s, background 0.18s",
              }}
            >
              &times;
            </button>
            <StepProgressDots steps={quizSteps} currentStep={step} />
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.33, ease: [0.32, 1, 0.64, 1] }}
              style={{ width: "100%", minHeight: 180 }}
            >
              <h2
                id="quiz-step-title"
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 26,
                  marginBottom: 10,
                  color: "#fadadd",
                  letterSpacing: ".02em",
                  lineHeight: "1.13",
                }}
              >
                {current.title}
              </h2>
              <div
                style={{
                  textAlign: "center",
                  fontWeight: 500,
                  color: "#fff",
                  opacity: 0.87,
                  marginBottom: 15,
                  fontSize: 16.2,
                  minHeight: 32,
                }}
              >
                {current.description}
              </div>
              {/* Option rendering */}
              <form onSubmit={onNext}>
                <div
                  style={{
                    margin: "16px 0 18px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: 368,
                    gap: 14,
                  }}
                >
                  {/* Choice (radio style) */}
                  {current.type === "choice" &&
                    current.options.map((opt) => {
                      const optVal =
                        typeof opt === "string" ? opt : opt.value;
                      const optLabel =
                        typeof opt === "string" ? opt : opt.label;
                      return (
                        <OptionButton
                          key={optVal}
                          label={optLabel}
                          selected={answers[current.key] === optVal}
                          onClick={() => selectOption(optVal)}
                          ariaLabel={optLabel}
                        />
                      );
                    })}
                  {/* Multi select */}
                  {current.type === "multi" &&
                    current.options.map((opt) => (
                      <OptionButton
                        key={opt}
                        label={opt}
                        selected={
                          Array.isArray(answers[current.key]) &&
                          answers[current.key].includes(opt)
                        }
                        onClick={() => selectMulti(opt)}
                        ariaLabel={opt}
                        disabled={
                          Array.isArray(answers[current.key]) &&
                          answers[current.key].length >= (current.max || 99) &&
                          !answers[current.key].includes(opt)
                        }
                      />
                    ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 13,
                    marginTop: 18,
                    width: "100%",
                  }}
                >
                  <button
                    type="button"
                    className="btn"
                    style={{
                      background:
                        "linear-gradient(89deg, #fadadd 30%, #e7b3ff 90%)",
                      color: "#27275e",
                      fontWeight: 600,
                      fontSize: 16,
                      padding: "10px 18px",
                      borderRadius: 8,
                      border: "none",
                      opacity: step === 0 ? 0.59 : 1,
                      pointerEvents: step === 0 ? "none" : "auto",
                      cursor: step === 0 ? "not-allowed" : "pointer",
                    }}
                    onClick={onBack}
                    aria-label="Go back"
                  >
                    ← Back
                  </button>
                  <button
                    className="btn"
                    type="submit"
                    style={{
                      background:
                        canProceed()
                          ? "linear-gradient(90deg, #fadadd 60%, #e7b3ff 100%)"
                          : "rgba(255,255,255,0.19)",
                      color: canProceed() ? "#27275e" : "#e7b3ffca",
                      fontWeight: 600,
                      fontSize: 16,
                      padding: "10px 18px",
                      borderRadius: 9,
                      border: "none",
                      boxShadow: canProceed()
                        ? "0 1px 10px 0 #fadadd73"
                        : "none",
                      cursor: canProceed() ? "pointer" : "not-allowed",
                      opacity: canProceed() ? 1 : 0.7,
                    }}
                    aria-label={
                      step < quizSteps.length - 1 ? "Next" : "See Results"
                    }
                    disabled={!canProceed()}
                  >
                    {step < quizSteps.length - 1 ? "Next →" : "See Results"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Quiz main entry (full page view).
 */
const Quiz = () => {
  // Modal state for full page view
  const [quizOpen, setQuizOpen] = useState(true);
  const [completedData, setCompletedData] = useState(null);

  // When the quiz is completed
  function handleQuizComplete(data) {
    setCompletedData(data);
    setQuizOpen(false);
    // Here you would typically trigger navigation to recommendations
  }

  // Show results summary if completed, otherwise show modal quiz
  return (
    <section className="container" style={{ minHeight: 400 }}>
      <AppleFadeTransition>
        <div>
          <h2 style={{ textAlign: "center" }}>
            Personalized Skincare Quiz
          </h2>
          <div style={{ textAlign: "center", color: "#fadadd" }}>
            Answer a few quick questions for your tailored skincare plan.
          </div>
        </div>
        <AnimatePresence>
          {quizOpen && (
            <QuizModal
              open={quizOpen}
              onClose={() => setQuizOpen(false)}
              onComplete={handleQuizComplete}
              animationKey={0}
            />
          )}
        </AnimatePresence>
        {completedData && (
          <MotionWrapper>
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: 18,
                margin: "36px auto 0 auto",
                maxWidth: 420,
                padding: "30px 18px",
                boxShadow:
                  "0 4px 22px 0 rgba(250,218,221,0.11), 0 0.5px 0.7px 0 #fadadd20",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "#fadadd", marginTop: 0 }}>
                Thanks! Here are your answers:
              </h3>
              <ul style={{ textAlign: "left", margin: "16px auto 8px auto", fontSize: 16 }}>
                <li>
                  <strong>Skin Type:</strong>{" "}
                  {completedData.skinType
                    ? completedData.skinType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
                    : "-"}
                </li>
                <li>
                  <strong>Goals:</strong>{" "}
                  {completedData.goals && completedData.goals.length > 0
                    ? completedData.goals.join(", ")
                    : "-"}
                </li>
                <li>
                  <strong>Budget:</strong>{" "}
                  {completedData.budget
                    ? {
                        drugstore: "Budget-Friendly",
                        midrange: "Midrange",
                        premium: "Premium",
                        no_limit: "No Preference",
                      }[completedData.budget] || completedData.budget
                    : "-"}
                </li>
              </ul>
              <div style={{ marginTop: 20 }}>
                {/* Recommend next action: View routine or restart quiz */}
                <button
                  className="btn btn-large"
                  style={{
                    background:
                      "linear-gradient(90deg, #fadadd 60%, #e7b3ff 100%)",
                    color: "#27275e",
                    fontWeight: 600,
                    fontSize: "1.08rem",
                    borderRadius: 12,
                    outline: "none",
                    margin: "0 10px 0 0",
                  }}
                  onClick={() => {
                    window.location.href = "/recommendations";
                  }}
                >
                  Get My Personalized Recommendations →
                </button>
                <button
                  className="btn"
                  style={{
                    background: "rgba(234,179,255,0.22)",
                    color: "#fadadd",
                    fontWeight: 500,
                    padding: "11px 18px",
                    marginLeft: 10,
                    borderRadius: 8,
                  }}
                  onClick={() => {
                    setQuizOpen(true);
                    setCompletedData(null);
                  }}
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          </MotionWrapper>
        )}
      </AppleFadeTransition>
    </section>
  );
};

export default Quiz;
