import React, { useEffect, useState } from "react";
import { fetchWeather } from "../../api/apiClient";
import { AppleFadeTransition, MotionWrapper } from "../../utils/animation";

// Diagnostic logger helper to funnel logs to console
const diagLog = (...args) => { try { window && window.console && window.console.log && window.console.log("[WeatherDiag]", ...args); } catch {} };

/**
 * Helper to check for CORS or API/network failures and produce a detailed diagnostic message.
 * @param {any} weatherResult
 * @param {string} locErrorStr
 * @param {object} diag diagnostic details from each stage
 * @returns {string} final error string to display
 */
function analyzeWeatherError(weatherResult, locErrorStr, diag = {}) {
  if (locErrorStr) return locErrorStr;
  if (!weatherResult || typeof weatherResult !== "object") return "Unknown error occurred. Please try again.";
  if (weatherResult.error === "Missing coordinates") {
    return "Could not determine your precise location. Please allow location access and retry.";
  }
  if (
    weatherResult.error &&
    typeof weatherResult.response === "object" &&
    weatherResult.code === 401
  ) {
    return "Weather fetch failed: Invalid API key. Please check/renew your OpenWeatherMap API key.";
  }
  if (
    weatherResult.error &&
    typeof weatherResult.response === "object" &&
    weatherResult.code === 429
  ) {
    return "Weather fetch failed: Too many requests (API rate limit exceeded). Please try again later.";
  }
  if (
    weatherResult.error &&
    typeof weatherResult.response === "object" &&
    typeof weatherResult.response.message === "string"
  ) {
    return `Weather API error: ${weatherResult.response.message}`;
  }
  if (
    weatherResult.error &&
    weatherResult.reason === "Invalid API key or unauthorized."
  ) {
    return "Weather fetch failed: Invalid API key (unauthorized). Check your OpenWeatherMap API key.";
  }
  if (
    weatherResult.error &&
    weatherResult.reason === "API rate limit exceeded (Too Many Requests)."
  ) {
    return "Weather fetch failed: Too many requests (rate limit). Try again in a moment.";
  }
  if (weatherResult.error) {
    return (
      weatherResult.error +
      (weatherResult.message
        ? ` (${weatherResult.message})`
        : weatherResult.reason
        ? ` (${weatherResult.reason})`
        : ""
      )
    );
  }
  // CORS error detection: fetchWeather returns a generic error if fetch fails (may be CORS or network)
  if (!("temp" in weatherResult)) {
    return "Failed to get weather data: Unexpected API/network response. Check your connection and CORS permissions.";
  }
  return "";
}

// PUBLIC_INTERFACE
/**
 * Weather-based suggestions that personalize skincare routine & products.
 * - Gets user geolocation (browser ask)
 * - Calls OpenWeatherMap for weather
 * - Adapts tips & product highlights to local weather
 */
