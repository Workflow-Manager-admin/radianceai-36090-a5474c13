import React from "react";
import "./ProductCard.css";

// PUBLIC_INTERFACE
/**
 * Displays a product's image and essential details in a card layout.
 * @param {Object} product - Product object with image, name, brand, price, etc.
 */
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.image || product.image_url || "/no-image.png"}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.brand && <p className="product-brand">{product.brand}</p>}
        {product.price && (
          <p className="product-price">${product.price.toFixed(2)}</p>
        )}
        {/* Add more details as needed */}
        {product.description && (
          <p className="product-desc">{product.description}</p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
