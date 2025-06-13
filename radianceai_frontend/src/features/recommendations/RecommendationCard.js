import React from "react";
import styles from "./RecommendationCard.module.css";

/* 
 * RecommendationCard: For each recommended routine step or product.
 * Pink accent: #fadadd, #e7b3ff, #f339db. Blue palette: #93bafe, #e3f0ff, #2a6ae7.
 */

// PUBLIC_INTERFACE
function RecommendationCard({ data = {}, index = 0 }) {
  return (
    <div
      className={styles.card}
      style={{
        background: "linear-gradient(90deg, #e3f0ff 45%, #93bafe 100%)",
        border: "2px solid #93bafe",
        boxShadow: "0 2px 18px #93bafe55"
      }}
      tabIndex={0}
    >
      {/* Badge for step order */}
      <div
        className={styles.badge}
        style={{
          background: "#2a6ae7",
          color: "#fff",
          border: "2px solid #93bafe"
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
              padding: "1px 7px"
            }}
          >
            {data.title}
          </span>
        </div>
        <div className={styles.cardDetails}>
          <span style={{ color: "#e3f0ff", fontWeight: 700 }}>{data.category}</span>
          <span style={{ color: "#2a6ae7", marginLeft: 7 }}>
            {data.brand}
          </span>
        </div>
        <div className={styles.cardInfo}>{data.description}</div>
        <div className={styles.actions}>
          {data.link && (
            <a
              className={styles.detailsBtn}
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "linear-gradient(94deg, #2a6ae7 52%, #93bafe 110%)",
                color: "#fff"
              }}
            >
              Learn More
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecommendationCard;
