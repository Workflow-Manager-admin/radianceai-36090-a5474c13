import React from 'react';
import Quiz from '../quiz/Quiz';
import ProductList from '../products/ProductList';
import { AppleFadeTransition, MotionWrapper } from '../../utils/animation';

/**
 * Renders the animated hero section at the top of the homepage.
 * Includes a call-to-action and anchor to the quiz section.
 */
function HeroSection() {
  // Apple-like hero banner with CTA
  return (
    <div
      style={{
        background: 'linear-gradient(97deg,#ebf4ff 70%,#FFF8EB 100%)',
        borderRadius: 24,
        padding: '55px 22px 38px 25px',
        boxShadow: '0 6px 32px #2050aa15',
        marginBottom: 38,
        textAlign: 'center',
        marginTop: 20,
        maxWidth: '1000px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <h1
        style={{
          color: '#2050aa',
          fontWeight: 900,
          fontSize: '2.48em',
          margin: '0 0 9px 0',
          letterSpacing: '.01em',
        }}
      >
        Personalized Skincare. <span style={{ color: '#77a6ed' }}>AI-Powered Glow.</span>
      </h1>
      <div
        style={{
          color: '#2050aa',
          fontWeight: 500,
          fontSize: '1.12em',
          margin: '9px 0 16px 0',
        }}
      >
        Discover your custom routine and products—guided by AI, built for you. Take our short quiz to get started!
      </div>
      <a href="#quiz-section">
        <button
          className="btn btn-large"
          style={{
            background: 'linear-gradient(91deg,#2050aa 55%,#77a6ed 100%)',
            color: '#fff',
            borderRadius: 13,
            fontWeight: 700,
            fontSize: '1.19em',
            letterSpacing: '.01em',
            marginTop: 6,
            boxShadow: '0 4px 26px #2050aa23',
            minWidth: 186,
            padding: '13px 28px',
          }}
        >
          Take The Quiz →
        </button>
      </a>
    </div>
  );
}

/**
 * An animated progress bar UI below the hero, reminiscent of Apple-style web progress.
 */
function AnimatedProgressBar() {
  // Simulated animated progress bar UI (Apple-like)
  return (
    <div
      style={{
        maxWidth: 540,
        margin: '0 auto 24px auto',
        background: 'linear-gradient(90deg,#dde9ff 30%,#77a6ed 100%)',
        borderRadius: 16,
        padding: '9px 0',
        boxShadow: '0 1.5px 8px #77a6ed23',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '80%',
          height: 16,
          background: 'linear-gradient(90deg,#2050aa 60%,#77a6ed 100%)',
          borderRadius: 14,
          transition: 'width 1.8s cubic-bezier(.36,1.37,.58,1.38)',
          animation: 'progressSlide 2s ease-in-out 1',
        }}
      />
      <style>
        {`
          @keyframes progressSlide {
            0% { width: 17%; }
            80% { width: 88%; }
            100% { width: 80%; }
          }
        `}
      </style>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * The Home page for RadianceAI – GlowSkin.
 * Preserves all UX sections: hero, animated progress, Quiz below the fold, and ProductList in its correct showcase area only.
 */
export default function Home() {
  // All homepage UX sections
  return (
    <MotionWrapper>
      <section>
        <HeroSection />
        <AnimatedProgressBar />
      </section>

      {/* Quiz Section (anchor link) */}
      <section id="quiz-section">
        <AppleFadeTransition>
          <Quiz />
        </AppleFadeTransition>
      </section>

      {/* Product showcase area: ONLY for ProductList */}
      <section style={{
        margin: '60px auto 10px auto',
        maxWidth: 1240,
        background: 'linear-gradient(96deg,#eaf5ff 70%,#FFF8EB 100%)',
        borderRadius: 26,
        padding: '32px 15px 48px 15px',
        boxShadow: '0 4px 32px #77a6ed14',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '0 0 19px 0',
          flexWrap: 'wrap',
        }}>
        <h2 style={{
          color: '#2050aa',
          fontWeight: 900,
          fontSize: '1.7em',
          margin: 0,
          letterSpacing: '.01em',
        }}>
          Best-Selling Skincare Products
       </h2>

          <a
            href="/allproducts" // 🔁 change this to your actual internal page route
            style={{
              textDecoration: 'none',
              fontSize: '0.95em',
              fontWeight: 600,
              color: '#266fd6',
              background: '#eaf5ff',
              padding: '8px 14px',
              borderRadius: 12,
              border: '1px solid #dde9ff',
              boxShadow: '0 1px 5px rgba(119, 166, 237, 0.1)',
              transition: 'background 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#d5e9ff')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#eaf5ff')}
          >
            View All Brands →
          </a>
        </div>

        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {/* ONLY insert ProductList here (Supabase fetch) */}
          <ProductList />
        </div>
      </section>
    </MotionWrapper>
  );
}
