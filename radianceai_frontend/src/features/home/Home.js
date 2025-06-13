import React from "react";
import useProducts from "../../hooks/useProducts";
import { AppleFadeTransition, MotionWrapper } from "../../utils/animation";

// Palette: use brand-approved blues, white, and creamy/neutral backgrounds
const palette = {
  blueDark: "#2050aa",
  blueLight: "#77a6ed",
  white: "#fff",
  creamyWhite: "#FFF8EB",
  cardBorder: "#eaf5ff",
  cardShadow: "0 2px 16px #bcdcfd33"
};

/**
 * PUBLIC_INTERFACE
 * Home: Fetches and displays products in a responsive, modern grid.
 * Products pulled via Supabase API and rendered as visually appealing cards.
 */
function Home() {
  const { recommended: products, loading } = useProducts({
    sortBy: "rating", limit: 12, deduplicate: true
  });
  
  return (
    <section className="container" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <AppleFadeTransition>
        <h1
          style={{
            fontSize: "2.7em",
            fontWeight: 900,
            color: palette.blueDark,
            letterSpacing: "0.005em",
            margin: "36px 0 14px 0"
          }}
          className="title"
        >
          Discover Best-Selling Skincare
        </h1>
        <div
          style={{
            color: palette.blueLight,
            fontWeight: 500,
            fontSize: 18,
            marginBottom: 28,
            opacity: 0.95,
          }}
          className="subtitle"
        >
          Shop the latest and most loved products, handpicked for your glow!
        </div>
        <MotionWrapper>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 31,
              marginTop: 20,
              marginBottom: 35,
              alignItems: "stretch",
            }}
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 340,
                    borderRadius: 18,
                    background: "linear-gradient(92deg, #eaf5ff 60%, #c1dbff 100%)",
                    boxShadow: palette.cardShadow,
                    opacity: 0.36,
                  }}
                />
              ))
            ) : !products.length ? (
              <div style={{
                gridColumn: "1/-1",
                color: palette.blueDark,
                background: "#eaf5ffb8",
                borderRadius: 15,
                textAlign: "center",
                padding: "48px 15px 44px 15px",
                fontWeight: 600,
                fontSize: "1.25em",
                boxShadow: palette.cardShadow,
              }}>
                No products found. Please try again later.
              </div>
            ) : (
              products.map((prod) => (
                <HomeProductCard key={prod.id || prod.title} product={prod} />
              ))
            )}
          </div>
        </MotionWrapper>
      </AppleFadeTransition>
    </section>
  );
}

/** 
 * Product card for Home. Displays image, title, brand, price, short info.
 */
function HomeProductCard({ product }) {
  // Fallback text/image if missing
  const imageUrl = product.image || "https://placehold.co/320x320/eee/222?text=No+Image";
  const title = product.title || "Untitled";
  const brand = product.brand || "";
  const price = typeof product.price === "number" ? `₹${product.price}` : (product.price || "");
  const rating = typeof product.rating === "number" ? product.rating.toFixed(1) : "";
  const description = product.description || product.info || "";

  // Filter short description
  const shortDesc = (description.length > 92)
    ? description.slice(0, 89).trim() + "..."
    : description;

  return (
    <div
      style={{
        background: "linear-gradient(99deg, #fff 75%, #eaf5ff 100%)",
        borderRadius: 18,
        border: `2.5px solid ${palette.cardBorder}`,
        boxShadow: palette.cardShadow,
        padding: "17px 14px 22px 14px",
        minHeight: 290,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        transition: "box-shadow 0.18s",
        userSelect: "none",
      }}
      tabIndex={0}
      aria-label={`Product card: ${title}`}
    >
      <div
        style={{
          width: 115,
          height: 115,
          borderRadius: 13,
          overflow: "hidden",
          marginBottom: 13,
          boxShadow: "0 2.5px 11px #bcdcfd33",
          background: "#eaf5ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 10,
            display: imageUrl === "" ? "none" : "block"
          }}
          loading="lazy"
        />
      </div>
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.13em",
          color: palette.blueDark,
          textAlign: "center",
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: palette.blueLight,
          margin: "2.5px 0 3px 0",
          fontSize: 15.5,
          fontWeight: 600
        }}
      >
        {brand}
      </div>
      <div
        style={{
          fontWeight: 600,
          color: "#1663b7",
          fontSize: 16.5,
          margin: "5px 0",
        }}
      >
        {price}
        {rating && (
          <span style={{
            marginLeft: 10,
            background: "#f7fbff",
            borderRadius: 7,
            fontWeight: 500,
            fontSize: 14.2,
            padding: "2px 11px",
            color: "#2e6ff2",
            border: "1px solid #bcdcfd88"
          }}>
            ★ {rating}
          </span>
        )}
      </div>
      <div
        style={{
          color: "#417ddc",
          opacity: 0.82,
          fontSize: 14.9,
          margin: "6px 0 0 0",
          minHeight: 39,
          textAlign: "center",
        }}
      >
        {shortDesc}
      </div>
    </div>
  );
}

export default Home;
