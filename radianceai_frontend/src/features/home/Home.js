import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import useProducts from "../../hooks/useProducts";
import { MotionWrapper } from "../../utils/animation";

/**
 * PUBLIC_INTERFACE
 * Home (landing) page: Dynamic product cards filtered by concern, with pill-shaped selectors.
 */

const CONCERNS = [
  { key: "brightening", label: "Brightening", icon: "✨" },
  { key: "acne", label: "Acne", icon: "🛡️" },
  { key: "hydration", label: "Hydration", icon: "💧" },
  { key: "antiaging", label: "Anti-Aging", icon: "🕰️" },
  { key: "sensitivity", label: "Sensitivity", icon: "🍃" },
];

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
    ? "linear-gradient(92deg, #23215b 90%, #5496fd 130%)"
    : "linear-gradient(92deg,#e7eafc 10%,#dbecfd 120%)",
  color: active ? "#fff" : "#23215b",
  boxShadow: active
    ? "0 2.5px 13px #63a3ff23"
    : "0 1.5px 7px #d8e7f844",
  marginRight: 13,
  marginBottom: 10,
  transition: "all .15s cubic-bezier(.27,1.36,.48,1)"
});

const productCardStyle = {
  minWidth: 236,
  flex: "0 0 236px",
  background: "linear-gradient(104deg,#ebf4ff 60%,#dde4ff 100%)",
  borderRadius: 20,
  boxShadow: "0 2px 18px #badbf369",
  padding: "19px 13px 18px 13px",
  marginBottom: 7,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  scrollSnapAlign: "start",
};

const Home = () => {
  // State for selected concern
  const [selected, setSelected] = useState(CONCERNS[0].key);

  // Fetch all products, and allow client-side filtering for demo (since API returns limited mapping)
  const { recommended, loading } = useProducts({
    sortBy: "rating",
    limit: 12,
    minRating: 3.5,
    deduplicate: true,
  });

  // Simulate concern-to-product mapping by keywords/category for filtering
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
            background: "linear-gradient(98deg, #1a1a1a 75%, #d2e2f410 100%)",
            borderRadius: 32,
            boxShadow: "0 4px 44px #88bbe123",
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
              color: "#479eff",
              letterSpacing: ".04em",
              marginBottom: 4
            }}>
              GlowSkin by RadianceAI
            </div>
            <h1
              style={{
                fontWeight: 900,
                fontSize: "2.54em",
                background: "linear-gradient(92deg,#479eff 50%,#2a378b 100%)",
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
              color: "#8cbffd",
              margin: "0 0 27px 0",
              opacity: 0.99
            }}>
              Unlock your ideal skincare routine with science-backed, personalized recommendations and trend-driven best sellers.
            </div>
            <motion.button
              onClick={() => window.location.href="/recommendations"}
              style={{
                background: "linear-gradient(91deg, #2889fd 45%, #8eb2fe 100%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.01em",
                padding: "13px 36px",
                borderRadius: 16,
                border: "none",
                boxShadow: "0 4px 15px #417aec36",
                margin: "6px 0 0 0",
                cursor: "pointer",
                letterSpacing: ".01em"
              }}
              whileHover={{ scale: 1.072, boxShadow: "0 8px 28px #9acca72f" }}
              whileTap={{ scale: 0.96 }}
              aria-label="See recommendations"
            >
              See Recommendations
            </motion.button>
            <div style={{marginTop: 16}}>
              <button
                className="btn btn-large"
                style={{
                  background: "#e4efff",
                  border: "2px solid #8ec8ff",
                  color: "#3788be",
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
            color: "#1784e7",
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
              color: "#1784e7",
              fontWeight: 600,
              textAlign: "center",
              margin: "32px 0",
              fontSize: 22,
            }}>
              Loading products…
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{
              color: "#7daffe",
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
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.10 + idx*0.06, duration: 0.44, type: "spring", bounce: 0.26 } }}
                  whileHover={{ scale: 1.06, boxShadow: "0 4px 18px #69acf82a" }}
                  style={productCardStyle}
                  tabIndex={0}
                  aria-label={`View details for ${prod.title}`}
                  onClick={() => window.open(prod.link || "/products", "_blank")}
                >
                  <img
                    src={prod.thumbnail}
                    alt={prod.title}
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: 15,
                      objectFit: "cover",
                      boxShadow: "0 2.5px 13px #476eec29",
                      marginBottom: 13,
                      background: "#fff"
                    }}
                    loading="lazy"
                  />
                  <div style={{
                    fontWeight: 700,
                    color: "#285598",
                    fontSize: "1.07em",
                    marginBottom: 4,
                    textAlign: "center"
                  }}
                    title={prod.title}
                  >{prod.title.length > 27 ? prod.title.slice(0, 26) + "…" : prod.title}</div>
                  <div style={{
                    color: "#6eabe6",
                    fontWeight: 600,
                    fontSize: "1em",
                    marginBottom: 2
                  }}>
                    Brand: <span style={{ color: "#398af6" }}>{prod.brand}</span>
                  </div>
                  <div style={{
                    fontWeight: 600,
                    color: "#1790ea",
                    fontSize: 15.2,
                    marginBottom: 3
                  }}>
                    {prod.currency === "INR" || prod.isLocalIN ? "₹" : "$"}
                    {prod.price}
                  </div>
                  <div style={{
                    fontSize: 13.1,
                    color: "#285598",
                    opacity: 0.75,
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
                      boxShadow: "0 1px 8px #b8e1ff22",
                      cursor: "pointer"
                    }}
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
};

export default Home;
