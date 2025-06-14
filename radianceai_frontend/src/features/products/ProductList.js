import React, { useState, useEffect } from "react";
import { fetchRecommendedProducts } from "../../api/apiClient";

// Palette: use approved blue/white without pinks
const palette = {
  blueDark: "#2050aa",
  blueLight: "#77a6ed",
  white: "#fff",
  creamyWhite: "#FFF8EB",
  border: "rgba(32, 80, 170, 0.09)",
  cardBG: "linear-gradient(92deg,#ebf4ff 80%,#FFF8EB 100%)",
  cardShadow: "0 1.5px 10px #77a6ed13",
  accent: "#266fd6",
  error: "#e43c46"
};

/**
 * ProductList:
 * Fetches and displays products from Supabase for homepage showcase.
 * Robustly surfaces fetch status and errors in the UI and console.
 */
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // error: { message, type (network/api/unauthorized), status, diagnostic }
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchRecommendedProducts()
      .then((res) => {
        if (cancelled) return;
        if (Array.isArray(res)) {
          const shuffled = res.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 6);
          setProducts(selected);
        }
        else if (res && res.error) {
          setProducts([]);
          setError({
            message: "Failed to load products: " + (res.error || "Unknown error"),
            type: "api",
            status: res.status || undefined,
            diagnostic: res
          });
          if (typeof window !== "undefined" && window.console) {
            window.console.error("[ProductList] API error:", res);
          }
        } else {
          setProducts([]);
        }
      })
      .catch((e) => {
        setProducts([]);
        setError({
          message: "Unable to load products. Network/API error: " + (e && e.message ? e.message : String(e)),
          type: "network",
        });
        if (typeof window !== "undefined" && window.console) {
          window.console.error("[ProductList] Network/API error:", e);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Status/message area
  let statusArea = null;
  if (loading) {
    statusArea = (
      <div style={{
        fontWeight: 600,
        color: palette.blueLight,
        fontSize: 16,
        padding: "14px 0",
        textAlign: "center",
      }}>
        Loading top products…
      </div>
    );
  } else if (error) {
    statusArea = (
      <div style={{
        color: palette.error,
        background: "#fff7f7",
        border: "1.3px solid #ffc7c7",
        borderRadius: 8,
        boxShadow: "0 1.5px 7px #e43c4623",
        fontWeight: 650,
        fontSize: 15.5,
        margin: "10px auto 18px auto",
        padding: "12px 14px",
        textAlign: "center",
        maxWidth: 430
      }}>
        {error.message}
        {error.status && (
          <div style={{
            fontSize: "0.99em",
            color: "#f27b7b",
            opacity: 0.86,
            fontWeight: 420,
            marginTop: 2
          }}>
            {error.status === 401 && " (Unauthorized. Contact support.)"}
            {error.status === 502 && " (Service unavailable)"}
            {error.status !== 401 && error.status !== 502 && ` (Error code: ${error.status})`}
          </div>
        )}
        <div style={{
          fontSize: 13.6,
          color: "#a59b9b",
          fontWeight: 400,
          opacity: 0.72,
          marginTop: 5,
        }}>
          Please try again later or refresh the page.
        </div>
      </div>
    );
  } else if (products.length === 0) {
    statusArea = (
      <div style={{
        color: palette.blueDark,
        background: "#f0f7ff",
        border: "1.3px solid #dde9ff",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 15.2,
        margin: "12px auto 14px auto",
        padding: "13px 14px",
        textAlign: "center",
        maxWidth: 420
      }}>
        No recommended products to display.
      </div>
    );
  }

  // Product grid/list UI
  return (
    <section className="container" style={{ margin: "0 auto 42px auto", maxWidth: 1180 }}>
      <h2 style={{
        fontWeight: 900,
        color: palette.blueDark,
        fontSize: "2.03em",
        margin: "15px 0 8px 0",
        letterSpacing: ".01em"
      }}>
        Best-Selling Skincare Products
      </h2>
      <div style={{
        fontSize: 16,
        color: palette.blueLight,
        marginBottom: 10,
        fontWeight: 500
      }}>
        Shop the most-loved products, powered by GlowSkin’s database.
      </div>

      {/* Loading/error/status message area */}
      {statusArea}

      {/* Product grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "22px",
        marginTop: 12,
        marginBottom: 12,
        width: "100%"
      }}>
        {!loading && !error && products.map((product, idx) => (
          <div key={product.id || idx}
            style={{
              background: palette.cardBG,
              border: "1.7px solid " + palette.border,
              borderRadius: 18,
              boxShadow: palette.cardShadow,
              padding: "19px 18px 13px 18px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              transition: "box-shadow .17s",
              minHeight: 184,
              cursor: "pointer"
            }}>
            {/* Product Name */}
            <div style={{ fontWeight: 700, color: palette.accent, fontSize: 19, marginBottom: 3 }}>
              {product.name}
            </div>

            {/* Brand ID (replace or improve after joining brands) */}
            <div style={{ color: palette.blueLight, fontWeight: 500, fontSize: 15.2, marginBottom: 4 }}>
              Brand ID: {product.brand_id}
            </div>

            {/* Category and rating */}
            <div style={{
              color: palette.blueDark,
              fontSize: 14.1,
              marginBottom: 9
            }}>
              {product.category && <span>{product.category}</span>}
              {product.rating && (
                <span style={{
                  marginLeft: product.category ? 11 : 0,
                  fontWeight: 700,
                  color: palette.accent
                }}>
                  ★ {product.rating}
                </span>
              )}
            </div>

            {/* Image */}
            {product.image_url && (
              <img
                alt={product.name}
                src={product.image_url}
                style={{
                  width: "93%",
                  maxHeight: 110,
                  borderRadius: 7,
                  objectFit: "cover",
                  background: "#fff",
                  margin: "0 0 5px 0",
                  boxShadow: "0 1.2px 7px #dde9ff18"
                }}
                loading="lazy"
              />
            )}

            {/* Description */}
            <div style={{
              color: "#232b45",
              fontSize: 13.7,
              opacity: 0.79,
              margin: "8px 0 0 0"
            }}>
              {product.description || ""}
            </div>

            {/* Price */}
            <div style={{ fontWeight: "bold", fontSize: 16, marginTop: 8 }}>
              ₹{product.price}
            </div>

            {/* Link */}
            {product.official_product_url && (
              <a
                href={product.official_product_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 14,
                  fontWeight: 500,
                  color: palette.blueDark,
                  background: "linear-gradient(90deg,#dde9ff 60%,#e9f6fb 100%)",
                  borderRadius: 10,
                  padding: "7px 17px",
                  fontSize: 14.3,
                  border: "none",
                  textDecoration: "none",
                  transition: "background .14s, color .14s"
                }}>
                View Product
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductList;
