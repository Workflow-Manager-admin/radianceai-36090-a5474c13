import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useProducts from "../../hooks/useProducts";
import { MotionWrapper } from "../../utils/animation";

/**
 * PUBLIC_INTERFACE
 * Home (landing) page: Dynamic product cards filtered by concern, with pill-shaped selectors.
 *
 * Refactored to remove all pink (#fadadd, #f339db, etc.) and use neutral/theme blue shades. Cards open modals on click for product details.
 */

// All pink/secondary color replacements use blue/gray theme
const CONCERNS = [
  { key: "brightening", label: "Brightening", icon: "✨" },
  { key: "acne", label: "Acne", icon: "🛡️" },
  { key: "hydration", label: "Hydration", icon: "💧" },
  { key: "antiaging", label: "Anti-Aging", icon: "🕰️" },
  { key: "sensitivity", label: "Sensitivity", icon: "🍃" },
];

// Transition animation presets
const sectionFade = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.68, type: "spring", bounce: 0.24 }},
};
const pillStyle = (active) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "none",
  padding: "9px 22px",
  borderRadius: 30,
  fontWeight: 700,
  fontSize: 16,
  cursor: "pointer",
  background: active
    ? "linear-gradient(92deg, #2050aa 90%, #77a6ed 130%)"
    : "linear-gradient(92deg,#dde9ff 10%,#e9f6fb 120%)",
  color: active ? "#fff" : "#233869",
  boxShadow: active
    ? "0 2.5px 14px #4894f522"
    : "0 1.5px 7px #a2c5e844",
  marginRight: 13,
  marginBottom: 10,
  transition: "all .15s cubic-bezier(.27,1.36,.48,1)"
});
const productCardStyle = {
  minWidth: 236,
  flex: "0 0 236px",
  background: "linear-gradient(104deg,#ebf4ff 60%,#dbe9fe 100%)",
  borderRadius: 20,
  boxShadow: "0 2px 18px #a8d4fc44",
  padding: "19px 13px 18px 13px",
  marginBottom: 7,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  scrollSnapAlign: "start",
  cursor: "pointer"
};

