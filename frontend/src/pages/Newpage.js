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

  return (
    <div style={styles.container}>
      <Link to="/">⬅ Zurück zur Homepage</Link>

      {level === 1 && (
        <div style={styles.largeBox}>
          <h4>Hast du bereits ein Aktienportfolio?</h4>
        </div>
      )}

      {level === 2 && (
        <div style={styles.largeBox}>
          <h4>Hast du bereits 1000 Euro auf deinem Aktienportfolio?</h4>
        </div>
      )}

      {level === 3 && (
        <div style={styles.largeBox}>
          <h4>Hast du bereits 10000 Euro auf deinem Aktienportfolio?</h4>
        </div>
      )}

      {level === 4 && (
        <div style={styles.largeBox}>
          <h4>Hast du bereits 100000 Euro auf deinem Aktienportfolio?</h4>
        </div>
      )}
    </div>
  );
}

export default NewPage;
