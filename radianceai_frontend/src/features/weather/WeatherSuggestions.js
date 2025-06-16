import React, { useEffect, useState } from "react";
import { fetchWeather } from "../../api/apiClient";
import { fetchGeolocation } from "../../api/geo";
import { MotionWrapper, AppleFadeTransition } from "../../utils/animation";

const palette = {
  blueDark: "#2050aa",
  blueLight: "#77a6ed",
  white: "#fff",
  gradient: "linear-gradient(120deg, #2050aa 40%, #77a6ed 100%)",
  creamyWhite: "#FFF8EB",
  beige: "#F5E3CF"
};

function WeatherSuggestions() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchLocationAndWeather() {
      const geo = await fetchGeolocation();
      if (!geo || geo.error || !geo.latitude || !geo.longitude) {
        setWeather({ error: true, reason: geo?.error || "Unable to determine location" });
        return;
      }

      const weatherData = await fetchWeather(geo.latitude, geo.longitude);
      if (weatherData.error) {
        setWeather({ error: true, reason: weatherData.reason || "Weather API failed" });
        return;
      }

      setWeather(weatherData);
    }

    fetchLocationAndWeather();
  }, []);

  const getSuggestion = (weatherObj) => {
    if (!weatherObj || weatherObj.error) return "";
    const t = weatherObj.temp;
    if (t < 16) return "Hydrating products (serum/moisturizer) recommended — cold/dry air can dehydrate skin.";
    if (t > 28) return "Lightweight, non-greasy sunscreen & toner recommended due to heat/humidity.";
    if (weatherObj.weatherMain === "Rain") return "Moisturizer and water-resistant sunscreen are a must during rainy weather.";
    if (weatherObj.weatherMain === "Clear" || weatherObj.weatherMain === "Clouds") return "Keep using sunscreen daily—even when cloudy!";
    return "";
  };

  return (
    <section className="container" style={{ maxWidth: 440, margin: "0 auto" }}>
      <AppleFadeTransition>
        <h2
          style={{
            fontWeight: 700,
            fontSize: "1.34rem",
            color: palette.blueDark,
            margin: "20px 0 8px 0",
            textAlign: "center"
          }}
        >
          Weather-Based Skincare Suggestions
        </h2>
        <MotionWrapper>
          <div
            style={{
              background: palette.gradient,
              borderRadius: 19,
              boxShadow: "0 1px 22px #77a6ed27",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              padding: "23px 12px 13px 12px",
              textAlign: "center",
              margin: "17px auto 8px auto"
            }}
          >
            {weather === null ? (
              <span style={{ color: palette.blueLight }}>Detecting weather for your region…</span>
            ) : weather.error ? (
              <span style={{ color: palette.blueLight }}>
                Weather not available ({weather.reason || "N/A"}).
              </span>
            ) : (
              <span>
                Weather in{" "}
                <b style={{ color: palette.blueLight }}>
                  {weather.city}
                  {weather.country ? `, ${weather.country}` : ""}
                </b>
                :<br />
                <span style={{ color: palette.creamyWhite }}>
                  {weather.temp}°C, {weather.weatherMain}
                </span>
                <br />
                <span style={{ color: "#fff", fontWeight: 600 }}>
                  {getSuggestion(weather)}
                </span>
              </span>
            )}
          </div>
        </MotionWrapper>
      </AppleFadeTransition>
    </section>
  );
}

export default WeatherSuggestions;
