"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Mot de passe incorrect");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "48px 40px", width: "100%", maxWidth: 380 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#A01414", fontWeight: 700, marginBottom: 8 }}>ADMIN</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32, fontFamily: "Cormorant Garamond, serif" }}>
          Voitures Chinoises
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #E0E0E0",
              borderRadius: 8,
              fontSize: 15,
              marginBottom: 16,
              boxSizing: "border-box",
              outline: "none",
            }}
            autoFocus
          />
          {error && <div style={{ color: "#A01414", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#A01414",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "13px",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "..." : "CONNEXION"}
          </button>
        </form>
      </div>
    </div>
  );
}