const SUGGESTIONS_MAP = [
  {
    match: (w) => w.weatherMain === "Clear" || w.weatherMain === "Sunny",
    title: "It's sunny – Prioritize SPF and antioxidants",
    tips: [
      "Use sunscreen (SPF 30+), reapply if outdoors.",
      "Consider lightweight, non-greasy formulas to avoid shine.",
      "Antioxidant serums (e.g., vitamin C) help fend off UV."
    ],
    routine: ["Sunscreen", "Light Moisturizer", "Vitamin C Serum"]
  },
  {
    match: (w) => ["Rain", "Drizzle", "Thunderstorm"].includes(w.weatherMain),
    title: "It's rainy – Combat excess humidity and pollution",
    tips: [
      "A gentle cleanser helps remove pollutants more frequently.",
      "Anti-bacterial or clarifying toner can help prevent breakouts.",
      "If oily, blotting papers or mattifying serum help control shine."
    ],
    routine: ["Gentle Cleanser", "Clarifying Toner", "Mattifying Serum"]
  },
  {
    match: (w) => w.weatherMain === "Snow",
    title: "Snowy or icy – Focus on hydration and protection",
    tips: [
      "Use heavier moisturizers or creams for lasting hydration.",
      "Consider a barrier-protecting balm for exposed skin.",
      "Don’t skip SPF – UV can reflect off snow!"
    ],
    routine: ["Cream Moisturizer", "Barrier Balm", "Sunscreen"]
  },
  {
    match: (w) => (typeof w.temp === "number" && w.temp <= 5),
    title: "Cold weather – Prevent dryness and irritation",
    tips: [
      "Switch to richer moisturizers and gentle cleansers.",
      "Add a hydrating serum or facial oil to your routine.",
      "Avoid hot showers; use lukewarm water."
    ],
    routine: ["Rich Moisturizer", "Hydrating Serum", "Facial Oil"]
  },
  {
    match: (w) => (typeof w.temp === "number" && w.temp >= 27),
    title: "Hot weather – Stay oil-free and protected",
    tips: [
      "Use foaming or gel cleansers for sweat and excess oil.",
      "Prefer oil-free, non-comedogenic products.",
      "Use lightweight SPF and stay hydrated."
    ],
    routine: ["Gel Cleanser", "Lightweight SPF", "Hydration Mist"]
  },
  {
    match: (w) => (typeof w.humidity === "number" && w.humidity < 35),
    title: "Dry air detected – Intensify hydration",
    tips: [
      "Apply hyaluronic acid serum before moisturizer.",
      "Layer a creamy moisturizer with a sealing face oil.",
      "Use a humidifier indoors if possible."
    ],
    routine: ["Hyaluronic Acid", "Cream Moisturizer", "Facial Oil"]
  }
];

// Generic/fallback suggestion for unknown states
const DEFAULT_SUGGESTION = {
  title: "Current weather detected – Follow your daily routine",
  tips: [
    "Keep using a gentle cleanser, serum, moisturizer, and SPF.",
    "Adapt moisturizer or SPF texture to comfort.",
    "Listen to your skin's needs and adjust as needed."
  ],
  routine: ["Cleanser", "Serum", "Moisturizer", "Sunscreen"]
};

// Helper: choose suggestions for weather
function getSuggestion(weather) {
  if (!weather) return DEFAULT_SUGGESTION;
  for (const rule of SUGGESTIONS_MAP) {
    try {
      if (rule.match(weather)) return rule;
    } catch {
      // continue with next rule
    }
  }
  return DEFAULT_SUGGESTION;
}

