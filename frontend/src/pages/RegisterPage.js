import React, { useState } from "react";
import styles from '../style';
import API_BASE_URL from "../api";

function RegisterPage({ switchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/api/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (res.ok) {
        alert("Registrierung erfolgreich! Bitte einloggen.");
        switchToLogin();
      } else {
        alert("Registrierung fehlgeschlagen");
      }
    });
  };

  return (
    <div style={styles.container}>
      <h1>Registrierung</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={styles.input}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />
        <br />
        <button type="submit" style={styles.button}>Registrieren</button>
      </form>
      <p>
        Bereits registriert? <button onClick={switchToLogin} style={styles.linkButton}>Login</button>
      </p>
    </div>
  );
}

export default RegisterPage;
