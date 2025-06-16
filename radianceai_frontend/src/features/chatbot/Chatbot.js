import React, { useState, useEffect, useRef } from "react";
import supabase from "../../api/supabaseClient";

// Rule-based fallback AI
function ruleBasedAI(question) {
  question = question.toLowerCase();

  if (question.includes("hello")) return "Hey there! How can I help you with your skincare today?";
  if (question.includes("thank")) return "You’re welcome! Feel free to ask me anything else.";
  return "Sorry, I didn't get that. Can you please rephrase?";
}

// Skin concerns dictionary with synonyms
const concernsDict = {
  acne: ["acne", "pimples", "blemishes", "breakouts", "oil control"],
  hydration: ["hydration", "dry", "dryness", "dehydration", "moisture"],
  aging: ["aging", "wrinkles", "fine lines", "age spots", "anti-aging", "texture"],
  brightness: ["brightness", "dull", "radiance", "glow"],
  sensitive: ["sensitive", "redness", "irritation", "allergic"],
  oily: ["oily", "greasy", "shine"],
  pigmentation: ["pigmentation", "dark spots", "hyperpigmentation", "uneven skin tone", "blemishes"],
  sun_protection: ["sun protection", "sun damage", "barrier repair"],
  dark_circles: ["dark circles", "fine lines"],
};

// Common skin types dictionary with synonyms
const skinTypesDict = {
  all: ["all", "any", "all skin types", "every skin type"],
  dry: ["dry", "dry skin"],
  oily_combination_sensitive: ["oily", "combination", "sensitive", "oily skin", "combination skin", "sensitive skin"],
  oily_acne_prone: ["oily acne-prone", "acne-prone", "acne prone", "acne skin", "oily acne prone"],
};

// Find best matching concern from user input
function findConcern(text) {
  const lowerText = text.toLowerCase();
  for (const [key, synonyms] of Object.entries(concernsDict)) {
    for (const synonym of synonyms) {
      if (lowerText.includes(synonym)) return key;
    }
  }
  return null;
}

// Find best matching skin type from user input
function findSkinType(text) {
  const lowerText = text.toLowerCase();
  for (const [key, synonyms] of Object.entries(skinTypesDict)) {
    for (const synonym of synonyms) {
      if (lowerText.includes(synonym)) return key;
    }
  }
  // If none found, default to 'all'
  return "all";
}

