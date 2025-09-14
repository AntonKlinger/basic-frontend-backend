import React from "react";
import { Link } from "react-router-dom";

function NewPage() {
  return (
    <div>
      <h1>Das ist die neue Seite 🎉</h1>
      <p>Hier kannst du weitere Inhalte hinzufügen.</p>

      {/* Zurück zur Startseite */}
      <Link to="/">⬅ Zurück zur Homepage</Link>
    </div>
  );
}

export default NewPage;
