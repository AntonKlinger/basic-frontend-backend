import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [nachrichten, setNachrichten] = useState([]);
  const [inhalt, setInhalt] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/nachrichten/')
      .then(res => setNachrichten(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/nachrichten/', { inhalt })
      .then(res => setNachrichten([res.data, ...nachrichten]));
    setInhalt('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Nachrichten</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inhalt}
          onChange={(e) => setInhalt(e.target.value)}
        />
        <br />
        <button type="submit">Absenden</button>
      </form>

      <hr />

      <ul>
        {nachrichten.map((n) => (
          <li key={n.id}>
            <strong>{new Date(n.erstellt_am).toLocaleString()}</strong><br />
            {n.inhalt}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
