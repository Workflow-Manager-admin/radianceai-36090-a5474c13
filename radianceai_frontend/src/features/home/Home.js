import React from "react";
import { MotionWrapper } from "../../utils/animation";

// PUBLIC_INTERFACE
/**
 * Home (landing) page with animated hero section.
 */
const Home = () => (
  <div className="container">
    <MotionWrapper>
      <div className="hero">
        <div className="subtitle">GlowSkin by RadianceAI</div>
        <h1 className="title">Modern Skincare Recommendation App</h1>
        <div className="description">
          Take the quiz, get your personalized routine, and unlock your best skin with AI-powered recommendations.
        </div>
        <button className="btn btn-large">Start Quiz</button>
      </div>
    </MotionWrapper>
  </div>
);

export default Home;
