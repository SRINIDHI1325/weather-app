import React from "react";
import { List, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";

function SearchHistory({ history, onSelect }) {
  if (history.length === 0) return null;

  return (
    <Paper sx={{ mt: 4, borderRadius: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Searches
      </Typography>
      <List>
        {history.map((city, index) => (
          <ListItemButton key={index} onClick={() => onSelect(city)}>
            <ListItemText primary={city} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}

export default SearchHistory;