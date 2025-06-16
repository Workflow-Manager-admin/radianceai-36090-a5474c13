import React, { useEffect, useState } from "react";
import { fetchGeolocation } from "../../api/geo"; // your geo.js file

const palette = {
  blueDark: "#2050aa",
  blueLight: "#77a6ed",
  creamyWhite: "#FFF8EB"
};

const OPENWEATHER_API_KEY = "1545b3a636a95548e533bcdca59dde0f";

async function fetchWeatherFromCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather API error");
    const data = await res.json();
    return {
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      weatherMain: data.weather[0].main
    };
  } catch (e) {
    return { error: e.message };
  }
}

function WeatherSuggestions() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLocationAndWeather() {
      setLoading(true);

      // Get geolocation from IP
      const geo = await fetchGeolocation();
      if (geo.error) {
        setWeather({ error: "Could not get location" });
        setLoading(false);
        return;
      }

      // Fetch weather from OpenWeatherMap API
      const weatherData = await fetchWeatherFromCoords(geo.latitude, geo.longitude);
      setWeather(weatherData);
      setLoading(false);
    }

    getLocationAndWeather();
  }, []);

  const getSuggestion = (w) => {
    if (!w || w.error) return "";
    const t = w.temp;
    if (t < 16)
      return "Hydrating products (serum/moisturizer) recommended — cold/dry air can dehydrate skin.";
    if (t > 28)
      return "Lightweight, non-greasy sunscreen & toner recommended due to heat/humidity.";
    if (w.weatherMain === "Rain")
      return "Moisturizer and water-resistant sunscreen are a must during rainy weather.";
    if (w.weatherMain === "Clear" || w.weatherMain === "Clouds")
      return "Keep using sunscreen daily—even when cloudy!";
    return "";
  };

  return (
    <section className="container" style={{ maxWidth: 440, margin: "0 auto" }}>
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

      <div
        style={{
          background: `linear-gradient(120deg, ${palette.blueDark} 40%, ${palette.blueLight} 100%)`,
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
        {loading ? (
          <span style={{ color: palette.blueLight }}>Detecting weather for your region…</span>
        ) : weather.error ? (
          <span style={{ color: palette.blueLight }}>Weather not available ({weather.error}).</span>
        ) : (
          <span>
            Weather in <b style={{ color: palette.blueLight }}>{weather.city}, {weather.country}</b>:<br />
            <span style={{ color: palette.creamyWhite }}>
              {weather.temp}°C, {weather.weatherMain}
            </span>
            <br />
            <span style={{ color: "#fff", fontWeight: 600 }}>{getSuggestion(weather)}</span>
          </span>
        )}
      </div>
    </section>
  );
}

export default WeatherSuggestions;
