import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Beispiel-Daten fürs Diagramm
const daten = [
  { name: "Jan", nachrichten: 5 },
  { name: "Feb", nachrichten: 8 },
  { name: "Mär", nachrichten: 2 },
  { name: "Apr", nachrichten: 6 },
];

function App() {
  const [mode, setMode] = useState("login");                 // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const [nachrichten, setNachrichten] = useState([]);
  const [name, setName] = useState("");
  const [alter, setAlter] = useState("");
  const [groesse, setGroesse] = useState("");

  // Sparziel (Zahl) – wird pro User gespeichert
  const [sparziel, setSparziel] = useState("");

  // Positionen (unter dem Diagramm)
  const [positionen, setPositionen] = useState([]);
  const [posName, setPosName] = useState("");
  const [posWert, setPosWert] = useState("");

  // -------------------- Effects --------------------
  useEffect(() => {
    if (token) {
      fetchNachrichten();
      fetchSparziel();
      fetchPositionen();
    }
  }, [token]);

  // -------------------- API Helpers --------------------
  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  const handleApiError = (err) => {
    console.error(err.response?.data || err.message);
    if (err.response?.status === 401) {
      alert("Token ungültig oder abgelaufen. Bitte neu einloggen.");
      handleLogout();
    }
  };

  // -------------------- Loaders --------------------
  const fetchNachrichten = () => {
    axios
      .get("http://127.0.0.1:8000/api/nachrichten/", { headers: authHeader() })
      .then((res) => setNachrichten(res.data))
      .catch(handleApiError);
  };

  const fetchSparziel = () => {
    axios
      .get("http://127.0.0.1:8000/api/sparziel/", { headers: authHeader() })
      .then((res) => setSparziel(res.data?.betrag ?? ""))
      .catch(handleApiError);
  };

  const fetchPositionen = () => {
    axios
      .get("http://127.0.0.1:8000/api/positionen/", { headers: authHeader() })
      .then((res) => setPositionen(res.data))
      .catch(handleApiError);
  };

  // -------------------- Auth --------------------
  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/register/", { username, password })
      .then(() => {
        alert("Registrierung erfolgreich! Bitte einloggen.");
        setMode("login");
      })
      .catch(() => alert("Registrierung fehlgeschlagen"));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/token/", { username, password })
      .then((res) => {
        const accessToken = res.data.access;
        localStorage.setItem("token", accessToken);
        setToken(accessToken);
      })
      .catch(() => alert("Login fehlgeschlagen!"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setNachrichten([]);
    setSparziel("");
    setPositionen([]);
  };

  // -------------------- Create/Update --------------------
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
        { headers: authHeader() }
      )
      .then((res) => {
        setNachrichten([res.data, ...nachrichten]);
        setName("");
        setAlter("");
        setGroesse("");
      })
      .catch(() => alert("Fehler beim Senden der Nachricht"));
  };

  const handleSubmitSparziel = (e) => {
    e.preventDefault();
    const wert = sparziel === "" ? null : parseFloat(sparziel);
    if (wert !== null && Number.isNaN(wert)) {
      alert("Bitte eine gültige Zahl für das Sparziel eingeben.");
      return;
    }
    axios
      .post(
        "http://127.0.0.1:8000/api/sparziel/",
        { betrag: wert },
        { headers: authHeader() }
      )
      .then((res) => setSparziel(res.data?.betrag ?? ""))
      .catch(() => alert("Fehler beim Speichern des Sparziels"));
  };

  const handleAddPosition = (e) => {
    e.preventDefault();
    const wert = posWert === "" ? null : parseFloat(posWert);
    if (!posName.trim() || wert === null || Number.isNaN(wert)) {
      alert("Bitte Name und eine gültige Zahl für den Wert eingeben.");
      return;
    }
    axios
      .post(
        "http://127.0.0.1:8000/api/positionen/",
        { name: posName.trim(), wert },
        { headers: authHeader() }
      )
      .then((res) => {
        setPositionen([res.data, ...positionen]);
        setPosName("");
        setPosWert("");
      })
      .catch(() => alert("Fehler beim Hinzufügen der Position"));
  };

  // -------------------- UI --------------------
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
          <button type="submit">
            {mode === "login" ? "Login" : "Registrieren"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login"
            ? "Noch kein Konto? Registrieren"
            : "Schon registriert? Login"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Willkommen! Du bist eingeloggt.</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* Sparziel – direkt unter dem Logout-Button */}
      <div style={{ marginTop: "1.5rem" }}>
        <h2>Sparziel</h2>
        <form onSubmit={handleSubmitSparziel}>
          <input
            type="number"
            step="0.01"
            placeholder="Sparziel (Zahl)"
            value={sparziel}
            onChange={(e) => setSparziel(e.target.value)}
          />
          <button type="submit" style={{ marginLeft: "0.5rem" }}>
            Speichern
          </button>
        </form>
        {sparziel !== "" && <p>Aktuelles Sparziel: {sparziel}</p>}
      </div>

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

      {/* Positionen – unter dem Diagramm */}
      <div style={{ marginTop: "2rem" }}>
        <h2>Positionen</h2>
        <form onSubmit={handleAddPosition}>
          <input
            type="text"
            placeholder="Positionsname"
            value={posName}
            onChange={(e) => setPosName(e.target.value)}
          />
          <br />
          <input
            type="number"
            step="0.01"
            placeholder="Wert"
            value={posWert}
            onChange={(e) => setPosWert(e.target.value)}
          />
        <br />
          <button type="submit">Hinzufügen</button>
        </form>
        <ul>
          {positionen.map((p) => (
            <li key={p.id}>
              {p.name} — {p.wert}
            </li>
          ))}
        </ul>
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
