"use client";
import { useState } from "react";

const ADMIN_PASSWORD = "vc2026";

interface ParsedCar {
  specs: { key: string; value: string }[];
  mini: { v: string; k: string }[];
  desc: string;
  price: string;
  cat: string;
  colors: string[];
}

export default function AdminImport() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2026");
  const [rawText, setRawText] = useState("");

  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedCar | null>(null);
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [carId, setCarId] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [photosUploaded, setPhotosUploaded] = useState(false);

  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
        <div style={{ background: "#1a1a1a", padding: 40, borderRadius: 16, width: 320 }}>
          <h1 style={{ color: "#fff", fontSize: 20, marginBottom: 24, fontFamily: "serif" }}>🔒 Admin — Import IA</h1>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && password === ADMIN_PASSWORD && setAuthenticated(true)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #333", background: "#111", color: "#fff", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }}
          />
          <button
            onClick={() => password === ADMIN_PASSWORD ? setAuthenticated(true) : setError("Mot de passe incorrect")}
            style={{ width: "100%", padding: "10px 0", background: "#A01414", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
          >
            Entrer
          </button>
          {error && <p style={{ color: "#f87171", fontSize: 13, marginTop: 8 }}>{error}</p>}
        </div>
      </div>
    );
  }

  const handleParse = async () => {
    if (!brand || !model || !rawText) { setError("Remplis la marque, le modèle et la fiche."); return; }
    setLoading(true); setError(""); setParsed(null);
    try {
      const res = await fetch("/api/ai-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, model, rawText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setParsed(data);
    } catch (e: any) {
      setError(e.message || "Erreur IA");
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    if (!parsed) return;
    setPublishing(true);
    try {
      const res = await fetch(`/api/sanity-publish?secret=voitureschinoises2026`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, model, year, ...parsed }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCarId(data.id);
      setPublished(true);
    } catch (e: any) {
      setError(e.message || "Erreur publication");
    }
    setPublishing(false);
  };

  const inp = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1px solid #2a2a2a", background: "#111", color: "#fff",
    fontSize: 14, boxSizing: "border-box" as const, fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "DM Sans, sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, marginBottom: 8 }}>
          ✨ Import IA — Nouvelle voiture
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 40, fontSize: 15 }}>
          Colle la fiche technique brute, l&apos;IA remplit tout automatiquement.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>MARQUE *</label>
            <input style={inp} placeholder="Ex: BYD" value={brand} onChange={e => setBrand(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>MODÈLE *</label>
            <input style={inp} placeholder="Ex: Titanium 7" value={model} onChange={e => setModel(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>ANNÉE</label>
            <input style={inp} value={year} onChange={e => setYear(e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
            FICHE TECHNIQUE BRUTE * — coller tout le texte
          </label>
          <textarea
            style={{ ...inp, height: 220, resize: "vertical" }}
            placeholder={"Coller ici la fiche technique complète :\n\nMoteur : 2.0T Turbo Hybride Plug-in\nPuissance : 265 ch\nCouple : 380 Nm\nBoîte : Automatique 7 rapports\nConsommation : 1.3 L/100km\nCouleurs : Blanc, Noir, Gris...\nPrix : 24 900 000 FCFA\n..."}
            value={rawText}
            onChange={e => setRawText(e.target.value)}
          />
        </div>

        <button
          onClick={handleParse}
          disabled={loading}
          style={{
            padding: "14px 32px", background: loading ? "#555" : "#A01414",
            color: "#fff", border: "none", borderRadius: 10,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700, fontSize: 15, letterSpacing: "0.05em",
            marginBottom: 32,
          }}
        >
          {loading ? "⏳ Analyse en cours..." : "✨ Analyser avec l'IA"}
        </button>

        {error && (
          <div style={{ background: "rgba(220,38,38,0.15)", border: "1px solid #7f1d1d", borderRadius: 10, padding: "12px 16px", marginBottom: 24, color: "#fca5a5", fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {parsed && (
          <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 16, padding: 32, marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, marginBottom: 24, color: "#fff" }}>✅ Résultat IA — {brand} {model}</h2>

            {/* Description */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", color: "#A01414", marginBottom: 8 }}>DESCRIPTION (5 RAISONS D&apos;ACHETER)</div>
              <textarea
                style={{ ...inp, height: 120, resize: "vertical", color: "rgba(255,255,255,0.8)" }}
                value={parsed.desc}
                onChange={e => setParsed({ ...parsed, desc: e.target.value })}
              />
            </div>

            {/* Prix + Cat */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 12, letterSpacing: "0.1em", color: "#A01414", marginBottom: 8 }}>PRIX FCFA</div>
                <input style={inp} value={parsed.price} onChange={e => setParsed({ ...parsed, price: e.target.value })} />
              </div>
              <div>
                <div style={{ fontSize: 12, letterSpacing: "0.1em", color: "#A01414", marginBottom: 8 }}>CATÉGORIE</div>
                <select
                  style={{ ...inp }}
                  value={parsed.cat}
                  onChange={e => setParsed({ ...parsed, cat: e.target.value })}
                >
                  <option value="suv">SUV</option>
                  <option value="hybride">Hybride</option>
                  <option value="5places">5 Places</option>
                  <option value="7places">7 Places</option>
                </select>
              </div>
            </div>

            {/* Mini specs */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", color: "#A01414", marginBottom: 8 }}>BADGES CARTE (3 mini-specs)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {(parsed.mini || [{v:"",k:""},{v:"",k:""},{v:"",k:""}]).map((m, i) => (
                  <div key={i} style={{ background: "#1a1a1a", borderRadius: 8, padding: 12 }}>
                    <input
                      style={{ ...inp, marginBottom: 6, fontWeight: 700 }}
                      placeholder="Valeur (ex: 2.0T)"
                      value={m.v}
                      onChange={e => { const mini = [...parsed.mini]; mini[i] = { ...mini[i], v: e.target.value }; setParsed({ ...parsed, mini }); }}
                    />
                    <input
                      style={{ ...inp, fontSize: 12, color: "rgba(255,255,255,0.5)" }}
                      placeholder="Label (ex: Moteur)"
                      value={m.k}
                      onChange={e => { const mini = [...parsed.mini]; mini[i] = { ...mini[i], k: e.target.value }; setParsed({ ...parsed, mini }); }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", color: "#A01414", marginBottom: 8 }}>COULEURS DISPONIBLES</div>
              <input
                style={inp}
                placeholder="Blanc, Noir, Gris, ..."
                value={parsed.colors.join(", ")}
                onChange={e => setParsed({ ...parsed, colors: e.target.value.split(",").map(c => c.trim()).filter(Boolean) })}
              />
            </div>

            {/* Specs table */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", color: "#A01414", marginBottom: 8 }}>FICHE TECHNIQUE ({parsed.specs.length} lignes)</div>
              <div style={{ maxHeight: 280, overflowY: "auto", border: "1px solid #2a2a2a", borderRadius: 8 }}>
                {parsed.specs.map((s, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", borderBottom: "1px solid #1a1a1a" }}>
                    <input
                      style={{ ...inp, borderRadius: 0, border: "none", borderRight: "1px solid #1a1a1a", background: "#151515", color: "rgba(255,255,255,0.5)", fontSize: 13 }}
                      value={s.key}
                      onChange={e => { const sp = [...parsed.specs]; sp[i] = { ...sp[i], key: e.target.value }; setParsed({ ...parsed, specs: sp }); }}
                    />
                    <input
                      style={{ ...inp, borderRadius: 0, border: "none", background: "#111", fontSize: 13 }}
                      value={s.value}
                      onChange={e => { const sp = [...parsed.specs]; sp[i] = { ...sp[i], value: e.target.value }; setParsed({ ...parsed, specs: sp }); }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {published ? (
              <div>
                <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #166534", borderRadius: 10, padding: "16px 20px", color: "#86efac", fontWeight: 600, textAlign: "center", marginBottom: 24 }}>
                  ✅ Voiture publiée ! Ajoute maintenant les photos ci-dessous.
                </div>

                {/* Photo upload section */}
                <div style={{ background: "#0d0d0d", border: "2px dashed #333", borderRadius: 12, padding: 24 }}>
                  <div style={{ fontSize: 12, letterSpacing: "0.1em", color: "#A01414", marginBottom: 12 }}>PHOTOS — SÉLECTIONNER PLUSIEURS À LA FOIS</div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => setPhotos(Array.from(e.target.files || []))}
                    style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 16, display: "block" }}
                  />
                  {photos.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                      {photos.map((f, i) => (
                        <div key={i} style={{ background: "#1a1a1a", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                          {f.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {photosUploaded ? (
                    <div style={{ color: "#86efac", fontWeight: 600 }}>✅ {photos.length} photo(s) ajoutée(s) avec succès !</div>
                  ) : (
                    <button
                      disabled={uploadingPhotos || photos.length === 0}
                      onClick={async () => {
                        setUploadingPhotos(true);
                        try {
                          const fd = new FormData();
                          fd.append("carId", carId);
                          photos.forEach(f => fd.append("photos", f));
                          const res = await fetch(`/api/sanity-upload-photos?secret=voitureschinoises2026`, { method: "POST", body: fd });
                          const data = await res.json();
                          if (data.error) throw new Error(data.error);
                          setPhotosUploaded(true);
                        } catch (e: any) {
                          setError(e.message || "Erreur upload photos");
                        }
                        setUploadingPhotos(false);
                      }}
                      style={{ padding: "12px 28px", background: uploadingPhotos || photos.length === 0 ? "#333" : "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, cursor: photos.length === 0 ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 14 }}
                    >
                      {uploadingPhotos ? `⏳ Upload en cours (${photos.length} photos)...` : `📸 Uploader ${photos.length} photo(s)`}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={handlePublish}
                disabled={publishing}
                style={{
                  width: "100%", padding: "16px", background: publishing ? "#555" : "#16a34a",
                  color: "#fff", border: "none", borderRadius: 10,
                  cursor: publishing ? "not-allowed" : "pointer",
                  fontWeight: 700, fontSize: 16,
                }}
              >
                {publishing ? "⏳ Publication en cours..." : "🚀 Publier dans Sanity"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
