import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";
import ProductCard from "./ProductCard";

const palette = {
  blueDark: "#2050aa",
  blueLight: "#77a6ed",
};

const typeOptions = ["Facewash", "Serum", "Cleanser", "Cream"];
const priceOptions = [
  { label: "Below ₹300", value: "300" },
  { label: "₹300 – ₹600", value: "600" },
  { label: "₹600 – ₹1000", value: "1000" },
  { label: "₹1000+", value: "10000" }
];

const brandOptions = [
  "DermaCo", "Kiehl's", "Minimalist", "Wow SkinScience", "Foxtale"
];

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    concern: "",
    type: "",
    skin_type: "",
    maxPrice: ""
  });
  const [sortBy, setSortBy] = useState("");
  const [concernOptions, setConcernOptions] = useState([]);
  const [skinTypeOptions, setSkinTypeOptions] = useState([]);

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    fetchProducts(); // Fetch all initially
  }, []);

  const fetchDropdownOptions = async () => {
    const { data: concerns } = await supabase.from("concerns").select("name");
    const { data: skinTypes } = await supabase.from("product_skin_types").select("name");

    setConcernOptions(concerns?.map((c) => c.name) || []);
    setSkinTypeOptions(skinTypes?.map((s) => s.name) || []);
  };

  const fetchProducts = async () => {
    let query = supabase.from("products").select("*");

    if (filters.brand) query = query.ilike("brand", `%${filters.brand}%`);
    if (filters.concern) query = query.ilike("concern", `%${filters.concern}%`);
    if (filters.skin_type) query = query.ilike("skin_type", `%${filters.skin_type}%`);
    if (filters.type) query = query.ilike("type", `%${filters.type}%`);
    if (filters.maxPrice) query = query.lte("price", filters.maxPrice);
    if (sortBy === "priceLow") query = query.order("price", { ascending: true });
    if (sortBy === "priceHigh") query = query.order("price", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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
          alignItems: "flex-end"
        }}
      >
        <div>
          <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>Filter by Brand</label>
          <select
            name="brand"
            value={filters.brand}
            onChange={handleChange}
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option value="">All</option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>Filter by Concern</label>
          <select
            name="concern"
            value={filters.concern}
            onChange={handleChange}
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option value="">All</option>
            {concernOptions.map((concern) => (
              <option key={concern} value={concern}>{concern}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>Filter by Skin Type</label>
          <select
            name="skin_type"
            value={filters.skin_type}
            onChange={handleChange}
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option value="">All</option>
            {skinTypeOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>Filter by Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option value="">All</option>
            {typeOptions.map((type) => (
              <option key={type} value={type.toLowerCase()}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>Filter by Price</label>
          <select
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option value="">All</option>
            {priceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>Sort by</label>
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

        <button
          onClick={fetchProducts}
          style={{
            backgroundColor: palette.blueDark,
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 6,
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: 28
          }}
        >
          Apply Filters
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "22px"
        }}
      >
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
