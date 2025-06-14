import React from "react";
import "./ProductCard.css";

/**
 * Card showing a skincare product.
 * Used in product lists and grid views.
 *
 * PUBLIC_INTERFACE
 * @param {object} props - product object, expects at least:
 *   { id, name, img (or image_url), price, brand, description }
 */
function ProductCard({ name, img, image_url, price, brand, description }) {
  // Support either 'img' (local/demo) or 'image_url' (from Supabase)
  const imageSrc = image_url || img;
  return (
    <div className="product-card" tabIndex={0} aria-label={`Product: ${name}`}>
      <img
        src={imageSrc}
        alt={name}
        className="product-card-img"
        style={{ background: "#f5eef7", objectFit: "cover" }}
        loading="lazy"
        width={144}
        height={144}
      />
      <div className="product-card-details">
        <div className="product-card-title">{name}</div>
        <div className="product-card-brand">
          <span>{brand}</span>
        </div>
        {description && <div className="product-card-desc">{description}</div>}
        <div className="product-card-price">{price}</div>
      </div>
    </div>
  );
}

export default ProductCard;
