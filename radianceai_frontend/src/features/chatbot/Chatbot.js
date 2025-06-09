import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppleFadeTransition, MotionWrapper } from "../../utils/animation";

/**
 * PUBLIC_INTERFACE
 * Chatbot: Apple-like animated AI chat with contextual rule-based (stub) logic for skin/routine/product help.
 */
const SUGGESTIONS = [
  "How do I start a skincare routine?",
  "Best products for dry skin?",
  "How often should I exfoliate?",
  "What's my skin type?",
  "Suggest a morning routine",
  "Why use sunscreen daily?",
  "Recommend me a moisturizer"
];

const BOT_AVATAR =
  <span style={{
    display: "inline-block",
    width: 35, height: 35,
    borderRadius: "50%", background: "linear-gradient(120deg,#fadadd 40%,#e7b3ff 100%)",
    boxShadow: "0 1.5px 7px #fadadd25",
    display_: "flex", alignItems_: "center", justifyContent_: "center", fontSize: 27, textAlign: "center"
  }} aria-label="bot">💬</span>;

// Rule-based AI stub: modify this map for better logic
function ruleBasedAI(query) {
  const q = query.trim().toLowerCase();
  if (/routine/.test(q) && /morning/.test(q)) {
    return "Here's a gentle morning routine: 1. Cleanser, 2. Toner, 3. Serum, 4. Moisturizer, 5. Sunscreen.";
  }
  if (/routine/.test(q) && /night/.test(q)) {
    return "Night routine: 1. Cleanser, 2. Treatment or Serum, 3. Night Moisturizer.";
  }
  if (/skin ?type/.test(q)) {
    return "Take the quiz for precise skin type analysis, or tell me about your skin (e.g., oily, dry, sensitive)!";
  }
  if (/dry skin/.test(q)) {
    return "For dry skin: Use gentle cleansers, hydrating serums (like hyaluronic acid), and rich moisturizers.";
  }
  if (/moisturizer/.test(q)) {
    return "Moisturizers help lock in hydration. Prefer fragrance-free products for sensitive skin. Want recommendations?";
  }
  if (/sunscreen/.test(q)) {
    return "Sunscreen protects skin from UV damage. Apply SPF 30+ every morning, and reapply as needed.";
  }
  if (/how often.*exfoliat/.test(q) || /exfoliat.*how often/.test(q)) {
    return "For most: exfoliate 1–2×/week with a mild exfoliant. Over-exfoliation can irritate. Choose gentle scrubs or acids.";
  }
  if (/recommend.*product/.test(q) || /product.*recommend/.test(q)) {
    return "What is your main skin goal or concern? (e.g., hydration, acne, aging, brightness)";
  }
  if (/hi|hello|hey|^$/.test(q)) {
    return "Hi there! I'm your RadianceAI skincare assistant. How can I help with products or routines today?";
  }
  return "I'm learning—can you rephrase or ask about skin, routines, or products?";
}

const USER_AVATAR =
  <span style={{
    display: "inline-block",
    width: 35, height: 35,
    borderRadius: "50%", background: "linear-gradient(120deg,#e7b3ff 60%,#fadadd 100%)",
    boxShadow: "0 1.5px 7px #e7b3ff28",
    display_: "flex", alignItems_: "center", justifyContent_: "center", fontSize: 25, textAlign: "center"
  }} aria-label="user">🧑‍💻</span>;

// Scroll helper
function useAutoScroll(ref, deps=[]) {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight+100;
    }
    // eslint-disable-next-line
  }, deps);
}

