import React, { useEffect, useState } from "react";
import  supabase  from "../../api/supabaseClient";
import "./ProductCard.css";

/**
 * AllProducts Component
 * Fetches all products from the Supabase 'products' table
 * Displays them with brand name (joined), with filtering capability
 */
function AllProducts() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  const fetchProducts = async (brandFilter = "all") => {
    setLoading(true);
    setError("");
    try {
      let query = supabase
        .from("products")
        .select(`*, brands(name)`); // Assuming FK: products.brand_id -> brands.id

      if (brandFilter !== "all") {
        query = query.eq("brand_id", brandFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(
        err?.message ||
          "Failed to load products. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    const { data, error } = await supabase.from("brands").select("id, name");
    if (!error) setBrands(data);
  };

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    fetchProducts(brandId);
  };

  const renderProductCard = (product, idx) => (
    <div className="product-card" key={product.id || idx}>
      <div className="product-image-wrapper">
        <img
          className="product-image"
          src={product.image_url || "https://via.placeholder.com/240x240?text=No+Image"}
          alt={product.name || "Product"}
        />
      </div>
      <div className="product-details">
        <h3 className="product-title">{product.name || "Unnamed Product"}</h3>
        <div className="product-brand">
          {product.brands?.name ? (
            <span>{product.brands.name}</span>
          ) : (
            <span className="product-placeholder">Brand unknown</span>
          )}
        </div>
        <div className="product-desc">{product.description || ""}</div>
        <div className="product-meta-row">
          <span className="product-price">
            {product.price !== undefined && product.price !== null
              ? `₹${product.price}`
              : "No price"}
          </span>
          {product.rating && (
            <span className="product-rating">
              ★ {Number(product.rating).toFixed(1)}
            </span>
          )}
        </div>
        {product.official_product_url && (
          <a
            href={product.official_product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="product-link"
          >
            View Product
          </a>
        )}
      </div>
    </div>
  );

  return (
    <section
      className="all-products-section"
      style={{ padding: "32px 0 24px 0", minHeight: "60vh" }}
    >
      <h2 className="section-title" style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        All Products
      </h2>

      <div className="filter-section" style={{ textAlign: "center", marginBottom: 24 }}>
        <label style={{ marginRight: 10, fontWeight: 500 }}>Filter by brand:</label>
        <select value={selectedBrand} onChange={handleBrandChange}>
          <option value="all">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div
          className="products-loading"
          style={{ textAlign: "center", padding: "2rem" }}
        >
          <span>Loading products…</span>
        </div>
      )}
      {error && (
        <div
          className="products-error"
          style={{ color: "#c44", textAlign: "center", marginBottom: "1.5rem" }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}
      {!loading && !error && products.length === 0 && (
        <div
          className="products-empty"
          style={{ textAlign: "center", padding: "1rem" }}
        >
          No products found.
        </div>
      )}
      {!loading && !error && products.length > 0 && (
        <div className="all-products-grid">
          {products.map(renderProductCard)}
        </div>
      )}
    </section>
  );
}

export default AllProducts;
