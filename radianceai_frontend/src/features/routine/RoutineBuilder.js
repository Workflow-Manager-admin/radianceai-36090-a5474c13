// RoutineBuilder.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../api/supabaseClient";

import styles from "./RoutineBuilder.module.css"; // Ensure this file exists and has styles

const RoutineBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [routineSteps, setRoutineSteps] = useState([]);
  const [quizAnswersLoaded, setQuizAnswersLoaded] = useState(false);

  useEffect(() => {
    const loadAnswersAndFetchRoutine = async () => {
      setLoading(true);
      let answersFromStorage = {};
      let validAnswers = false;

      // 1. Attempt to load quiz answers from localStorage
      try {
        const storedAnswers = localStorage.getItem("quizAnswers");
        if (storedAnswers) {
          answersFromStorage = JSON.parse(storedAnswers);
          if (answersFromStorage.primaryGoal && answersFromStorage.primaryGoal.trim() !== '') {
            validAnswers = true;
          } else {
            console.warn("Incomplete quiz answers found in localStorage (missing primaryGoal):", answersFromStorage);
          }
        } else {
          console.warn("No quiz answers found in localStorage.");
        }
      } catch (error) {
        console.error("Error parsing quiz answers from localStorage:", error);
      }

      setUserAnswers(answersFromStorage);
      setQuizAnswersLoaded(validAnswers);

      // If no valid quiz answers, stop here and show the "Quiz Not Completed" message
      if (!validAnswers) {
        setLoading(false);
        return;
      }

      // 2. Fetch routine steps from Supabase based on the primaryGoal
      const { primaryGoal } = answersFromStorage;

      try {
        const { data, error } = await supabase
          .from("routine_steps")
          .select(`
            id,
            concern,
            step_number,
            time_of_day,
            notes,
            products (
            id,
            name,
            description,
            category,
            official_product_url,
            image_url,
            brands (name)
          )
          `) // <--- ALL COMMENTS REMOVED FROM THIS SELECT STRING!
          .ilike("concern", `%${primaryGoal.toLowerCase()}%`)
          .order("step_number", { ascending: true });

        if (error) {
          console.error("Error fetching routine:", error.message);
          setRoutineSteps([]);
          return;
        }

        // This console log is still here for your debugging benefit!
        console.log("Raw data from Supabase:", data);

        // 3. Map the fetched data to a cleaner format for your component
        const formattedRoutine = data.map(step => ({
          id: step.id,
          stepNumber: step.step_number,
          concern: step.concern,
          timeOfDay: step.time_of_day,
          notes: step.notes,
          // Ensure products data exists before accessing nested properties
          product: step.products ? {
            id: step.products.id,
            name: step.products.name,
            description: step.products.description,
            category: step.products.category,
            officialProductUrl: step.products.official_product_url,
            imageUrl: step.products.image_url ?? "/default-product-image.jpg",
            brand: step.products.brands?.name || 'Unknown Brand'
          } : null
        })).filter(step => step.product !== null); // Filter out any steps that couldn't find a product

        setRoutineSteps(formattedRoutine);

      } catch (error) {
        console.error("Unexpected error during routine fetch:", error);
        setRoutineSteps([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnswersAndFetchRoutine();
  }, []);

  // --- Conditional Rendering ---

  // 1. Loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <div>Building your personalized routine...</div>
      </div>
    );
  }

  // 2. No quiz answers found (user hasn't completed the quiz or data is invalid)
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
            To get a personalized routine, please complete the{" "}
            <a
              href="/quiz"
              style={{ color: "#2a6ae7", textDecoration: "underline" }}
              onClick={(e) => { e.preventDefault(); navigate("/quiz"); }}
            >
              quiz
            </a>{" "}
            first.
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

  // 3. Quiz answers loaded, but no routine found in the database for the given goal
  if (routineSteps.length === 0) {
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
            No Routine Available
          </div>
          <div style={{ fontSize: 15.5, marginBottom: 12 }}>
            We couldn't find a routine matching your primary goal: **{userAnswers.primaryGoal || 'N/A'}**.
            <br />
            Please ensure there are routine steps in the database for this goal,
            or try adjusting your quiz answers.
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

  // 4. Routine data successfully loaded and ready to display!
  return (
    <section className={styles.routineSection}>
      <h2 className={styles.heading} style={{ color: "#2a6ae7" }}>
        Your Personalized Routine for {userAnswers.primaryGoal}
      </h2>
      <div className={styles.routineList}>
        {routineSteps.map((step) => (
          // You could abstract this into a <RoutineStepCard /> component
          // for better organization, similar to RecommendationCard.
          <div key={step.id} className={styles.routineStepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumberBadge}>Step {step.stepNumber}</span>
              <h3>{step.product.name} ({step.timeOfDay})</h3>
            </div>
            {step.notes && <p className={styles.stepNotes}>* {step.notes}</p>}
            {step.product.imageUrl && (
                <div className={styles.routineImageContainer}>
                    <img
                        src={step.product.imageUrl}
                        alt={step.product.name}
                        className={styles.routineProductImage}
                        onError={(e) => { e.target.onerror = null; e.target.src = "/default-product-image.jpg"; }}
                    />
                </div>
            )}
            <p className={styles.productDescription}>{step.product.description}</p>
            <p className={styles.productDetails}>
                <span className={styles.productCategory}>{step.product.category}</span> - {step.product.brand}
            </p>
            {step.product.officialProductUrl && (
              <a
                href={step.product.officialProductUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.productLink}
              >
                View Product
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoutineBuilder;