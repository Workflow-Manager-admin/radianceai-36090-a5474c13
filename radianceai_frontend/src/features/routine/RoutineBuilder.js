import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchRecommendedProducts } from "../../api/apiClient";
import { AppleFadeTransition, MotionWrapper } from "../../utils/animation";
import useLocalStorage from "../../hooks/useLocalStorage";

/**
 * Routine steps mapped for both morning and night routines
 * Steps mapped to product types/categories in API
 */
const ROUTINE_STEPS = [
  {
    key: "cleanser",
    name: "Cleanser",
    icon: "🧼",
    slot: "morning",
    description: "Removes dirt and excess oil, prepping skin for the day.",
    category: "skincare", // API category
    tags: ["cleanser", "face wash", "gel"],
  },
  {
    key: "toner",
    name: "Toner",
    icon: "💧",
    slot: "morning",
    description: "Balances skin pH, refreshes and delivers hydration.",
    category: "skincare",
    tags: ["toner", "essence"],
  },
  {
    key: "serum",
    name: "Serum",
    icon: "🧪",
    slot: "morning",
    description: "Targets skincare goals: brightening, anti-aging, hydration.",
    category: "skincare",
    tags: ["serum"],
  },
  {
    key: "moisturizer",
    name: "Moisturizer",
    icon: "🥛",
    slot: "morning",
    description: "Hydrates and locks in skincare benefits.",
    category: "skincare",
    tags: ["moisturizer", "cream", "lotion"],
  },
  {
    key: "sunscreen",
    name: "Sunscreen",
    icon: "🌞",
    slot: "morning",
    description: "Shields skin from UV and sun damage.",
    category: "skincare",
    tags: ["sunscreen", "spf"],
    isPrimary: true,
  },
  // Night routine
  {
    key: "cleanser_night",
    name: "Cleanser",
    icon: "🧼",
    slot: "night",
    description: "Removes daily build-up, pollution, and SPF.",
    category: "skincare",
    tags: ["cleanser", "face wash", "gel"],
  },
  {
    key: "treatment",
    name: "Treatment",
    icon: "💊",
    slot: "night",
    description: "Treatments for acne, anti-aging, or other concerns.",
    category: "skincare",
    tags: ["treatment", "retinol", "acne", "serum", "blemish"],
  },
  {
    key: "night_serum",
    name: "Serum / Oil",
    icon: "🌙",
    slot: "night",
    description: "Nourishes skin overnight (serum/face oil).",
    category: "skincare",
    tags: ["serum", "face oil", "night"],
  },
  {
    key: "night_moisturizer",
    name: "Moisturizer",
    icon: "🥛",
    slot: "night",
    description: "Repairs and hydrates skin overnight.",
    category: "skincare",
    tags: ["moisturizer", "cream", "lotion", "night"],
    isPrimary: true,
  },
];


// Helper to personalize step order based on quiz answers
function getRoutineSteps(slot, quiz) {
  // Reorders, removes, or highlights steps based on quiz
  // (For now: assign all, enhance if quiz provided)
  let steps = ROUTINE_STEPS.filter((s) => s.slot === slot);
  // Example: if sensitive skin, remove "treatment"
  if (quiz?.skinType === "sensitive") {
    steps = steps.filter((s) => s.key !== "treatment");
  }
  return steps;
}

// Tag matching for product fetching
function tagsMatch(product, tags = []) {
  // Check if product title/category/keywords matches tags (fuzzy)
  const haystack =
    [
      product.title,
      product.brand,
      product.category,
      ...(product.tags || []),
      product.description,
    ]
      .join(" ")
      .toLowerCase() || "";
  return tags.some((tag) => haystack.includes(tag));
}

