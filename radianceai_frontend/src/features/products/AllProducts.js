import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";
import ProductCard from "./ProductCard";

const palette = {
  blueDark: "#2050aa",
  blueLight: "#77a6ed",
};

const typeOptions = ["Facewash", "Serum", "Cleanser", "Cream"];
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
    fetchProducts(); // Load all products initially
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      const { data: concerns } = await supabase.from("concerns").select("concern");
      const { data: skinTypes } = await supabase.from("skin_types").select("type");

      setConcernOptions(concerns?.map((c) => c.concern) || []);
      setSkinTypeOptions(skinTypes?.map((s) => s.type) || []);
    } catch (err) {
      console.error("Error fetching dropdown options:", err);
    }
  };

  const fetchProducts = async (filterParams = filters, sortParam = sortBy) => {
    try {
      let query = supabase.from("products").select(`
        *,
        brands(name)
      `);

      // Brand filtering using brand_id
      if (filterParams.brand) {
        const { data: brandData, error: brandError } = await supabase
          .from("brands")
          .select("id")
          .eq("name", filterParams.brand)
          .single();

        if (brandError) {
          console.error("Error fetching brand ID:", brandError);
        } else if (brandData?.id) {
          query = query.eq("brand_id", brandData.id);
        }
      }

      if (filterParams.concern) {
        query = query.eq("concern", filterParams.concern);
      }

      if (filterParams.skin_type) {
        query = query.eq("skin_type", filterParams.skin_type);
      }

      if (filterParams.type) {
        query = query.eq("type", filterParams.type);
      }

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
      console.error("Error in fetchProducts:", err);
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
    const
