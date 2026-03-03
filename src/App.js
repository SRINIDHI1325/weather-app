import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Signup from "./pages/Signup";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
  <Route
    path="/"
    element={!user ? <Login /> : <Navigate to="/dashboard" />}
  />
  <Route
    path="/signup"
    element={!user ? <Signup /> : <Navigate to="/dashboard" />}
  />
  <Route
    path="/dashboard"
    element={user ? <Dashboard /> : <Navigate to="/" />}
  />
</Routes>
    </Router>
  );
}

export default App;