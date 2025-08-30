import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

import wb from './assets/Wallstreetbets.png';
import styles from './style.js'

import API_BASE_URL from "./api";


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

  // Neue States für Sparraten
  const [sparraten, setSparraten] = useState([]);
  const [srName, setSrName] = useState("");
  const [srBetrag, setSrBetrag] = useState("");
  const [srAnfang, setSrAnfang] = useState("");
  const [srEnde, setSrEnde] = useState("");

  // Transformierte Daten für das Diagramm
  let kumulierteSparraten = 0;

  const datenDiagramm = Array.from({ length: 10 * 12 }, (_, i) => {
    const jahr = 2025 + Math.floor(i / 12);
    const monat = (i % 12) + 1;
    const stichtag = new Date(jahr, monat - 1, 1);

    const punkt = {
      jahr,
      monat,
      label: `${monat.toString().padStart(2, "0")}.${jahr}`,
      nachrichten: daten[i]?.nachrichten ?? 0
    };

    // Positionen verarbeiten
    let summePositionen = 0;
    positionen.forEach((p) => {
      const anfang = p.anfangsdatum ? new Date(p.anfangsdatum) : null;
      const ende = p.enddatum ? new Date(p.enddatum) : null;

      const aktiv =
        (!anfang || stichtag >= anfang) &&
        (!ende || stichtag <= ende);

      if (aktiv) {
        const monateSeitStart = (jahr - 2025) * 12 + (monat - 1);
        const wert = p.wert * Math.pow(1.01, monateSeitStart);
        punkt[p.name] = wert;
        summePositionen += wert;
      } else {
        punkt[p.name] = 0;
      }
    });

    // Sparraten verarbeiten
    let summeSparraten = 0;
    sparraten.forEach((s) => {
      const anfang = s.anfangsdatum ? new Date(s.anfangsdatum) : null;
      const ende = s.enddatum ? new Date(s.enddatum) : null;

      const aktiv =
        (!anfang || stichtag >= anfang) &&
        (!ende || stichtag <= ende);

      if (aktiv) {
        summeSparraten += s.betrag; // pro Monat
      }
    });

    punkt.summeSparraten = summeSparraten;

    // Sparraten kumulativ aufaddieren (Akkumulation über die Monate)
    kumulierteSparraten += summeSparraten;

    // Summe Positionen (ohne Sparraten)
    punkt.summePositionen = summePositionen;

    // Vermögen = Positionen + alle Sparraten bis hierhin
    punkt.vermögen = summePositionen + kumulierteSparraten;

    return punkt;
  });



  const handleDeletePosition = (id) => {
    axios
      .delete(`${API_BASE_URL}/api/positionen/${id}/`, { headers: authHeader() })
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
      .get(`${API_BASE_URL}/api/nachrichten/`, { headers: authHeader() })
      .then((res) => setNachrichten(res.data))
      .catch(handleApiError);
  };

  const fetchSparziel = () => {
    axios
      .get(`${API_BASE_URL}/api/sparziel/`, { headers: authHeader() })
      .then((res) => setSparziel(res.data?.betrag ?? ""))
      .catch(handleApiError);
  };

  const fetchPositionen = () => {
    axios
      .get(`${API_BASE_URL}/api/positionen/`, { headers: authHeader() })
      .then((res) => setPositionen(res.data))
      .catch(handleApiError);
  };

  // -------------------- Auth --------------------
  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/api/register/`, { username, password })
      .then(() => {
        alert("Registrierung erfolgreich! Bitte einloggen.");
        setMode("login");
      })
      .catch(() => alert("Registrierung fehlgeschlagen"));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/api/token/`, { username, password })
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
      const response = await fetch(`${API_BASE_URL}/api/nachrichten/`, {
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
        `${API_BASE_URL}/api/sparziel/`,
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
        `${API_BASE_URL}/api/positionen/`,
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


  // Sparraten laden
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/sparraten/`, { headers: authHeader() })
      .then(res => setSparraten(res.data))
      .catch(err => console.error(err));
  }, []);

  // Sparrate hinzufügen
  const handleAddSparrate = (e) => {
    e.preventDefault();
    axios.post(`${API_BASE_URL}/api/sparraten/`, {
      name: srName,
      betrag: parseFloat(srBetrag),
      anfangsdatum: srAnfang || null,
      enddatum: srEnde || null
    }, { headers: authHeader() })
      .then(res => {
        setSparraten([res.data, ...sparraten]);
        setSrName("");
        setSrBetrag("");
        setSrAnfang("");
        setSrEnde("");
      });
  };

  // Sparrate löschen
  const handleDeleteSparrate = (id) => {
    axios.delete(`${API_BASE_URL}/api/sparraten/${id}/`, { headers: authHeader() })
      .then(() => setSparraten(sparraten.filter(sr => sr.id !== id)));
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
        {/*<button onClick={() => setMode(mode === "login" ? "register" : "login")} style={styles.button}>
          {mode === "login"
            ? "Noch kein Konto? Registrieren"
            : "Schon registriert? Login"}
        </button>*/}
      </div>
    );
  }

  return (
    <div style={styles.container}>
    <div style={styles.header}>
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
    </div>

      {/* Sparziel – direkt unter dem Logout-Button */}
      <div style={{ marginTop: "1.5rem" }}>
        <img src={wb} alt="Logo" style={styles.wb}/>
        <form onSubmit={handleSubmitSparziel}>
          <input
            type="number"
            step="0.01"
            placeholder="Sparziel (Zahl)"
            value={sparziel}
            onChange={(e) => setSparziel(e.target.value)}
            style={styles.input}
          />
          <br />
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
            <Line
              type="monotone"
              dataKey="summeSparraten"
              stroke="#0099ff"
              dot={false}
              strokeDasharray="4 4"
            />
          <Line
            type="monotone"
            dataKey="vermögen"
            stroke="#ff9900"
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

      {/* Sparraten – unter den Positionen */}
      <div style={{ marginTop: "2rem" }}>
        <h2>Sparraten</h2>
        <form onSubmit={handleAddSparrate}>
          <input
            type="text"
            placeholder="Sparrate-Name"
            value={srName}
            onChange={(e) => setSrName(e.target.value)}
            style={styles.input}
          /><br />
          <input
            type="number"
            step="0.01"
            placeholder="Betrag"
            value={srBetrag}
            onChange={(e) => setSrBetrag(e.target.value)}
            style={styles.input}
          /><br />
          <input
            type="date"
            value={srAnfang}
            onChange={(e) => setSrAnfang(e.target.value)}
            style={styles.input}
          /><br />
          <input
            type="date"
            value={srEnde}
            onChange={(e) => setSrEnde(e.target.value)}
            style={styles.input}
          /><br />
          <button style={styles.button} type="submit">Hinzufügen</button>
        </form>

        <ul>
          {sparraten.map((sr) => (
            <li key={sr.id}>
              {sr.name} — {sr.betrag} € ({sr.anfangsdatum || "ab sofort"} bis {sr.enddatum || "unbegrenzt"})
              <button
                style={{ marginLeft: "10px", background: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                onClick={() => handleDeleteSparrate(sr.id)}
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



export default App;
