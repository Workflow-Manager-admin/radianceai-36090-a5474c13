import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    skinType: "",
    primaryGoal: "",
    productPreference: "",
    fragrance: "",
    age: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save answers to localStorage
    localStorage.setItem("quizAnswers", JSON.stringify(answers));

    // Navigate to recommendations
    navigate("/recommendations");
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 20,
        background: "#f4f8ff",
        borderRadius: 16,
        boxShadow: "0 4px 12px rgba(32, 80, 170, 0.12)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#2050aa", fontSize: 26 }}>
        Personalized Skincare Quiz
      </h2>
      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 18 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 600,
              color: "#2050aa",
              fontSize: 15.5,
            }}
          >
            Your Skin Type:
          </label>
          <select
            name="skinType"
            value={answers.skinType}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 15.5,
              borderRadius: 8,
              border: "1.5px solid #77a6ed",
              outline: "none",
              backgroundColor: "#fff",
            }}
          >
            <option value="">Select...</option>
            <option value="dry">Dry</option>
            <option value="oily">Oily</option>
            <option value="combination">Combination</option>
            <option value="sensitive">Sensitive</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 600,
              color: "#2050aa",
              fontSize: 15.5,
            }}
          >
            Your Primary Skin Concern:
          </label>
          <select
            name="primaryGoal"
            value={answers.primaryGoal}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 15.5,
              borderRadius: 8,
              border: "1.5px solid #77a6ed",
              outline: "none",
              backgroundColor: "#fff",
            }}
          >
            <option value="">Select...</option>
            <option value="hydration">Hydration</option>
            <option value="acne">Acne</option>
            <option value="brightening">Brightening</option>
            <option value="antiaging">Anti-aging</option>
          </select>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 600,
              color: "#2050aa",
              fontSize: 15.5,
            }}
          >
            Your Age Range:
          </label>
          <select
            name="age"
            value={answers.age}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 15.5,
              borderRadius: 8,
              border: "1.5px solid #77a6ed",
              outline: "none",
              backgroundColor: "#fff",
            }}
          >
            <option value="">Select...</option>
            <option value="18-24">18–24</option>
            <option value="25-34">25–34</option>
            <option value="35-44">35–44</option>
            <option value="45-54">45–54</option>
            <option value="55+">55+</option>
          </select>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 600,
              color: "#2050aa",
              fontSize: 15.5,
            }}
          >
            Product Preference:
          </label>
          <select
            name="productPreference"
            value={answers.productPreference}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 15.5,
              borderRadius: 8,
              border: "1.5px solid #77a6ed",
              outline: "none",
              backgroundColor: "#fff",
            }}
          >
            <option value="">Select...</option>
            <option value="minimal">Minimal (3–4 steps)</option>
            <option value="complete">Complete (5–7 steps)</option>
            <option value="budget">Budget-friendly</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 600,
              color: "#2050aa",
              fontSize: 15.5,
            }}
          >
            Do you prefer fragrance-free products?
          </label>
          <select
            name="fragrance"
            value={answers.fragrance}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 15.5,
              borderRadius: 8,
              border: "1.5px solid #77a6ed",
              outline: "none",
              backgroundColor: "#fff",
            }}
          >
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No, I don't mind</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            background: "linear-gradient(90deg,#2050aa 60%,#77a6ed 100%)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            display: "block",
            width: "100%",
            marginTop: 10,
          }}
        >
          See Product Recommendations
        </button>
      </form>
    </div>
  );
};

export default Quiz;
