import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import styles from '../style';
import API_BASE_URL from "../api";

function NewPage() {
  const [level, setLevel] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${API_BASE_URL}/api/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setLevel(res.data.level))
      .catch(err => console.error(err));
    }
  }, []);

  // Level um eins erhöhen
  const increaseLevel = () => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/api/me/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLevel(data.level))  // direkt Level updaten
      .catch((err) => console.error(err));
  };

  // Level um eins senken
  const decreaseLevel = () => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/api/me/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "decrease" }),
    })
      .then((res) => res.json())
      .then((data) => setLevel(data.level))
      .catch((err) => console.error(err));
  };

  return (
    <div style={styles.container}>
      <Link to="/">⬅ Zurück zur Homepage</Link>

      {level === 1 && (
        <div style={styles.largeBox}>
          <h4>Hast du bereits ein Aktienportfolio?</h4>
          <button style={styles.button} onClick={increaseLevel}>
            Weiter
          </button>
        </div>
      )}

      {level === 2 && (
        <div style={styles.largeBox}>
          <h4>Hast du bereits 100 Euro auf deinem Aktienportfolio?</h4>
          <button style={styles.button} onClick={increaseLevel}>
            Weiter
          </button>
        </div>
      )}

      {level === 3 && (
        <div style={styles.largeBox}>
          <h4>Hast du bereits 10000 Euro auf deinem Aktienportfolio?</h4>
          <button style={styles.button} onClick={increaseLevel}>
            Weiter
          </button>
          <button style={styles.button} onClick={decreaseLevel}>
            Zurück
          </button>
        </div>
      )}

      {level === 4 && (
        <div style={styles.largeBox}>
          <h4>Hast du bereits 100000 Euro auf deinem Aktienportfolio?</h4>
          {/* Optional: ab Level 4 keinen Button mehr anzeigen */}
          <button style={styles.button} onClick={decreaseLevel}>
            Zurück
          </button>
        </div>
      )}
    </div>
  );
}

export default NewPage;