const WeatherSuggestions = () => {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locError, setLocError] = useState("");
  const [coordDiag, setCoordDiag] = useState("");
  const [weatherError, setWeatherError] = useState("");
  const [diagnostic, setDiagnostic] = useState(null); // SYSTEM: richer diagnostics structure

  // Instrumented status trackers
  const [stepLog, setStepLog] = useState([]);

  useEffect(() => {
    let logs = [];
    setStepLog((cur) => []);
    // Geolocation step
    if (!("geolocation" in navigator)) {
      diagLog("Step [geo]: Browser geolocation API not supported.");
      logs.push("Geolocation API: NOT supported in browser.");
      setStepLog(logs);
      setLocError("Geolocation unsupported in your browser. Precise/daily weather tips may be unavailable.");
      setLoading(false);
      setCoordDiag("Browser does not implement geolocation (navigator.geolocation missing)");
      return;
    }
    // Geolocation fetch
    diagLog("Step [geo]: Requesting browser geolocation…");
    logs.push("Geolocation API: Requested browser geolocation.");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        diagLog(
          "Step [geo]: User location detected.",
          { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
        );
        logs.push("Geolocation API: Success. User accepted geolocation prompt.");
        setStepLog(logs);
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (geoErr) => {
        let msg = "Could not get precise location. Using default example (NYC).";
        let diag = `Geo error code:${geoErr && geoErr.code}; message:${geoErr && geoErr.message}`;
        if (geoErr && geoErr.code === 1) {
          msg = "Location permission denied. Showing NYC example.";
          diag += " (User denied browser geolocation permission)";
        }
        diagLog("Step [geo]: Geolocation failed/fallback.", geoErr, diag);
        logs.push(`Geolocation API: Failure. ${msg} [${diag}]`);
        setStepLog(logs);
        setLocError(msg);
        setCoordDiag(diag || String(geoErr));
        setCoords({ lat: 40.7831, lon: -73.9712 }); // NYC fallback
      },
      {
        timeout: 8000
      }
    );
    // eslint-disable-next-line
  }, []);

  // Fetch actual weather when coordinates ready
  useEffect(() => {
    if (!coords) return;
    let logs = [...stepLog];
    logs.push(`Proceed to fetch weather for lat=${coords.lat}, lon=${coords.lon}`);
    setLoading(true);
    setStepLog(logs);

    fetchWeather(coords.lat, coords.lon)
      .then((w) => {
        diagLog("Step [weather]: Weather fetch response:", w);
        logs.push(w && !w.error ? "Weather API: Success." : `Weather API: Failure. Error: ${w && w.error}`);
        setStepLog(logs);
        setWeather(w);
        setLoading(false);
        // Build comprehensive diagnostic tree
        let diagDetail = {
          location: coords,
          locError,
          coordsDiag: coordDiag,
          weatherResult: w,
          logs
        };
        // Improved error parsing/path for further diagnostics
        setWeatherError(analyzeWeatherError(w, locError, diagDetail));
        setDiagnostic(diagDetail);
      })
      .catch((e) => {
        diagLog("Step [weather]: Weather fetch failed (network/CORS)", e);
        logs.push(`Weather API: Network or CORS error: ${(e && e.message) ? e.message : String(e)}`);
        setStepLog(logs);
        setLoading(false);
        setWeatherError("Could not fetch weather data (network or CORS error).");
        setDiagnostic({
          error: e,
          location: coords,
          locError,
          coordsDiag: coordDiag,
          logs
        });
      });
    // eslint-disable-next-line
  }, [coords]);

  // Choose tips & routine
  const suggestion = getSuggestion(weather);

  // Improved handling for subtle/diagnostic errors (always user-friendly, but system details available)
  const finalError =
    loading
      ? ""
      : weatherError ||
        analyzeWeatherError(weather, locError, diagnostic);

  // UI section
  return (
    <section className="container" style={{ maxWidth: 510, margin: "0 auto" }}>
      <AppleFadeTransition>
        <h2 style={{
          color: "#fadadd",
          fontWeight: 700,
          fontSize: "1.6rem",
          margin: "24px 0 12px 0",
          textAlign: "center"
        }}>
          Weather-Aware Skincare Suggestions
        </h2>
        <div style={{ color: "#e7b3ff", fontSize: 15.9, textAlign: "center", marginBottom: 24 }}>
          {finalError
            ? (
              <span style={{ color: "#f339db" }}>
                {/* Show user-facing failure and a more precise location */}
                {finalError}
                {coordDiag &&
                  <span style={{ display: "block", fontSize: 12.5, opacity: 0.7, color: "#f339db", marginTop: 4 }}>
                    {coordDiag}
                  </span>
                }
              </span>
            )
            : (
              <span>
                Using your current location, we've tailored skincare tips and product focus for today's weather.
              </span>
            )
          }
        </div>
        {loading ? (
          <MotionWrapper>
            <div style={{
              color: "#fadadd",
              fontWeight: 600,
              textAlign: "center",
              margin: "55px 0",
              fontSize: 22,
            }}>
              Loading weather…
            </div>
          </MotionWrapper>
        ) : finalError ? (
          // Add a collapsible diagnostics section for easier debugging of persistent weather errors
          <div style={{ color: "#f339db", textAlign: "center", fontSize: 16, margin: "30px 0" }}>
            {finalError}
            {diagnostic && (
              <details style={{
                background: "#f339db16",
                color: "#fadadd",
                fontSize: 12.7,
                borderRadius: 8,
                margin: "17px auto 0 auto",
                padding: "7px 9px",
                maxWidth: 420,
                textAlign: "left"
              }}>
                <summary style={{ cursor: "pointer", color: "#fadadd", fontWeight: 600, fontSize: "1em" }}>
                  Diagnostic details
                </summary>
                <div>
                  <b>Debug log:</b>
                  <ul style={{ marginBottom: 7, paddingLeft: 16 }}>
                    {diagnostic.logs && diagnostic.logs.map((line, idx) => (
                      <li key={idx} style={{ marginBottom: 0 }}>{line}</li>
                    ))}
                  </ul>
                  <b>Error detail:</b>
                  <pre style={{ background: "rgba(255,255,255,0.04)", padding: 6, borderRadius: 6 }}>
                    {JSON.stringify(diagnostic, null, 2).slice(0, 900)}
                  </pre>
                  <div>
                    <em>
                      Tip: Check your browser console for more logs,<br />
                      verify location & API key permissions, and check network connection.
                    </em>
                  </div>
                </div>
              </details>
            )}
          </div>
        ) : (
          <MotionWrapper>
            <div
              style={{
                background: "linear-gradient(100deg,#faf0ff55 40%,#e7b3ff22 100%)",
                borderRadius: 18,
                padding: "16px 16px 24px 16px",
                boxShadow: "0 2px 14px 0 #fadadd24",
                margin: "0 0 22px 0"
              }}>
              {/* Weather Icon + Summary */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
                marginBottom: 5,
                justifyContent: "center"
              }}>
                {weather?.icon && (
                  <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    width={52}
                    height={52}
                    alt={weather.weatherMain || "weather"}
                    title={weather.weatherDesc}
                    style={{ verticalAlign: "middle", marginRight: 5 }}
                  />
                )}
                <div>
                  <div style={{ fontSize: 22, color: "#f339db", fontWeight: 700 }}>
                    {weather?.weatherMain}, {typeof weather?.temp === "number" ? `${Math.round(weather.temp)}°C` : ""}
                  </div>
                  <div style={{
                    color: "#e7b3ff",
                    fontSize: 14.5,
                    fontWeight: 500,
                    marginTop: 2
                  }}>
                    {weather?.city} {weather?.country && <span>({weather.country})</span>}
                  </div>
                </div>
              </div>
              {/* Suggestion */}
              <div style={{
                color: "#27174e",
                background: "#fadadd11",
                borderRadius: 13,
                padding: "11px 14px 11px 16px",
                fontWeight: 600,
                fontSize: 16.7,
                margin: "14px 0 8px 0",
                textAlign: "center",
                boxShadow: "0 1px 8px #fadadd20"
              }}>
                {suggestion.title}
              </div>
              {/* Tips list */}
              <ul style={{
                color: "#fadadd",
                margin: "10px 0 7px 0",
                fontSize: 15.6,
                fontWeight: 500,
                minHeight: 70
              }}>
                {suggestion.tips.map((tip, idx) => (
                  <li key={idx} style={{
                    marginBottom: 8,
                    color: "#e7b3ff",
                    lineHeight: 1.5
                  }}>{tip}</li>
                ))}
              </ul>
              {/* Routine highlights */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 11,
                  margin: "12px 0 0 0",
                  justifyContent: "center"
                }}>
                {suggestion.routine.map((r, i) => (
                  <span
                    key={r}
                    style={{
                      background: "linear-gradient(92deg,#fadadd 45%,#e7b3ff 95%)",
                      color: "#23155f",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 15,
                      padding: "4.5px 15px",
                      marginRight: i < suggestion.routine.length - 1 ? 0 : "",
                      letterSpacing: ".02em",
                      boxShadow: "0 1.5px 5px #f339db22"
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
              <div style={{
                textAlign: "center",
                marginTop: 18,
                color: "#fadadd",
                fontSize: 13.2,
                opacity: 0.86
              }}>
                Suggestions adapt daily – for a new tip, refresh this page!
              </div>
            </div>
            <div style={{
              textAlign: "center",
              fontSize: 14.5,
              color: "#e7b3ff",
              opacity: 0.84
            }}>
              <span>
                Want to see how routines change as the weather does? Compare below, or <a href="/routine" style={{ color: "#f339db" }}>build your routine now</a>.
              </span>
            </div>
          </MotionWrapper>
        )}
      </AppleFadeTransition>
    </section>
  );
};

export default WeatherSuggestions;
