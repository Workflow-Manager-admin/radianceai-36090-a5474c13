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

  const { data, error } = await supabase
    .from("products")
    .select(`
      name,
      description,
      category,
      official_product_url,
      image_url,
      brand (
        name
      )
    `)
    // Use 'contains' or 'cs' (case-sensitive contains) if concerns/skin_type are arrays in DB,
    // or ensure your primaryGoal/skinType values match exact database values for 'ilike'.
    // Double-check your Supabase column names and data for 'concerns' and 'skin_type'.
    // Example: if 'concerns' column has 'hydration, antiaging', and primaryGoal is 'hydration',
    // the current `ilike` with '%hydration%' will work.
    // However, if your DB column 'concerns' only has 'hydration' (singular), and you query for '%hydration%', it should still work.
    // The most common error is a mismatch between quiz values and DB values.
    .ilike("concerns", `%${primaryGoal}%`)
    .ilike("skin_type", `%${skinType}%`);

  if (error) {
    console.error("Error fetching recommendations:", error.message);
    return [];
  }

  // console.log("Fetched products:", data); // Uncomment for debugging if you need to see raw data

  return data.map((product) => ({
    title: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand?.name ?? "Unknown Brand",
    link: product.official_product_url,
    imageUrl: product.image_url ?? "/default-product-image.jpg",
  }));
}

const Recommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizAnswersLoaded, setQuizAnswersLoaded] = useState(false); // New state to track if answers were successfully loaded

  useEffect(() => {
    const loadAndFetchRecommendations = async () => {
      setLoading(true);
      let answers = {};
      let validAnswers = false;

      try {
        const storedAnswers = localStorage.getItem("quizAnswers");
        if (storedAnswers) {
          answers = JSON.parse(storedAnswers);
          // Crucial check: ensure the necessary properties exist
          if (answers.primaryGoal && answers.skinType) {
            validAnswers = true;
          } else {
            console.warn("Incomplete quiz answers found in localStorage:", answers);
          }
        } else {
          console.warn("No quiz answers found in localStorage.");
        }
      } catch (error) {
        console.error("Error parsing quiz answers from localStorage:", error);
      }

      setQuizAnswersLoaded(validAnswers); // Update state based on validAnswers flag

      if (!validAnswers) {
        setLoading(false);
        // Optionally navigate back to quiz if no valid answers
        // navigate("/quiz"); // Uncomment if you want immediate redirect
        return;
      }

      const { primaryGoal, skinType } = answers;
      const fetchedRecs = await fetchRecommendationsFromSupabase(primaryGoal, skinType);
      setRecommendations(fetchedRecs);
      setLoading(false);
    };

    loadAndFetchRecommendations();
  }, []); // Empty dependency array, runs once on mount

  // --- Render Logic ---

  if (loading) {
    return <div>Loading recommendations...</div>; // Render simple loading message
  }

  // If not loading and no valid quiz answers were loaded
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
              onClick={(e) => { e.preventDefault(); navigate("/quiz"); }} // Prevent full page reload
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

  // If not loading, answers loaded, but no recommendations found
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
            Skin Type: <strong>{answers.skinType || 'N/A'}</strong>, Goal: <strong>{answers.primaryGoal || 'N/A'}</strong>.
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

export default Recommendations;# radianceai-36090-a5474c13