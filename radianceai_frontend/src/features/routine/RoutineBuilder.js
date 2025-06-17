import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import supabase from "../../api/supabaseClient";

const RoutineBuilder = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [routineSteps, setRoutineSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAnswers, setHasAnswers] = useState(false); // Track if valid answers exist

  useEffect(() => {
    const loadAndFetchRoutine = async () => {
      setLoading(true);
      let answers = null;
      try {
        const stored = localStorage.getItem("quizAnswers");
        if (stored) {
          answers = JSON.parse(stored);
          // Check for essential answers for the routine builder
          if (answers && answers.primaryGoal) {
            setHasAnswers(true);
          }
        }
      } catch (error) {
        console.error("Error parsing quiz answers from localStorage:", error);
      }

      if (!answers || !answers.primaryGoal) {
        // No valid answers, or primaryGoal is missing
        setLoading(false);
        setHasAnswers(false); // Ensure this is false
        // Optionally, you might want to navigate here immediately if no answers at all
        // navigate("/quiz"); // Uncomment if you want immediate redirect
        return;
      }

      // If we have answers, proceed to fetch the routine
      const { data, error } = await supabase
        .from("routine_steps")
        .select(`
          step_order,
          step_name,
          description,
          brand_id,
          official_product_url,
          brands!routine_steps_brand_id_fkey (
            name
          )
        `)
        .eq("concerns", answers.primaryGoal)
        .order("step_order", { ascending: true });

      if (error) {
        console.error("Error fetching routine steps:", error);
        setRoutineSteps([]); // Ensure empty array on error
      } else {
        setRoutineSteps(data);
      }
      setLoading(false);
    };

    loadAndFetchRoutine();
  }, []); // Empty dependency array means this runs once on mount

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
            Please complete the{" "}
            <a href="/quiz" style={linkStyle} onClick={(e) => {
              e.preventDefault();
              navigate("/quiz");
            }}>
              quiz
            </a>{" "}
            to get a personalized routine tailored to your needs.
          </p>
        </div>
      </div>
    );
  }

  // If routineSteps exist, render the routine
  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}> {/* Added max-width for better layout */}
      <h2 style={{ ...headingStyle, marginBottom: 24, textAlign: 'center' }}>
        Your Personalized Skincare Routine
      </h2>
      <div style={{ display: "grid", gap: 30 }}> {/* Increased gap for better spacing */}
        {routineSteps.map((step, idx) => (
          <div
            key={idx}
            style={{
              background: "linear-gradient(90deg, #e3f0ff 45%, #93bafe 100%)",
              border: "2px solid #93bafe",
              borderRadius: 12,
              boxShadow: "0 2px 18px #93bafe55",
              padding: 20,
              position: "relative",
            }}
          >
            {/* Step badge */}
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

            {/* Title */}
            <h3 style={{ color: "#2a6ae7", fontWeight: 700, marginTop: 15 }}> {/* Adjusted margin */}
              {step.step_name || "Unnamed Step"}
            </h3>

            {/* Brand */}
            <p style={{ marginBottom: 4, color: "#47567f" }}>
              <strong>Brand:</strong> {step.brands?.name || "Unknown"}
            </p>

            {/* Description */}
            <p style={{ color: "#47567f", marginBottom: 15 }}>{step.description}</p> {/* Added margin-bottom */}

            {/* Learn More */}
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
  cursor: "pointer", // Added cursor for clarity
};

export default RoutineBuilder;