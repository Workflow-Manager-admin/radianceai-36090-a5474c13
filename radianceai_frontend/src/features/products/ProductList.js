import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchRecommendedProducts } from "../../api/apiClient";
import { AppleFadeTransition, MotionWrapper } from "../../utils/animation";

/**
 * PUBLIC_INTERFACE
 * Animated, expandable list of product cards with detailed views
 * Uses Framer Motion for transitions and Apple-like UI design
 */

// Animated, expandable product card
function AnimatedProductCard({ product, expanded, onToggle }) {
  // Animation variants for expand
  const cardVariants = {
    collapsed: {
      borderRadius: "18px",
      boxShadow: "0 1.5px 7px 0 #fadadd29",
      scale: 1,
      background:
        "linear-gradient(101deg, #201157 70%, #fadadd0c 100%)",
      transition: {
        duration: 0.26,
        type: "spring",
        stiffness: 210,
        damping: 28,
      },
    },
    expanded: {
      borderRadius: "26px",
      boxShadow: "0 8px 22px #fadadd55",
      scale: 1.013,
      background:
        "linear-gradient(101deg,#e7b3ff14 55%,#fadadd18 110%)",
      transition: {
        duration: 0.31,
        type: "spring",
        stiffness: 200,
        damping: 28,
      },
    },
  };

  return (
    <motion.div
      layout
      className="animated-product-card"
      onClick={onToggle}
      variants={cardVariants}
      initial="collapsed"
      animate={expanded ? "expanded" : "collapsed"}
      exit="collapsed"
      style={{
        cursor: "pointer",
        marginBottom: 25,
        marginTop: 3,
        padding: expanded ? "24px 22px" : "14px 14px",
        border: "2px solid #fadadd35",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        transition: "border 0.22s",
        position: "relative",
        minHeight: 145,
      }}
      aria-expanded={expanded}
      tabIndex={0}
      role="button"
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 18,
        }}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          style={{
            width: 85,
            height: 85,
            borderRadius: "13px",
            objectFit: "cover",
            background: "#fff",
            boxShadow: "0 1.5px 9px #fadadd23",
            marginBottom: 3,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              color: "#fadadd",
              fontSize: "1.13rem",
              marginBottom: 2,
              letterSpacing: ".01em",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: 210,
            }}
            title={product.title}
          >
            {product.title}
          </div>
          <div
            style={{
              color: "#e7b3ff",
              fontWeight: 500,
              fontSize: 14.3,
              marginBottom: 4,
            }}
          >
            Brand: <span style={{ color: "#f339db" }}>{product.brand}</span>
          </div>
          <div
            style={{
              fontSize: 14.6,
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 2,
            }}
          >
            <span style={{ color: "#fadadd", fontWeight: 600 }}>
              {product.currency === "INR" || product.isLocalIN ? "₹" : "$"}
              {product.price}
              {product.isLocalIN && (
                <span style={{ color: "#f339db", fontSize: 11, marginLeft: 4 }}>India</span>
              )}
            </span>
            <span style={{ color: "#f339db" }}>★ {product.rating}</span>
            {product.stock < 15 && (
              <span style={{
                color: "#ff6161",
                fontWeight: 500,
                fontSize: 12.5,
                marginLeft: 7,
              }}>Low stock</span>
            )}
          </div>
          <div
            style={{
              color: "#23155f",
              fontSize: 13.1,
              opacity: 0.75,
              margin: "4px 0 0 0",
              textOverflow: "ellipsis",
              overflow: "hidden",
              height: 19,
              whiteSpace: "nowrap",
              maxWidth: 220,
            }}
          >
            {product.description?.length > 60
              ? product.description.slice(0, 55) + "…"
              : product.description}
          </div>
        </div>
        <div
          style={{
            marginLeft: 6, marginTop: 8,
            color: "#fadadd",
            background: "rgba(234,179,255,.15)",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: 13,
            padding: "2px 10px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {expanded ? "–" : "+"}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            layout
            key="card-expanded"
            initial={{ opacity: 0, y: 16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.35, ease: [0.38, 1, 0.54, 1] }}
            style={{
              width: "100%",
              marginTop: 19,
              overflow: "hidden",
            }}
          >
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 14.3,
                  minHeight: 33,
                }}
              >
                {product.description}
              </div>
              {product.category && (
                <div style={{
                  color: "#fadadd",
                  fontSize: 13.2,
                  marginTop: 6,
                }}>
                  Category: <span style={{ color: "#f339db" }}>{product.category}</span>
                </div>
              )}
              <div style={{
                marginTop: 7,
                color: "#e7b3ff",
                fontSize: 13.2,
                opacity: 0.9,
              }}>
                <span style={{ color: "#fadadd", fontWeight: 600 }}>Details:</span>
                <span style={{ marginLeft: 6 }}>
                  {/* Show key features if available, else fallback */}
                  {product.keywords
                    ? product.keywords.join(", ")
                    : product.brand + " | " + product.category}
                </span>
              </div>
              {/* Usage tip: placeholder for future extension */}
              <div style={{
                marginTop: 10,
                color: "#fadadd",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: ".01em"
              }}>
                Usage Tip:
                <span style={{
                  color: "#fff",
                  fontWeight: 400,
                  marginLeft: 7,
                  fontSize: 13
                }}>
                  See product label for usage instructions.
                </span>
              </div>
              {product.link || product.url ? (
                <a
                  href={product.link || product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: 13,
                    color: "#fff",
                    background: "linear-gradient(92deg, #f339db 60%, #e7b3ff 100%)",
                    borderRadius: 9,
                    fontSize: 14,
                    padding: "8px 18px",
                    fontWeight: 600,
                    textDecoration: "none"
                  }}
                >
                  View Product →
                </a>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main ProductList component
// PUBLIC_INTERFACE
function ProductList() {
  const [products, setProducts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ALLOWED BRANDS for filter ---
  const availableBrands = [
    "DermaCo",
    "Kiehl's",
    "Minimalist",
    "Plum",
    "Wow",
    "FoxTale"
  ];
  const [selectedBrands, setSelectedBrands] = useState([...availableBrands]);

  // Fetch product list, optionally filtered by selected brands
  useEffect(() => {
    setLoading(true);
    fetchRecommendedProducts({
      limit: 7,
      minRating: 3.7,
      brands: selectedBrands
    })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [selectedBrands]);

  // Handler for toggling brand selection
  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setExpandedId(null); // Reset expanded state on filter change
  };

  // Handler for selecting all brands
  const handleSelectAll = () => {
    setSelectedBrands([...availableBrands]);
    setExpandedId(null);
  };

  // Handler for clearing all brands
  const handleClearAll = () => {
    setSelectedBrands([]);
    setExpandedId(null);
  };

  return (
    <section className="container" style={{ maxWidth: 825, margin: "0 auto" }}>
      <AppleFadeTransition>
        <div style={{ margin: "15px 0 8px 0" }}>
          <h2 style={{
            color: "#fadadd",
            fontWeight: 800,
            fontSize: "1.62rem",
            margin: "22px 0 4px",
            textAlign: "center"
          }}>
            All Products
          </h2>
          {/* BRAND FILTER: Interactive filter for Indian brands */}
          <div style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 14,
            marginTop: 2,
          }}>
            <button onClick={handleSelectAll} disabled={selectedBrands.length === availableBrands.length}
              style={{
                background: "#e7b3ff",
                color: "#fff",
                fontWeight: 600,
                fontSize: 13.5,
                borderRadius: 8,
                border: "none",
                padding: "6px 13px",
                marginRight: 3,
                opacity: selectedBrands.length === availableBrands.length ? 0.55 : 1,
                cursor: "pointer"
              }}
            >All Brands</button>
            <button onClick={handleClearAll} disabled={selectedBrands.length === 0}
              style={{
                background: "#fadadd",
                color: "#f339db",
                fontWeight: 600,
                fontSize: 13.5,
                borderRadius: 8,
                border: "none",
                padding: "6px 13px",
                marginRight: 6,
                opacity: selectedBrands.length === 0 ? 0.5 : 1,
                cursor: "pointer"
              }}
            >Clear</button>
            {availableBrands.map((brand) => (
              <label key={brand} style={{
                display: "inline-flex",
                alignItems: "center",
                marginRight: 4,
                marginLeft: 0,
                fontSize: 14.3,
                fontWeight: 600,
                color: "#e7b3ff",
                background: selectedBrands.includes(brand)
                  ? "linear-gradient(92deg,#fadadd 60%,#e7b3ff 100%)"
                  : "#fffafd",
                border: selectedBrands.includes(brand)
                  ? "2px solid #f339db"
                  : "2px solid #fadadd55",
                borderRadius: 8,
                padding: "4px 10px",
                marginBottom: 4,
                cursor: "pointer",
                userSelect: "none"
              }}>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  style={{ marginRight: 7, accentColor: "#f339db", cursor: "pointer" }}
                />
                {brand}
              </label>
            ))}
          </div>
          <div style={{
            color: "#e7b3ff",
            fontWeight: 500,
            textAlign: "center",
            margin: "0 0 18px 0",
            fontSize: 16.3,
            opacity: 0.93
          }}>
            {selectedBrands.length === 0 ?
              "Select one or more brands to view products." :
              "Tap a card to see full details and usage tips."
            }
          </div>
        </div>
        <MotionWrapper>
          {loading ? (
            <div style={{
              color: "#fadadd",
              fontWeight: 600,
              textAlign: "center",
              margin: "40px 0",
              fontSize: 22,
            }}>
              Loading products…
            </div>
          ) : products.length === 0 ? (
            <div style={{
              color: "#f339db",
              margin: "34px 0",
              textAlign: "center",
              fontSize: 18,
            }}>
              No products available for the selected brand(s).
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              margin: "0 0 22px 0"
            }}>
              {/* Card list with animation */}
              <AnimatePresence initial={false}>
                {products.map((product) => (
                  <AnimatedProductCard
                    key={product.id}
                    product={product}
                    expanded={expandedId === product.id}
                    onToggle={e => {
                      if (e && e.stopPropagation) e.stopPropagation();
                      setExpandedId(expandedId === product.id ? null : product.id);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </MotionWrapper>
      </AppleFadeTransition>
    </section>
  );
}

export default ProductList;
