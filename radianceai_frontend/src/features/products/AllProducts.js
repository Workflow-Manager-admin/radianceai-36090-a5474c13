import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";
import ProductCard from "./ProductCard";

// BLUE UI PALETTE
const palette = {
  blueDark: "#2050aa",
  blueLight: "#77a6ed",
  cardBG: "#ebf4ff",
};

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    concern: "",
    type: "",
    maxPrice: ""
  });
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy]);

  async function fetchProducts() {
    let query = supabase.from("products").select("*");

    if (filters.brand) query = query.ilike("brand", `%${filters.brand}%`);
    if (filters.concern) query = query.ilike("concern", `%${filters.concern}%`);
    if (filters.type) query = query.ilike("type", `%${filters.type}%`);
    if (filters.maxPrice) query = query.lte("price", filters.maxPrice);
    if (sortBy === "priceLow") query = query.order("price", { ascending: true });
    if (sortBy === "priceHigh") query = query.order("price", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return;
    }

    setProducts(data);
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ color: palette.blueDark, fontWeight: "bold", marginBottom: 12 }}>
        All Skincare Products
      </h2>

      {/* FILTERS */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "14px",
        marginBottom: "20px"
      }}>
        <input name="brand" placeholder="Brand" value={filters.brand} onChange={handleFilterChange} />
        <input name="concern" placeholder="Concern (e.g. acne)" value={filters.concern} onChange={handleFilterChange} />
        <input name="type" placeholder="Product Type (e.g. serum)" value={filters.type} onChange={handleFilterChange} />
        <input name="maxPrice" placeholder="Max Price" type="number" value={filters.maxPrice} onChange={handleFilterChange} />
        <select name="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>

      {/* PRODUCT GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "22px",
      }}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image_url={product.image_url}
            price={`₹${product.price}`}
            brand={product.brand}
            description={product.description}
          />
        ))}
      </div>
    </section>
  );
}

export default AllProducts;
