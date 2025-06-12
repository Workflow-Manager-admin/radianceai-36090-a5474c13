import React, { useState } from "react";
import { sendEmail } from "../../api/apiClient";
import useLocalStorage from "../../hooks/useLocalStorage";
import { MotionWrapper, AppleFadeTransition } from "../../utils/animation";

/*
 * EmailJS config: Draws ONLY from environment variables (REACT_APP_EMAILJS_*)
 * If not present or left as placeholders, ALL email features are BLOCKED.
 * UI shows clear instructions for admin setup only if admin/dev, never to regular users.
 */
function getEmailJsConfigFromEnv() {
  return {
    serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || "",
    userId: process.env.REACT_APP_EMAILJS_USER_ID || "",
    reminderTemplateId: process.env.REACT_APP_EMAILJS_REMINDER_TEMPLATE_ID || "",
    summaryTemplateId: process.env.REACT_APP_EMAILJS_SUMMARY_TEMPLATE_ID || "",
  };
}

function validateEmail(email) {
  // Simple email validation
  return /\S+@\S+\.\S+/.test(email);
}

// PUBLIC_INTERFACE
/**
 * EmailFeatures – Sends routine reminders/summary via EmailJS.
 * Shows minimal "not available" message to normal users if misconfigured.
 * Admin/dev get full diagnostic + setup instructions. 
 */
