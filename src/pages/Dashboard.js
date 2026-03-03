// src/components/Dashboard.js
import React, { useState} from "react";
import {
  TextField,
  Paper,
  List,
  ListItem,
  ListItemButton,
  Box,
  Container,
  Typography,
  IconButton,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { fetchWeather, fetchCitySuggestions } from "../api";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";



function Dashboard({ setUser }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("light");
  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );

  // Handle city input change
  const handleChange = async (e) => {
    const value = e.target.value;
    setCityInput(value);

    if (value.length > 2) {
      try {
        const results = await fetchCitySuggestions(value);
        setSuggestions(results || []);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Fetch weather data
  const getWeather = async (cityObj) => {
    setLoading(true);
    try {
     const data = await fetchWeather(cityObj);
      if (!data) throw new Error("No weather data");

      setWeather(data);

      // Update recent history
      const updatedHistory = [
        cityObj,
        ...history.filter(
          (h) => h.name !== cityObj.name || h.country !== cityObj.country
        ),
      ].slice(0, 5);

      setHistory(updatedHistory);
      localStorage.setItem("history", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error(err);
      alert("City not found or API error");
    } finally {
      setLoading(false);
    }
  };

  // Select a suggestion
  const handleSelect = (cityObj) => {
    setCityInput(`${cityObj.name}, ${cityObj.country}`);
    setSuggestions([]);
    getWeather(cityObj);
  };

  // Click on history
  const handleHistoryClick = (cityObj) => {
    setCityInput(`${cityObj.name}, ${cityObj.country}`);
    getWeather(cityObj);
  };

  // Logout
  const handleLogout = async () => {
  await signOut(auth);
  navigate("/");
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          mode === "dark"
            ? "linear-gradient(to right, #0f2027, #203a43, #2c5364)"
            : "linear-gradient(to right, #667eea, #764ba2)",
        transition: "0.4s",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 4 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" mb={3}>
            <IconButton
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>

          <Typography variant="h4" align="center" fontWeight="bold" mb={4}>
            Weather Dashboard
          </Typography>

          {/* Search */}
          <Box position="relative">
            <TextField
              label="Search City"
              fullWidth
              value={cityInput}
              onChange={handleChange}
            />
            {suggestions.length > 0 && (
              <Paper
                elevation={6}
                sx={{
                  position: "absolute",
                  width: "100%",
                  zIndex: 10,
                  mt: 1,
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                <List>
                  {suggestions.map((item, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemButton
                        onClick={() => handleSelect(item)}
                        sx={{
                          transition: "0.2s",
                          "&:hover": { backgroundColor: "primary.light" },
                        }}
                      >
                        <span style={{ marginRight: 8 }}>
                          {getFlagEmoji(item.country)}
                        </span>
                        {item.name}
                        {item.state ? `, ${item.state}` : ""}, {item.country}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          {/* History */}
          {history.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" mb={2}>
                Recent Searches
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {history.map((item, idx) => (
                  <Chip
                    key={idx}
                    label={`${item.name}, ${item.country}`}
                    onClick={() => handleHistoryClick(item)}
                  />
                ))}
              </Box>
            </>
          )}

          {/* Loading */}
          {loading && (
            <Box mt={4} textAlign="center">
              <CircularProgress />
            </Box>
          )}

          {/* Current Weather */}
          {weather?.current && !loading && (
            <Box mt={5} textAlign="center">
              <Typography variant="h3">
  {weather.current.main?.temp}°C
</Typography>

<Typography sx={{ textTransform: "capitalize" }}>
  {weather.current.weather[0]?.description}
</Typography>

<Typography mt={2}>
  Humidity: {weather.current.main?.humidity}%
</Typography>

<Typography>
  Wind: {weather.current.wind?.speed} m/s
</Typography>
            </Box>
          )}

          {/* Hourly Forecast */}
          {weather?.hourly?.length > 0 && (
            <Box mt={5}>
              <Typography variant="h6" mb={2}>
                Hourly Forecast
              </Typography>
              <Box display="flex" overflow="auto" gap={2}>
                {weather.hourly.slice(0, 12).map((hour, idx) => (
                  <Paper
                    key={idx}
                    sx={{ p: 1, minWidth: 70, textAlign: "center" }}
                  >
                    <Typography variant="body2">
                      {new Date(hour.dt * 1000).getHours()}:00
                    </Typography>
                    <img
                      src={`https://openweathermap.org/img/wn/${hour.weather[0]?.icon}.png`}
                      alt="icon"
                    />
                    <Typography variant="body2">{hour.main?.temp}°C</Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

          {weather?.daily?.length > 8 && !loading && (
  <Box mt={5}>
    <Typography variant="h6" mb={2}>
      Tomorrow (Approx)
    </Typography>

    <Paper sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h6">
        {weather.daily[8]?.main?.temp}°C
      </Typography>

      <Typography sx={{ textTransform: "capitalize" }}>
        {weather.daily[8]?.weather[0]?.description}
      </Typography>

      <img
        src={`https://openweathermap.org/img/wn/${weather.daily[8]?.weather[0]?.icon}@2x.png`}
        alt="icon"
      />

      <Typography>
        Humidity: {weather.daily[8]?.main?.humidity}%
      </Typography>

      <Typography>
        Wind: {weather.daily[8]?.wind?.speed} m/s
      </Typography>
    </Paper>
  </Box>
)}
        </Paper>
      </Container>
    </Box>
  );
}

// Convert country code → flag emoji
function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "🏳️";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export default Dashboard;