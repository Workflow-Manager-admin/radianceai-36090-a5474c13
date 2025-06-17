// recommendations.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecommendationCard from "./RecommendationCard";
import styles from "./Recommendations.module.css";
import supabase from "../../api/supabaseClient";

/**
 * Fetches product recommendations from Supabase based on user's quiz answers.
 */
async function fetchRecommendationsFromSupabase(primaryGoal, skinType) {
  // Ensure primaryGoal and skinType are valid strings before querying
  if (!primaryGoal || !skinType || typeof primaryGoal !== 'string' || typeof skinType !== 'string') {
    console.warn("Invalid primaryGoal or skinType provided to fetchRecommendationsFromSupabase.");
    return [];
  }

  // Normalize inputs to lowercase to ensure case-insensitive matching
  const normalizedPrimaryGoal = primaryGoal.toLowerCase(); // e.g., "antiaging"
  const normalizedSkinType = skinType.toLowerCase();

  // >>> START OF NEW MAPPING LOGIC <<<
  let queryGoal = normalizedPrimaryGoal; // Default to using the normalized goal directly

  // If the normalized primary goal from the quiz doesn't directly match
  // what's in your product concerns, define a specific mapping.
  if (normalizedPrimaryGoal === 'antiaging') {
    // We map 'antiaging' (from quiz) to 'aging' (which is in 'Aging, Wrinkles' in DB)
    queryGoal = 'aging';
  }
  // Add other mappings here if your quiz goals don't directly map to product concerns
  // For example, if quiz sends 'acne free' but products only have 'blemishes':
  // if (normalizedPrimaryGoal === 'acne free') {
  //   queryGoal = 'acne'; // Or 'blemishes' depending on your DB data
  // }
  // You can extend this for any other mismatches.
  // >>> END OF NEW MAPPING LOGIC <<<

  // Add this for better debugging to see what values are actually being used for the query
  console.log("Querying recommendations for Goal (mapped):", queryGoal, "and Skin Type:", normalizedSkinType);

  const { data, error } = await supabase
    .from("products")
    .select(`
      name,
      description,
      category,
      official_product_url,
      image_url,
      brand_id,
      brands!products_brand_id_fkey(name)
    `)
    // Now use the 'queryGoal' in the ilike filter
    .ilike("concerns", `%${queryGoal}%`)
    // SKIN_TYPE: Use .or() to check for specific skin type OR 'All' skin type.
    .or(`skin_type.ilike.%${normalizedSkinType}%,skin_type.eq.All`);


  if (error) {
    console.error("Error fetching recommendations:", error.message);
    return [];
  }

  // This console log will now show what data came back from Supabase AFTER mapping.
  console.log("Raw recommendations data from Supabase:", data);

  return data.map((product) => ({
    title: product.name,
    description: product.description,
    category: product.category,
    brand: product.brands?.name ?? "Unknown Brand", // Access through 'brands' alias
    link: product.official_product_url,
    imageUrl: product.image_url ?? "/default-product-image.jpg",
  }));
}

const Recommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizAnswersLoaded, setQuizAnswersLoaded] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    const loadAndFetchRecommendations = async () => {
      setLoading(true);
      let answersFromStorage = {};
      let validAnswers = false;

      try {
        const storedAnswers = localStorage.getItem("quizAnswers");
        if (storedAnswers) {
          answersFromStorage = JSON.parse(storedAnswers);
          // Check if both primaryGoal and skinType are present and not empty strings
          if (answersFromStorage.primaryGoal && answersFromStorage.primaryGoal.trim() !== '' &&
              answersFromStorage.skinType && answersFromStorage.skinType.trim() !== '') {
            validAnswers = true;
          } else {
            console.warn("Incomplete quiz answers found in localStorage:", answersFromStorage);
          }
        } else {
          console.warn("No quiz answers found in localStorage.");
        }
      } catch (error) {
        console.error("Error parsing quiz answers from localStorage:", error);
      }

      setUserAnswers(answersFromStorage);
      setQuizAnswersLoaded(validAnswers);

      if (!validAnswers) {
        setLoading(false);
        return;
      }

      const { primaryGoal, skinType } = answersFromStorage;
      const fetchedRecs = await fetchRecommendationsFromSupabase(primaryGoal, skinType);
      setRecommendations(fetchedRecs);
      setLoading(false);
    };

    loadAndFetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <div>Loading recommendations...</div>
      </div>
    );
  }

  if (!quizAnswersLoaded) {
    return (
      <div className={styles.empty}>
        <div
          className={styles.emptyBox}
          style={{
            background: "linear-gradient(95deg, #93bafe 60%, #e3f0ff 100%)",
            color: "#2a6ae7",
            border: "2px solid #2a6ae755",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 21, marginBottom: 5 }}>
            Quiz Not Completed
          </div>
          <div style={{ fontSize: 15.5, marginBottom: 12 }}>
            Please complete the{" "}
            <a
              href="/quiz"
              style={{ color: "#2a6ae7", textDecoration: "underline" }}
              onClick={(e) => { e.preventDefault(); navigate("/quiz"); }}
            >
              quiz
            </a>{" "}
            for personalized recommendations.
          </div>
          <button
            className={styles.quizBtn}
            style={{
              background: "linear-gradient(92deg, #93bafe 54%, #e3f0ff 110%)",
              color: "#2a6ae7",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => navigate("/quiz")}
          >
            Take Quiz
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={styles.empty}>
        <div
          className={styles.emptyBox}
          style={{
            background: "linear-gradient(95deg, #93bafe 60%, #e3f0ff 100%)",
            color: "#2a6ae7",
            border: "2px solid #2a6ae755",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 21, marginBottom: 5 }}>
            No Recommendations Found
          </div>
          <div style={{ fontSize: 15.5, marginBottom: 12 }}>
            We couldn't find products matching your selections:
            <br />
            Skin Type: **{userAnswers.skinType || 'N/A'}**, Goal: **{userAnswers.primaryGoal || 'N/A'}**.
            <br />
            Please try adjusting your quiz answers or check back later for more options.
          </div>
          <button
            className={styles.quizBtn}
            style={{
              background: "linear-gradient(92deg, #93bafe 54%, #e3f0ff 110%)",
              color: "#2a6ae7",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => navigate("/quiz")}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.recommendationsSection}>
      <h2 className={styles.heading} style={{ color: "#2a6ae7" }}>
        Your Personalized Recommendations
      </h2>
      <div className={styles.recommendationsList}>
        {recommendations.map((rec, idx) => (
          <RecommendationCard key={idx} data={rec} index={idx} />
        ))}
      </div>
    </section>
  );
};

export default Recommendations;
