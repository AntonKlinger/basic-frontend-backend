import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const [nachrichten, setNachrichten] = useState([]);
  const [name, setName] = useState("");
  const [alter, setAlter] = useState("");
  const [groesse, setGroesse] = useState("");

  // Nachrichten laden
  useEffect(() => {
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/nachrichten/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setNachrichten(res.data))
        .catch(() => {
          alert("Token ungültig oder abgelaufen. Bitte neu einloggen.");
          handleLogout();
        });
    }
  }, [token]);

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/token/", { username, password })
      .then((res) => {
        localStorage.setItem("token", res.data.access);
        setToken(res.data.access);
      })
      .catch(() => alert("Login fehlgeschlagen"));
  };

  // Registrierung
  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/register/", { username, password })
      .then(() => alert("Registrierung erfolgreich, jetzt einloggen."))
      .catch(() => alert("Registrierung fehlgeschlagen"));
  };

  // Neue Nachricht absenden
  const handleSubmitNachricht = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://127.0.0.1:8000/api/nachrichten/",
        {
          name,
          alter: parseInt(alter, 10),
          groesse: parseFloat(groesse),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setNachrichten([res.data, ...nachrichten]);
        setName("");
        setAlter("");
        setGroesse("");
      })
      .catch(() => alert("Fehler beim Senden"));
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setNachrichten([]);
  };

  // Wenn nicht eingeloggt: Login & Registrierung anzeigen
  if (!token) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Registrieren</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Registrieren</button>
        </form>

        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  // Wenn eingeloggt: Nachrichten-Übersicht + Logout
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Nachrichten</h1>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleSubmitNachricht}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Alter"
          value={alter}
          onChange={(e) => setAlter(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Größe (z.B. 1.75)"
          value={groesse}
          onChange={(e) => setGroesse(e.target.value)}
          required
        />
        <button type="submit">Absenden</button>
      </form>

      <hr />
      <ul>
        {nachrichten.map((n) => (
          <li key={n.id}>
            <strong>{new Date(n.erstellt_am).toLocaleString()}</strong>
            <br />
            Name: {n.name} <br />
            Alter: {n.alter} <br />
            Größe: {n.groesse}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