// Fetch products filtered by concern and skin type
async function fetchProducts(concern, skinType) {
  let query = supabase
    .from("products")
    .select("id, name, brand, product_url, image_url")
    .limit(5);

  if (concern) {
    query = query.ilike("concerns", `%${concern}%`);
  }

  // Only filter skin type if not 'all'
  if (skinType && skinType !== "all") {
    query = query.ilike("skin_types", `%${skinType}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase fetch error:", error);
    return { error };
  }

  return { data };
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! Ask me for skincare product recommendations or general help. You can mention your skin concern and skin type for better suggestions.",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Typing dots component
  const TypingDots = () => (
    <div style={{ fontStyle: "italic", color: "#666" }}>
      Bot is typing
      <span className="dots">...</span>
      <style>{`
        .dots {
          animation: dots 1.5s steps(3, end) infinite;
          display: inline-block;
        }
        @keyframes dots {
          0%, 20% {content: "";}
          40% {content: ".";}
          60% {content: "..";}
          80%, 100% {content: "...";}
        }
      `}</style>
    </div>
  );

  async function sendMessage(msg) {
    if (!msg.trim()) return;

    setMessages((m) => [...m, { sender: "user", text: msg.trim(), ts: Date.now() }]);
    setInput("");
    setTyping(true);

    const normalizedMsg = msg.toLowerCase();

    // Check if user is asking for product recommendations
    const wantsRecommendation = /recommend|suggest|products?|help with/.test(normalizedMsg);

    if (wantsRecommendation) {
      // Detect concern and skin type from message
      const concern = findConcern(normalizedMsg);
      const skinType = findSkinType(normalizedMsg);

      if (!concern) {
        // Ask user to specify concern if missing
        setMessages((m) => [
          ...m,
          {
            sender: "bot",
            text:
              "Could you please specify your skin concern? For example: acne, hydration, aging, sensitive, oily, pigmentation, sun protection, dark circles.",
            ts: Date.now() + 1,
          },
        ]);
        setTyping(false);
        return;
      }

      const { data, error } = await fetchProducts(concern, skinType);

      if (error) {
        setMessages((m) => [
          ...m,
          {
            sender: "bot",
            text: "Oops! There was a problem fetching products. Please try again later.",
            ts: Date.now() + 1,
          },
        ]);
        setTyping(false);
        return;
      }

      if (!data || data.length === 0) {
        setMessages((m) => [
          ...m,
          {
            sender: "bot",
            text: `Sorry, I couldn't find any products for your concern "${concern}"${
              skinType !== "all" ? ` and skin type "${skinType.replace(/_/g, " ")}"` : ""
            }. Try another concern or skin type, or ask for general help!`,
            ts: Date.now() + 1,
          },
        ]);
        setTyping(false);
        return;
      }

      // Show products with images and links
      setMessages((m) => [
        ...m,
        {
          sender: "bot",
          text: `Here are some products for *${concern.replace(/_/g, " ")}*${skinType !== "all" ? ` and skin type *${skinType.replace(/_/g, " ")}*` : ""}:`,
          ts: Date.now() + 1,
          products: data, // attach products for rendering images
        },
      ]);
      setTyping(false);
      return;
    }

    // Fallback to rule-based AI with delay and typing animation
    setTimeout(() => {
      const reply = ruleBasedAI(msg);
      setMessages((m) => [...m, { sender: "bot", text: reply, ts: Date.now() + 1 }]);
      setTyping(false);
    }, 1000 + Math.random() * 800);
  }

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "auto",
        border: "1px solid #ccc",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          padding: "12px 15px",
          borderBottom: "1px solid #ccc",
          fontWeight: "700",
          fontSize: 20,
          backgroundColor: "#4a90e2",
          color: "white",
          textAlign: "center",
        }}
      >
        Skincare Chatbot
      </div>

      <div
        style={{
          flexGrow: 1,
          padding: 12,
          overflowY: "auto",
          backgroundColor: "#f7f9fc",
          fontSize: 15,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={msg.ts + i}
            style={{
              marginBottom: 12,
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                backgroundColor: msg.sender === "user" ? "#007bff" : "#e0e6f7",
                color: msg.sender === "user" ? "white" : "#1a1a1a",
                padding: "10px 14px",
                borderRadius: 18,
                whiteSpace: "pre-wrap",
                boxShadow: msg.sender === "bot" ? "0 0 8px rgba(0,0,0,0.1)" : undefined,
                position: "relative",
              }}
            >
              {/* If bot message has products, render product cards */}
              {msg.products ? (
                <>
                  <p style={{ marginTop: 0, marginBottom: 8 }}>{msg.text}</p>
                  {msg.products.map((p) => (
                    <a
                      key={p.id}
                      href={p.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "white",
                        padding: 8,
                        marginBottom: 8,
                        borderRadius: 10,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        textDecoration: "none",
                        color: "#333",
                        gap: 12,
                      }}
                    >
                      <img
                        src={p.image_url || "https://via.placeholder.com/60"}
                        alt={p.name}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flexGrow: 1 }}>
                        <strong>{p.brand}</strong>
                        <div>{p.name}</div>
                      </div>
                      <div
                        style={{
                          color: "#4a90e2",
                          fontWeight: "600",
                          fontSize: 13,
                        }}
                      >
                        View
                      </div>
                    </a>
                  ))}
                </>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {typing && <TypingDots />}
        <div ref={chatBottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        style={{
          display: "flex",
          padding: "12px 15px",
          borderTop: "1px solid #ccc",
          backgroundColor: "#fafafa",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flexGrow: 1,
            padding: "12px 15px",
            borderRadius: 25,
            border: "1.5px solid #ccc",
            outline: "none",
            fontSize: 15,
            boxShadow: "inset 0 1px 3px rgb(0 0 0 / 0.1)",
          }}
          disabled={typing}
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          style={{
            marginLeft: 10,
            padding: "12px 20px",
            borderRadius: 25,
            border: "none",
            backgroundColor: typing ? "#a0bff9" : "#007bff",
            color: "white",
            fontWeight: "700",
            fontSize: 15,
            cursor: typing ? "not-allowed" : "pointer",
            boxShadow: "0 4px 8px rgb(0 123 255 / 0.4)",
            transition: "background-color 0.3s ease",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
