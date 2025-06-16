// AllProducts.js
import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import ProductCard from "./ProductCard";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) {
          console.error("Supabase error:", error);
          setError(error.message);
        } else if (isMounted) {
          setProducts(data);
        }
      } catch (e) {
        console.error("Unexpected error:", e);
        setError("An unexpected error occurred.");
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return <div style={{ color: "red", fontWeight: 600 }}>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
      <h2 style={{ fontSize: "1.8rem", color: "#2050aa", fontWeight: 800, marginBottom: 12 }}>
        All Skincare Products
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "22px",
        marginTop: 20,
        marginBottom: 32
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
    </div>
  );
}

export default AllProducts;
