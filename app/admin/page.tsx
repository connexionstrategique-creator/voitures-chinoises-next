import { createClient } from "@sanity/client";
import Link from "next/link";

export const revalidate = 0;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "t3ow1rmc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function getCars() {
  return client.fetch(
    `*[_type=="car"] | order(brand asc, model asc) { _id, brand, model, year, price, cat }`
  );
}

const th: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: "#888",
  textAlign: "left",
  textTransform: "uppercase",
  background: "#FAFAFA",
  borderBottom: "1px solid #E8E8E8",
};

const td: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: 14,
  color: "#1a1a1a",
  borderBottom: "1px solid #F0F0F0",
};

export default async function AdminPage() {
  let cars: any[] = [];
  try { cars = await getCars(); } catch {}

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4, fontFamily: "Cormorant Garamond, serif" }}>Catalogue</h1>
          <p style={{ color: "#888", fontSize: 14 }}>{cars.length} véhicule{cars.length > 1 ? "s" : ""} dans Sanity</p>
        </div>
        <Link
          href="/admin/import"
          style={{
            background: "#0D0D0D",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          + Ajouter une voiture
        </Link>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #E0E0E0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Marque</th>
              <th style={th}>Modèle</th>
              <th style={th}>Année</th>
              <th style={th}>Prix (FCFA)</th>
              <th style={th}>Catégorie</th>
              <th style={{ ...th, textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id}>
                <td style={td}><strong>{car.brand}</strong></td>
                <td style={td}>{car.model}</td>
                <td style={{ ...td, color: "#888" }}>{car.year}</td>
                <td style={td}>{car.price}</td>
                <td style={td}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                    background: "#F0F0F0", padding: "3px 10px", borderRadius: 100,
                    textTransform: "uppercase",
                  }}>{car.cat}</span>
                </td>
                <td style={{ ...td, textAlign: "right", borderBottom: "1px solid #F0F0F0" }}>
                  <Link
                    href={`/admin/voitures/${car._id}`}
                    style={{
                      background: "#A01414", color: "#fff",
                      padding: "6px 16px", borderRadius: 6,
                      fontSize: 13, fontWeight: 600, textDecoration: "none",
                    }}
                  >
                    Modifier →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
