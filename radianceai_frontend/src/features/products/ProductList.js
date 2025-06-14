import React from "react";
import { useFetchProducts } from "../../hooks/useFetchProducts";
import ProductCard from "./ProductCard";
import "./ProductList.css";

// PUBLIC_INTERFACE
/**
 * Displays all products fetched from Supabase in a grid layout.
 * Handles loading and error states.
 */
function ProductList() {
  const { products, loading, error } = useFetchProducts();

  if (loading) {
    return (
      <div className="productlist-state productlist-loading">
        <div className="loader" role="status" aria-label="Loading products..." />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="productlist-state productlist-error">
        <p>Failed to load products: <span className="error-text">{error}</span></p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="productlist-state">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="productlist-container">
      <h2 className="productlist-title">All Products</h2>
      <div className="productlist-grid">
        {products.map((product) => (
          <ProductCard key={product.id || product.name} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
