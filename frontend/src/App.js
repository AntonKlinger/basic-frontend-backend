import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import NewPage from "./pages/Newpage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [mode, setMode] = useState("login"); // login | register

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
//    <Router>
//      {!token ? (
//        mode === "login" ? (
//          <LoginPage setToken={setToken} switchToRegister={() => setMode("register")} />
//        ) : (
//          <RegisterPage switchToLogin={() => setMode("login")} />
//        )
//      ) : (
//        <Routes>
//          <Route path="/" element={<MainPage token={token} handleLogout={handleLogout} />} />
//          <Route path="/newpage" element={<NewPage />} />
//        </Routes>
//      )}
//    </Router>
  <Router>
    {!token ? (
      <LoginPage setToken={setToken} />
    ) : (
      <Routes>
        <Route path="/" element={<MainPage token={token} handleLogout={handleLogout} />} />
        <Route path="/newpage" element={<NewPage />} />
      </Routes>
    )}
  </Router>
  );
}

export default App;
