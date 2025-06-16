import React from "react";
import styles from "./RecommendationCard.module.css";

/**
 * Displays a single product recommendation.
 */
function RecommendationCard({ data, index }) {
  return (
    <div
      className={styles.card}
      style={{
        background: "linear-gradient(90deg, #e3f0ff 45%, #93bafe 100%)",
        border: "2px solid #93bafe",
        boxShadow: "0 2px 18px #93bafe55",
        outline: "none",
      }}
      tabIndex={0}
      onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 12px 3px #2a6ae7cc")}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "0 2px 18px #93bafe55")}
    >
      <div
        className={styles.badge}
        style={{
          background: "#2a6ae7",
          color: "#fff",
          border: "2px solid #93bafe",
        }}
      >
        #{index + 1}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTitle}>
          <span
            style={{
              color: "#2a6ae7",
              fontWeight: 700,
              background: "#93bafe33",
              borderRadius: 7,
              padding: "1px 7px",
            }}
          >
            {data.title || "Untitled Recommendation"}
          </span>
        </div>
        <div className={styles.cardDetails}>
          <span style={{ color: "#2a6ae7", fontWeight: 700 }}>
            {data.category || "General"}
          </span>
          <span style={{ color: "#2a6ae7", marginLeft: 7 }}>
            {data.brand || "Unknown Brand"}
          </span>
        </div>
        <div className={styles.cardInfo} style={{ color: "#47567f" }}>
          {data.description || "No description available."}
        </div>
        <div className={styles.actions}>
          {data.link ? (
            <a
              className={styles.detailsBtn}
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "linear-gradient(94deg, #2a6ae7 52%, #93bafe 110%)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 6,
                padding: "8px 14px",
                textDecoration: "none",
                display: "inline-block",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "linear-gradient(94deg, #1f52c7 52%, #7ea7f3 110%)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "linear-gradient(94deg, #2a6ae7 52%, #93bafe 110%)")
              }
            >
              Learn More
            </a>
          ) : (
            <span
              style={{
                color: "#888",
                fontStyle: "italic",
                fontSize: 14,
              }}
            >
              No link available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecommendationCard;
