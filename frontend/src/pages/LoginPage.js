import React, { useState } from "react";
import styles from '../style';
import API_BASE_URL from "../api";

function LoginPage({ setToken, switchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      const accessToken = data.access;
      localStorage.setItem("token", accessToken);
      setToken(accessToken);
    })
    .catch(() => alert("Login fehlgeschlagen!"));
  };

  return (
    <div style={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p>
        Noch keinen Account? <button onClick={switchToRegister} style={styles.linkButton}>Registrieren</button>
      </p>
    </div>
  );
}

export default LoginPage;