const EmailFeatures = () => {
  // Persist user fields only (email/name/consent)
  const [email, setEmail] = useLocalStorage("userEmail", "");
  const [name, setName] = useLocalStorage("userName", "");
  const [optedIn, setOptedIn] = useLocalStorage("emailOptIn", false);

  // Always read EmailJS config from environment
  const emailjsConfig = getEmailJsConfigFromEnv();
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState(""); // success/fail message
  const [sendType, setSendType] = useState("reminder"); // 'reminder' or 'summary'

  // Helper: check if config is incomplete or uses placeholder values
  function configHasPlaceholdersOrMissing(cfg) {
    if (
      !cfg ||
      !cfg.serviceId ||
      !cfg.userId ||
      !cfg.reminderTemplateId ||
      !cfg.summaryTemplateId
    ) return true;
    if (
      /YOUR_SERVICE_ID/i.test(cfg.serviceId) ||
      /YOUR_EMAILJS_USER_ID|YOUR_PUBLIC_KEY/i.test(cfg.userId) ||
      /routine_reminder_template|YOUR_TEMPLATE_ID/i.test(cfg.reminderTemplateId) ||
      /routine_summary_template|YOUR_TEMPLATE_ID/i.test(cfg.summaryTemplateId)
    ) return true;
    return false;
  }
  const configIncomplete = configHasPlaceholdersOrMissing(emailjsConfig);

  // User/admin mode detection (public, quick logic; for real admin use auth/session/role)
  // In dev: localhost, 127.*; or window.ADMIN_MODE = true (mock for admin testing)
  const isDevHost =
    (typeof window !== "undefined" && window.location && (window.location.hostname === "localhost" || window.location.hostname.startsWith("127.")));
  const isAdmin =
    (typeof window !== "undefined" && window.ADMIN_MODE === true) ||
    isDevHost;

  // Handlers
  const handleOptIn = async (e) => {
    e.preventDefault();
    setResult("");
    if (!validateEmail(email)) {
      setResult("Please enter a valid email address.");
      return;
    }
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
    // Block send if not configured
    if (configIncomplete) {
      setResult("Email feature is not configured. Please ask an admin to set valid EmailJS credentials in environment.");
      return;
    }
    setPending(true);
    setResult("");
    // Build payload, only .env config allowed
    const payload = {
      toEmail: email,
      toName: name || "GlowSkin User",
      serviceId: emailjsConfig.serviceId,
      userId: emailjsConfig.userId,
      type: sendType,
      reminderTemplateId: emailjsConfig.reminderTemplateId,
      summaryTemplateId: emailjsConfig.summaryTemplateId,
      data: {
        routine: "Example routine data goes here.",
        summary: "Your routine summary will be included here.",
      },
    };
    const ok = await sendEmail(payload);
    setPending(false);
    if (ok === true) setResult("Email sent successfully!");
    else if (ok && ok.error) setResult(ok.error);
    else setResult("Email failed to send. Check configuration and try again.");
  };

  // Diagnostic/admin message logic (admin-only)
  let configDiagnosticMsg = "";
  if (configIncomplete && isAdmin) {
    configDiagnosticMsg =
      "⚠️ EmailJS is not configured! Emails are BLOCKED until real credentials are set as environment variables. \n" +
      "To enable this feature, set all the following in your .env or deployment config (never commit values in code or UI!)\n" +
      "• REACT_APP_EMAILJS_SERVICE_ID\n" +
      "• REACT_APP_EMAILJS_USER_ID   (public key)\n" +
      "• REACT_APP_EMAILJS_REMINDER_TEMPLATE_ID\n" +
      "• REACT_APP_EMAILJS_SUMMARY_TEMPLATE_ID\n" +
      "Edit .env in radianceai_frontend/ for local dev. For deployment, use secure environment variables. \n" +
      "Values must match your real EmailJS dashboard: https://dashboard.emailjs.com/\n" +
      "See docs: https://www.emailjs.com/docs/examples/reactjs/ \n" +
      "Emails are BLOCKED until everything is correct.";
  }

  // User-facing email unavailable message
  const emailUnavailableMessage = (
    <div
      style={{
        color: "#77a6ed",
        background: "rgba(32,80,170,0.06)",
        fontSize: 16,
        padding: "14px 14px 13px 14px",
        borderRadius: 12,
        textAlign: "center",
        fontWeight: 600,
        marginBottom: 17,
        marginTop: 6,
        boxShadow: "0 1.5px 8px #2050aa10",
        letterSpacing: ".01em",
        lineHeight: 1.32,
      }}
    >
      Email reminders are not available at the moment. This feature will be enabled soon.
    </div>
  );

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
        {/* Show user-friendly unavailable message to users if blocked; show setup guidance only to admin/dev */}
        {configIncomplete && !isAdmin && emailUnavailableMessage}
        {configIncomplete && isAdmin && (
          <MotionWrapper>
            <div style={{
              background: "#1c3b65",
              color: "#93c7ff",
              borderRadius: 11,
              fontWeight: 600,
              fontSize: 15,
              textAlign: "center",
              padding: "14px",
              marginBottom: 18,
              marginTop: 7,
              boxShadow: "0 1.5px 10px #266fd630"
            }}>
              {configDiagnosticMsg.split('\n').map((txt, idx) => (
                <div key={idx} style={idx === 0 ? { color: "#3aa1ff", fontWeight: 700, fontSize: 16 } : undefined}>{txt}</div>
              ))}
              <div style={{marginTop:10, whiteSpace:"pre-line", color: "#bfd7ef", fontWeight: 500, fontSize: 14.5 }}>
                To configure, set .env in <b>radianceai_frontend/</b> (see EmailJS docs).<br />
                <a href="https://dashboard.emailjs.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#358fff", fontWeight: 700, textDecoration: "underline", marginTop: 8, display: "inline-block" }}>EmailJS Dashboard →</a>
              </div>
            </div>
          </MotionWrapper>
        )}
        <div style={{ color: "#e7b3ff", textAlign: "center", fontSize: 16, marginBottom: 17 }}>
          Opt in to receive skincare reminders and your routine summary. No spam. Cancel anytime.
        </div>
        {/* Show opt-in/out/send forms ONLY if config is valid or is admin (so admin/dev can test even if not configured) */}
        {(!configIncomplete || isAdmin) && (
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
        )}
        {/* Test send section if opted in AND config is valid/admin */}
        {optedIn && (!configIncomplete || isAdmin) && (
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

        <div style={{
          color: "#e7b3ff",
          opacity: 0.82,
          fontSize: 13.7,
          margin: "25px 0 0 0",
          textAlign: "center"
        }}>
          All notifications are optional and you may unsubscribe at any time.
        </div>

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
      </AppleFadeTransition>
    </section>
  );
};

export default EmailFeatures;
