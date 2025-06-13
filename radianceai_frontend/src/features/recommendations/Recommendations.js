import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppleFadeTransition, MotionWrapper } from "../../utils/animation";

/**
 * [RadianceAI Blue Palette Integration]
 * All previous pink values replaced throughout Recommendations with:
 * - blue: #93bafe    (was #fadadd)
 * - blueAccent: #2a6ae7 (was #f339db)
 * - blue2: #e3f0ff   (was #e7b3ff)
 */

const blue = "#93bafe";
const blueAccent = "#2a6ae7";
const blue2 = "#e3f0ff";

// Example recs for demo
const RECOMMENDATION_OPTIONS = [
  { label: "Hydration", value: "hydration" },
  { label: "Brightening", value: "brightening" },
  { label: "Anti-aging", value: "antiaging" },
  { label: "Acne", value: "acne" },
  { label: "Sensitivity", value: "sensitivity" },
];

const RESULT_MOCKS = [
  {
    title: "Kiehl's Ultra Facial Cream",
    desc: "Intense 24-hour hydration for all skin types.",
    badge: "Top Seller",
    url: "#",
    thumbnail: "https://dummyimage.com/120x120/93bafe/fff.png&text=Kiehl's",
    brand: "Kiehl's",
    price: "54",
    rating: "4.7",
    stock: 32,
  },
  {
    title: "Minimalist 10% Niacinamide Serum",
    desc: "Targets pores, blemishes, and uneven tone.",
    badge: "Dermatologist Pick",
    url: "#",
    thumbnail: "https://dummyimage.com/120x120/93bafe/fff.png&text=Niacin",
    brand: "Minimalist",
    price: "12",
    rating: "4.3",
    stock: 14,
  },
];

function Badge({ children }) {
  return (
    <span
      style={{
        background: blue2,
        color: blueAccent,
        fontWeight: 700,
        borderRadius: "50em",
        fontSize: 13.2,
        marginLeft: 8,
        padding: "2.5px 11px",
      }}
    >
      {children}
    </span>
  );
}

