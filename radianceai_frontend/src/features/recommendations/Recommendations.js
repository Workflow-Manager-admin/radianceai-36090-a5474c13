import React from "react";
import RecommendationCard from "./RecommendationCard";
import styles from "./Recommendations.module.css";

/* 
 * Shows the full list of recommended routines/products based on quiz input.
 * Old pink palette: #fadadd, #e7b3ff, #f339db; New RadianceAI blues: #93bafe, #e3f0ff, #2a6ae7.
 */

/** 
 * PUBLIC_INTERFACE
 * Recommendations: main container for displaying personalized recommendations.
 */
const Recommendations = ({ recommendations = [] }) => {
  // If none, prompt user to go back to quiz.
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
          <a href="/quiz">
            <button
              className={styles.quizBtn}
              style={{
                background: "linear-gradient(92deg, #93bafe 54%, #e3f0ff 110%)",
                color: "#2a6ae7",
                border: "none",
              }}
            >
              Take Quiz
            </button>
          </a>
        </div>
      </div>
    );
  }
  return (
    <section className={styles.recommendationsSection}>
      <h2 className={styles.heading} style={{
        color: "#2a6ae7"
      }}>
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
