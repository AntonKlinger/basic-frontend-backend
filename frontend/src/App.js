import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Beispiel-Daten für das Diagramm
const daten = [
  { name: "Jan", nachrichten: 5 },
  { name: "Feb", nachrichten: 8 },
  { name: "Mär", nachrichten: 2 },
  { name: "Apr", nachrichten: 6 },
];

function App() {
  const [mode, setMode] = useState("login"); // login oder register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const [nachrichten, setNachrichten] = useState([]);
  const [name, setName] = useState("");
  const [alter, setAlter] = useState("");
  const [groesse, setGroesse] = useState("");

  const [sparziel, setSparziel] = useState("");

  useEffect(() => {
    if (token) {
      fetchNachrichten();
      fetchSparziel();
    }
  }, [token]);

  // --- Nachrichten laden ---
  const fetchNachrichten = () => {
    axios
      .get("http://127.0.0.1:8000/api/nachrichten/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNachrichten(res.data))
      .catch((err) => {
        console.error(err.response?.data || err.message);
        if (err.response?.status === 401) handleLogout();
      });
  };

  // --- Sparziel laden ---
  const fetchSparziel = () => {
    axios
      .get("http://127.0.0.1:8000/api/sparziel/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSparziel(res.data.betrag || ""))
      .catch((err) => console.error(err.response?.data || err.message));
  };

  // --- Registrierung ---
  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/register/", { username, password })
      .then(() => {
        alert("Registrierung erfolgreich! Bitte einloggen.");
        setMode("login");
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Registrierung fehlgeschlagen");
      });
  };

  // --- Login ---
  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/token/", { username, password })
      .then((res) => {
        const accessToken = res.data.access;
        localStorage.setItem("token", accessToken);
        setToken(accessToken);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Login fehlgeschlagen!");
      });
  };

  // --- Logout ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setNachrichten([]);
    setSparziel("");
  };

  // --- Nachricht senden ---
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
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setNachrichten([res.data, ...nachrichten]);
        setName("");
        setAlter("");
        setGroesse("");
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Fehler beim Senden der Nachricht");
      });
  };

  // --- Sparziel senden ---
  const handleSubmitSparziel = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://127.0.0.1:8000/api/sparziel/",
        { betrag: parseFloat(sparziel) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => alert("Sparziel gespeichert!"))
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Fehler beim Speichern des Sparziels");
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

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Willkommen! Du bist eingeloggt.</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* Sparziel */}
      <h2>Sparziel</h2>
      <form onSubmit={handleSubmitSparziel}>
        <input
          type="number"
          step="0.01"
          placeholder="Sparziel"
          value={sparziel}
          onChange={(e) => setSparziel(e.target.value)}
        />
        <button type="submit">Speichern</button>
      </form>

      {/* Diagramm */}
      <div style={{ marginTop: "2rem" }}>
        <h2>Nachrichten pro Monat</h2>
        <BarChart width={500} height={300} data={daten}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="nachrichten" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Nachricht erstellen */}
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

      {/* Nachrichtenliste */}
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
