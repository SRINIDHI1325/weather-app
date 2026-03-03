import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

function WeatherCard({ data }) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  return (
    <Card
      sx={{
        mt: 4,
        borderRadius: 4,
        textAlign: "center",
        background: "white",
      }}
      elevation={8}
    >
      <CardContent>
        <Typography variant="h5" fontWeight={600}>
          {data.name}
        </Typography>

        <Box>
          <img src={iconUrl} alt="weather icon" />
        </Box>

        <Typography variant="h4">
          {data.main.temp} °C
        </Typography>

        <Typography color="text.secondary">
          {data.weather[0].description}
        </Typography>

        <Typography mt={2}>
          Humidity: {data.main.humidity}%
        </Typography>
      </CardContent>
    </Card>
  );
}

export default WeatherCard;