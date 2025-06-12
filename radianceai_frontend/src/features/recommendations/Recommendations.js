import React, { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppleFadeTransition } from "../../utils/animation";
import { useProducts } from "../../hooks/useProducts";
import { GlobalStateContext } from "../../context/GlobalStateContext";

// PUBLIC_INTERFACE
/**
 * Recommendations feature: horizontally scrollable, animated carousel
 * Fetches best-selling products and displays them based on quiz result mapping.
 */

function ProductCard({ product }) {
  // Card animation and layout
  return (
    <motion.div
      className="product-card"
      layout
      whileHover={{ scale: 1.03, boxShadow: "0 4px 16px #fadadd33" }}
      style={{
        width: 210,
        background: "linear-gradient(104deg,#faf0ffbb 60%,#e7b3ff25 100%)",
        borderRadius: 18,
        margin: "0 14px 0 0",
        padding: "15px 14px 18px 14px",
        boxShadow: "0 1px 12px 0 #fadadd1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid #fadadd24",
        minHeight: 285,
      }}
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        loading="lazy"
        style={{
          objectFit: "cover",
          width: 120,
          height: 120,
          borderRadius: 12,
          marginBottom: 10,
          boxShadow: "0 2px 10px #e7b3ff28",
          background: "#fff"
        }}
      />
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.08rem",
          color: "#1a1a1a",
          textAlign: "center",
          marginBottom: 2,
        }}
        title={product.title}
      >
        {product.title.length > 30 ? product.title.slice(0, 29) + "…" : product.title}
      </div>
      <div
        style={{
          color: "#e7b3ff",
          fontWeight: 500,
          fontSize: 15.2,
          marginBottom: 2,
          textAlign: "center",
          minHeight: 22,
        }}
      >
        <span style={{ color: "#f339db" }}>Brand:</span> {product.brand}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 7,
          fontSize: 14.5,
          marginBottom: 2,
        }}
      >
        <span style={{ color: "#27275e", fontWeight: 700 }}>
          {product.currency === "INR" || product.isLocalIN ? "₹" : "$"}
          {product.price}
        </span>
        <span style={{ color: "#fadadd" }} title="Product rating">
          ★ {product.rating}
        </span>
        {product.isLocalIN && (
          <span style={{ color: "#f339db", fontSize: 11, marginLeft: 5 }}>
            India
          </span>
        )}
      </div>
      <div style={{
        fontSize: 13.3,
        color: "#23155f",
        minHeight: 45,
        opacity: 0.76,
        margin: "8px 0 0 0",
        textAlign: "center"
      }}>
        {product.description.length > 55
          ? product.description.slice(0, 55) + "…"
          : product.description}
      </div>
      <a
        href={product.link || "#"}
        style={{
          marginTop: 10,
          display: "inline-block",
          color: "#fff",
          background: "linear-gradient(92deg, #f339db 60%, #e7b3ff 100%)",
          borderRadius: 9,
          fontSize: 14.3,
          padding: "7px 17px",
          fontWeight: 600,
          textDecoration: "none"
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        View
      </a>
    </motion.div>
  );
}

