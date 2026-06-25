"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SpecRow { key: string; value: string; }

function parseSpecs(raw: any): SpecRow[] {
  if (!raw) return [];
  // Flat object { Moteur: "...", ... }
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return Object.entries(raw)
      .filter(([, v]) => typeof v === "string")
      .map(([key, value]) => ({ key, value: value as string }));
  }
  // Array [{key, value}] or [{_key, value}]
  if (Array.isArray(raw)) {
    return raw
      .filter((r: any) => r && typeof r.value === "string")
      .map((r: any) => ({ key: r.key || r._key || "", value: r.value }));
  }
  return [];
}

export default function CarEditor({ car }: { car: any }) {
  const router = useRouter();
  const [price, setPrice] = useState(car.price || "");
  const [desc, setDesc] = useState(car.desc || "");
  const [year, setYear] = useState(car.year || "");
  const [cat, setCat] = useState(car.cat || "suv");
  const [colors, setColors] = useState<string>((car.colors || []).join(", "));
  const [specs, setSpecs] = useState<SpecRow[]>(parseSpecs(car.specs));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [aiRaw, setAiRaw] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAi, setShowAi] = useState(false);

  function updateSpec(i: number, field: "key" | "value", val: string) {
    const next = [...specs];
    next[i] = { ...next[i], [field]: val };
    setSpecs(next);
  }

  function addSpec() {
    setSpecs([...specs, { key: "", value: "" }]);
  }

  function removeSpec(i: number) {
    setSpecs(specs.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");

    const specsObj: Record<string, string> = {};
    specs.filter(s => s.key.trim()).forEach(s => { specsObj[s.key.trim()] = s.value; });

    const patch: Record<string, any> = {
      price,
      desc,
      year,
      cat,
      specs: specsObj,
      colors: colors.split(",").map(c => c.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(`/api/admin/cars/${car._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patch }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    }
    setSaving(false);
  }

  async function handleAiParse() {
    if (!aiRaw.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: car.brand, model: car.model, rawText: aiRaw }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.specs) {
        const parsed: SpecRow[] = data.specs.map((s: any) => ({ key: s.key, value: s.value }));
        setSpecs(parsed);
      }
      if (data.desc) setDesc(data.desc);
      if (data.price) setPrice(data.price);
      if (data.colors?.length) setColors(data.colors.join(", "));
      setShowAi(false);
      setAiRaw("");
    } catch (e: any) {
      setError(e.message || "Erreur IA");
    }
    setAiLoading(false);
  }

  const inp: React.CSSProperties = {
    padding: "10px 14px",
    border: "1px solid #E0E0E0",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "DM Sans, sans-serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const label: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "#A01414",
    display: "block",
    marginBottom: 6,
    textTransform: "uppercase",
  };

  const section: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #E0E0E0",
    borderRadius: 12,
    padding: "28px 28px",
    marginBottom: 20,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <button
          onClick={() => router.push("/admin")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 22, padding: 0 }}
        >
          ←
        </button>
        <div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>{car.brand}</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, fontFamily: "Cormorant Garamond, serif" }}>
            {car.brand} {car.model}
          </h1>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          {error && <span style={{ color: "#A01414", fontSize: 13 }}>⚠️ {error}</span>}
          {saved && <span style={{ color: "#16a34a", fontSize: 13, fontWeight: 600 }}>✅ Sauvegardé</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? "#ccc" : "#A01414",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 28px",
              fontSize: 14,
              fontWeight: 700,
              cursor: saving ? "wait" : "pointer",
              letterSpacing: "0.05em",
            }}
          >
            {saving ? "Sauvegarde..." : "SAUVEGARDER"}
          </button>
        </div>
      </div>

      {/* Prix + Année + Cat */}
      <div style={section}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 1fr", gap: 20 }}>
          <div>
            <span style={label}>Prix CIF (FCFA)</span>
            <input style={inp} value={price} onChange={e => setPrice(e.target.value)} placeholder="Ex: 8 976 150" />
          </div>
          <div>
            <span style={label}>Année</span>
            <input style={inp} value={year} onChange={e => setYear(e.target.value)} />
          </div>
          <div>
            <span style={label}>Catégorie</span>
            <select style={inp} value={cat} onChange={e => setCat(e.target.value)}>
              <option value="suv">SUV</option>
              <option value="hybride">Hybride</option>
              <option value="5places">5 Places</option>
              <option value="7places">7 Places</option>
              <option value="pickup">Pickup</option>
              <option value="berline">Berline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Couleurs */}
      <div style={section}>
        <span style={label}>Couleurs disponibles</span>
        <input
          style={inp}
          value={colors}
          onChange={e => setColors(e.target.value)}
          placeholder="Blanc, Noir, Gris, Bleu..."
        />
        <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>Séparer par des virgules</div>
      </div>

      {/* Description */}
      <div style={section}>
        <span style={label}>Description / Raisons d&apos;acheter</span>
        <textarea
          style={{ ...inp, height: 140, resize: "vertical" }}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Chaque phrase devient une raison d'acheter. Terminer par un point."
        />
        <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>
          {desc.split(/(?<=[.!?])\s+/).filter((s: string) => s.length > 10).length} raison(s) générée(s)
        </div>
      </div>

      {/* AI panel */}
      {showAi && (
        <div style={{ ...section, border: "1px solid #A01414" }}>
          <span style={label}>Remplissage IA — Fiche technique</span>
          <textarea
            style={{
              width: "100%", padding: "12px 14px", border: "1px solid #E0E0E0",
              borderRadius: 8, fontSize: 14, fontFamily: "DM Sans, sans-serif",
              height: 160, resize: "vertical", boxSizing: "border-box", marginBottom: 12,
            }}
            placeholder={"Coller ici la fiche technique brute :\n\nMoteur : 1.5T Turbo\nPuissance : 156 ch\nCouple : 230 Nm\nBoîte : Automatique 7DCT\nConsommation : 7.2 L/100km\nDimensions : 4480 × 1860 × 1680 mm\n..."}
            value={aiRaw}
            onChange={e => setAiRaw(e.target.value)}
            autoFocus
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleAiParse}
              disabled={aiLoading || !aiRaw.trim()}
              style={{
                background: aiLoading ? "#ccc" : "#A01414", color: "#fff",
                border: "none", borderRadius: 8, padding: "10px 24px",
                fontSize: 14, fontWeight: 700, cursor: aiLoading ? "wait" : "pointer",
              }}
            >
              {aiLoading ? "⏳ Analyse..." : "✨ Analyser et remplir"}
            </button>
            <button
              onClick={() => { setShowAi(false); setAiRaw(""); }}
              style={{
                background: "#F0F0F0", border: "none", borderRadius: 8,
                padding: "10px 20px", fontSize: 14, cursor: "pointer",
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Specs */}
      <div style={section}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={label}>Fiche technique</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowAi(!showAi)}
              style={{
                background: "#0D0D0D", color: "#fff", border: "none", borderRadius: 6,
                padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600,
              }}
            >
              ✨ Remplir avec l&apos;IA
            </button>
            <button
              onClick={addSpec}
              style={{
                background: "#F0F0F0", border: "none", borderRadius: 6,
                padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600,
              }}
            >
              + Ajouter une ligne
            </button>
          </div>
        </div>
        <div style={{ border: "1px solid #E0E0E0", borderRadius: 8, overflow: "hidden" }}>
          {specs.map((s, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 36px",
                borderBottom: i < specs.length - 1 ? "1px solid #F0F0F0" : "none",
              }}
            >
              <input
                style={{
                  padding: "10px 14px", border: "none", borderRight: "1px solid #F0F0F0",
                  fontSize: 13, fontWeight: 500, color: "#666", background: "#FAFAFA",
                  fontFamily: "DM Sans, sans-serif", outline: "none",
                }}
                value={s.key}
                placeholder="Clé (ex: Moteur)"
                onChange={e => updateSpec(i, "key", e.target.value)}
              />
              <input
                style={{
                  padding: "10px 14px", border: "none", borderRight: "1px solid #F0F0F0",
                  fontSize: 13, color: "#1a1a1a", background: "#fff",
                  fontFamily: "DM Sans, sans-serif", outline: "none",
                }}
                value={s.value}
                placeholder="Valeur"
                onChange={e => updateSpec(i, "value", e.target.value)}
              />
              <button
                onClick={() => removeSpec(i)}
                style={{
                  border: "none", background: "none", cursor: "pointer",
                  color: "#ccc", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save bottom */}
      <div style={{ textAlign: "right" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saving ? "#ccc" : "#A01414",
            color: "#fff", border: "none", borderRadius: 8,
            padding: "12px 36px", fontSize: 14, fontWeight: 700,
            cursor: saving ? "wait" : "pointer",
          }}
        >
          {saving ? "Sauvegarde..." : "SAUVEGARDER LES MODIFICATIONS"}
        </button>
      </div>
    </div>
  );
}
