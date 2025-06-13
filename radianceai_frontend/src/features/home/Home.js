import React, { useState } from "react";
import { motion } from "framer-motion";
import Quiz from "../quiz/Quiz";
import ProductList from "../products/ProductList";
import { AppleFadeTransition, MotionWrapper } from "../../utils/animation";

/**
 * Home: "GlowSkin" hero, quiz CTA, hero copy, and embedded ProductList
 * - Retains hero/jumbotron, call-to-action, palette-compliant styling
 * - Quiz launches in a modal
 * - ProductList (Supabase-driven) appears in 'Best Sellers' section
 * - All other content/layout/animation from original and requirements is preserved
 */

const HERO_BG =
  "linear-gradient(107deg, #eaf5ff 65%, #fff8eb 100%)";

const SUBTEXT =
  "Personalized skincare routines powered by AI, science, and the best-selling products.";

function Home() {
  const [quizOpen, setQuizOpen] = useState(false);

  // Animation variants for hero
  const heroVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.98 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { delay: 0.05, duration: 0.9, type: "spring", bounce: 0.34 }
    }
  };

  // Animation for call-to-action button
  const ctaMotion = {
    rest: { scale: 1, boxShadow: "0 1.5px 19px #77a6ed41" },
    hover: { scale: 1.05, boxShadow: "0 5px 36px #2050aa19" },
    tap: { scale: 0.98 }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="container"
        style={{
          background: HERO_BG,
          borderRadius: 22,
          margin: "0 auto",
          marginTop: 12,
          marginBottom: 44,
          padding: "36px 18px 29px 18px",
          boxShadow: "0 4px 32px #abd4fc13",
          maxWidth: 1020,
        }}
      >
        <MotionWrapper>
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "2.52rem",
                fontWeight: 900,
                letterSpacing: ".01em",
                color: "#2050aa",
                marginBottom: 10
              }}
            >
              GlowSkin by RadianceAI
            </h1>
            <div
              className="subtitle"
              style={{
                color: "#77a6ed",
                fontSize: "1.34em",
                marginBottom: 18,
                fontWeight: 600,
              }}
            >
              {SUBTEXT}
            </div>

            {/* Animated hero description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 0.97, y: 0 }}
              transition={{ delay: 0.24, duration: 0.8, type: "tween" }}
              className="description"
              style={{
                color: "#2050aa",
                fontSize: "1.08em",
                marginBottom: 32,
                maxWidth: 540,
                marginLeft: "auto",
                marginRight: "auto",
                opacity: 0.92,
              }}
            >
              Discover your perfect morning and night skincare routine.
              <br />
              Take our 2‑minute quiz and get verified matches for your skin type, goals, and budget—with AI-powered suggestions and real-time best-seller rankings.
            </motion.div>

            {/* Quiz Modal Trigger CTA */}
            <motion.button
              className="btn btn-large"
              variants={ctaMotion}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              style={{
                background: "linear-gradient(90deg,#2050aa 62%,#77a6ed 100%)",
                color: "#fff",
                borderRadius: 14,
                fontWeight: 800,
                fontSize: "1.15em",
                padding: "15px 38px",
                marginTop: 12,
                marginBottom: 7,
                letterSpacing: ".012em",
                boxShadow: "0 4px 22px #2050aa18",
                border: "none",
                cursor: "pointer"
              }}
              onClick={() => setQuizOpen(true)}
              aria-label="Take the Skincare Quiz"
            >
              Take the Quiz
            </motion.button>
            <div style={{ color: "#77a6ed", marginTop: 4, fontSize: 15.5 }}>
              Already took the quiz? <a href="/recommendations" style={{ color: "#2050aa", textDecoration: "underline", fontWeight: 600 }}>See Recommendations</a>
            </div>
          </motion.div>
        </MotionWrapper>
      </section>

      {/* Quiz Modal */}
      {quizOpen && (
        <div
          className="quiz-modal-overlay"
          style={{
            position: "fixed",
            top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(119,166,237,0.19)",
            zIndex: 4020,
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, type: "spring" }}
            style={{
              zIndex: 4030,
              background: "#fafdfe",
              borderRadius: 19,
              padding: 0,
              boxShadow: "0 8px 38px #2050aa14",
              width: "100%",
              maxWidth: 560,
              margin: 10
            }}
          >
            {/* Close button (top right) */}
            <div style={{ textAlign: "right", padding: 8 }}>
              <button
                tabIndex={0}
                aria-label="Close Quiz"
                onClick={() => setQuizOpen(false)}
                style={{
                  background: "transparent",
                  color: "#2050aa",
                  fontWeight: 900,
                  fontSize: 23,
                  border: "none",
                  cursor: "pointer"
                }}
              >
                ×
              </button>
            </div>
            <AppleFadeTransition>
              <Quiz />
            </AppleFadeTransition>
          </motion.div>
        </div>
      )}

      {/* Section: Best Sellers / ProductList */}
      <section
        className="container"
        style={{
          margin: "0 auto",
          marginBottom: 42,
          maxWidth: 1200,
          background: "#fff",
          borderRadius: 19,
          boxShadow: "0 2px 16px #dde9ff38",
          padding: "32px 7px 34px 7px"
        }}
      >
        <MotionWrapper>
          <h2
            className="title"
            style={{
              textAlign: "center",
              fontSize: "2.0rem",
              fontWeight: 800,
              color: "#2050aa",
              margin: "2px 0 19px 0",
              letterSpacing: ".01em"
            }}
          >
            Trending & Best-Selling Products
          </h2>
          <div
            className="subtitle"
            style={{
              color: "#77a6ed",
              textAlign: "center",
              fontWeight: 500,
              fontSize: "1.19rem",
              marginBottom: 28
            }}
          >
            Top-rated and most-loved items, updated live from our Supabase database.
          </div>
          {/* The actual product list (Supabase-powered) */}
          <div style={{ margin: "0 auto", maxWidth: 1050 }}>
            <ProductList />
          </div>
        </MotionWrapper>
      </section>

      {/* Additional animated/structured UI section could be placed here */}
      <section
        className="container"
        style={{
          maxWidth: 1020,
          margin: "0 auto",
          marginBottom: 24,
          textAlign: "center"
        }}
      >
        <MotionWrapper>
          <div
            style={{
              color: "#2050aa",
              fontSize: "1.07rem",
              background: "linear-gradient(98deg,#eaf5ff 80%,#fff8eb 100%)",
              padding: "15px 12px",
              borderRadius: 14,
              boxShadow: "0 1.7px 10px #abd4fc15",
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            <strong>GlowSkin</strong> uses AI and dermatologist-backed algorithms to match you with the ideal products. <br />
            Save your personalized routine, track your progress, and receive recommendations tailored to the weather in your region!
          </div>
        </MotionWrapper>
      </section>
    </div>
  );
}

export default Home;
