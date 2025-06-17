// recommendations.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // No need for useLocation here anymore
import RecommendationCard from "./RecommendationCard";
import styles from "./Recommendations.module.css";
import supabase from "../../api/supabaseClient";

/**
 * Fetches product recommendations from Supabase based on user's quiz answers.
 */
async function fetchRecommendationsFromSupabase(primaryGoal, skinType) {
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
    .ilike("concerns", `%${primaryGoal}%`)
    .ilike("skin_type", `%${skinType}%`);

  if (error) {
    console.error("Error fetching recommendations:", error.message);
    return [];
  }

  console.log("Fetched products:", data);

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

  useEffect(() => {
    // Read answers from localStorage
    let answers = {};
    try {
      const storedAnswers = localStorage.getItem("quizAnswers");
      if (storedAnswers) {
        answers = JSON.parse(storedAnswers);
      }
    } catch (error) {
      console.error("Error parsing quiz answers from localStorage:", error);
    }

    if (!answers || Object.keys(answers).length === 0 || !answers.primaryGoal || !answers.skinType) {
      console.warn("Quiz answers not found or incomplete in localStorage. Redirecting to quiz.");
      navigate("/quiz");
      return;
    }

    const { primaryGoal, skinType } = answers;
    fetchRecommendationsFromSupabase(primaryGoal, skinType)
      .then(setRecommendations)
      .catch(error => {
         console.error("Failed to fetch recommendations:", error);
         setRecommendations([]);
      })
      .finally(() => setLoading(false));
  }, [navigate]); // Dependency array only needs navigate

  if (loading) {
    return <div>Loading recommendations...</div>;
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
            No Recommendations
          </div>
          <div style={{ fontSize: 15.5, marginBottom: 12 }}>
            Please complete the{" "}
            <a
              href="/quiz"
              style={{ color: "#2a6ae7", textDecoration: "underline" }}
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