// Modal for details
function ProductModal({ open, onClose, product }) {
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
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(36,58,125,0.23)",
          backdropFilter: "blur(4.5px)",
          zIndex: 5000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onClick={onClose}
        aria-label="Product modal background"
      >
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.93 }}
          transition={{ duration: 0.33, type: "spring", bounce: 0.28 }}
          style={{
            minWidth: 300, maxWidth: 420,
            width: "94vw",
            background: "linear-gradient(101deg, #fbfcff 0%, #dcf2fe 80%)",
            borderRadius: 30,
            boxShadow: "0 8px 48px 0 #3388e726, 0 2px 6px #bcdcfd42",
            padding: "32px 20px 22px 20px",
            position: "relative",
            display: "flex", flexDirection: "column", alignItems: "center",
            outline: "none"
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          {/* Close btn */}
          <button
            aria-label="Close"
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12, right: 12,
              background: "#edf3fc",
              border: "none", color: "#2050aa",
              fontWeight: 900, fontSize: 25, borderRadius: 17,
              width: 32, height: 32, cursor: "pointer", opacity: 0.68,
              boxShadow: "0 1.5px 10px #cfe8ff"
            }}
          >&times;</button>
          <img
            src={product?.thumbnail}
            alt={product?.title}
            style={{
              width: 90, height: 90,
              borderRadius: 18,
              objectFit: "cover",
              marginBottom: 14,
              boxShadow: "0 2.5px 14px #4894f513",
              background: "#fff"
            }}
            loading="lazy"
          />
          <div style={{
            fontWeight: 800, color: "#2050aa",
            fontSize: "1.13em", textAlign: "center", marginBottom: 4
          }}>{product?.title}</div>
          <div style={{
            color: "#2779c6", fontWeight: 700, marginBottom: 3
          }}>
            Brand: <span style={{ color: "#206bb6" }}>{product?.brand}</span>
          </div>
          <div style={{
            fontWeight: 700, color: "#1663b7", fontSize: 15.5, marginBottom: 2
          }}>
            {product?.currency === "INR" || product?.isLocalIN ? "₹" : "$"}
            {product?.price}
          </div>
          <div style={{
            fontSize: 14.2, color: "#24528a", opacity: 0.81, textAlign: "center", marginBottom: 8
          }}>
            {product?.description}
          </div>
          <div style={{
            color: "#679cf3", fontSize: 13.2, margin: "3px 0 7px 0", minHeight: 15
          }}>
            Rating: <b>{product?.rating}</b>{" "}
            {product?.stock < 15 && <span style={{
              color: "#ca3838", fontWeight: 600, fontSize: 12.3, marginLeft: 9
            }}>Low stock</span>}
          </div>
          <div style={{
            color: "#3977bf", fontSize: 13.7, opacity: 0.74, marginBottom: 7
          }}>
            Category: {product?.category}
          </div>
          <div style={{
            margin: "16px auto 0 auto"
          }}>
            {product?.link &&
              <a href={product.link} rel="noopener noreferrer" target="_blank"
                style={{
                  background: "linear-gradient(91deg,#1d7ae1 38%,#48bcfb 100%)",
                  color: "#fff", borderRadius: 10, fontWeight: 700,
                  fontSize: 14.3, padding: "9px 27px", textDecoration: "none",
                  boxShadow: "0 1px 12px #a8d4fc18"
                }}
              >View on Store →</a>
            }
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const Home = () => {
  // State for selected concern
  const [selected, setSelected] = useState(CONCERNS[0].key);

  // Modal open state
  const [modalProduct, setModalProduct] = useState(null);

  // Fetch all products, and allow client-side filtering for demo purposes
  const { recommended, loading } = useProducts({
    sortBy: "rating",
    limit: 14,
    minRating: 3.5,
    deduplicate: true,
  });

  // Simulate concern-to-product mapping for filtering
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(recommended)) return [];
    if (!selected) return recommended.slice(0, 8);
    // Map concern to match title, category or keywords string match
    return recommended.filter((prod) =>
      [
        prod.title?.toLowerCase(),
        prod.category?.toLowerCase(),
        ...(prod.keywords || [])
      ]
        .join(" ")
        .includes(selected)
    );
  }, [recommended, selected]);

  return (
    <div className="container" style={{maxWidth: 1060, margin: "0 auto", padding: 0}}>
      <MotionWrapper>
        {/* HERO SECTION */}
        <motion.section
          style={{
            background: "linear-gradient(98deg, #182349 77%, #e2f0fa14 100%)",
            borderRadius: 32,
            boxShadow: "0 4px 44px #83b2e916",
            padding: "48px 14px 42px 14px",
            margin: "28px 0 0 0",
            position: "relative",
            minHeight: 210,
          }}
          variants={sectionFade}
          initial="initial"
          animate="animate"
        >
          <div style={{
            textAlign: "center",
            maxWidth: 630,
            margin: "0 auto"
          }}>
            <div style={{
              fontWeight: 600,
              fontSize: "1.36em",
              color: "#417ddc",
              letterSpacing: ".04em",
              marginBottom: 4
            }}>
              GlowSkin by RadianceAI
            </div>
            <h1
              style={{
                fontWeight: 900,
                fontSize: "2.54em",
                background: "linear-gradient(92deg,#338af1 56%,#1a3770 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: ".01em",
                margin: "0 0 10px 0",
                padding: 0,
                lineHeight: 1.07
              }}
            >
              AI-Powered Skincare Guidance & Routines
            </h1>
            <div style={{
              fontSize: "1.13em",
              color: "#87bcfa",
              margin: "0 0 27px 0",
              opacity: 0.99
            }}>
              Unlock your ideal skincare routine with science-backed, personalized recommendations and trend-driven best sellers.
            </div>
            <motion.button
              onClick={() => window.location.href="/recommendations"}
              style={{
                background: "linear-gradient(91deg, #2e6ff2 49%, #7bb7fe 100%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.01em",
                padding: "13px 36px",
                borderRadius: 16,
                border: "none",
                boxShadow: "0 4px 15px #417aec28",
                margin: "6px 0 0 0",
                cursor: "pointer",
                letterSpacing: ".01em"
              }}
              whileHover={{ scale: 1.072, boxShadow: "0 8px 28px #7db6f72f" }}
              whileTap={{ scale: 0.96 }}
              aria-label="See recommendations"
            >
              See Recommendations
            </motion.button>
            <div style={{marginTop: 16}}>
              <button
                className="btn btn-large"
                style={{
                  background: "#eaf5ff",
                  border: "2px solid #90c4fa",
                  color: "#206bb6",
                  fontWeight: 700,
                  fontSize: "1.09em",
                  borderRadius: 13,
                  margin: "3px 4px 0 4px",
                  outline: "none",
                  boxShadow: "none",
                  transition: "background .15s"
                }}
                onClick={() => window.location.href="/quiz"}
              >
                Take the Personalized Quiz
              </button>
            </div>
          </div>
        </motion.section>
        {/* PILL CONCERN FILTER */}
        <motion.section
          style={{ marginTop: 34, marginBottom: 18 }}
          variants={sectionFade}
          initial="initial"
          animate="animate"
        >
          <div style={{
            color: "#266fd6",
            fontWeight: 700,
            fontSize: "1.18em",
            margin: "0 0 17px 2px"
          }}>
            Filter by Concern
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
            {CONCERNS.map((c) => (
              <button
                key={c.key}
                style={pillStyle(selected === c.key)}
                onClick={() => setSelected(c.key)}
                aria-label={`Show products for ${c.label}`}
              >
                <span style={{fontSize: 20}}>{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
        </motion.section>
        {/* PRODUCT CARDS MODAL SECTION */}
        <motion.section
          style={{
            margin: "18px 0 30px 0",
            padding: "0 0 8px 0"
          }}
          variants={sectionFade}
          initial="initial"
          animate="animate"
        >
          {loading ? (
            <div style={{
              color: "#266fd6",
              fontWeight: 600,
              textAlign: "center",
              margin: "32px 0",
              fontSize: 22,
            }}>
              Loading products…
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{
              color: "#7bb7fe",
              margin: "18px 0",
              textAlign: "center",
              fontSize: 18,
            }}>
              No products for this concern.
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
                display: "flex",
                gap: 23,
                padding: "7px 9px 10px 7px",
                scrollSnapType: "x mandatory",
                margin: "0 -7px 0 0"
              }}
            >
              {filteredProducts.map((prod, idx) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.14 + idx*0.09, duration: 0.43, type: "spring", bounce: 0.26 } }}
                  whileHover={{ scale: 1.065, boxShadow: "0 4px 18px #a8d4fc4a" }}
                  style={productCardStyle}
                  tabIndex={0}
                  aria-label={`View details for ${prod.title}`}
                  onClick={() => setModalProduct(prod)}
                >
                  <img
                    src={prod.thumbnail}
                    alt={prod.title}
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: 15,
                      objectFit: "cover",
                      boxShadow: "0 2.5px 13px #4894f513",
                      marginBottom: 13,
                      background: "#fff"
                    }}
                    loading="lazy"
                  />
                  <div style={{
                    fontWeight: 700,
                    color: "#2050aa",
                    fontSize: "1.07em",
                    marginBottom: 4,
                    textAlign: "center"
                  }}
                    title={prod.title}
                  >{prod.title.length > 27 ? prod.title.slice(0, 26) + "…" : prod.title}</div>
                  <div style={{
                    color: "#4279bc",
                    fontWeight: 600,
                    fontSize: "1em",
                    marginBottom: 2
                  }}>
                    Brand: <span style={{ color: "#236ac2" }}>{prod.brand}</span>
                  </div>
                  <div style={{
                    fontWeight: 600,
                    color: "#1663b7",
                    fontSize: 15.2,
                    marginBottom: 3
                  }}>
                    {prod.currency === "INR" || prod.isLocalIN ? "₹" : "$"}
                    {prod.price}
                  </div>
                  <div style={{
                    fontSize: 13.1,
                    color: "#2050aa",
                    opacity: 0.78,
                    minHeight: 18,
                    textAlign: "center",
                    marginBottom: 0
                  }}>
                    {prod.description?.length > 34
                      ? prod.description.slice(0, 33) + "…"
                      : prod.description}
                  </div>
                  <button
                    className="btn"
                    style={{
                      background: "linear-gradient(89deg, #1d7ae1 38%, #48bcfb 100%)",
                      color: "#fff",
                      borderRadius: 9,
                      fontWeight: 700,
                      fontSize: 13.4,
                      marginTop: 11,
                      minWidth: 102,
                      border: "none",
                      boxShadow: "0 1px 8px #a8d4fc18",
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
        {modalProduct &&
          <ProductModal open={!!modalProduct} product={modalProduct} onClose={() => setModalProduct(null)} />
        }
      </MotionWrapper>
    </div>
  );
};

export default Home;
