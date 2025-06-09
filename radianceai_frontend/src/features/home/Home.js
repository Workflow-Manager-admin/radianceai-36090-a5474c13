import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MotionWrapper } from "../../utils/animation";
import { motion } from "framer-motion";
import useProducts from "../../hooks/useProducts";
import VideoSlideshow from "../../components/VideoSlideshow";

/**
 * PUBLIC_INTERFACE
 * Home (landing) page with large, animated category tiles for major skin concerns.
 * Apple-like, visually distinct tiles drive user flow to category/product recommendations.
 */
const CATEGORIES = [
  {
    key: "brightening",
    label: "Skin Brightening",
    icon: "✨",
    color: "linear-gradient(100deg, #fadadd 70%, #e7b3ff 100%)",
    to: "/recommendations?cat=brightening",
    description: "Even skin tone, reduce dullness, and reveal radiance"
  },
  {
    key: "acne",
    label: "Acne Removal",
    icon: "🛡️",
    color: "linear-gradient(100deg, #f339db 65%, #e7b3ff 100%)",
    to: "/recommendations?cat=acne",
    description: "Fight acne, reduce blemishes, and soothe inflammation"
  },
  {
    key: "hydration",
    label: "Hydration",
    icon: "💧",
    color: "linear-gradient(100deg, #e7b3ff 60%, #fadadd 100%)",
    to: "/recommendations?cat=hydration",
    description: "Boost and lock in skin hydration for lasting glow"
  },
  {
    key: "antiaging",
    label: "Anti-Aging",
    icon: "🕰️",
    color: "linear-gradient(94deg, #fadadd 50%, #e7b3ff 90%)",
    to: "/recommendations?cat=antiaging",
    description: "Reduce fine lines and boost skin elasticity"
  },
  {
    key: "sensitivity",
    label: "Sensitivity",
    icon: "🍃",
    color: "linear-gradient(91deg, #fadadd 45%, #e7b3ff 97%)",
    to: "/recommendations?cat=sensitivity",
    description: "Soothe, protect and comfort sensitive skin"
  }
];

const tileVariants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.08 + i * 0.12,
      type: "spring",
      bounce: 0.28,
      duration: 0.65,
      stiffness: 170
    }
  }),
  whileHover: { scale: 1.04, boxShadow: "0 4px 32px #fadadd55" },
  whileTap: { scale: 0.98 }
};

const DEMO_VIDEO_URLS = [
  // Copyright-free demo/sample videos. In production, replace with real product showcase videos.
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Top Seller: Multivitamin Moisturizer"
  },
  {
    src: "https://www.pexels.com/video/854168/download/",
    title: "Blockbuster: Vitamin C Glow Serum"
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    title: "Classic: Gentle Foaming Cleanser"
  }
];

const Home = () => {
  const navigate = useNavigate();
  // Fetch 3 bestsellers—if product doesn't include video, fallback to demo.
  const { recommended, loading } = useProducts({
    sortBy: "rating",
    limit: 3,
    minRating: 4,
    deduplicate: true
  });

  // Map product data to video (mocking video source for now)
  const videoSlides = useMemo(() => {
    if (Array.isArray(recommended) && recommended.length > 0) {
      // If real .video or .videoUrl exists, use that. Otherwise, fallback.
      return recommended.map((p, i) => ({
        src: p.video || p.videoUrl || DEMO_VIDEO_URLS[i % DEMO_VIDEO_URLS.length].src,
        title: p.title
      }));
    }
    return DEMO_VIDEO_URLS;
  }, [recommended]);

  // PUBLIC_INTERFACE
  // Main home page: hero + animated option tiles
  return (
    <div className="container">
      <MotionWrapper>
        {/* VideoSlideshow Hero */}
        <VideoSlideshow videos={videoSlides} />
        <div className="hero" style={{
          paddingBottom: 10,
          gap: 19
        }}>
          <div className="subtitle"
            style={{
              color: "#fadadd",
              fontWeight: 600,
              letterSpacing: ".03em",
              fontSize: "1.38em"
            }}>
            GlowSkin by RadianceAI
          </div>
          <h1 className="title" style={{
            background: "linear-gradient(92deg, #fadadd 50%, #e7b3ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: ".01em"
          }}>
            Your AI-Powered Skincare Guide
          </h1>
          <div className="description"
            style={{
              fontSize: "1.12em",
              color: "#e7b3ff",
              marginBottom: 14
            }}>
            Choose your top skin concern to see personalized routines and top-rated Indian products.
          </div>
        </div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 22,
          maxWidth: 760,
          margin: "0 auto",
          justifyContent: "center",
          marginBottom: 24
        }}>
          {CATEGORIES.map((cat, idx) => (
            <motion.button
              key={cat.key}
              custom={idx}
              initial="initial"
              animate="animate"
              whileHover="whileHover"
              whileTap="whileTap"
              variants={tileVariants}
              onClick={() => navigate(cat.to)}
              className="category-tile-btn"
              style={{
                minWidth: 154,
                minHeight: 154,
                maxWidth: 196,
                flex: "1 1 170px",
                background: cat.color,
                color: "#27174e",
                border: "none",
                borderRadius: 29,
                boxShadow: "0 2.5px 16px #fadadd35",
                fontWeight: 700,
                fontSize: "1.16em",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                margin: "0",
                padding: "18px 12px 14px 12px",
                overflow: "hidden",
                transition: "box-shadow 0.18s, background 0.12s, color 0.15s"
              }}
              aria-label={`See products for ${cat.label}`}
            >
              <motion.div
                style={{
                  fontSize: 38,
                  marginBottom: 7,
                  textShadow: "0 2px 10px #fadadd44"
                }}
                initial={{ scale: 0.91 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 160, delay: 0.05 + idx * 0.11 }}
              >
                {cat.icon}
              </motion.div>
              <div style={{
                fontWeight: 800,
                fontSize: "1.19em",
                color: "#f339db",
                letterSpacing: ".01em",
                marginBottom: 2
              }}>
                {cat.label}
              </div>
              <div style={{
                color: "#27174e",
                fontWeight: 400,
                fontSize: "0.97em",
                lineHeight: 1.21,
                opacity: 0.74,
                marginTop: 2,
                textAlign: "center"
              }}>
                {cat.description}
              </div>
            </motion.button>
          ))}
        </div>
        <div style={{
          textAlign: "center",
          margin: "0 auto 10px auto",
          color: "#fadadd",
          fontSize: 16.8,
          fontWeight: 600
        }}>
          <span style={{
            background: "linear-gradient(93deg,#fadadd 20%,#e7b3ff 100%)",
            borderRadius: 13,
            padding: "6px 24px",
            color: "#27174e",
            boxShadow: "0 1px 8px #fadadd2a",
            fontWeight: 700,
            fontSize: "1.02em"
          }}>Or —</span>
          <span style={{ marginLeft: 12 }}>
            <button
              className="btn btn-large"
              style={{
                background: "linear-gradient(93deg,#fadadd 20%,#e7b3ff 100%)",
                color: "#27174e",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: "1.1em",
                marginLeft: 4,
              }}
              onClick={() => navigate("/quiz")}
            >Take the Personalized Quiz</button>
          </span>
        </div>
      </MotionWrapper>
    </div>
  );
};

export default Home;