// Chatbot component
const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Need help with your skin, routine, or products? Ask me anything ✨", ts: Date.now() }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSuggest, setShowSuggest] = useState(true);
  const scrollRef = useRef();

  // Auto scroll to bottom on messages
  useAutoScroll(scrollRef, [messages, typing]);

  // Send message (simulate AI delay)
  function sendMessage(msg) {
    if (!msg.trim()) return;
    setMessages(m => [...m, { sender: "user", text: msg.trim(), ts: Date.now() }]);
    setTyping(true);
    setTimeout(() => {
      const reply = ruleBasedAI(msg);
      setMessages(m => [...m, { sender: "bot", text: reply, ts: Date.now() + 1 }]);
      setTyping(false);
    }, 650 + Math.random()*400); // random typing time
  }

  function handleInput(e) {
    setInput(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
      setShowSuggest(false);
    }
  }
  function handleSuggest(s) {
    sendMessage(s);
    setInput("");
    setShowSuggest(false);
  }

  return (
    <section className="container" style={{ maxWidth: 480, margin: "0 auto", paddingTop: 36, paddingBottom: 32 }}>
      <AppleFadeTransition>
        <h2 style={{
          fontWeight: 700, fontSize: "1.48rem",
          color: "#fadadd", textAlign: "center", letterSpacing: ".01em",
          margin: "10px 0 7px 0"
        }}>
          RadianceAI Chatbot
        </h2>
        <div style={{
          color: "#e7b3ff",
          textAlign: "center",
          fontSize: 16,
          marginBottom: 15,
        }}>
          Get personalized answers about your skin, routines, or products—in real time.
        </div>
        <MotionWrapper>
          <motion.div
            className="ai-chatbot-frame"
            initial={{ boxShadow: "0 2px 20px #fadadd17", scale: 0.97 }}
            animate={{ boxShadow: "0 4px 38px #fadadd26", scale: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.29 }}
            style={{
              background: "linear-gradient(115deg,#19155e 50%,#fadadd24 120%)",
              borderRadius: 24,
              padding: "26px 10px 12px 10px",
              boxShadow: "0 1.5px 9px #fadadd12",
              minHeight: 440,
              margin: "0 auto 12px auto",
              position: "relative",
              maxWidth: 470,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Message area */}
            <motion.div
              ref={scrollRef}
              style={{
                width: "100%",
                height: 340,
                overflowY: "auto",
                overscrollBehavior: "contain",
                background: "rgba(234,179,255,0.055)",
                borderRadius: 16,
                boxShadow: "0 1px 11px #e7b3ff19",
                padding: "6px 8px 8px 8px",
                marginBottom: 9,
                position: "relative",
                scrollbarWidth: "thin"
              }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.ts + "-" + i}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.29, type: "spring", bounce: 0.26 }}
                  style={{
                    display: "flex",
                    flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    gap: 9,
                    marginBottom: 5,
                  }}
                >
                  <div>{msg.sender === "bot" ? BOT_AVATAR : USER_AVATAR}</div>
                  <div
                    style={{
                      background: msg.sender === "bot"
                        ? "linear-gradient(110deg,#E7B3FF0c 60%,#FADADD27 120%)"
                        : "linear-gradient(97deg, #fadadd 65%, #e7b3ff 120%)",
                      color: msg.sender === "bot" ? "#fadadd" : "#23155f",
                      padding: "12px 15px",
                      borderRadius: msg.sender === "bot" ? "13px 13px 13px 2.5em" : "13px 13px 2.5em 13px",
                      fontSize: 15.9,
                      minWidth: 40,
                      minHeight: 22,
                      maxWidth: 320,
                      fontWeight: 500,
                      boxShadow: msg.sender === "bot"
                        ? "0 2px 14px #fadadd15"
                        : "0 2px 19px #fadadd43",
                      marginBottom: 5,
                      marginLeft: msg.sender === "user" ? 0 : 5,
                      marginRight: msg.sender === "user" ? 5 : 0,
                      whiteSpace: "pre-line",
                      wordBreak: "break-word"
                    }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {/* Typing animation */}
              <AnimatePresence>
                {typing &&
                  <motion.div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 3,
                      marginLeft: 2
                    }}
                    initial={{ opacity: 0, y: 10, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1.05 }}
                    exit={{ opacity: 0, y: -13, scale: 0.96 }}
                    transition={{ duration: 0.18, type: "tween" }}
                  >
                    <div>{BOT_AVATAR}</div>
                    <div style={{
                      display: "inline-block", padding: "12px 20px",
                      borderRadius: "14px 14px 18px 14px", background: "#fadadd29",
                      color: "#fadadd"
                    }}>
                      <BlinkingDots />
                    </div>
                  </motion.div>
                }
              </AnimatePresence>
            </motion.div>
            {/* Quick suggestions */}
            {showSuggest && (
              <div style={{
                width: "100%", margin: "0 auto",
                display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", marginBottom: 9,
              }}>
                {SUGGESTIONS.slice(0, 4).map((s, idx) =>
                  <motion.button
                    key={s}
                    onClick={() => handleSuggest(s)}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: "7px 15px",
                      borderRadius: 12,
                      border: "none",
                      background: "linear-gradient(90deg,#fadadd 60%,#e7b3ff 100%)",
                      color: "#27174e",
                      fontWeight: 600,
                      fontSize: 14,
                      boxShadow: "0 1px 6px #e7b3ff1d",
                      marginBottom: 2,
                      cursor: "pointer",
                    }}>
                    {s}
                  </motion.button>
                )}
              </div>
            )}
            {/* Input and send */}
            <form onSubmit={handleSubmit} autoComplete="off" style={{
              marginTop: 2,
              width: "100%",
              display: "flex",
              gap: 8
            }}>
              <input
                value={input}
                onChange={handleInput}
                placeholder="Type your skincare question…"
                aria-label="Chat input"
                disabled={typing}
                maxLength={200}
                style={{
                  flex: 1,
                  borderRadius: 13,
                  border: "none",
                  fontSize: 16,
                  padding: "12px 14px",
                  background: "#e7b3ff19",
                  color: "#fff",
                  outline: "none",
                  marginRight: 2,
                  boxShadow: "0 1px 4px #fadadd15"
                }}
                onFocus={() => setShowSuggest(false)}
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.96 }}
                disabled={typing || !input.trim()}
                style={{
                  borderRadius: 13,
                  border: "none",
                  fontWeight: 700,
                  fontSize: 16.2,
                  background: "linear-gradient(90deg,#fadadd 60%,#e7b3ff 100%)",
                  color: "#27174e",
                  padding: "11px 24px",
                  minWidth: 65,
                  cursor: typing || !input.trim() ? "not-allowed" : "pointer",
                  opacity: typing || !input.trim() ? 0.69 : 1,
                  boxShadow: "0 1px 4px #fadadd13"
                }}
                aria-label="Send"
              >Send</motion.button>
            </form>
            <div style={{
              color: "#fadadd",
              fontSize: 13.2,
              opacity: 0.56,
              margin: "8px 0 0 0",
              textAlign: "center"
            }}>
              Chatbot is learning. For product recommendations, try the <a href="/quiz" style={{
                color: "#f339db", textDecoration: "underline"
              }}>quiz</a> or <a href="/products" style={{
                color: "#e7b3ff", textDecoration: "underline"
              }}>browse products</a>.
            </div>
          </motion.div>
        </MotionWrapper>
      </AppleFadeTransition>
    </section>
  );
};

// Typing indicator
function BlinkingDots() {
  const [dotCount, setDotCount] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => setDotCount(d => (d + 1) > 3 ? 1 : d + 1), 350);
    return () => clearInterval(interval);
  }, []);
  return <span>{'.'.repeat(dotCount)}<span style={{ opacity: 0.35 }}>{'.'.repeat(3 - dotCount)}</span></span>
}

export default Chatbot;
