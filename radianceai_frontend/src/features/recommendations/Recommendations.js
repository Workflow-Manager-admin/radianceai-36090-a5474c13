import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import useProducts from "../../hooks/useProducts";
import { MotionWrapper } from "../../utils/animation";

/**
 * PUBLIC_INTERFACE
 * Recommendations: Personalized product recommendations using blue palette (RadianceAI branding).
 * All pink/purple color values replaced with blue shades: #e7b3ff (soft), #4682e7 (accent), #2050aa (dark), #77a6ed (light).
 */

const PALETTE = {
  blueSoft: "#e7b3ff",
  blueAccent: "#4682e7",
  blueDark: "#2050aa",
  blueLight: "#77a6ed"
};

const titleStyles = {
  fontWeight: 700,
  fontSize: "2.0rem",
  marginTop: 17,
  marginBottom: 7,
  textAlign: "center",
  color: PALETTE.blueSoft,
};

const sectionTitle = {
  color: PALETTE.blueAccent,
  fontWeight: 600,
  fontSize: "1.18em",
  margin: "0 0 17px 2px"
};

const pillRecommendStyle = (active) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "none",
  padding: "8px 21px",
  borderRadius: 26,
  fontWeight: 700,
  fontSize: 15.2,
  cursor: "pointer",
  background: active
    ? "linear-gradient(93deg, #4682e7 70%, #e7b3ff 120%)"
    : "linear-gradient(93deg,#f0f8ff 13%,#e7b3ff 110%)",
  color: active ? "#fff" : "#2050aa",
  boxShadow: active
    ? "0 2px 13px #4682e722"
    : "0 1px 6px #e7b3ff55",
  marginRight: 9,
  marginBottom: 10,
  transition: "all .14s cubic-bezier(.27,1.36,.48,1)",
});

const productCard = {
  minWidth: 224,
  flex: "0 0 224px",
  background: "linear-gradient(108deg,#e7f2ff 50%,#e7b3ff 100%)",
  borderRadius: 17,
  boxShadow: "0 1px 7px #4682e729",
  padding: "18px 13px 17px 13px",
  marginBottom: 10,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  scrollSnapAlign: "start",
  cursor: "pointer"
};

const CONCERNS = [
  { key: "hydration", label: "Hydration", icon: "💧" },
  { key: "brightening", label: "Brightening", icon: "✨" },
  { key: "acne", label: "Acne", icon: "🛡️" },
  { key: "antiaging", label: "Anti-Aging", icon: "🕰️" },
  { key: "sensitivity", label: "Sensitivity", icon: "🍃" }
];

// PUBLIC_INTERFACE
function Recommendations() {
  const [selectedConcern, setSelectedConcern] = useState("hydration");
  const { recommended, loading } = useProducts({ sortBy: "rating", limit: 16 });

  const filtered = useMemo(() => {
    if (!Array.isArray(recommended)) return [];
    if (!selectedConcern) return recommended.slice(0, 10);
    return recommended.filter(prod =>
      [prod.title, prod.category, ...(prod.keywords || [])]
        .join(" ")
        .toLowerCase()
        .includes(selectedConcern)
    );
  }, [recommended, selectedConcern]);

  return (
    <div className="container" style={{ maxWidth: 900, margin: "0 auto" }}>
      <MotionWrapper>
        <motion.section>
          <h2 style={titleStyles}>Personalized Recommendations</h2>
          <div style={sectionTitle}>Choose a skin concern to explore top picks</div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {CONCERNS.map((c) => (
              <button
                key={c.key}
                style={pillRecommendStyle(selectedConcern === c.key)}
                onClick={() => setSelectedConcern(c.key)}
                aria-label={`Show ${c.label} recommendations`}
              >
                <span style={{ fontSize: 19 }}>{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
        </motion.section>
        <motion.section style={{ margin: "24px 0 0 0" }}>
          {loading ? (
            <div style={{ color: PALETTE.blueAccent, fontWeight: 600, textAlign: "center", fontSize: 22 }}>
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ color: PALETTE.blueSoft, textAlign: "center", fontSize: 17 }}>No recommendations found.</div>
          ) : (
            <div
              style={{
                overflowX: "auto",
                display: "flex",
                gap: 21,
                padding: "7px 9px 10px 7px",
                scrollSnapType: "x mandatory",
                margin: "0 -7px 0 0"
              }}
            >
              {filtered.map((prod, idx) => (
                <motion.div
                  key={prod.id}
                  style={productCard}
                  whileHover={{ scale: 1.045, boxShadow: "0 4px 18px #4682e73a" }}
                  tabIndex={0}
                  aria-label={`See details for ${prod.title}`}
                >
                  <img
                    src={prod.thumbnail}
                    alt={prod.title}
                    style={{
                      width: 74,
                      height: 74,
                      borderRadius: 12,
                      objectFit: "cover",
                      marginBottom: 11,
                      background: "#fff",
                      boxShadow: "0 2.5px 11px #e7b3ff18"
                    }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      fontWeight: 700,
                      color: PALETTE.blueDark,
                      fontSize: "1.01em",
                      marginBottom: 3,
                      textAlign: "center"
                    }}
                    title={prod.title}
                  >{prod.title.length > 25 ? prod.title.slice(0, 24) + "…" : prod.title}</div>
                  <div style={{
                    color: PALETTE.blueAccent,
                    fontWeight: 600,
                    fontSize: "0.99em",
                    marginBottom: 2
                  }}>
                    Brand: <span style={{ color: "#236ac2" }}>{prod.brand}</span>
                  </div>
                  <div style={{
                    fontWeight: 600,
                    color: PALETTE.blueDark,
                    fontSize: 14.5,
                    marginBottom: 2
                  }}>
                    {prod.currency === "INR" || prod.isLocalIN ? "₹" : "$"}
                    {prod.price}
                  </div>
                  <div style={{
                    fontSize: 13.1,
                    color: "#4682e7",
                    opacity: 0.76,
                    minHeight: 18,
                    textAlign: "center",
                    marginBottom: 0
                  }}>
                    {prod.description?.length > 32
                      ? prod.description.slice(0, 31) + "…"
                      : prod.description}
                  </div>
                  <button
                    className="btn"
                    style={{
                      background: "linear-gradient(91deg, #2050aa 38%, #e7b3ff 100%)",
                      color: "#fff",
                      borderRadius: 9,
                      fontWeight: 700,
                      fontSize: 13.3,
                      marginTop: 10,
                      minWidth: 94,
                      border: "none",
                      boxShadow: "0 1px 8px #4682e718",
                      cursor: "pointer"
                    }}
                    tabIndex={-1}
                  >
                    See Details
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </MotionWrapper>
    </div>
  );
}

export default Recommendations;
