import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient"; // Import your existing Supabase client

const RoutineBuilder = () => {
  const [answers, setAnswers] = useState(null);
  const [routineSteps, setRoutineSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load answers from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("quizAnswers");
    if (stored) {
      setAnswers(JSON.parse(stored));
    } else {
      setLoading(false); // No answers, stop loading
    }
  }, []);

  // Fetch routine from Supabase
  useEffect(() => {
    const fetchRoutine = async () => {
      if (!answers?.primaryGoal) {
        setLoading(false);
        return;
      }

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
      } else {
        setRoutineSteps(data);
      }
      setLoading(false);
    };

    fetchRoutine();
  }, [answers]);

  if (loading) {
    return (
      <div style={wrapperStyle}>
        <div style={boxStyle}>
          <h2 style={headingStyle}>Building your routine...</h2>
        </div>
      </div>
    );
  }

  if (!answers || routineSteps.length === 0) {
    return (
      <div style={wrapperStyle}>
        <div style={boxStyle}>
          <h2 style={headingStyle}>No routine available</h2>
          <p style={paragraphStyle}>
            Please complete the{" "}
            <a href="/quiz" style={linkStyle}>
              quiz
            </a>{" "}
            to get a personalized routine.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ ...headingStyle, marginBottom: 24 }}>
        Your Personalized Skincare Routine
      </h2>
      <div style={{ display: "grid", gap: 20 }}>
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
            <h3 style={{ color: "#2a6ae7", fontWeight: 700 }}>
              {step.step_name || "Unnamed Step"}
            </h3>

            {/* Brand */}
            <p style={{ marginBottom: 4, color: "#47567f" }}>
              <strong>Brand:</strong> {step.brands?.name || "Unknown"}
            </p>

            {/* Description */}
            <p style={{ color: "#47567f" }}>{step.description}</p>

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

// Inline styles
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
};

export default RoutineBuilder;
