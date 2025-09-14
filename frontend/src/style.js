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
    header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    position: "sticky", // bleibt beim Scrollen oben kleben
    top: 0,
    zIndex: 10,
    },
    wb: {
    width: "200px",
    display: "block",
    margin: "0 auto",
    marginBottom: -7,
    },
    input: {
    width: "250px",
    padding: "10px 14px",
    backgroundColor: "transparent", // transparentes Feld
    color: "#fff",                   // weiße Schrift
    border: "2px solid rgba(255,255,255,0.4)", // halbtransparente weiße Border
    borderRadius: "8px",
    outline: "none",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    marginBottom: "10px",
    },
    
  title: { fontSize: "2rem", marginBottom: "1rem" },
  subtitle: { fontSize: "1.5rem", marginBottom: "1rem" },
  form: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
  button: { padding: "10px 20px", border: "none", borderRadius: "5px", background: "#1e90ff", color: "#fff", cursor: "pointer" },
  linkButton: { marginTop: "10px", background: "none", border: "none", color: "#1e90ff", cursor: "pointer" },


  smallBox: { marginTop: "2rem", backgroundColor: "#222831", padding: "1rem", borderRadius: "8px", boxShadow: "0 4px 12px rgba(248, 243, 243, 0.15)", maxWidth: "100%"},
  largeBox: { marginTop: "2rem", backgroundColor: "#222831", padding: "1rem", borderRadius: "8px", width: "600px", boxShadow: "0 4px 12px rgba(248, 243, 243, 0.15)", maxWidth: "100%" },


  logoutButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    background: "#ff4d4d",
    color: "#fff",
    cursor: "pointer",
  },
  listItem: { padding: "5px 0", borderBottom: "1px solid #333" },
};

export default styles;