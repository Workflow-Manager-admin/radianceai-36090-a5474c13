import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";
import ProductCard from "./ProductCard";

const palette = {
  blueDark: "#2050aa",
  blueLight: "#77a6ed",
};

const typeOptions = ["Facewash", "Serum", "Cleanser", "Cream", "Moisturizer", "Cleanser", "Toner", "Body Wash"];
const brandOptions = ["DermaCo", "Kiehl's", "Minimalist", "Wow SkinScience", "Foxtale"];

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    concern: "",
    type: "",
    skin_type: "",
  });
  const [sortBy, setSortBy] = useState("");
  const [concernOptions, setConcernOptions] = useState([]);
  const [skinTypeOptions, setSkinTypeOptions] = useState([]);

  useEffect(() => {
    fetchDropdownOptions();
    fetchProducts(); // fetch all products initially
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      const { data: concerns, error: errConcerns } = await supabase
        .from("concerns")
        .select("concern");

      const { data: skinTypes, error: errSkinTypes } = await supabase
        .from("skin_types")
        .select("type");

      if (errConcerns) console.error("Concerns error:", errConcerns);
      if (errSkinTypes) console.error("Skin types error:", errSkinTypes);

      setConcernOptions(concerns?.map((c) => c.concern) || []);
      setSkinTypeOptions(skinTypes?.map((s) => s.type) || []);
    } catch (err) {
      console.error("Error fetching dropdown options:", err);
    }
  };

  const fetchProducts = async (filterParams = filters, sortParam = sortBy) => {
    try {
      // Select from products and join brands table to get brand name
      let query = supabase
        .from("products")
        .select(`
          *,
          brands (
            name
          )
        `);

      // Filter by brand name → get brand_id from brands table
      if (filterParams.brand) {
        const { data: brandData, error: brandError } = await supabase
          .from("brands")
          .select("id") // Adjust this if your primary key is named differently
          .eq("name", filterParams.brand)
          .single();

        if (brandError) {
          console.error("Error fetching brand ID:", brandError);
        } else if (brandData?.id) {
          query = query.eq("brand_id", brandData.id);
        }
      }

      if (filterParams.concern) query = query.eq("concern", filterParams.concern);
      if (filterParams.skin_type) query = query.eq("skin_type", filterParams.skin_type);
      if (filterParams.type) query = query.eq("type", filterParams.type);

      if (sortParam === "priceLow") {
        query = query.order("price", { ascending: true });
      } else if (sortParam === "priceHigh") {
        query = query.order("price", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchProducts(filters, sortBy);
  };

  const handleResetFilters = () => {
    const cleared = {
      brand: "",
      concern: "",
      type: "",
      skin_type: "",
    };
    setFilters(cleared);
    setSortBy("");
    fetchProducts(cleared, "");
  };

  return (
    <section style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ color: palette.blueDark, fontWeight: "bold", marginBottom: 20 }}>
        All Skincare Products
      </h2>

      {/* FILTERS */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "14px",
          marginBottom: "20px",
          alignItems: "flex-end",
        }}
      >
        {/* Brand */}
        <div>
          <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>
            Filter by Brand
          </label>
          <select
            name="brand"
            value={filters.brand}
            onChange={handleChange}
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option value="">All</option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Concern */}
        <div>
          <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>
            Filter by Concern
          </label>
          <select
            name="concern"
            value={filters.concern}
            onChange={handleChange}
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option value="">All</option>
            {concernOptions.map((concern) => (
              <option key={concern} value={concern}>
                {concern}
              </option>
            ))}
          </select>
        </div>

        {/* Skin Type */}
        <div>
          <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>
            Filter by Skin Type
          </label>
          <select
            name="skin_type"
            value={filters.skin_type}
            onChange={handleChange}
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option value="">All</option>
            {skinTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>
            Filter by Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option value="">All</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option value="">None</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: 28 }}>
          <button
            onClick={handleApplyFilters}
            style={{
              backgroundColor: palette.blueDark,
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 6,
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            style={{
              backgroundColor: "#888",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 6,
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "22px",
        }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image_url={product.image_url}
              price={`₹${product.price}`}
              brand={product.brands?.name || "Unknown Brand"}
              description={product.description}
            />
          ))
        ) : (
          <p>No products found matching your filters.</p>
        )}
      </div>
    </section>
  );
}

export default AllProducts;
