import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppleFadeTransition, MotionWrapper } from "../../utils/animation";
import useLocalStorage from "../../hooks/useLocalStorage";

/**
 * Recommendations: Main personalized recommendations page.
 * All pink/purple colors replaced with RadianceAI blue palette.
 */

const Palette = {
  primaryBlue: "#3A8DFF",
  secondaryBlue: "#2366C8",
  accentBlue: "#99C8FF",
  modalOverlay: "rgba(58,141,255,0.88)",
  cardBG: "linear-gradient(91deg, #3A8DFF 60%, #99C8FF 100%)",
  cardAccent: "#2366C8",
  badgeBG: "#99C8FF",
  badgeColor: "#2366C8",
  highlightTitle: "#2366C8",
  text: "#2a2f42",
  mutedText: "#2366C8",
  modalBG: "linear-gradient(97deg, #bbdeff 10%, #e9f3fc 90%)",
  white: "#fff",
  boxShadowMain: "0 2.5px 16px #3A8DFF22",
  boxShadowHover: "0 4px 32px #99C8FF33",
};

/**
 * PUBLIC_INTERFACE
 * Renders a single recommendation card with blue palette colors.
 */
const RecommendationCard = ({
  icon, title, text, badge, onClick, highlighted,
}) => (
  <motion.div
    className="recommendation-card"
    whileHover={{
      scale: 1.033,
      boxShadow: Palette.boxShadowHover,
    }}
    style={{
      background: highlighted ? Palette.cardBG : Palette.white,
      borderRadius: 22,
      boxShadow: Palette.boxShadowMain,
      border: badge ? `2.5px solid ${Palette.cardAccent}` : "none",
      position: "relative",
      cursor: "pointer",
      marginBottom: 18,
      transition: "box-shadow .18s, background .33s",
      minHeight: 97,
      padding: "22px 24px",
      display: "flex",
      alignItems: "flex-start",
    }}
    tabIndex={0}
    onClick={onClick}
    aria-label={title}
  >
    <div
      className="recommendation-card-icon"
      style={{
        fontSize: 33,
        marginRight: 20,
        marginTop: 2,
        filter: "drop-shadow(0 1px 5px #3A8DFF48)",
        color: Palette.cardAccent,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div
        className="recommendation-card-title"
        style={{
          fontWeight: 800,
          color: Palette.highlightTitle,
          fontSize: "1.1em",
          marginBottom: 3,
          letterSpacing: ".01em",
          display: "flex",
          alignItems: "center",
        }}
      >
        {title}
        {badge && (
          <span
            className="recommendation-card-badge"
            style={{
              background: Palette.badgeBG,
              color: Palette.badgeColor,
              fontWeight: 700,
              fontSize: 12.3,
              borderRadius: 8,
              padding: "1.9px 7.5px",
              marginLeft: 10,
              boxShadow: Palette.boxShadowHover,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <div
        className="recommendation-card-text"
        style={{
          color: Palette.text,
          opacity: 0.85,
          fontWeight: 500,
          fontSize: 15.2,
          marginBottom: 0,
        }}
      >
        {text}
      </div>
    </div>
  </motion.div>
);

/**
 * PUBLIC_INTERFACE
 * Main Recommendations section—uses blue palette only.
 */
const Recommendations = () => {
  // Retrieve quiz answers and recommendations from LocalStorage
  const [quizAnswers] = useLocalStorage("quizAnswers", null);
  const [recommendations, setRecommendations] = useState([]);
  const [openInfo, setOpenInfo] = useState(null);

  // Example: simulate recommendations on mount for demo purposes
  useEffect(() => {
    // Dummy data in blue theme
    setRecommendations([
      {
        icon: "🌞",
        title: "Morning Cleanser",
        text: "Start your day with a refreshing, hydrating cleanser chosen for your skin type.",
        badge: "Must-have",
      },
      {
        icon: "💧",
        title: "Hydrating Serum",
        text: "Boosts and locks in skin moisture with advanced hyaluronic acid complex.",
        badge: "Derm-Approved",
      },
      {
        icon: "🌙",
        title: "Night Moisturizer",
        text: "Wake up glowing with barrier-restoring overnight moisture for your skin goal.",
        badge: "Overnight Care",
      },
    ]);
  }, []);

  return (
    <section
      className="container"
      style={{
        maxWidth: 720,
        margin: "0 auto",
        paddingTop: 36,
      }}
    >
      <AppleFadeTransition>
        <h2
          style={{
            color: Palette.cardAccent,
            textAlign: "center",
            fontWeight: 800,
            letterSpacing: ".02em",
            fontSize: "2.1rem",
            marginBottom: 7,
            marginTop: 0,
          }}
        >
          Personal Recommendations
        </h2>
        <div
          style={{
            color: Palette.primaryBlue,
            textAlign: "center",
            fontWeight: 600,
            fontSize: 18,
            marginBottom: 19,
            marginTop: 0,
          }}
        >
          Tailored to your quiz answers.
        </div>
        <MotionWrapper>
          <div style={{ marginBottom: 33 }}>
            {recommendations.length === 0 ? (
              <div
                style={{
                  color: Palette.accentBlue,
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: 16.9,
                  opacity: 0.92,
                  margin: "30px 0 38px 0",
                }}
              >
                No recommendations available.<br />Take the quiz to see personalized suggestions!
              </div>
            ) : (
              recommendations.map((rec, idx) => (
                <RecommendationCard
                  key={rec.title}
                  {...rec}
                  highlighted={idx === 0}
                  onClick={() => setOpenInfo(rec)}
                />
              ))
            )}
          </div>
        </MotionWrapper>
        <AnimatePresence>
          {openInfo && (
            <motion.div
              className="recommendation-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.98 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: Palette.modalOverlay,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 4020,
              }}
              onClick={() => setOpenInfo(null)}
              aria-label="Recommendation modal background"
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.22, type: "spring", bounce: 0.29 }}
                style={{
                  background: Palette.modalBG,
                  borderRadius: 27,
                  boxShadow: "0 8px 42px #3A8DFF33, 0 2.5px 7px #99C8FF33",
                  minWidth: 290,
                  maxWidth: 440,
                  width: "94vw",
                  padding: "38px 20px 22px 20px",
                  outline: "none",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onClick={e => e.stopPropagation()}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
              >
                <button
                  aria-label="Close"
                  onClick={() => setOpenInfo(null)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 14,
                    background: Palette.primaryBlue,
                    border: "none",
                    color: Palette.white,
                    fontWeight: 700,
                    fontSize: 25,
                    borderRadius: 17,
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    opacity: 0.7,
                    boxShadow: "0 1.5px 7px #2366C822",
                  }}
                >
                  &times;
                </button>
                <div style={{ fontWeight: 800, color: Palette.highlightTitle, fontSize: 20, marginBottom: 3 }}>{openInfo.title}</div>
                <div
                  style={{
                    color: Palette.primaryBlue,
                    fontWeight: 700,
                    fontSize: 14.5,
                    marginBottom: 3,
                  }}
                >
                  {openInfo.badge}
                </div>
                <div
                  style={{
                    color: Palette.cardAccent,
                    opacity: 0.9,
                    fontWeight: 500,
                    fontSize: 15.7,
                    marginBottom: 0,
                    textAlign: "center",
                  }}
                >
                  {openInfo.text}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AppleFadeTransition>
    </section>
  );
};

export default Recommendations;

// All pink/purple palette colors removed. Fully RadianceAI blue brand–compliant.
