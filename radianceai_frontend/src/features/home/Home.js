import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MotionWrapper } from "../../utils/animation";
import { motion } from "framer-motion";
import useProducts from "../../hooks/useProducts";

/**
 * PUBLIC_INTERFACE
 * Home (landing) page redesigned based on radianceaihome1 and home2 screenshots.
 * - Soft hero with brand, tagline, main CTA
 * - Prominent best-sellers carousel (horizontal scroll) under hero
 * - Secondary CTA: "Take Quiz"
 * - Category tiles scroll horizontally (subtler, not visually dominant)
 * - Overall: light, elegant, premium, soft shadows and rounded corners
 */

const CATEGORIES = [
  {
    key: "brightening",
    label: "Skin Brightening",
    icon: "✨",
    color: "linear-gradient(100deg, #fadadd 80%, #e7b3ff 100%)",
    to: "/recommendations?cat=brightening",
    description: "Even tone, radiance"
  },
  {
    key: "acne",
    label: "Acne Removal",
    icon: "🛡️",
    color: "linear-gradient(100deg, #f339db 65%, #e7b3ff 100%)",
    to: "/recommendations?cat=acne",
    description: "Fight blemishes"
  },
  {
    key: "hydration",
    label: "Hydration",
    icon: "💧",
    color: "linear-gradient(100deg, #e7b3ff 60%, #fadadd 100%)",
    to: "/recommendations?cat=hydration",
    description: "Glowing hydration"
  },
  {
    key: "antiaging",
    label: "Anti-Aging",
    icon: "🕰️",
    color: "linear-gradient(94deg, #fadadd 50%, #e7b3ff 90%)",
    to: "/recommendations?cat=antiaging",
    description: "Youthful skin"
  },
  {
    key: "sensitivity",
    label: "Sensitivity",
    icon: "🍃",
    color: "linear-gradient(91deg, #fadadd 45%, #e7b3ff 97%)",
    to: "/recommendations?cat=sensitivity",
    description: "Calming care"
  }
];

// Animation for CTAs and sections
const sectionFade = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.68, type: "spring", bounce: 0.24 }},
};

const tileVariants = {
  initial: { opacity: 0, x: 40, scale: 0.96 },
  animate: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: 0.03 + i * 0.12,
      type: "spring",
      bounce: 0.18,
      duration: 0.56,
      stiffness: 162
    }
  }),
  whileHover: { scale: 1.04, boxShadow: "0 4px 32px #fadadd55" },
  whileTap: { scale: 0.98 }
};

