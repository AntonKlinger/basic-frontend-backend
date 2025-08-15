import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [mode, setMode] = useState("login"); // "login" oder "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [nachrichten, setNachrichten] = useState([]);
  const [name, setName] = useState("");
  const [alter, setAlter] = useState("");
  const [groesse, setGroesse] = useState("");

  useEffect(() => {
    console.log("Aktueller Token:", token);
    if (token) {
      fetchNachrichten();
    }
  }, [token]);

  // Nachrichten laden
  const fetchNachrichten = () => {
    axios
      .get("http://127.0.0.1:8000/api/nachrichten/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("GET Nachrichten:", res.data);
        setNachrichten(res.data);
      })
      .catch((err) => {
        console.error("Fehler beim Laden:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          alert("Token ungültig oder abgelaufen. Bitte neu einloggen.");
          handleLogout();
        }
      });
  };

  // Registrierung
  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/register/", { username, password })
      .then((res) => {
        console.log("Register Response:", res.data);
        alert("Registrierung erfolgreich! Bitte einloggen.");
        setMode("login");
      })
      .catch((err) => {
        console.error("Register Fehler:", err.response?.data || err.message);
        alert("Registrierung fehlgeschlagen");
      });
  };

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/token/", { username, password })
      .then((res) => {
        console.log("Login Response:", res.data);
        const accessToken = res.data.access;
        localStorage.setItem("token", accessToken);
        setToken(accessToken);
      })
      .catch((err) => {
        console.error("Login Fehler:", err.response?.data || err.message);
        alert("Login fehlgeschlagen!");
      });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setNachrichten([]);
  };

  // Nachricht senden
  const handleSubmitNachricht = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://127.0.0.1:8000/api/nachrichten/",
        {
          name,
          alter: alter ? parseInt(alter, 10) : null,
          groesse: groesse ? parseFloat(groesse) : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log("Nachricht erstellt:", res.data);
        setNachrichten([res.data, ...nachrichten]);
        setName("");
        setAlter("");
        setGroesse("");
      })
      .catch((err) => {
        console.error("POST Fehler:", err.response?.data || err.message);
        alert("Fehler beim Senden der Nachricht");
      });
  };

  // --- UI ---
  if (!token) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>{mode === "login" ? "Login" : "Registrierung"}</h1>
        <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">{mode === "login" ? "Login" : "Registrieren"}</button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Noch kein Konto? Registrieren" : "Schon registriert? Login"}
        </button>
      </div>
    );
  }

  // Eingabeformular für Name, Alter, Größe
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Willkommen! Du bist eingeloggt.</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Nachricht erstellen</h2>
      <form onSubmit={handleSubmitNachricht}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          type="number"
          placeholder="Alter"
          value={alter}
          onChange={(e) => setAlter(e.target.value)}
        />
        <br />
        <input
          type="number"
          step="0.01"
          placeholder="Größe"
          value={groesse}
          onChange={(e) => setGroesse(e.target.value)}
        />
        <br />
        <button type="submit">Absenden</button>
      </form>

      <hr />

      <ul>
        {nachrichten.map((n) => (
          <li key={n.id}>
            <strong>{new Date(n.erstellt_am).toLocaleString()}</strong>
            <br />
            {n.name} | {n.alter} | {n.groesse}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
