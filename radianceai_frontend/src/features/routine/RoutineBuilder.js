// routinebuilder.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../api/supabaseClient"; // Keep import, but logic will be commented

const RoutineBuilder = () => {
  const navigate = useNavigate();
  const [routineSteps, setRoutineSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAnswers, setHasAnswers] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    const loadAndProcessRoutine = async () => { // Renamed to reflect no direct fetch
      setLoading(true);
      let answersFromStorage = null;
      let validAnswersExist = false;

      try {
        const stored = localStorage.getItem("quizAnswers");
        if (stored) {
          answersFromStorage = JSON.parse(stored);
          if (answersFromStorage && answersFromStorage.primaryGoal) {
            validAnswersExist = true;
          }
        }
      } catch (error) {
        console.error("Error parsing quiz answers from localStorage:", error);
      }

      setUserAnswers(answersFromStorage || {});
      setHasAnswers(validAnswersExist);

      if (!validAnswersExist) {
        setLoading(false);
        return;
      }

      // --- IMPORTANT: ROUTINE_STEPS TABLE DOES NOT EXIST IN SUPABASE ---
      // The code below assumes you WILL create a 'routine_steps' table in Supabase.
      // If you do not create this table, this fetch will ALWAYS fail with a 400 error.
      // For now, it's commented out and a placeholder is used.

      // // Define the foreign key constraint name for brands.
      // // Assuming 'routine_steps_brand_id_fkey' based on common Supabase conventions.
      // const FK_NAME = "routine_steps_brand_id_fkey";

      // const { data, error } = await supabase
      //   .from("routine_steps")
      //   .select(`
      //     step_order,
      //     step_name,
      //     description,
      //     brand_id, // Include the foreign key column
      //     official_product_url,
      //     brands!${FK_NAME}(name) // Use the explicit foreign key relationship name
      //   `)
      //   // Using .ilike as requested for 'concerns'
      //   .ilike("concerns", `%${answersFromStorage.primaryGoal}%`)
      //   .order("step_order", { ascending: true });

      // if (error) {
      //   console.error("Error fetching routine steps:", error.message);
      //   setRoutineSteps([]); // Ensure empty array on error
      // } else {
      //   setRoutineSteps(data);
      // }

      // --- TEMPORARY PLACEHOLDER DATA (REMOVE ONCE SUPABASE TABLE IS READY) ---
      // You can replace this with a more sophisticated hardcoded logic or
      // enable the Supabase fetch above once your table is created and populated.
      if (answersFromStorage.primaryGoal === "acne") {
        setRoutineSteps([
          {
            step_order: 1,
            step_name: "Gentle Cleansing",
            description: "Start with a mild, pH-balanced cleanser to remove impurities without stripping the skin.",
            brand_id: null,
            official_product_url: "#",
            brands: { name: "Example Brand A" }
          },
          {
            step_order: 2,
            step_name: "Targeted Treatment (Salicylic Acid)",
            description: "Apply a serum with salicylic acid to exfoliate, unclog pores, and reduce inflammation.",
            brand_id: null,
            official_product_url: "#",
            brands: { name: "Example Brand B" }
          },
          {
            step_order: 3,
            step_name: "Lightweight Hydration",
            description: "Follow with a non-comedogenic, oil-free moisturizer to keep skin hydrated.",
            brand_id: null,
            official_product_url: "#",
            brands: { name: "Example Brand C" }
          }
        ]);
      } else if (answersFromStorage.primaryGoal === "hydration") {
         setRoutineSteps([
          {
            step_order: 1,
            step_name: "Hydrating Cleanser",
            description: "Use a creamy, hydrating cleanser to retain skin's natural moisture.",
            brand_id: null,
            official_product_url: "#",
            brands: { name: "Example Brand D" }
          },
          {
            step_order: 2,
            step_name: "Hyaluronic Acid Serum",
            description: "Apply a serum rich in hyaluronic acid to draw moisture into the skin.",
            brand_id: null,
            official_product_url: "#",
            brands: { name: "Example Brand E" }
          },
          {
            step_order: 3,
            step_name: "Rich Moisturizer",
            description: "Lock in moisture with a rich, emollient moisturizer.",
            brand_id: null,
            official_product_url: "#",
            brands: { name: "Example Brand F" }
          }
        ]);
      } else {
        setRoutineSteps([]); // No specific hardcoded routine for this goal
      }

      setLoading(false);
    };

    loadAndProcessRoutine();
  }, []);

  // --- Render Logic ---

  if (loading) {
    return (
      <div style={wrapperStyle}>
        <div style={boxStyle}>
          <h2 style={headingStyle}>Building your personalized routine...</h2>
        </div>
      </div>
    );
  }

  // If not loading, but no answers or no routine steps were found
  if (!hasAnswers || routineSteps.length === 0) {
    return (
      <div style={wrapperStyle}>
        <div style={boxStyle}>
          <h2 style={headingStyle}>No Routine Available</h2>
          <p style={paragraphStyle}>
            We couldn't find a routine matching your primary goal: **{userAnswers.primaryGoal || 'N/A'}**.
            <br />
            **Action Needed:** To get a personalized routine, you need to:
            <br />
            1. **Create a `routine_steps` table in your Supabase project.**
            <br />
            2. Populate it with routine data, including a `concerns` column (text) and `brand_id` (foreign key to `brands.id`).
            <br />
            3. Uncomment the Supabase fetch logic in `RoutineBuilder.js` and remove this message.
            <br />
            Alternatively, you can manually add routine suggestions within the component code.
          </p>
          <button
            style={buttonStyle}
            onClick={() => navigate("/quiz")}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ ...headingStyle, marginBottom: 24, textAlign: 'center' }}>
        Your Personalized Skincare Routine
      </h2>
      <div style={{ display: "grid", gap: 30 }}>
        {routineSteps.map((step, idx) => (
          <div
            key={idx} // Using index as key is okay for static lists, but if items reorder/change, use a unique ID from Supabase
            style={{
              background: "linear-gradient(90deg, #e3f0ff 45%, #93bafe 100%)",
              border: "2px solid #93bafe",
              borderRadius: 12,
              boxShadow: "0 2px 18px #93bafe55",
              padding: 20,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -10,
                left: -10,
                background: "#2a6ae7",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 14,
                border: "2px solid #93bafe",
              }}
            >
              Step {step.step_order}
            </div>

            <h3 style={{ color: "#2a6ae7", fontWeight: 700, marginTop: 15 }}>
              {step.step_name || "Unnamed Step"}
            </h3>

            <p style={{ marginBottom: 4, color: "#47567f" }}>
              **Brand:** {step.brands?.name || "Unknown"}
            </p>

            <p style={{ color: "#47567f", marginBottom: 15 }}>{step.description}</p>

            {step.official_product_url ? (
              <a
                href={step.official_product_url}
                target="_blank"
                rel="noopener noreferrer"
                style={buttonStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(94deg, #1f52c7 52%, #7ea7f3 110%)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(94deg, #2a6ae7 52%, #93bafe 110%)")
                }
              >
                Learn More
              </a>
            ) : (
              <span
                style={{
                  color: "#888",
                  fontStyle: "italic",
                  fontSize: 14,
                }}
              >
                No product link available
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Inline styles (unchanged, just moved for readability)
const wrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "60vh",
  padding: 20,
};

const boxStyle = {
  background: "linear-gradient(95deg, #93bafe 60%, #e3f0ff 100%)",
  color: "#2a6ae7",
  border: "2px solid #2a6ae755",
  padding: 32,
  borderRadius: 14,
  textAlign: "center",
  maxWidth: 420,
};

const headingStyle = {
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 12,
};

const paragraphStyle = {
  fontSize: 15,
};

const linkStyle = {
  color: "#2a6ae7",
  textDecoration: "underline",
};

const buttonStyle = {
  marginTop: 14,
  display: "inline-block",
  background: "linear-gradient(94deg, #2a6ae7 52%, #93bafe 110%)",
  color: "#fff",
  padding: "8px 16px",
  fontWeight: 700,
  borderRadius: 6,
  textDecoration: "none",
  transition: "background 0.3s ease",
  fontSize: 14.5,
  cursor: "pointer",
};

export default RoutineBuilder;