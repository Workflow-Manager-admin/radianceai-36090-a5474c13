import React, { useState } from "react";
import { sendEmail } from "../../api/apiClient";
import useLocalStorage from "../../hooks/useLocalStorage";
import { MotionWrapper, AppleFadeTransition } from "../../utils/animation";

/*
 * EmailJS config: Draws ONLY from environment variables (REACT_APP_EMAILJS_*)
 * If not present or left as placeholders, ALL email features are BLOCKED. UI shows clear instructions for admin setup.
 * No UI/LS/admin config allowed anymore. Remove all fallback/local config logic.
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
 * EmailFeatures – Send routine reminders & summary via EmailJS.
 * Users can opt-in, see config status and admin instructions if not ready.
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

  // Block usage if missing env vars
  function configHasPlaceholdersOrMissing(cfg) {
    if (
      !cfg ||
      !cfg.serviceId ||
      !cfg.userId ||
      !cfg.reminderTemplateId ||
      !cfg.summaryTemplateId
    ) return true;
    // Check for placeholder values
    if (
      /YOUR_SERVICE_ID/i.test(cfg.serviceId) ||
      /YOUR_EMAILJS_USER_ID|YOUR_PUBLIC_KEY/i.test(cfg.userId) ||
      /routine_reminder_template|YOUR_TEMPLATE_ID/i.test(cfg.reminderTemplateId) ||
      /routine_summary_template|YOUR_TEMPLATE_ID/i.test(cfg.summaryTemplateId)
    ) return true;
    return false;
  }
  const configIncomplete = configHasPlaceholdersOrMissing(emailjsConfig);

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
      setResult("Email feature is not configured. Please ask an admin to set valid EmailJS credentials (Service ID, Public Key, and Template IDs) in environment. See below.");
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
    // Attempt send
    const ok = await sendEmail(payload);
    setPending(false);
    if (ok === true) setResult("Email sent successfully!");
    else if (ok && ok.error) setResult(ok.error);
    else setResult("Email failed to send. Check configuration and try again.");
  };

  // Diagnostic/admin message logic
  let configDiagnosticMsg = "";
  if (configIncomplete) {
    configDiagnosticMsg =
      "⚠️ EmailJS is not configured! Emails are BLOCKED until real credentials are set as environment variables. \n" +
      "To enable this feature, set all the following in your .env or deployment config (never commit values in code or UI!):\n" +
      "• REACT_APP_EMAILJS_SERVICE_ID\n" +
      "• REACT_APP_EMAILJS_USER_ID   (public key)\n" +
      "• REACT_APP_EMAILJS_REMINDER_TEMPLATE_ID\n" +
      "• REACT_APP_EMAILJS_SUMMARY_TEMPLATE_ID\n" +
      "Edit .env in radianceai_frontend/ for local dev. For deployment, use secure environment variables. \n" +
      "Values must match your real EmailJS dashboard: https://dashboard.emailjs.com/\n" +
      "See docs: https://www.emailjs.com/docs/examples/reactjs/ \n" +
      "Emails are BLOCKED until everything is correct.";
  }

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
        {configIncomplete && (
          <MotionWrapper>
            <div style={{
              background: "#f339db1c",
              color: "#f339db",
              borderRadius: 11,
              fontWeight: 600,
              fontSize: 15,
              textAlign: "center",
              padding: "12px",
              marginBottom: 15,
              boxShadow: "0 1.5px 8px #fadadd20"
            }}>
              {configDiagnosticMsg.split('\n').map((txt, idx) => (
                <div key={idx}>{txt}</div>
              ))}
            </div>
          </MotionWrapper>
        )}
        <div style={{ color: "#e7b3ff", textAlign: "center", fontSize: 16, marginBottom: 17 }}>
          Opt in to receive skincare reminders and your routine summary. No spam. Cancel anytime.
        </div>
        {configIncomplete && (
          <div style={{
            color: "#f339db",
            fontSize: 14,
            background: "#fadadd18",
            borderRadius: 11,
            padding: "12px",
            textAlign: "center",
            marginBottom: 13,
            boxShadow: "0 1.5px 8px #fadadd23"
          }}>
            <div>
              <b>Email feature is blocked:</b> Real EmailJS credentials not set.
            </div>
            <div style={{marginTop:7, whiteSpace:"pre-line"}}>
              To configure, ask an admin to update the .env file in <b>radianceai_frontend/.env</b> (sample below), then restart the app:
              <br /> <br />
              <code>
                REACT_APP_EMAILJS_SERVICE_ID=your_real_service_id_here<br/>
                REACT_APP_EMAILJS_USER_ID=your_real_user_key_here<br/>
                REACT_APP_EMAILJS_REMINDER_TEMPLATE_ID=your_real_template_id_here<br/>
                REACT_APP_EMAILJS_SUMMARY_TEMPLATE_ID=your_real_template_id_here
              </code>
              <br />
              <a href="https://dashboard.emailjs.com/" target="_blank" rel="noopener noreferrer">Get values from EmailJS Dashboard →</a>
            </div>
          </div>
        )}
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

        {/* Admin: config is not editable via browser at all. Show instructions only */}
        <div style={{
          margin: "24px 0 0 0",
          textAlign: "center",
          fontSize: 13.5,
          color: "#fadadd",
          opacity: 0.82
        }}>
          <b>Note for Admins:</b> EmailJS configuration is now <u>read strictly from environment variables</u>.<br />
          To update credentials, <b>edit <code>.env</code> in <code>radianceai_frontend/</code></b> (or set environment secrets in your deployment host) and <b>restart</b> the app.<br />
          <br />
          Get valid values from <a href="https://dashboard.emailjs.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#f339db" }}>EmailJS Dashboard →</a>
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