const Home = () => {
  const navigate = useNavigate();

  // Get the top 5 recommended products for the horizontal best-seller carousel (not videos)
  const { recommended, loading } = useProducts({
    sortBy: "rating",
    limit: 5,
    minRating: 4,
    deduplicate: true
  });

  // Horizontally scrollable best-seller carousel (products, not videos for homepage per brief)
  const bestSellers = useMemo(() => {
    if (Array.isArray(recommended) && recommended.length > 0) {
      return recommended;
    }
    return [];
  }, [recommended]);

  return (
    <div className="container" style={{maxWidth: 1050, margin: "0 auto", padding: 0}}>
      <MotionWrapper>
        {/* HERO SECTION */}
        <motion.section
          style={{
            background: "linear-gradient(98deg, #1a1a1a 70%, #fadadd10 100%)",
            borderRadius: 32,
            boxShadow: "0 4px 44px #fadadd23",
            padding: "48px 14px 42px 14px",
            margin: "28px 0 0 0",
            position: "relative",
            minHeight: 235
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
              color: "#fadadd",
              letterSpacing: ".04em",
              marginBottom: 4
            }}>
              GlowSkin by RadianceAI
            </div>
            <h1
              style={{
                fontWeight: 900,
                fontSize: "2.54em",
                background: "linear-gradient(92deg, #fadadd 50%, #e7b3ff 100%)",
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
              fontSize: "1.15em",
              color: "#e7b3ff",
              margin: "0 0 27px 0",
              opacity: 0.96
            }}>
              Unlock your ideal skincare routine with science-backed, personalized recommendations and trend-driven best sellers.
            </div>
            <motion.button
              onClick={() => navigate("/recommendations")}
              style={{
                background: "linear-gradient(93deg,#fadadd 38%,#e7b3ff 100%)",
                color: "#23155f",
                fontWeight: 800,
                fontSize: "1.07em",
                padding: "14px 42px",
                borderRadius: 15,
                border: "none",
                boxShadow: "0 4px 16px #fadadd2a",
                margin: "6px 0 0 0",
                cursor: "pointer",
                transition: "all 0.16s",
                letterSpacing: ".01em"
              }}
              whileHover={{ scale: 1.075, boxShadow: "0 8px 28px #fadadd42" }}
              whileTap={{ scale: 0.96 }}
              aria-label="See recommendations"
            >
              See Recommendations
            </motion.button>
            <div style={{marginTop: 16}}>
              <button
                className="btn btn-large"
                style={{
                  background: "rgba(234,179,255,0.16)",
                  border: "2px solid #fadadd63",
                  color: "#fadadd",
                  fontWeight: 700,
                  fontSize: "1.1em",
                  borderRadius: 13,
                  margin: "3px 4px 0 4px",
                  outline: "none",
                  boxShadow: "none"
                }}
                onClick={() => navigate("/quiz")}
              >
                Take the Personalized Quiz
              </button>
            </div>
          </div>
        </motion.section>
        {/* BEST SELLERS CAROUSEL */}
        <motion.section
          style={{
            margin: "34px 0 0 0",
            padding: "0 0 14px 0"
          }}
          variants={sectionFade}
          initial="initial"
          animate="animate"
        >
          <div style={{
            color: "#fadadd",
            fontWeight: 700,
            fontSize: "1.31em",
            margin: "0 0 10px 10px",
            letterSpacing: ".01em"
          }}>
            Best Sellers
          </div>
          {loading ? (
              <div style={{
                color: "#fadadd",
                fontWeight: 600,
                textAlign: "center",
                margin: "38px 0",
                fontSize: 22,
              }}>
                Loading best sellers…
              </div>
            ) : (
            <div
              style={{
                overflowX: "auto",
                display: "flex",
                gap: 28,
                padding: "7px 9px 10px 9px",
                scrollSnapType: "x mandatory",
                margin: "0 -8px 0 0"
              }}
            >
              {bestSellers.length === 0 && (
                <div style={{ color: "#fadadd", margin: "22px 0" }}>
                  No product data available.
                </div>
              )}
              {bestSellers.map((prod, idx) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.11 + idx*0.11, duration: 0.55, type: "spring", bounce: 0.27 } }}
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 17px #fadadd48" }}
                  style={{
                    minWidth: 238,
                    flex: "0 0 238px",
                    background: "linear-gradient(104deg, #faf0ffbb 70%, #e7b3ff22 100%)",
                    borderRadius: 22,
                    boxShadow: "0 2px 15px #fadadd23",
                    padding: "14px 12px 19px 12px",
                    marginBottom: 6,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    scrollSnapAlign: "start"
                  }}
                >
                  <img
                    src={prod.thumbnail}
                    alt={prod.title}
                    style={{
                      width: 86,
                      height: 86,
                      borderRadius: 13,
                      objectFit: "cover",
                      boxShadow: "0 2.5px 19px #fadadd22",
                      marginBottom: 12,
                      background: "#fff"
                    }}
                    loading="lazy"
                  />
                  <div style={{
                    fontWeight: 700,
                    color: "#27174e",
                    fontSize: "1.09em",
                    marginBottom: 3,
                    textAlign: "center"
                  }}
                    title={prod.title}
                  >{prod.title.length > 28 ? prod.title.slice(0, 27) + "…" : prod.title}</div>
                  <div style={{
                    color: "#f339db",
                    fontWeight: 600,
                    fontSize: "1em",
                    marginBottom: 2
                  }}>
                    Brand: <span style={{ color: "#e7b3ff" }}>{prod.brand}</span>
                  </div>
                  <div style={{
                    fontWeight: 600,
                    color: "#fadadd",
                    fontSize: 15.6,
                    marginBottom: 4
                  }}>
                    {prod.currency === "INR" || prod.isLocalIN ? "₹" : "$"}
                    {prod.price}
                    {prod.isLocalIN && (
                      <span style={{ color: "#f339db", fontSize: 11, marginLeft: 4 }}>India</span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 13.2,
                    color: "#23155f",
                    opacity: 0.73,
                    minHeight: 21,
                    textAlign: "center",
                    marginBottom: 0
                  }}>
                    {prod.description?.length > 35
                      ? prod.description.slice(0, 35) + "…"
                      : prod.description}
                  </div>
                  <button
                    className="btn"
                    style={{
                      background: "linear-gradient(91deg, #fadadd 47%, #e7b3ff 100%)",
                      color: "#23155f",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 14.1,
                      marginTop: 12,
                      minWidth: 130,
                      border: "none",
                      boxShadow: "0 1px 8px #fadadd22",
                      cursor: "pointer"
                    }}
                    onClick={() => navigate("/products")}
                  >
                    Browse More
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
        {/* CATEGORY CAROUSEL: Horizontally scrolling */}
        <motion.section
          style={{
            margin: "32px 0 10px 0"
          }}
          variants={sectionFade}
          initial="initial"
          animate="animate"
        >
          <div style={{
            color: "#fadadd",
            fontWeight: 700,
            fontSize: "1.16em",
            margin: "0 0 8px 10px"
          }}>
            Shop by Concern
          </div>
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: 22,
              padding: "7px 8px",
              scrollbarWidth: "thin",
              msOverflowStyle: "none"
            }}>
            {CATEGORIES.map((cat, idx) => (
              <motion.button
                key={cat.key}
                custom={idx}
                initial="initial"
                animate="animate"
                whileHover="whileHover"
                whileTap="whileTap"
                variants={tileVariants}
                onClick={() => navigate(cat.to)}
                className="category-tile-btn"
                style={{
                  minWidth: 143,
                  minHeight: 113,
                  maxWidth: 170,
                  flex: "0 0 143px",
                  background: cat.color,
                  color: "#23155f",
                  border: "none",
                  borderRadius: 20,
                  boxShadow: "0 2.5px 13px #fadadd23",
                  fontWeight: 700,
                  fontSize: "1.11em",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                  margin: "0",
                  padding: "13px 10px 13px 10px",
                  overflow: "hidden"
                }}
                aria-label={`See products for ${cat.label}`}
              >
                <motion.div
                  style={{
                    fontSize: 32,
                    marginBottom: 2,
                    textShadow: "0 2px 8px #fadadd29"
                  }}
                  initial={{ scale: 0.89 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 160, delay: 0.05 + idx * 0.09 }}
                >
                  {cat.icon}
                </motion.div>
                <div style={{
                  fontWeight: 800,
                  fontSize: "1.03em",
                  color: "#f339db",
                  letterSpacing: ".01em"
                }}>
                  {cat.label}
                </div>
                <div style={{
                  color: "#23155f",
                  fontWeight: 400,
                  fontSize: "0.91em",
                  lineHeight: 1.15,
                  opacity: 0.69,
                  marginTop: 1,
                  textAlign: "center"
                }}>
                  {cat.description}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>
      </MotionWrapper>
    </div>
  );
};

export default Home;
