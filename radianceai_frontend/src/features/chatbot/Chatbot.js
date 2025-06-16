import React, { useState, useEffect, useRef } from "react";
import supabase from "../../api/supabaseClient"; // Adjust path if needed

// Your existing rule-based AI function
function ruleBasedAI(question) {
  question = question.toLowerCase();

  if (question.includes("hello")) return "Hey there! How can I help you with your skincare today?";
  if (question.includes("recommend")) return "Please tell me your skin concern like acne, hydration, or anti-aging.";
  if (question.includes("thank")) return "You’re welcome! Feel free to ask me anything else.";
  return "Sorry, I didn't get that. Can you please rephrase?";
}

// Fetch products by concern from Supabase
async function fetchProductsByConcern(concern) {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, brand, product_url")
    .ilike("concerns", `%${concern}%`)
    .limit(5);

  if (error) {
    console.error("Supabase fetch error:", error);
    return null;
  }
  return data;
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me for skincare product recommendations or general help.", ts: Date.now() }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending message and getting bot reply
  async function sendMessage(msg) {
    if (!msg.trim()) return;

    // Add user message
    setMessages((m) => [...m, { sender: "user", text: msg.trim(), ts: Date.now() }]);
    setInput("");
    setTyping(true);

    const q = msg.trim().toLowerCase();

    // Detect if user wants product recommendations
    if (/recommend.*product/.test(q) || /product.*recommend/.test(q)) {
      // Try to find a known concern keyword
      const concerns = ["acne", "hydration", "aging", "brightness", "dry", "oily", "sensitive"];
      let foundConcern = null;
      for (let c of concerns) {
        if (q.includes(c)) {
          foundConcern = c;
          break;
        }
      }

      if (foundConcern) {
        const products = await fetchProductsByConcern(foundConcern);
        if (products && products.length > 0) {
          // Format bot message listing products
          const productList = products.map(
            (p) => `• ${p.brand} - ${p.name} [View Product](${p.product_url})`
          ).join("\n");

          setMessages((m) => [
            ...m,
            {
              sender: "bot",
              text: `Here are some products for *${foundConcern}*: \n${productList}`,
              ts: Date.now() + 1,
            },
          ]);
        } else {
          setMessages((m) => [
            ...m,
            {
              sender: "bot",
              text: `Sorry, I couldn't find products for "${foundConcern}". Try another concern or ask for general help!`,
              ts: Date.now() + 1,
            },
          ]);
        }
        setTyping(false);
        return;
      }
    }

    // Fallback to rule-based AI after a short delay
    setTimeout(() => {
      const reply = ruleBasedAI(msg);
      setMessages((m) => [...m, { sender: "bot", text: reply, ts: Date.now() + 1 }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
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
      }}
    >
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          fontWeight: "bold",
          fontSize: 18,
          backgroundColor: "#f5f5f5",
          textAlign: "center",
        }}
      >
        Skincare Chatbot
      </div>

      <div
        style={{
          flexGrow: 1,
          padding: "10px",
          overflowY: "auto",
          backgroundColor: "#fafafa",
          fontSize: 15,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={msg.ts + i}
            style={{
              marginBottom: 10,
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                backgroundColor: msg.sender === "user" ? "#007bff" : "#e2e3e5",
                color: msg.sender === "user" ? "white" : "#333",
                padding: "8px 12px",
                borderRadius: 15,
                whiteSpace: "pre-wrap",
              }}
            >
              {/* If bot message contains product list, render as clickable links */}
              {msg.sender === "bot" && msg.text.startsWith("Here are some products for") ? (
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {msg.text
                    .split("\n")
                    .slice(1)
                    .map((line, idx) => {
                      const match = line.match(/• (.+) - (.+) \[View Product\]\((.+)\)/);
                      if (!match) return <li key={idx}>{line}</li>;
                      const [, brand, name, url] = match;
                      return (
                        <li key={idx}>
                          <strong>{brand}</strong> -{" "}
                          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
                            {name}
                          </a>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ fontStyle: "italic", color: "#666" }}>Bot is typing...</div>
        )}
        <div ref={chatBottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        style={{
          display: "flex",
          padding: 10,
          borderTop: "1px solid #ccc",
          backgroundColor: "#f9f9f9",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flexGrow: 1,
            padding: "10px",
            borderRadius: 20,
            border: "1px solid #ccc",
            outline: "none",
            fontSize: 15,
          }}
          disabled={typing}
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          style={{
            marginLeft: 8,
            padding: "10px 18px",
            borderRadius: 20,
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            fontWeight: "bold",
            cursor: typing ? "not-allowed" : "pointer",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
