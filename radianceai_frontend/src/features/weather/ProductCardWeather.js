import React from "react";

const palette = {
  blueDark: "#2050aa",
  blueLight: "#77a6ed",
  creamyWhite: "#FFF8EB"
};

function ProductCardWeather({ product }) {
  return (
    <a
      href={product.official_product_url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        padding: "10px 14px",
        textDecoration: "none",
        color: "#000",
        transition: "all 0.2s ease",
        marginBottom: 12
      }}
    >
      <img
        src={product.image_url}
        alt={product.name}
        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10, marginRight: 12 }}
      />
      <div>
        <div style={{ fontWeight: 600 }}>{product.name}</div>
        <div style={{ color: "#777", fontSize: "0.9rem" }}>{product.brand_name}</div>
        <div style={{ color: palette.blueDark, fontWeight: 500, marginTop: 4 }}>
          ₹{product.price}
        </div>
      </div>
    </a>
  );
}

export default ProductCardWeather;