function ProductCarousel({ products, scrollRef }) {
  return (
    <motion.div
      className="carousel"
      style={{
        width: "100%",
        overflowX: "auto",
        display: "flex",
        flexDirection: "row",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        margin: "24px 0",
        WebkitOverflowScrolling: "touch",
        paddingBottom: 10,
      }}
      ref={scrollRef}
      whileTap={{ cursor: "grabbing" }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </motion.div>
  );
}

const Recommendations = () => {
  // Access quiz answers from global context (provided by GlobalStateProvider and useQuiz)
  const { quiz } = useContext(GlobalStateContext);
  // quiz.quizAnswers format: { skinType, goals, budget }
  // Defensive fallback: quiz may be undefined on first render
  const quizAnswers = quiz?.quizAnswers || {};

  // --- Parse query param for category ---
  const location = useLocation();
  const navigate = useNavigate();
  const [categoryParam, setCategoryParam] = useState(null);

  useEffect(() => {
    // Parse query string to get ?cat= value
    const params = new URLSearchParams(location.search);
    const cat = params.get("cat");
    setCategoryParam(cat);
  }, [location.search]);

  // Mapping quiz answers to product categories/concerns
  function mapQuizToCategoriesAndConcerns(quizAnswers) {
    // Map quiz goals to product categories
    const goalToCategory = {
      "Hydration":            ["moisturizer", "serum"],
      "Reduce Acne/Blemishes":["acne", "cleanser", "serum"],
      "Even Skin Tone":       ["serum", "toner", "brightening"],
      "Anti-Aging":           ["serum", "moisturizer", "anti-aging"],
      "Minimize Pores":       ["cleanser", "toner", "mask"],
      "Brightening":          ["serum", "brightening", "mask"],
      "Reduce Redness":       ["soothing", "cream", "serum"],
      "Sun Protection":       ["sunscreen", "spf"],
      "Soothe Sensitivity":   ["soothing", "moisturizer", "cream"],
    };

    // The quiz stores goals as an array, other fields as strings.
    const goals = quizAnswers.goals || [];
    const categories = [];
    const concerns = [];

    for (const goal of goals) {
      if (goalToCategory[goal]) {
        for (const cat of goalToCategory[goal]) {
          // Separate 'concerns' like 'acne'/'brightening' and categories like 'serum'
          if (
            ["acne", "anti-aging", "brightening", "soothing"].includes(
              cat.toLowerCase()
            )
          ) {
            concerns.push(cat);
          } else {
            categories.push(cat);
          }
        }
      }
    }

    // Fallback/default if user has not answered/wrong data
    if (categories.length === 0 && categoryParam) {
      categories.push(categoryParam);
    }

    return {
      categories: [...new Set(categories)],
      concerns: [...new Set(concerns)],
    };
  }

  // Get tailored filters based on quiz answers
  const { categories: quizCategories, concerns: quizConcerns } = React.useMemo(
    () => mapQuizToCategoriesAndConcerns(quizAnswers),
    // Rerun mapping if quiz answers or categoryParam changes
    [quizAnswers, categoryParam]
  );

  // Pass mapped concerns/categories to product hook
  const filterCategories = React.useMemo(() => {
    // URL param beats quiz by user intent, fallback to mapped quiz categories, then []
    if (categoryParam) return [categoryParam];
    if (quizCategories) return quizCategories;
    return [];
  }, [categoryParam, quizCategories]);

  const filterConcerns = React.useMemo(() => {
    // Quiz concerns, or none
    return quizConcerns || [];
  }, [quizConcerns]);

  const { recommended } = useProducts({
    concerns: filterConcerns,
    categories: filterCategories,
    limit: 15,
    minRating: 4,
    deduplicate: true,
  });

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const scrollRef = useRef();

  useEffect(() => {
    setLoading(true);
    // recommended is reactive to quizState (concerns/categories) or the cat param if set
    const allowedBrands = [
      "DermaCo",
      "Kiehl's",
      "Minimalist",
      "Plum",
      "Wow",
      "FoxTale"
    ];
    // Normalize for variants like Kiehls, Kiehl’s (“ or other apostrophes)
    function normalizeBrand(brand) {
      if (!brand) return "";
      const str = ("" + brand).trim().toLowerCase().replace(/[’‘`´]/g, "'");
      if (
        str === "kiehl's" ||
        str === "kiehls" ||
        str === "kiehl’s" ||
        str === "kiehls'" ||
        str === "kiels"
      ) return "Kiehl's";
      if (str === "foxtale" || str === "fox tale") return "FoxTale";
      if (str === "the derma co" || str === "dermaco") return "DermaCo";
      if (str === "minimalist") return "Minimalist";
      if (str === "plum") return "Plum";
      if (str === "wow skin science" || str === "wow") return "Wow";
      return brand; // fallback
    }
    if (recommended && Array.isArray(recommended)) {
      setProducts(
        recommended.filter(p =>
          allowedBrands.includes(normalizeBrand(p.brand))
        )
      );
      setLoading(false);
    }
  }, [recommended]);

  const scrollBy = (dx) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dx, behavior: "smooth" });
    }
  };

  return (
    <section className="container" style={{ maxWidth: 1000, margin: "0 auto" }}>
      <AppleFadeTransition>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <h2 style={{
            color: "#fadadd", fontWeight: 700, fontSize: "1.7rem", margin: "22px 0 6px 0"
          }}>
            {categoryParam
              ? `Recommended for ${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}`
              : "Recommended Products"}
          </h2>
          <div style={{
            display: "flex", gap: 8
          }}>
            <button
              aria-label="Scroll left"
              onClick={() => scrollBy(-200)}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 10, transition: "background .18s"
              }}
            >◀︎</button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollBy(200)}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 10, transition: "background .18s"
              }}
            >▶︎</button>
          </div>
        </div>
        {loading ? (
          <div style={{
            textAlign: "center",
            color: "#e7b3ff",
            marginTop: 30,
            fontSize: 18
          }}>Loading recommendations…</div>
        ) : (
          products.length > 0 ? (
            <ProductCarousel products={products} scrollRef={scrollRef} />
          ) : (
            <div style={{
              textAlign: "center",
              marginTop: 25,
              color: "#fadadd"
            }}>No recommendations available.</div>
          )
        )}
        <div style={{
          fontSize: 14.2,
          color: "#e7b3ff",
          textAlign: "center",
          margin: "22px 0"
        }}>
          Need a more tailored routine? <a href="/quiz" style={{color: "#f339db"}}>Take the quiz</a> for best matches!
        </div>
      </AppleFadeTransition>
    </section>
  );
};

export default Recommendations;
