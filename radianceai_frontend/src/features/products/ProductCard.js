import React from "react";
import "./ProductCard.css";

/**
 * Card showing a skincare product.
 * Used in product lists and grid views.
 *
 * PUBLIC_INTERFACE
 * @param {object} props - product object, expects at least:
 *   { id, name, img (or image_url), price, brand, description, official_product_url }
 */
function ProductCard({
  id,
  name,
  img,
  image_url,
  price,
  brand,
  description,
  official_product_url,
}) {
  const imageSrc = image_url || img;

  const isExternal = official_product_url && official_product_url.startsWith("http");

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

        {/* VIEW PRODUCT LINK */}
        {isExternal ? (
          <a
            href={official_product_url}
            className="view-product-link"
            style={{
              display: "inline-block",
              marginTop: 8,
              color: "#fff",
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            aria-label={`View official product page for ${name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Product
          </a>
        ) : (
          <a
            href={`/product/${id}`}
            className="view-product-link"
            style={{
              display: "inline-block",
              marginTop: 8,
              color: "#fff",
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            aria-label={`View details for ${name}`}
          >
            View Product
          </a>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
