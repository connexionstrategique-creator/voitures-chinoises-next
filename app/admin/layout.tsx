import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F5", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{
        background: "#0D0D0D",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#A01414", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em" }}>ADMIN</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Voitures Chinoises</span>
        </div>
        <a
          href="/api/admin/logout"
          style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}
        >
          Déconnexion
        </a>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {children}
      </div>
    </div>
  );
}
