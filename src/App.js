import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Relative paths for HashRouter */}
      <Route path="" element={!user ? <Login /> : <Navigate to="dashboard" replace />} />
      <Route path="signup" element={!user ? <Signup /> : <Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="" />} />
    </Routes>
  );
}

export default App;