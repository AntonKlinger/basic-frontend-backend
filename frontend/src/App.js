import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';


// Beispiel-Daten fürs Diagramm
const daten = Array.from({ length: 10 }, (_, i) => ({
  jahr: 2025 + i,
  nachrichten: Math.floor(Math.random() * 10), // Beispielwerte
}));

function App() {
  const [mode, setMode] = useState("login");                 // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const [nachrichten, setNachrichten] = useState([]);
  const [nachrichtText, setNachrichtText] = useState(""); // nur noch ein Feld

  // Sparziel (Zahl) – wird pro User gespeichert
  const [sparziel, setSparziel] = useState("");

  // Positionen (unter dem Diagramm)
  const [positionen, setPositionen] = useState([]);
  const [posName, setPosName] = useState("");
  const [posWert, setPosWert] = useState("");
  const [posAnfang, setPosAnfang] = useState("");
  const [posEnde, setPosEnde] = useState("");

  // Transformierte Daten für das Diagramm
  const datenDiagramm = Array.from({ length: 10 }, (_, i) => {
    const jahrIndex = i + 1; // 1 bis 10
    const jahr = 2025 + i;

    const punkt = { jahr, nachrichten: daten[i]?.nachrichten ?? 0 };

    // Positionen mit Wachstumsfaktor 1,01^jahrIndex berechnen
    positionen.forEach((p) => {
      punkt[p.name] = p.wert * Math.pow(1.1, jahrIndex);
    });

    return punkt;
  });

  const handleDeletePosition = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/positionen/${id}/`, { headers: authHeader() })
      .then(() => {
        setPositionen(positionen.filter((p) => p.id !== id));
      })
      .catch(() => alert("Fehler beim Löschen der Position"));
  };

  const datenDiagrammMitSumme = datenDiagramm.map((item) => {
    // Summe aller Positionen in diesem Jahr
    const summePositionen = positionen.reduce((acc, pos) => {
      const key = pos.name;             // genau der dataKey wie im Chart
      const wert = item[key] || 0;      // Wert aus datenDiagramm für dieses Jahr
      return acc + wert;
    }, 0);

  return { ...item, summePositionen };
});


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

  const handleAddNachricht = async (e) => {
    e.preventDefault();
    if (!nachrichtText) return;

    const jetzt = new Date().toISOString(); // aktueller Zeitstempel

    try {
      const response = await fetch("http://127.0.0.1:8000/api/nachrichten/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ text: nachrichtText }),
      });
      const data = await response.json();
      // Timestamp ergänzen, falls nicht vom Backend geliefert
      setNachrichten([...nachrichten, { ...data, erstellt_am: data.erstellt_am ?? jetzt }]);
      setNachrichtText("");
    } catch (error) {
      console.error(error);
    }
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
        {
          name: posName.trim(),
          wert,
          anfangsdatum: posAnfang || null, // leer → Backend setzt default
          enddatum: posEnde || null,       // leer → null
        },
        { headers: authHeader() }
      )
      .then((res) => {
        setPositionen([res.data, ...positionen]);
        setPosName("");
        setPosWert("");
        setPosAnfang("");
        setPosEnde("");
      })
      .catch(() => alert("Fehler beim Hinzufügen der Position"));
  };

  // -------------------- UI --------------------
  if (!token) {
    return (
      <div style={styles.container}>
        <h1>{mode === "login" ? "Login" : "Registrierung"}</h1>
        <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <br />
          <button type="submit" style={styles.button}>
            {mode === "login" ? "Login" : "Registrieren"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={styles.button}>
          {mode === "login"
            ? "Noch kein Konto? Registrieren"
            : "Schon registriert? Login"}
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Willkommen! Du bist eingeloggt.</h1>
      <button onClick={handleLogout} style={styles.button}>Logout</button>

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
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Speichern
          </button>
        </form>
        {sparziel !== "" && <p>Aktuelles Sparziel: {sparziel}</p>}
      </div>

      {/* Diagramm */}
      <div style={{ marginTop: "30px" }}>
        <h2 style={styles.subtitle}>Nachrichten pro Monat</h2>
          <LineChart width={600} height={300} data={datenDiagrammMitSumme}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jahr" />
            <YAxis domain={[0, sparziel]} />
            <Tooltip />
            <Legend />

            {/* Sparziel-Linie */}
            <ReferenceLine y={sparziel} stroke="red" strokeDasharray="3 3" label="Sparziel" />

            {/* Dynamische Linien für Positionen */}
            {positionen.map((p) => (
              <Line
                key={p.id}
                type="monotone"
                dataKey={p.name}   // <-- wichtig: genau der gleiche Key wie in datenDiagramm
                stroke="#cc00ffff"
                dot={false}
              />
            ))}

            {/* Linie für Summe aller Positionen */}
            <Line
              type="monotone"
              dataKey="summePositionen"
              stroke="#00ff11ff"
              dot={false}
            />
          </LineChart>
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
            style={styles.input}
          />
          <br />
          <input
            type="number"
            step="0.01"
            placeholder="Wert"
            value={posWert}
            onChange={(e) => setPosWert(e.target.value)}
            style={styles.input}
          />
          <br />
          <input
            type="date"
            placeholder="Anfangsdatum"
            value={posAnfang}
            onChange={(e) => setPosAnfang(e.target.value)}
            style={styles.input}
          />
          <br />
          <input
            type="date"
            placeholder="Enddatum"
            value={posEnde}
            onChange={(e) => setPosEnde(e.target.value)}
            style={styles.input}
          />
          <br />
          <button style={styles.button} type="submit">Hinzufügen</button>
        </form>

        <ul>
          {positionen.map((p) => (
            <li key={p.id}>
              {p.name} — {p.wert}  
              {p.anfangsdatum && ` | Anfang: ${p.anfangsdatum}`}  
              {p.enddatum ? ` | Ende: ${p.enddatum}` : " | Ende: offen"}
              <button
                style={{
                  marginLeft: "10px",
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
                onClick={() => handleDeletePosition(p.id)}
              >
                löschen
              </button>
            </li>
          ))}
        </ul>
      </div>


      {/* Nachricht erstellen */}
      <h2>Nachricht erstellen</h2>
        <form onSubmit={handleAddNachricht}>
          <input
            type="text"
            placeholder="Nachricht eingeben"
            value={nachrichtText}
            onChange={(e) => setNachrichtText(e.target.value)}
            style={styles.input}
          />
          <button style={styles.button} type="submit">Senden</button>
        </form>

      <hr />

      <ul>
        {nachrichten.map((n) => (
          <li key={n.id}>
            <strong>{new Date(n.erstellt_am).toLocaleString()}</strong>
            <br />
            {n.text} {/* hier statt n.name | n.alter | n.groesse */}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#222831",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
  },
  title: { fontSize: "2rem", marginBottom: "1rem" },
  subtitle: { fontSize: "1.5rem", marginBottom: "1rem" },
  form: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
  input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "250px" },
  button: { padding: "10px 20px", border: "none", borderRadius: "5px", background: "#1e90ff", color: "#fff", cursor: "pointer" },
  linkButton: { marginTop: "10px", background: "none", border: "none", color: "#1e90ff", cursor: "pointer" },
  listItem: { padding: "5px 0", borderBottom: "1px solid #333" },
};

export default App;