function RecommendationModal({ open, onClose, rec }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.98 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(147,186,254,0.22)", // blue overlay
          backdropFilter: "blur(7px)",
          zIndex: 5000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onClose}
        aria-label="Recommendation modal background"
      >
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.93 }}
          transition={{ duration: 0.33, type: "spring", bounce: 0.28 }}
          style={{
            minWidth: 280,
            maxWidth: 400,
            width: "94vw",
            background: "linear-gradient(101deg, #fbfcff 0%, #e3f0ff 85%)",
            borderRadius: 26,
            boxShadow: "0 8px 48px 0 #4894f544",
            padding: "30px 16px 23px 16px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            outline: "none",
          }}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <button
            aria-label="Close"
            onClick={onClose}
            style={{
              position: "absolute",
              top: 10, right: 13,
              background: "#f1f7fe",
              border: "none", color: blueAccent,
              fontWeight: 900, fontSize: 23, borderRadius: 16,
              width: 30, height: 30, cursor: "pointer", opacity: 0.68,
              boxShadow: "0 1.5px 10px #d1e7fe"
            }}
          >&times;</button>
          <img
            src={rec?.thumbnail}
            alt={rec?.title}
            style={{
              width: 78, height: 78,
              borderRadius: 15,
              objectFit: "cover",
              marginBottom: 12,
              boxShadow: "0 2.5px 13px #93bafe1b",
              background: "#fff"
            }}
            loading="lazy"
          />
          <div style={{
            fontWeight: 800, color: blueAccent,
            fontSize: "1.13em", textAlign: "center", marginBottom: 4
          }}>{rec?.title}</div>
          <div style={{
            color: "#4279bc", fontWeight: 700, marginBottom: 3
          }}>
            Brand: <span style={{ color: blueAccent }}>{rec?.brand}</span>
          </div>
          <div style={{
            fontWeight: 700, color: "#1663b7", fontSize: 15.5, marginBottom: 2
          }}>
            ${rec?.price}
          </div>
          <div style={{
            fontSize: 14.2, color: "#24528a", opacity: 0.81, textAlign: "center", marginBottom: 8
          }}>
            {rec?.desc}
          </div>
          <div style={{
            color: "#679cf3", fontSize: 13.2, margin: "3px 0 7px 0", minHeight: 15
          }}>
            Rating: <b>{rec?.rating}</b>{" "}
            {rec?.stock < 15 &&
              <span style={{
                color: "#ca3838", fontWeight: 600, fontSize: 12.3, marginLeft: 9
              }}>Low stock</span>}
          </div>
          <div style={{
            color: "#3977bf", fontSize: 13.7, opacity: 0.74, marginBottom: 7
          }}>
            Category: "Demo"
          </div>
          <div style={{
            margin: "16px auto 0 auto"
          }}>
            {rec?.url &&
              <a href={rec.url} rel="noopener noreferrer" target="_blank"
                style={{
                  background: "linear-gradient(91deg,#2a6ae7 38%,#93bafe 100%)",
                  color: "#fff", borderRadius: 10, fontWeight: 700,
                  fontSize: 14.3, padding: "9px 27px", textDecoration: "none",
                  boxShadow: "0 1px 12px #93bafe18"
                }}
              >View on Store →</a>
            }
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// PUBLIC_INTERFACE
function Recommendations() {
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRec, setModalRec] = useState(null);

  function handleSelectOption(opt) {
    setSelected(opt.value);
  }
  function handleShowDetails(rec) {
    setModalRec(rec);
    setModalOpen(true);
  }
  function handleCloseModal() {
    setModalOpen(false);
    setModalRec(null);
  }
  function handleRecommendations() {
    // Dummy stub for async fetch
    // In a real app, would fetch and update state here
    return;
  }

  return (
    <section className="container" style={{ maxWidth: 640, margin: "0 auto", paddingTop: 32, paddingBottom: 32 }}>
      <AppleFadeTransition>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "1.86em",
            color: blueAccent,
            textAlign: "center",
            margin: "30px 0 8px 0",
            letterSpacing: ".01em"
          }}
        >
          Personalized Product Recommendations
        </h2>
        <div style={{ color: blue, textAlign: "center", margin: "0 0 18px 0", fontWeight: 600, fontSize: "1.13em" }}>
          Choose your main skincare goal to see recommendations.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 8px", justifyContent: "center", marginBottom: 16 }}>
          {RECOMMENDATION_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              style={{
                background:
                  selected === opt.value
                    ? "linear-gradient(97deg,#93bafe 60%,#e3f0ff 100%)"
                    : "#fff",
                border: selected === opt.value
                  ? "2.5px solid #2a6ae7"
                  : "1.2px solid #e3f0ff",
                boxShadow: selected === opt.value
                  ? "0 2.5px 15px #93bafe66"
                  : "0 1px 7px #e3f0ff30",
                color: selected === opt.value ? "#2a6ae7" : "#3a5f94",
                fontWeight: 700,
                borderRadius: 22,
                padding: "12px 22px",
                margin: "0 7px 13px 0",
                cursor: "pointer",
                fontSize: 16,
                transition: "all 0.16s cubic-bezier(.25,1.45,.48,1)"
              }}
              onClick={() => handleSelectOption(opt)}
            >
              {opt.label}
            </div>
          ))}
        </div>
        <button
          className="btn btn-large"
          style={{
            background: "linear-gradient(91deg, #2a6ae7 49%, #93bafe 100%)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1.01em",
            padding: "13px 36px",
            borderRadius: 16,
            border: "none",
            boxShadow: "0 4px 15px #93bafe28",
            margin: "6px 0 0 0",
            cursor: "pointer",
            letterSpacing: ".01em"
          }}
          onClick={handleRecommendations}
          aria-label="Get Recommendations"
        >
          Get Recommendations
        </button>
        <MotionWrapper>
          {/* Simulated result cards */}
          <div style={{ marginTop: 26, marginBottom: 6, gap: 19, display: "flex", flexDirection: "column" }}>
            {RESULT_MOCKS.map((rec, idx) => (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.08 * idx, duration: 0.32 } }}
                whileHover={{ scale: 1.027, boxShadow: "0 4px 22px #93bafe2a" }}
                style={{
                  background: "linear-gradient(97deg,#93bafe 60%,#e3f0ff 100%)",
                  border: "2px solid #2a6ae7",
                  borderRadius: 20,
                  boxShadow: "0 1.5px 10px #93bafe23",
                  padding: "13px 21px 19px 21px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  position: "relative"
                }}
                onClick={() => handleShowDetails(rec)}
                tabIndex={0}
                aria-label={`Show details for ${rec.title}`}
              >
                <img
                  src={rec.thumbnail}
                  alt={rec.title}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 13,
                    objectFit: "cover",
                    marginRight: 17,
                    background: "#fff"
                  }}
                  loading="lazy"
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: blueAccent, fontSize: "1.02em", marginBottom: 3 }}>
                    {rec.title} <Badge>{rec.badge}</Badge>
                  </div>
                  <div style={{ color: "#4179cc", fontWeight: 500, fontSize: 15, marginBottom: 0 }}>
                    {rec.desc}
                  </div>
                  <div style={{ color: "#3878e6", fontWeight: 500, fontSize: 13.6, margin: "5px 0 0 0" }}>
                    Brand: <span style={{ color: blueAccent }}>{rec.brand}</span>
                    <span style={{ marginLeft: 10 }}>Rating: <b>{rec.rating}</b></span>
                  </div>
                  <div style={{ color: "#4179cc", fontSize: 13.2 }}>
                    <span style={{ fontWeight: 600 }}>${rec.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </MotionWrapper>
        <RecommendationModal open={modalOpen} rec={modalRec} onClose={handleCloseModal} />
      </AppleFadeTransition>
    </section>
  );
}

export default Recommendations;
