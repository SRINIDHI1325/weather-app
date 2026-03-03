import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY; // put your real key

// Fetch weather (FREE version)
export const fetchWeather = async (cityObj) => {
  try {
    if (!cityObj?.lat || !cityObj?.lon) {
      throw new Error("Invalid city object");
    }

    // Current Weather (FREE)
    const currentRes = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat: cityObj.lat,
          lon: cityObj.lon,
          units: "metric",
          appid: API_KEY,
        },
      }
    );

    // 5 Day Forecast (FREE)
    const forecastRes = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          lat: cityObj.lat,
          lon: cityObj.lon,
          units: "metric",
          appid: API_KEY,
        },
      }
    );

    return {
      name: `${cityObj.name}, ${cityObj.country}`,
      current: currentRes.data,
      hourly: forecastRes.data.list.slice(0, 8), // next few hours
      daily: forecastRes.data.list,
    };
  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// City suggestions (FREE)
export const fetchCitySuggestions = async (query) => {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY,
        },
      }
    );

    return response.data.map((item) => ({
      name: item.name,
      country: item.country,
      state: item.state || "",
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error("Suggestion API error:", error.message);
    return [];
  }
};