// Animated, Expandable Product Card
function AnimatedProductCard({ step, product, expanded, onToggle }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 22, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.98 }}
      transition={{
        duration: 0.32,
        ease: [0.39, 1.22, 0.48, 1],
      }}
      style={{
        marginBottom: 18,
        background:
          "linear-gradient(101deg,#1c1850bb 10%,#fadadd10 100%)",
        borderRadius: 19,
        padding: expanded ? "28px 24px" : "17px 18px",
        boxShadow: expanded
          ? "0 4px 18px 0 #fadadd62"
          : "0 1.5px 7px 0 #fadadd1b",
        border: step.isPrimary
          ? "2.2px solid #fadadd"
          : "1.5px solid #fadadd29",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        cursor: "pointer",
        position: "relative",
        transition: "box-shadow 0.2s",
      }}
      onClick={onToggle}
      aria-expanded={expanded}
      tabIndex={0}
      role="button"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <span
          style={{
            fontSize: 27,
            marginRight: 3,
            filter: "drop-shadow(0 0 2px #fadadd7c)",
          }}
        >
          {step.icon}
        </span>
        <div>
          <div
            style={{
              fontWeight: 700,
              color: "#fadadd",
              fontSize: 19,
              marginBottom: 2,
            }}
          >
            {step.name}
            {step.isPrimary && (
              <span
                style={{
                  background: "#fadadd",
                  color: "#27174e",
                  fontWeight: 600,
                  borderRadius: 8,
                  fontSize: 12.5,
                  marginLeft: 8,
                  padding: "2.2px 8px",
                  letterSpacing: ".03em",
                  position: "relative",
                  top: -1,
                }}
              >
                Must-have
              </span>
            )}
          </div>
          <div
            style={{
              color: "#e7b3ff",
              opacity: 0.94,
              fontWeight: 500,
              fontSize: 14.2,
              marginBottom: 1,
            }}
          >
            {step.description}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {expanded && product && (
          <motion.div
            layout
            key="expandedCard"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.33,
              ease: [0.36, 1.12, 0.52, 1],
            }}
            style={{
              width: "100%",
              overflow: "hidden",
              marginTop: 19,
            }}
          >
            {/* Product details */}
            <div style={{display: "flex", gap: 18, alignItems: "center" }}>
              <img
                src={product.thumbnail}
                alt={product.title}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 13,
                  boxShadow: "0 2px 12px #fadadd39",
                  background: "#fff",
                  objectFit: "cover",
                  marginRight: 0,
                }}
              />
              <div style={{flex: 1}}>
                <div
                  style={{
                    fontWeight: 600,
                    color: "#fadadd",
                    fontSize: 16.9,
                    marginBottom: 2,
                  }}
                  title={product.title}
                >
                  {product.title}
                </div>
                <div
                  style={{
                    color: "#f339db",
                    fontWeight: 500,
                    fontSize: 14.7,
                  }}
                >
                  Brand: {product.brand}
                </div>
                <div style={{color: "#e7b3ff", fontSize: 13.8, margin: "3px 0 2px 0"}}>
                  Price: <span style={{color:'#fadadd', fontWeight:600}}>${product.price}</span>
                  <span style={{marginLeft:7, color:"#fadadd"}}>Rating: ★ {product.rating}</span>
                </div>
                <div style={{color: "#fff", fontSize:13.5, opacity: 0.78, minHeight: 20, marginTop: 3}}>
                  {product.description && product.description.length > 60
                    ? product.description.slice(0, 60) + "…"
                    : product.description}
                </div>
                {product.link && (
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      color: "#fff",
                      background: "linear-gradient(92deg, #f339db 60%, #e7b3ff 100%)",
                      borderRadius: 7,
                      fontSize: 12.8,
                      padding: "6px 15px",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    View Product →
                  </a>
                )}
              </div>
            </div>
            <div
              style={{
                marginTop: 13,
                color: "#fadadd",
                fontWeight: 500,
                fontSize: 13.1,
                letterSpacing: ".01em",
              }}
            >
              Usage Tip: <span style={{ color: "#fff", fontWeight: 400 }}>{expandUsageTip(step, product)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Helper: usage tips per step and product
function expandUsageTip(step, product) {
  // Example tip (could be enhanced)
  if (!product) return "";
  switch (step.key) {
    case "cleanser":
    case "cleanser_night":
      return "Massage onto damp skin for 30–60 seconds, rinse with lukewarm water.";
    case "serum":
    case "night_serum":
      return "Apply 2–3 drops and gently pat into skin post-toner.";
    case "toner":
      return "Sweep over clean skin with cotton pad or press in with palms.";
    case "treatment":
      return "Use small amount on targeted areas after cleansing, before moisturizer.";
    case "moisturizer":
    case "night_moisturizer":
      return "Apply evenly to face and neck as the final step.";
    case "sunscreen":
      return "Apply generously as the final step in morning routine. Reapply every 2–3 hours when exposed to sun.";
    default:
      return "See product label for usage instructions.";
  }
}


// PUBLIC_INTERFACE
/**
 * RoutineBuilder: generates personalized routines and displays as animated cards.
 */
const RoutineBuilder = () => {
  // Retrieve user's quiz answers from localStorage
  // - Key convention: "quizAnswers"
  const [quizAnswers] = useLocalStorage("quizAnswers", null);
  const [routineProducts, setRoutineProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedStep, setExpandedStep] = useState(null);

  // Map skin goals/budget to API queries
  useEffect(() => {
    let isMounted = true;
    async function buildRoutine() {
      setLoading(true);
      const freshProducts = {};
      // For each step, fetch a relevant product based on quiz answers
      // Could enhance by fetching once and matching locally if needed
      for (let slot of ["morning", "night"]) {
        const steps = getRoutineSteps(slot, quizAnswers);
        for (let step of steps) {
          // Determine quiz influence for tags/category
          let tags = [...step.tags];

          // If quiz has goals, boost most relevant tags for serums/treatments
          if (
            (step.key === "serum" || step.key === "night_serum" || step.key === "treatment") &&
            quizAnswers?.goals &&
            Array.isArray(quizAnswers.goals)
          ) {
            tags = [
              ...tags,
              ...quizAnswers.goals.map((g) =>
                g
                  .toLowerCase()
                  .replace(/[^a-z]/g, "")
                  .slice(0, 10)
              ),
            ];
          }

          // Map budget to price, if supported, but DummyJSON won't filter
          let minRating = 3.7;
          let limit = 16;

          const products = await fetchRecommendedProducts({
            limit,
            minRating,
            // Could add category: step.category,
          });

          // Fuzzy match by tags/goals first; fallback to any with required keyword
          let matched =
            products.find((p) => tagsMatch(p, tags)) ||
            products.find((p) => tagsMatch(p, [step.key])) ||
            products[Math.floor(Math.random() * products.length)];

          freshProducts[step.key] = matched;
        }
      }
      if (isMounted) {
        setRoutineProducts(freshProducts);
        setLoading(false);
      }
    }
    buildRoutine();
    return () => {
      isMounted = false;
    };
    // trigger rebuild if quiz answers change
  }, [quizAnswers]);

  // If no quiz data, show prompt
  if (!quizAnswers) {
    return (
      <section className="container" style={{ minHeight: 433, textAlign: "center", paddingTop: 25 }}>
        <AppleFadeTransition>
          <h2 style={{ color: "#fadadd" }}>Build Your Skincare Routine</h2>
          <p style={{ color: "#e7b3ff", margin: "14px 0 30px 0", fontSize: 18 }}>
            Please complete the <a href="/quiz" style={{ color: "#f339db", fontWeight: 600 }}>personalized quiz</a> to generate your custom morning and night routines.
          </p>
          <a href="/quiz">
            <button className="btn btn-large" style={{
              background: "linear-gradient(90deg,#fadadd 60%,#e7b3ff 100%)",
              color: "#27275e", borderRadius: 15,
              fontWeight: 700, fontSize: "1.12rem"
            }}>
              Start Quiz
            </button>
          </a>
        </AppleFadeTransition>
      </section>
    );
  }

  // Main: routines are ready
  return (
    <section className="container" style={{ maxWidth: 800, margin: "0 auto" }}>
      <AppleFadeTransition>
        <h2 style={{
          color: "#fadadd", fontWeight: 700, fontSize: "2.0rem", marginTop: 17, marginBottom: 7, textAlign: "center"
        }}>
          Your Personalized Routines
        </h2>
        <div style={{ textAlign: "center", color: "#e7b3ff", margin: "0 0 16px 0", fontSize: 17 }}>
          Morning and night routines crafted for your skin, goals, and preferences.
        </div>
        {/* Routine cards */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 43,
          margin: "36px 0 22px 0"
        }}>
          {/* Morning routine */}
          <MotionWrapper>
            <div>
              <div style={{
                color: "#fadadd", fontWeight: 600, fontSize: "1.25rem", marginBottom: 15,
                letterSpacing: ".01em", display: "flex", alignItems: "center"
              }}>
                <span style={{
                  fontSize: 23,
                  marginRight: 5,
                  filter: "drop-shadow(0 1px 3px #fadadd90)"
                }}>🌞</span>Morning Routine
              </div>
              <div>
                {getRoutineSteps("morning", quizAnswers).map((step) => (
                  <AnimatedProductCard
                    key={step.key}
                    step={step}
                    product={routineProducts[step.key]}
                    expanded={expandedStep === step.key}
                    onToggle={(e) => {
                      e?.stopPropagation();
                      setExpandedStep(expandedStep === step.key ? null : step.key);
                    }}
                  />
                ))}
              </div>
            </div>
          </MotionWrapper>
          {/* Night routine */}
          <MotionWrapper>
            <div>
              <div style={{
                color: "#fadadd", fontWeight: 600, fontSize: "1.25rem", marginBottom: 15,
                letterSpacing: ".01em", display: "flex", alignItems: "center"
              }}>
                <span style={{
                  fontSize: 23,
                  marginRight: 5,
                  filter: "drop-shadow(0 1px 3px #fadadd90)"
                }}>🌙</span>Night Routine
              </div>
              <div>
                {getRoutineSteps("night", quizAnswers).map((step) => (
                  <AnimatedProductCard
                    key={step.key}
                    step={step}
                    product={routineProducts[step.key]}
                    expanded={expandedStep === step.key}
                    onToggle={(e) => {
                      e?.stopPropagation();
                      setExpandedStep(expandedStep === step.key ? null : step.key);
                    }}
                  />
                ))}
              </div>
            </div>
          </MotionWrapper>
        </div>
        <div style={{
          marginTop: 24,
          color: "#fadadd",
          textAlign: "center",
          fontSize: 15.2,
          opacity: 0.86
        }}>
          Tap a step to expand. For a new routine, <a href="/quiz" style={{ color: "#f339db", fontWeight: 500 }}>retake the quiz</a>.
        </div>
      </AppleFadeTransition>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.93 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              zIndex: 2999,
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              background: "rgba(23,9,87,0.87)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              color: "#fadadd",
              fontWeight: 600,
              pointerEvents: "all",
            }}
          >
            Building your routine…
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RoutineBuilder;
