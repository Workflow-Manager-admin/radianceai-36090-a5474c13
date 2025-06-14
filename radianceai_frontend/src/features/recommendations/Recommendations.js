import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RecommendationCard from "./RecommendationCard";
import styles from "./Recommendations.module.css";

/** 
 * Generate dummy recommendations based on quiz answers.
 * You can replace this with your real product data later.
 */
function getRecommendations(answers) {
  const { primaryGoal, skinType } = answers;

  // Example simple recommendations based on primaryGoal
  const allRecs = {
    hydration: [
      { id: 1, name: "Hydrating Cleanser", description: "Gentle cleanser for hydration" },
      { id: 2, name: "Moisturizing Cream", description: "Keeps skin moist and soft" },
    ],
    brightening: [
      { id: 3, name: "Vitamin C Serum", description: "Brightens skin and evens tone" },
      { id: 4, name: "Brightening Face Mask", description: "Enhances skin glow" },
    ],
    antiaging: [
      { id: 5, name: "Retinol Cream", description: "Reduces fine lines and wrinkles" },
      { id: 6, name: "Firming Eye Gel", description: "Firms delicate eye skin" },
    ],
    acne: [
      { id: 7, name: "Salicylic Acid Cleanser", description: "Clears acne and unclogs pores" },
      { id: 8, name: "Oil Control Moisturizer", description: "Controls shine and hydrates" },
    ],
  };

  // Default fallback if no primaryGoal
  return allRecs[primaryGoal] || [];
}

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers || {};

  const recommendations = getRecommendations(answers);

  // If no answers or no recommendations, prompt to take quiz
  if (!recommendations.length) {
    return (
      <div className={styles.empty}>
        <div
          className={styles.emptyBox}
          style={{
            background: "linear-gradient(95deg, #93bafe 60%, #e3f0ff 100%)",
            color: "#2a6ae7",
            border: "2px solid #2a6ae755"
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 21, marginBottom: 5 }}>No Recommendations</div>
          <div style={{ fontSize: 15.5, marginBottom: 12 }}>
            Please complete the <a href="/quiz" style={{ color: "#2a6ae7", textDecoration: "underline" }}>quiz</a> for personalized recommendations.
          </div>
          <button
            className={styles.quizBtn}
            style={{
              background: "linear-gradient(92deg, #93bafe 54%, #e3f0ff 110%)",
              color: "#2a6ae7",
              border: "none",
              cursor: "pointer"
            }}
            onClick={() => navigate("/quiz")}
          >
            Take Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.recommendationsSection}>
      <h2 className={styles.heading} style={{ color: "#2a6ae7" }}>
        Your Personalized Recommendations
      </h2>
      <div className={styles.recommendationsList}>
        {recommendations.map((rec, idx) => (
          <RecommendationCard key={rec.id || idx} data={rec} index={idx} />
        ))}
      </div>
    </section>
  );
};

export default Recommendations;
