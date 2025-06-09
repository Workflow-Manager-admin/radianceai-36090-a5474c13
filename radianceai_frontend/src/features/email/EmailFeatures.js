import React, { useState } from "react";
import { sendEmail } from "../../api/apiClient";
import useLocalStorage from "../../hooks/useLocalStorage";
import { MotionWrapper, AppleFadeTransition } from "../../utils/animation";

// Default config: Replace with your EmailJS values or show UX prompt
const DEFAULT_EMAILJS_CONFIG = {
  serviceId: "YOUR_SERVICE_ID",
  userId: "YOUR_EMAILJS_USER_ID",
  reminderTemplateId: "routine_reminder_template",
  summaryTemplateId: "routine_summary_template",
};

function validateEmail(email) {
  // Simple email validation
  return /\S+@\S+\.\S+/.test(email);
}

// PUBLIC_INTERFACE
/**
 * EmailFeatures – Send routine reminders & summary via EmailJS.
 * Users can opt-in, with config controls, and see clean feedback.
 */
const EmailFeatures = () => {
  // Persist email + consent opt-in
  const [email, setEmail] = useLocalStorage("userEmail", "");
  const [name, setName] = useLocalStorage("userName", "");
  const [optedIn, setOptedIn] = useLocalStorage("emailOptIn", false);

  // Separate config state if admin/advanced toggle needed later (for demo)
  const [emailjsConfig, setEmailjsConfig] = useLocalStorage("emailjsConfig", DEFAULT_EMAILJS_CONFIG);

  const [pending, setPending] = useState(false);
  const [result, setResult] = useState(""); // success/fail message

  // For demonstration: user can choose type + if they're testing config
  const [sendType, setSendType] = useState("reminder"); // 'reminder' or 'summary'

  // Handlers
  const handleOptIn = async (e) => {
    e.preventDefault();
    setResult("");
    if (!validateEmail(email)) {
      setResult("Please enter a valid email address.");
      return;
    }
    // Could trigger confirmation email here for double opt-in.
    setOptedIn(true);
    setResult("Opt-in successful! You will receive reminders and summaries.");
  };

  const handleOptOut = () => {
    setOptedIn(false);
    setResult("Unsubscribed from email notifications.");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setResult("Invalid email.");
      return;
    }
    setPending(true);
    setResult("");
    // Demo: fake payload
    const payload = {
      toEmail: email,
      toName: name || "GlowSkin User",
      serviceId: emailjsConfig.serviceId,
      type: sendType,
      data: {
        routine: "Example routine data goes here.", // Add details from routine builder/localStorage if needed.
        summary: "Your routine summary will be included here.",
      },
    };
    // Attempt send
    const ok = await sendEmail(payload);
    setPending(false);
    setResult(ok ? "Email sent successfully!" : "Email failed to send. Check config/try later.");
  };

  // For admin/demo: configurable emailjs keys (hidden in production)
  const [showConfig, setShowConfig] = useState(false);
  const updateConfig = (field, value) => setEmailjsConfig(prev => ({ ...prev, [field]: value }));

  return (
    <section className="container" style={{ maxWidth: 440, margin: "0 auto", paddingTop: 25 }}>
      <AppleFadeTransition>
        <h2 style={{
          color: "#fadadd",
          textAlign: "center",
          fontWeight: 700,
          fontSize: "1.38rem",
          margin: "20px 0 10px 0"
        }}>
          Email Reminders & Summaries
        </h2>
        <div style={{ color: "#e7b3ff", textAlign: "center", fontSize: 16, marginBottom: 17 }}>
          Opt in to receive skincare reminders and your routine summary. No spam. Cancel anytime.
        </div>
        <MotionWrapper>
          {!optedIn ? (
            <form style={{
              background: "rgba(250,218,221,0.09)",
              borderRadius: 16,
              padding: "23px 19px 17px 19px",
              boxShadow: "0 2px 13px #fadadd22",
              marginBottom: 14
            }} onSubmit={handleOptIn} autoComplete="on">
              <div style={{marginBottom:18}}>
                <label style={{ color: "#fadadd", fontWeight: 700 }}>
                  Name:
                  <input
                    style={{
                      display: "block",
                      marginTop: 2,
                      marginBottom: 11,
                      fontWeight: 500,
                      borderRadius: 7,
                      border: "none",
                      padding: "7px 12px",
                      width: "100%",
                      background: "#e7b3ff18",
                      color: "#fff"
                    }}
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    autoComplete="name"
                  />
                </label>
                <label style={{ color: "#fadadd", fontWeight: 700 }}>
                  Email:
                  <input
                    style={{
                      display: "block",
                      marginTop: 2,
                      marginBottom: 9,
                      fontWeight: 500,
                      borderRadius: 7,
                      border: "none",
                      padding: "7px 12px",
                      width: "100%",
                      background: "#e7b3ff18",
                      color: "#fff"
                    }}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    placeholder="e.g. you@email.com"
                  />
                </label>
              </div>
              <button className="btn btn-large" style={{
                width: "100%",
                fontWeight: 700,
                fontSize: "1.09rem",
                background: "linear-gradient(90deg, #fadadd 60%, #e7b3ff 100%)",
                color: "#23155f",
                borderRadius: 13,
                marginTop: 2
              }} type="submit">
                Opt in for Email Reminders
              </button>
            </form>
          ) : (
            <div style={{
              background: "rgba(250,218,221,0.08)",
              borderRadius: 15,
              padding: "20px",
              marginBottom: 14
            }}>
              <div style={{ color: "#fadadd", fontWeight: 600, marginBottom: 12 }}>
                <span>
                  {/* Show user's email */}
                  {name && <span>{name}, </span>}
                  you're opted in for:
                </span>
                <ul style={{ color: "#e7b3ff", fontWeight: 400, marginTop: 8, fontSize: "1.06em" }}>
                  <li>• Routine reminders</li>
                  <li>• Routine summary</li>
                </ul>
              </div>
              <button className="btn"
                style={{
                  background: "rgba(234, 179, 255, 0.17)",
                  color: "#fadadd",
                  fontWeight: 500,
                  borderRadius: 9,
                  marginBottom: 4
                }}
                onClick={handleOptOut}>Opt out</button>
            </div>
          )}
        </MotionWrapper>

        {/* Demo/test send section if opted in only */}
        {optedIn && (
          <MotionWrapper>
            <form onSubmit={handleSend} style={{ marginTop: 7 }}>
              <label style={{ color: "#e7b3ff", fontWeight: 500 }}>Test type:
                <select
                  value={sendType}
                  onChange={e => setSendType(e.target.value)}
                  style={{
                    marginLeft: 7,
                    borderRadius: 7,
                    border: "none",
                    padding: "5px 10px",
                    fontWeight: 500,
                    background: "#e7b3ff34",
                    color: "#27174e"
                  }}
                >
                  <option value="reminder">Routine Reminder</option>
                  <option value="summary">Routine Summary</option>
                </select>
              </label>
              <button className="btn btn-large"
                type="submit"
                style={{
                  marginLeft: 14,
                  background: "linear-gradient(90deg, #fadadd 60%, #e7b3ff 100%)",
                  color: "#23155f",
                  borderRadius: 13,
                  fontWeight: 700,
                  fontSize: "1.01rem",
                  minWidth: 146
                }}
                disabled={pending}
              >
                {pending ? "Sending..." : `Send ${sendType === "summary" ? "Summary" : "Reminder"} Email`}
              </button>
            </form>
          </MotionWrapper>
        )}

        {/* Admin/config: allow switching config (hide or require password in prod) */}
        <div style={{
          margin: "24px 0 0 0",
          textAlign: "center",
          fontSize: 13.5,
          color: "#fadadd",
          opacity: 0.79,
          cursor: "pointer"
        }}>
          <span onClick={() => setShowConfig(s => !s)} style={{ textDecoration: "underline", cursor: "pointer" }}>
            {showConfig ? "Hide" : "Show"} EmailJS config
          </span>
        </div>
        {showConfig && (
          <MotionWrapper>
            <div style={{
              background: "#fadadd1d",
              borderRadius: 13,
              margin: "13px 0 0 0",
              padding: "12px 12px 10px 12px",
              color: "#23155f"
            }}>
              <div style={{ marginBottom: 7 }}>
                <label>
                  Service ID:
                  <input value={emailjsConfig.serviceId} onChange={e => updateConfig("serviceId", e.target.value)}
                    style={{ marginLeft: 5, borderRadius: 7, padding: "2.5px 6px" }} />
                </label>
              </div>
              <div style={{ marginBottom: 7 }}>
                <label>
                  User ID (Public Key):
                  <input value={emailjsConfig.userId} onChange={e => updateConfig("userId", e.target.value)}
                    style={{ marginLeft: 5, borderRadius: 7, padding: "2.5px 6px" }} />
                </label>
              </div>
              <div>
                <label>
                  Reminder Template ID:
                  <input value={emailjsConfig.reminderTemplateId} onChange={e => updateConfig("reminderTemplateId", e.target.value)}
                    style={{ marginLeft: 5, borderRadius: 7, padding: "2.5px 6px" }} />
                </label>
              </div>
              <div style={{ marginTop: 5 }}>
                <label>
                  Summary Template ID:
                  <input value={emailjsConfig.summaryTemplateId} onChange={e => updateConfig("summaryTemplateId", e.target.value)}
                    style={{ marginLeft: 5, borderRadius: 7, padding: "2.5px 6px" }} />
                </label>
              </div>
              <div style={{
                color: "#f339db", marginTop: 11, fontSize: 13.2
              }}>
                Remember to use your EmailJS dashboard to match these config keys!
              </div>
            </div>
          </MotionWrapper>
        )}

        {result && (
          <MotionWrapper>
            <div style={{
              marginTop: 14,
              textAlign: "center",
              color: result.startsWith("Email sent") || result.startsWith("Opt-in") ? "#fadadd" : "#f339db",
              background: "rgba(234,179,255,0.16)",
              borderRadius: 9,
              padding: "7px 0",
              fontWeight: 600
            }}>
              {result}
            </div>
          </MotionWrapper>
        )}

        <div style={{
          color: "#e7b3ff",
          opacity: 0.82,
          fontSize: 13.7,
          margin: "25px 0 0 0",
          textAlign: "center"
        }}>
          All notifications are optional and you may unsubscribe at any time.
        </div>
      </AppleFadeTransition>
    </section>
  );
};

export default EmailFeatures;
