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

  // Normalize inputs to lowercase to ensure case-insensitive matching with ilike
  const normalizedPrimaryGoal = primaryGoal.toLowerCase();
  const normalizedSkinType = skinType.toLowerCase();

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
    // CONCERNS: Still using ilike, assuming your concerns field might be a comma-separated string
    // and 'acne' will be present as a substring (e.g., 'Acne, Oiliness').
    // If your DB only has 'Blemishes' for an 'Acne' goal, you might need a mapping here.
    .ilike("concerns", `%${normalizedPrimaryGoal}%`)
    // SKIN_TYPE: Use .or() to check for specific skin type OR 'All' skin type.
    // The .ilike() for skin_type will match if the normalizedSkinType is a substring
    // (e.g., 'oily' matches 'Dry, Oily, Combination').
    // The .eq() will match if the skin_type column is exactly 'All' (case-sensitive for 'All').
    .or(`skin_type.ilike.%${normalizedSkinType}%,skin_type.eq.All`);


  if (error) {
    console.error("Error fetching recommendations:", error.message);
    return [];
  }

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
  }, []); // Empty dependency array means this runs once on mount

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